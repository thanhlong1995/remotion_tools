"""Check a rendered episode: duration, streams, loudness per 10 s and clipping.

Usage (from the repo root): .venv/Scripts/python.exe .claude/skills/daytro-episode/scripts/check_video.py out/daytro/Tap-01-....mp4
"""

import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import scipy.io.wavfile as wavfile

TOOLS = Path("node_modules/@remotion/compositor-win32-x64-msvc")


def main() -> None:
    sys.stdout.reconfigure(encoding="utf-8")
    video = Path(sys.argv[1])
    probe = subprocess.run(
        [str(TOOLS / "ffprobe.exe"), "-v", "error", "-show_entries", "format=duration,size",
         "-show_entries", "stream=codec_name,width,height", "-of", "compact", str(video)],
        capture_output=True, text=True, check=True,
    ).stdout
    print(probe.strip())
    duration = float(probe.split("duration=")[1].split("|")[0])
    print(f"duration {int(duration // 60)}:{duration % 60:04.1f}")
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "audio.wav"
        subprocess.run([str(TOOLS / "ffmpeg.exe"), "-v", "error", "-y", "-i", str(video), "-vn", "-ac", "1",
                        "-ar", "16000", str(wav)], check=True)
        sr, a = wavfile.read(wav)
    a = a.astype(np.float64) / 32768
    chunks = [a[i : i + sr * 10] for i in range(0, len(a), sr * 10)]
    levels = [20 * np.log10(np.sqrt(np.mean(c**2)) + 1e-9) for c in chunks]
    print("loudness per 10 s (dB):", " ".join(f"{v:.0f}" for v in levels))
    quiet = [i * 10 for i, v in enumerate(levels[:-1]) if v < -35]
    if quiet:
        print("WARNING: near-silent stretches starting at (s):", quiet)
    print("clipped samples:", int((np.abs(a) > 0.98).sum()))


if __name__ == "__main__":
    main()
