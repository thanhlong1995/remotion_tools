"""Render every dialogue line of a Dãy Trọ episode with the characters' voices.

Usage: python scripts/render_episode_voices.py ep01 [line ids...]   (default: every line)

Reads  src/daytro/episodes/<ep>/lines.json   [{id, speaker, kind: speech|thought|bark|laugh, text, volume?, clip?}]
Writes public/daytro/<ep>/voice/<id>.wav     48 kHz
       src/daytro/episodes/<ep>/audio.json    seconds and a 30 fps loudness envelope per line,
                                              used to time the scenes and drive lip sync

Each line is rendered a few times and Whisper picks the clearest take, which is then nudged to the
speaker's pace. Thoughts (pets around humans) get a soft, roomy "inside the head" treatment.

A spoken line can take "semitones" (pitch shift) and "drive" (soft clipping) to push it towards a shout.

Barks and laughs are never TTS: a line with "clip" is mixed from real recordings instead, each piece
{src, start?, end?, at?, gain?, semitones?, speed?, fade?, tremolo?} cut from a file under the repo and placed at `at` seconds.
"""

import json
import random
import sys
import time
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from clone_voices import cer, normalize, speech_seconds, stretch, syllables  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
FPS = 30

# Cloned from the user's samples (voices/refs, made by clone_voices.py) or a fixed VieNeu preset for
# characters without a sample. Keep presets unchanged so a character sounds the same in every episode.
# rate: syllables per second the line is nudged towards, matching the character
VOICES = {
    # Vàng: cloned from the user's second sample, "Giọng của Vàng 02" (2026-10-15)
    "vang": {"ref": "voices/refs/vang02.wav", "rate": 4.5},
    "tu": {"ref": "voices/refs/tu.wav", "rate": 5.0},
    "minh": {"ref": "voices/refs/minh.wav", "rate": 4.6},
    "sau": {"ref": "voices/refs/sau.wav", "rate": 4.8},
    "hung": {"ref": "voices/refs/hung.wav", "rate": 4.5},
    "thu": {"ref": "voices/refs/thu.wav", "rate": 4.4},
    "shipper": {"preset": "Hải Đăng", "rate": 5.8},
    "muop": {"preset": "Phạm Tuyên", "rate": 3.8},
    "khoa": {"preset": "Minh Triết", "rate": 3.6},
}

TEMPERATURES = [0.55, 0.7]
SEEDS = [1310, 2024]
# Lines marked "takes": 8 in lines.json get these extra seeds too
EXTRA_SEEDS = [7, 99]
STRETCH_RANGE = (0.85, 1.3)


def thought_fx(wav: np.ndarray, sr: int) -> np.ndarray:
    """Soften and add a small room so a pet's thought sounds like it's inside its head."""
    from scipy.signal import butter, fftconvolve, sosfilt

    band = sosfilt(butter(2, [160, 5200], btype="bandpass", fs=sr, output="sos"), wav)
    t = np.arange(int(0.45 * sr)) / sr
    rng = np.random.default_rng(7)
    ir = rng.standard_normal(t.size) * np.exp(-t / 0.11)
    ir /= np.sqrt(np.sum(ir**2))
    wet = fftconvolve(band, ir)[: band.size]
    mixed = 0.82 * band + 0.32 * wet / max(1e-6, np.max(np.abs(wet))) * np.max(np.abs(band))
    return mixed.astype(np.float32)


def render_clip(pieces: list, sr: int) -> np.ndarray:
    """Mix cuts of recorded sounds (Vàng's real barks, laughs) into one line, instead of TTS."""
    import librosa

    placed = []
    for piece in pieces:
        start = piece.get("start", 0.0)
        duration = piece["end"] - start if "end" in piece else None
        y, _ = librosa.load(str(ROOT / piece["src"]), sr=sr, mono=True, offset=start, duration=duration)
        if piece.get("semitones"):
            y = librosa.effects.pitch_shift(y, sr=sr, n_steps=piece["semitones"])
        y = stretch(y, sr, piece.get("speed", 1.0))
        if piece.get("tremolo"):
            # Fast wobble in loudness, the cartoon sound of someone being electrocuted
            t = np.arange(len(y)) / sr
            y = (y * (1 - 0.55 * (0.5 + 0.5 * np.sin(2 * np.pi * piece["tremolo"] * t)))).astype(np.float32)
        fade = min(len(y) // 4, int(0.012 * sr))
        y[:fade] *= np.linspace(0, 1, fade)
        y[len(y) - fade :] *= np.linspace(1, 0, fade)
        # Optional longer fade-out (seconds), to trail a laugh off instead of cutting it
        tail = min(len(y), int(piece.get("fade", 0.0) * sr))
        if tail:
            y[len(y) - tail :] *= np.linspace(1, 0, tail) ** 1.5
        placed.append((int(piece.get("at", 0.0) * sr), normalize(y) * piece.get("gain", 1.0)))
    out = np.zeros(max(offset + len(y) for offset, y in placed), np.float32)
    for offset, y in placed:
        out[offset : offset + len(y)] += y
    return out


def envelope(wav: np.ndarray, sr: int) -> list:
    hop = sr // FPS
    frames = [wav[i : i + hop] for i in range(0, len(wav), hop)]
    rms = np.array([np.sqrt(np.mean(f**2)) if f.size else 0.0 for f in frames])
    peak = np.percentile(rms, 95) or 1.0
    return [round(float(v), 2) for v in np.clip(rms / peak, 0, 1)]


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    ep = sys.argv[1]
    only = set(sys.argv[2:])
    import librosa
    import soundfile as sf
    from faster_whisper import WhisperModel
    from vieneu import Vieneu

    ep_dir = ROOT / "src" / "daytro" / "episodes" / ep
    out_dir = ROOT / "public" / "daytro" / ep / "voice"
    out_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = ep_dir / "audio.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else {"fps": FPS, "lines": {}}
    lines = json.loads((ep_dir / "lines.json").read_text(encoding="utf-8"))
    todo = [line for line in lines if not only or line["id"] in only]

    started = time.time()
    spoken = [line for line in todo if "clip" not in line]
    # The models are only needed for lines that are actually spoken
    tts = Vieneu() if spoken else None
    asr = WhisperModel("medium", device="cpu", compute_type="int8") if spoken else None
    sr = tts.sample_rate if tts else 48000
    for speaker in {line["speaker"] for line in spoken}:
        if "ref" in VOICES[speaker]:
            tts.add_voice(speaker, str(ROOT / VOICES[speaker]["ref"]))
    print(f"models and voices ready in {time.time() - started:.1f}s", flush=True)

    def hear(wav: np.ndarray) -> str:
        segments, _ = asr.transcribe(librosa.resample(wav, orig_sr=sr, target_sr=16000), language="vi", beam_size=5)
        return " ".join(s.text for s in segments)

    def save(line: dict, audio: np.ndarray, note: str) -> None:
        audio = (audio * line.get("volume", 1.0)).clip(-0.98, 0.98).astype(np.float32)
        sf.write(str(out_dir / f"{line['id']}.wav"), audio, sr)
        manifest["lines"][line["id"]] = {
            "file": f"daytro/{ep}/voice/{line['id']}.wav",
            "seconds": round(len(audio) / sr, 3),
            "env": envelope(audio, sr),
        }
        print(f"{line['id']} {line['speaker']}: {len(audio) / sr:.2f}s {note}", flush=True)
        # Save as we go so an interrupted run keeps what it finished
        manifest_path.write_text(json.dumps(manifest, ensure_ascii=False), encoding="utf-8")

    for line in todo:
        if "clip" in line:
            save(line, normalize(render_clip(line["clip"], sr)), "(recorded)")
            continue
        voice = VOICES[line["speaker"]]
        name = voice.get("preset", line["speaker"])
        takes = []
        seeds = SEEDS + (EXTRA_SEEDS if line.get("takes", 4) > 4 else [])
        for temperature in TEMPERATURES:
            for seed in seeds:
                random.seed(seed)
                np.random.seed(seed)
                audio = normalize(tts.infer(line["text"], voice=name, temperature=temperature))
                rate = syllables(line["text"]) / max(0.1, speech_seconds(audio, sr))
                heard = hear(audio)
                takes.append({"audio": audio, "rate": rate, "cer": cer(line["text"], heard), "heard": heard})
        best = min(takes, key=lambda t: (round(t["cer"], 2), abs(t["rate"] - voice["rate"])))
        factor = float(np.clip(voice["rate"] / best["rate"], *STRETCH_RANGE))
        audio = stretch(best["audio"], sr, factor)
        audio, _ = librosa.effects.trim(audio, top_db=40)
        if line.get("semitones"):
            audio = librosa.effects.pitch_shift(audio, sr=sr, n_steps=line["semitones"])
        if line.get("drive"):
            # A strained, shouting edge: soft-clip the voice
            audio = (np.tanh(audio * line["drive"]) / np.tanh(line["drive"])).astype(np.float32)
        if line["kind"] == "thought":
            audio = normalize(thought_fx(audio, sr)) * 0.9
        save(line, audio, f"x{factor:.2f} CER {best['cer']:.2f} | {best['heard'].strip()}")


if __name__ == "__main__":
    main()
