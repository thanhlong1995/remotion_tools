"""Synthesise the Dãy Trọ music and sound effects from scratch (no samples, no licences).

Usage: python scripts/generate_daytro_audio.py
Writes public/daytro/music/{stroll,chase,outro}.wav and public/daytro/sfx/*.wav (44.1 kHz).
Deterministic: the same files on every run.
"""

from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 44100
ROOT = Path(__file__).resolve().parent.parent
MUSIC = ROOT / "public" / "daytro" / "music"
SFX = ROOT / "public" / "daytro" / "sfx"
rng = np.random.default_rng(20261014)


def t_axis(seconds: float) -> np.ndarray:
    return np.arange(int(seconds * SR)) / SR


def mtof(m: float) -> float:
    return 440.0 * 2 ** ((m - 69) / 12)


def band(x: np.ndarray, lo: float, hi: float, order: int = 2) -> np.ndarray:
    return sosfilt(butter(order, [lo, hi], btype="bandpass", fs=SR, output="sos"), x)


def low(x: np.ndarray, f: float) -> np.ndarray:
    return sosfilt(butter(2, f, btype="lowpass", fs=SR, output="sos"), x)


def high(x: np.ndarray, f: float) -> np.ndarray:
    return sosfilt(butter(2, f, btype="highpass", fs=SR, output="sos"), x)


def save(path: Path, x: np.ndarray, peak: float = 0.9) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    x = x / max(1e-9, np.max(np.abs(x))) * peak
    sf.write(str(path), x.astype(np.float32), SR)
    print(f"{path.relative_to(ROOT)}  {len(x) / SR:.2f}s")


def add(buf: np.ndarray, at: float, x: np.ndarray, gain: float = 1.0) -> None:
    i = int(at * SR)
    if i >= len(buf):
        return
    n = min(len(x), len(buf) - i)
    buf[i : i + n] += x[:n] * gain


# --- instruments ---------------------------------------------------------------------------

def pluck(m: float, dur: float = 0.45, bright: float = 0.6) -> np.ndarray:
    """Ukulele-ish pluck: a few decaying harmonics."""
    t = t_axis(dur)
    f = mtof(m)
    x = sum(bright**k * np.sin(2 * np.pi * f * (k + 1) * t) * np.exp(-t * (6 + 5 * k)) for k in range(5))
    return x * np.minimum(1, t * 400)


def bass(m: float, dur: float = 0.4) -> np.ndarray:
    t = t_axis(dur)
    f = mtof(m)
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 5) * np.minimum(1, t * 300)


def glock(m: float, dur: float = 0.6) -> np.ndarray:
    t = t_axis(dur)
    f = mtof(m)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 9)) * np.exp(-t * 4.5)


def saw(m: float, dur: float, decay: float = 6.0) -> np.ndarray:
    t = t_axis(dur)
    f = mtof(m)
    x = sum(np.sin(2 * np.pi * f * k * t) / k for k in range(1, 12)) + sum(np.sin(2 * np.pi * f * 1.006 * k * t) / k for k in range(1, 12))
    return low(x * np.exp(-t * decay), 3500) * np.minimum(1, t * 200)


def kick() -> np.ndarray:
    t = t_axis(0.3)
    return np.sin(2 * np.pi * (50 + 90 * np.exp(-t * 30)) * t) * np.exp(-t * 12)


def snare() -> np.ndarray:
    t = t_axis(0.22)
    return band(rng.standard_normal(t.size), 1200, 6000) * np.exp(-t * 18) + 0.4 * np.sin(2 * np.pi * 190 * t) * np.exp(-t * 25)


def hat(dur: float = 0.05) -> np.ndarray:
    t = t_axis(dur)
    return high(rng.standard_normal(t.size), 7000) * np.exp(-t * 60)


# --- music ---------------------------------------------------------------------------------

def stroll() -> np.ndarray:
    """Bouncy oom-pah for the walk: C major, 100 bpm, room left for dialogue."""
    bpm, bars = 100, 52
    beat = 60 / bpm
    buf = np.zeros(int(bars * 4 * beat * SR) + SR)
    chords = [(48, [60, 64, 67]), (45, [57, 60, 64]), (41, [57, 60, 65]), (43, [55, 59, 62])]
    motif = [72, 74, 76, 72, None, 79, 76, None, 77, 76, 74, 72, 74, None, 67, None]
    for bar in range(bars):
        root, triad = chords[bar % 4]
        t0 = bar * 4 * beat
        add(buf, t0, bass(root), 0.9)
        add(buf, t0 + 2 * beat, bass(root + 7), 0.8)
        for b in (1, 3):
            for k, n in enumerate(triad):
                add(buf, t0 + b * beat + k * 0.012, pluck(n, 0.3), 0.32)
        for e in range(8):
            add(buf, t0 + e * beat / 2 + (0.04 if e % 2 else 0), hat(0.04), 0.06)
        # The whistled tune only every other phrase, so it rarely sits under a line
        if (bar // 4) % 4 == 1:
            for k in range(4):
                n = motif[(bar % 4) * 4 + k]
                if n:
                    add(buf, t0 + k * beat, glock(n), 0.28)
    return buf


def chase() -> np.ndarray:
    """Frantic chase: A minor, 168 bpm, driving bass and brass-ish stabs."""
    bpm, bars = 168, 28
    beat = 60 / bpm
    buf = np.zeros(int(bars * 4 * beat * SR) + SR)
    line = [45, 45, 48, 45, 52, 45, 50, 45]
    stabs = [[57, 60, 64], [55, 59, 62], [53, 57, 60], [52, 56, 59]]
    for bar in range(bars):
        t0 = bar * 4 * beat
        for e, n in enumerate(line):
            add(buf, t0 + e * beat / 2, bass(n - 12 + (2 if bar % 8 >= 6 else 0), 0.2), 0.8)
        for b in (0, 2):
            add(buf, t0 + b * beat, kick(), 0.9)
        for b in (1, 3):
            add(buf, t0 + b * beat, snare(), 0.5)
        for s16 in range(16):
            add(buf, t0 + s16 * beat / 4, hat(), 0.08 if s16 % 2 else 0.12)
        for k, n in enumerate(stabs[bar % 4]):
            add(buf, t0 + 1.5 * beat, saw(n, 0.25, 9), 0.12)
            add(buf, t0 + 3.5 * beat, saw(n, 0.25, 9), 0.12)
    return buf


def outro() -> np.ndarray:
    """Short sign-off jingle for the end card."""
    buf = np.zeros(int(3.2 * SR))
    for k, n in enumerate([72, 76, 79, 84]):
        add(buf, 0.12 * k, glock(n, 0.9), 0.5)
    for k, n in enumerate([48, 60, 64, 67, 72]):
        add(buf, 0.6 + k * 0.015, pluck(n, 2.2, 0.7), 0.4)
    add(buf, 0.6, bass(36, 1.5), 0.8)
    return buf


# --- sound effects -------------------------------------------------------------------------

def sfx() -> dict:
    out = {}
    t = t_axis(1.8)
    out["wind"] = band(rng.standard_normal(t.size), 250, 1400) * np.sin(np.pi * t / t[-1]) ** 2
    t = t_axis(1.2)
    crackle = high(rng.standard_normal(t.size), 2500) * (rng.random(t.size) < 0.02).astype(float)
    out["bag"] = low(np.convolve(crackle, np.exp(-np.arange(300) / 40), "same"), 9000) * np.exp(-t * 1.2)
    t = t_axis(0.28)
    out["thump"] = np.sin(2 * np.pi * (70 + 60 * np.exp(-t * 40)) * t) * np.exp(-t * 18) + 0.2 * band(rng.standard_normal(t.size), 200, 900) * np.exp(-t * 40)
    beep = lambda d: (np.sign(np.sin(2 * np.pi * 420 * t_axis(d))) + np.sign(np.sin(2 * np.pi * 532 * t_axis(d)))) * 0.5
    horn = np.zeros(int(0.75 * SR))
    add(horn, 0.0, low(beep(0.18), 3000))
    add(horn, 0.3, low(beep(0.32), 3000))
    out["horn"] = horn
    t = t_axis(2.6)
    f = 40 + 75 * (1 - np.exp(-t * 2.5))
    phase = 2 * np.cumsum(np.pi * f / SR)
    out["engine"] = low(np.sign(np.sin(phase)) * 0.6 + 0.3 * rng.standard_normal(t.size), 900) * np.minimum(1, t * 6) * np.exp(-np.maximum(0, t - 1.8) * 3)
    t = t_axis(0.9)
    out["skid"] = band(rng.standard_normal(t.size), 2200, 3200, 4) * (1 + 0.5 * np.sin(2 * np.pi * 18 * t)) * np.exp(-t * 3)
    t = t_axis(0.45)
    thud = low(rng.standard_normal(t.size), 400) * np.exp(-t * 25)
    out["drop"] = thud + np.concatenate([np.zeros(int(0.16 * SR)), thud[: t.size - int(0.16 * SR)] * 0.4])
    t = t_axis(0.55)
    out["whoosh"] = band(rng.standard_normal(t.size), 400, 4000) * np.sin(np.pi * t / t[-1]) ** 3
    t = t_axis(0.35)
    out["gulp"] = np.sin(2 * np.pi * np.cumsum(320 - 220 * t / t[-1]) / SR) * np.exp(-((t - 0.12) ** 2) / 0.004)
    t = t_axis(1.8)
    sting = sum(saw(n, 1.8, 2.2) for n in (38, 45, 50, 53))
    out["sting"] = sting + 1.5 * np.sin(2 * np.pi * 55 * t) * np.exp(-t * 4)
    t = t_axis(0.6)
    out["slip"] = band(rng.standard_normal(t.size), 800, 2500) * np.exp(-t * 4) * (0.6 + 0.4 * np.sin(2 * np.pi * 30 * t))
    t = t_axis(0.18)
    out["pop"] = np.sin(2 * np.pi * (600 + 900 * t / t[-1]) * t) * np.exp(-t * 30)
    t = t_axis(20)
    hum = low(rng.standard_normal(t.size), 180) * 0.6
    birds = np.zeros(t.size)
    for start in rng.uniform(0, 19, 14):
        tb = t_axis(0.12)
        add(birds, start, np.sin(2 * np.pi * np.cumsum(3200 + 900 * np.sin(2 * np.pi * 14 * tb)) / SR) * np.sin(np.pi * tb / tb[-1]), 0.15)
    out["ambience"] = hum + birds
    return out


def main() -> None:
    save(MUSIC / "stroll.wav", stroll(), 0.8)
    save(MUSIC / "chase.wav", chase(), 0.8)
    save(MUSIC / "outro.wav", outro(), 0.8)
    for name, x in sfx().items():
        save(SFX / f"{name}.wav", x)


if __name__ == "__main__":
    main()
