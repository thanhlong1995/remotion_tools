"""Clone the Dãy Trọ characters' voices with VieNeu-TTS and render test lines.

Usage: python scripts/clone_voices.py [minh tu vang ...]   (default: every character)

VieNeu v3 Turbo enrols a voice from the first 8 s of the reference, cutting there even mid-word,
and copies its pace. So for each character:
  1. the sample is sped up (pitch kept) by each factor in REF_SPEEDS and cut at the last pause
     before 8 s, giving one candidate voice per factor;
  2. every test line is rendered several times per voice (temperatures x seeds);
  3. Whisper transcribes every take; the voice with the lowest average character error rate wins,
     and so does its clearest take of each line;
  4. that take is nudged towards TARGET_RATE syllables per second.
Outputs:
  voices/refs/<id>.wav               the reference clip of the winning voice (voices/ is git-ignored)
  out/daytro/voice-tests/<id>.wav    the chosen take of every test line, one after another
"""

import random
import re
import sys
import time
import unicodedata
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
VOICES = ROOT / "voices"
REFS = VOICES / "refs"
TESTS = ROOT / "out" / "daytro" / "voice-tests"

# Voice file supplied by the user, and lines that show the character off
CHARACTERS = {
    "minh": {
        "file": "Giọng Ông Minh.mp3",
        "lines": [
            "Rồi rồi, bà yên tâm…",
            "Để đó tôi sửa cho, cái bóng đèn này hư từ tháng trước rồi.",
            "Ơ… bà đừng giận, tôi chỉ uống có một ly thôi mà.",
        ],
    },
    "tu": {
        "file": "Giọng Bà Tư.mp3",
        "lines": [
            "Cầm chắc dây vào ông, nó lại đuổi shipper bây giờ!",
            "Tháng này điện nước lên giá nha mấy đứa!",
            "Phòng ba! Tiền nhà tháng này đâu? Đừng có giả vờ ngủ nha!",
        ],
    },
    "thu": {
        "file": "Giọng Bé Thư.mp3",
        "lines": [
            "Dạ… em chào anh chị ạ!",
            "Mochi ơi, đừng chạy lung tung nha.",
            "Em nhớ mẹ quá…",
        ],
    },
    "hung": {
        "file": "Giọng Ông Hùng Loa.mp3",
        "lines": [
            "Đêm nay anh hát tặng cả xóm!",
            "Ghé đi ông ơi, có cả karaoke nè! A lô a lô!",
            "Ai rút loa của tôi?!",
        ],
    },
    "sau": {
        "file": "Giọng Ông Sáu Xạo.mp3",
        "lines": [
            "Con cá to cỡ này nè, thiệt đó!",
            "Ê ông Minh! Ghé đây làm một ly coi! Một ly thôi mà!",
            "Ngắm cột điện mà chảy nước miếng hả ông Minh?",
        ],
    },
    "vang": {
        "file": "Giọng của Vàng.mp3",
        "lines": [
            "Chuyện gì ở dãy này mà qua mặt được tao!",
            "Suỵt… tụi bây nghe gì chưa? Chị Ngân lại nhận thêm ba thùng hàng nữa kìa.",
            "Gâu! Gâu! Anh shipper kia, đứng lại đó!",
        ],
    },
    # Second sample for Vàng (2026-10-15), replacing the first one
    "vang02": {
        "file": "Giọng của Vàng 02.mp3",
        "lines": [
            "Chào cả nhà, tao là Vàng, bảo vệ dãy trọ số mười bảy.",
            "Cái gì kia?! Kẻ địch! Có kẻ địch!",
            "Xin lỗi cái gì. Tao đâu có cắn. Tao chỉ… tiễn nó ra khỏi hẻm.",
        ],
    },
}

REF_SPEEDS = [1.0, 1.2, 1.35]
TEMPERATURES = [0.55, 0.7]
SEEDS = [1310, 2024]
# Lively comic dialogue; the samples were read as slow narration (about 3.4/s)
TARGET_RATE = 4.6
MAX_STRETCH = 1.3

MAX_REF = 8.0
MIN_REF = 4.5
PAUSE = 0.18  # seconds of quiet that count as a breath between phrases
GAP_BETWEEN_LINES = 0.7
TARGET_RMS_DB = -16.0
PEAK_CEILING = 0.95


def stretch(wav: np.ndarray, sr: int, speed: float) -> np.ndarray:
    """Change tempo without changing pitch (WSOLA)."""
    if abs(speed - 1) < 1e-3:
        return wav
    from audiotsm import wsola
    from audiotsm.io.array import ArrayReader, ArrayWriter

    frame = int(0.03 * sr)
    writer = ArrayWriter(channels=1)
    wsola(channels=1, speed=speed, frame_length=frame).run(ArrayReader(wav[None, :]), writer)
    return writer.data[0].astype(np.float32)


def cut_reference(wav: np.ndarray, sr: int) -> np.ndarray:
    """Trim the edges, then end the clip at the last pause before MAX_REF."""
    import librosa

    wav, _ = librosa.effects.trim(wav, top_db=30)
    hop = int(0.01 * sr)
    rms = librosa.feature.rms(y=wav, frame_length=4 * hop, hop_length=hop)[0]
    quiet = rms < rms.max() * 0.06
    end = min(len(wav), int(MAX_REF * sr))
    run = 0
    for i, q in enumerate(quiet):
        run = run + 1 if q else 0
        t = i * hop / sr
        if run * hop / sr >= PAUSE and MIN_REF <= t <= MAX_REF:
            # Cut in the middle of the pause
            end = int((t - run * hop / sr / 2) * sr)
    return wav[:end]


DIGITS = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"]


def plain(text: str) -> str:
    text = unicodedata.normalize("NFC", text.lower())
    words = re.sub(r"[^\w\s]", " ", text).split()
    # Whisper writes "phòng 3" where the script says "phòng ba"
    return " ".join(DIGITS[int(w)] if w.isdigit() and len(w) == 1 else w for w in words)


def syllables(text: str) -> int:
    return len(plain(text).split())


def cer(reference: str, heard: str) -> float:
    """Character error rate: edit distance over the reference length."""
    a, b = plain(reference), plain(heard)
    row = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        prev, row[0] = row[0], i
        for j, cb in enumerate(b, 1):
            prev, row[j] = row[j], min(row[j] + 1, row[j - 1] + 1, prev + (ca != cb))
    return row[-1] / max(1, len(a))


def speech_seconds(wav: np.ndarray, sr: int) -> float:
    import librosa

    trimmed, _ = librosa.effects.trim(wav, top_db=35)
    return len(trimmed) / sr


def normalize(audio: np.ndarray) -> np.ndarray:
    voiced = audio[np.abs(audio) > 0.01]
    if voiced.size == 0:
        return audio
    rms = float(np.sqrt(np.mean(voiced**2)))
    gain = min(10 ** (TARGET_RMS_DB / 20) / rms, PEAK_CEILING / float(np.max(np.abs(audio))))
    return (audio * gain).astype(np.float32)


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    ids = sys.argv[1:] or list(CHARACTERS)
    import librosa
    from faster_whisper import WhisperModel
    from vieneu import Vieneu

    started = time.time()
    tts = Vieneu()
    asr = WhisperModel("medium", device="cpu", compute_type="int8")
    print(f"models loaded in {time.time() - started:.1f}s", flush=True)
    sr_out = tts.sample_rate
    TESTS.mkdir(parents=True, exist_ok=True)
    REFS.mkdir(parents=True, exist_ok=True)

    def hear(wav: np.ndarray) -> str:
        segments, _ = asr.transcribe(librosa.resample(wav, orig_sr=sr_out, target_sr=16000), language="vi", beam_size=5)
        return " ".join(s.text for s in segments)

    for cid in ids:
        spec = CHARACTERS[cid]
        sample, sr_in = sf.read(str(VOICES / spec["file"]), dtype="float32", always_2d=False)
        if sample.ndim > 1:
            sample = sample.mean(axis=1)

        results = {}
        for speed in REF_SPEEDS:
            name = f"{cid}@{speed}"
            ref = cut_reference(stretch(sample, sr_in, speed), sr_in)
            ref_path = REFS / f"{cid}-x{speed}.wav"
            sf.write(str(ref_path), ref, sr_in)
            tts.add_voice(name, str(ref_path))
            per_line = []
            for n, line in enumerate(spec["lines"]):
                takes = []
                for temperature in TEMPERATURES:
                    for seed in SEEDS:
                        random.seed(seed + n)
                        np.random.seed(seed + n)
                        audio = normalize(tts.infer(line, voice=name, temperature=temperature))
                        heard = hear(audio)
                        rate = syllables(line) / max(0.1, speech_seconds(audio, sr_out))
                        takes.append({"audio": audio, "cer": cer(line, heard), "rate": rate, "heard": heard})
                per_line.append(min(takes, key=lambda t: (round(t["cer"], 2), abs(t["rate"] - TARGET_RATE))))
            score = float(np.mean([t["cer"] for t in per_line]))
            # Equally clear voices: prefer the one already speaking at the target pace, since
            # stretching afterwards costs a little quality
            off_pace = float(np.mean([abs(t["rate"] - TARGET_RATE) for t in per_line]))
            results[speed] = (score, per_line, ref_path, off_pace)
            print(f"{cid} x{speed}: mean CER {score:.3f}, rates {[round(t['rate'], 1) for t in per_line]}", flush=True)

        speed = min(results, key=lambda s: (round(results[s][0], 2), results[s][3]))
        score, per_line, ref_path, _ = results[speed]
        ref_path.replace(REFS / f"{cid}.wav")
        for other in REF_SPEEDS:
            (REFS / f"{cid}-x{other}.wav").unlink(missing_ok=True)

        out = []
        print(f"{cid}: using the x{speed} voice", flush=True)
        for line, take in zip(spec["lines"], per_line):
            factor = min(MAX_STRETCH, max(1.0, TARGET_RATE / take["rate"]))
            audio = normalize(stretch(take["audio"], sr_out, factor))
            out += [audio, np.zeros(int(GAP_BETWEEN_LINES * sr_out), dtype=np.float32)]
            print(f"  {take['rate']:.1f}/s x{factor:.2f} -> {take['rate'] * factor:.1f}/s  CER {take['cer']:.2f}  heard: {take['heard'].strip()}", flush=True)
        tts.save(np.concatenate(out), str(TESTS / f"{cid}.wav"))


if __name__ == "__main__":
    main()
