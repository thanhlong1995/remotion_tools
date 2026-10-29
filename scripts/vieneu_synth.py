"""Synthesize several lines with VieNeu-TTS in one model load.

Usage: python scripts/vieneu_synth.py <scenes.json> <out_dir> <voice>
scenes.json: [{"id": "01-hook", "text": "...", "seed": 1310}, ...]
Writes <out_dir>/<id>.wav (48 kHz) for each scene.
"""

import json
import random
import sys
import time
from pathlib import Path

import numpy as np
from vieneu import Vieneu

# VieNeu comes out around -20 dBFS RMS, a few dB under typical narration.
# Raise it towards this level without letting peaks pass PEAK_CEILING.
TARGET_RMS_DB = -16.0
PEAK_CEILING = 0.95


def normalize(audio: np.ndarray) -> np.ndarray:
    voiced = audio[np.abs(audio) > 0.01]
    if voiced.size == 0:
        return audio
    rms = float(np.sqrt(np.mean(voiced**2)))
    gain = min(10 ** (TARGET_RMS_DB / 20) / rms, PEAK_CEILING / float(np.max(np.abs(audio))))
    return (audio * gain).astype(np.float32)


def main() -> None:
    scenes = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    out_dir = Path(sys.argv[2])
    voice = sys.argv[3]
    out_dir.mkdir(parents=True, exist_ok=True)

    started = time.time()
    tts = Vieneu()
    print(f"model loaded in {time.time() - started:.1f}s", flush=True)

    for scene in scenes:
        # Sampling is random; seeding makes a rerun give the same take
        seed = scene.get("seed", 1310)
        random.seed(seed)
        np.random.seed(seed)
        started = time.time()
        audio = normalize(tts.infer(scene["text"], voice=voice))
        tts.save(audio, str(out_dir / f"{scene['id']}.wav"))
        print(f"{scene['id']}: {len(audio) / 48_000:.2f}s audio in {time.time() - started:.1f}s", flush=True)


if __name__ == "__main__":
    main()
