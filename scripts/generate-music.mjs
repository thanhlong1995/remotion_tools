// Generates the royalty-free background track for the Kita Boo video.
// Cheerful ukulele + glockenspiel pop, 120 BPM, exactly 45 seconds.
// Bars land every 2s, so scene cuts in the video sit on downbeats.
//
// Usage: node scripts/generate-music.mjs
// Output: public/music/kita-boo-theme.wav

import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const SR = 44100;
const BPM = 120;
const DURATION = 45;
const BEAT = 60 / BPM;
const BAR = 4 * BEAT;
const E8 = BEAT / 2;
const TOTAL = Math.round(DURATION * SR);

// Deterministic noise so the track is identical on every run
let seed = 20261010;
const rand = () => {
	seed |= 0;
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rand() * 2 - 1;
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);

// Buses
const drumsL = new Float32Array(TOTAL);
const drumsR = new Float32Array(TOTAL);
const musicL = new Float32Array(TOTAL); // ducked by the kick
const musicR = new Float32Array(TOTAL);
const leadL = new Float32Array(TOTAL);
const leadR = new Float32Array(TOTAL);
const bassBus = new Float32Array(TOTAL);
const reverbSend = new Float32Array(TOTAL);
const duck = new Float32Array(TOTAL).fill(1);

const panGains = (pan) => {
	const a = ((pan + 1) * Math.PI) / 4;
	return [Math.cos(a), Math.sin(a)];
};

const writer = (busL, busR, pan, send) => {
	const [gl, gr] = panGains(pan);
	return (i, v) => {
		if (i < 0 || i >= TOTAL) return;
		busL[i] += v * gl;
		busR[i] += v * gr;
		if (send) reverbSend[i] += v * send;
	};
};

// RBJ biquad
const biquad = (type, f, q) => {
	const w0 = (2 * Math.PI * Math.min(f, SR * 0.45)) / SR;
	const cos = Math.cos(w0);
	const alpha = Math.sin(w0) / (2 * q);
	let b0, b1, b2;
	if (type === 'lp') {
		b0 = (1 - cos) / 2;
		b1 = 1 - cos;
		b2 = (1 - cos) / 2;
	} else if (type === 'hp') {
		b0 = (1 + cos) / 2;
		b1 = -(1 + cos);
		b2 = (1 + cos) / 2;
	} else {
		b0 = alpha;
		b1 = 0;
		b2 = -alpha;
	}
	const a0 = 1 + alpha;
	return {
		b0: b0 / a0,
		b1: b1 / a0,
		b2: b2 / a0,
		a1: (-2 * cos) / a0,
		a2: (1 - alpha) / a0,
	};
};

class Filter {
	constructor(type, f, q = 0.707) {
		this.type = type;
		this.q = q;
		this.x1 = this.x2 = this.y1 = this.y2 = 0;
		this.set(f);
	}

	set(f) {
		this.c = biquad(this.type, f, this.q);
	}

	process(x) {
		const {b0, b1, b2, a1, a2} = this.c;
		const y = b0 * x + b1 * this.x1 + b2 * this.x2 - a1 * this.y1 - a2 * this.y2;
		this.x2 = this.x1;
		this.x1 = x;
		this.y2 = this.y1;
		this.y1 = y;
		return y;
	}
}

// ---------- Instruments ----------

// Karplus-Strong string, ukulele-like
const pluck = (t0, midi, gain, pan, len = 0.7, bright = 0.55) => {
	const out = writer(musicL, musicR, pan, 0.18);
	const f = mtof(midi);
	const n = Math.max(2, Math.round(SR / f));
	const buf = new Float32Array(n);
	let prev = 0;
	let mean = 0;
	for (let i = 0; i < n; i++) {
		prev += bright * (noise() - prev);
		buf[i] = prev;
		mean += prev;
	}
	mean /= n;
	for (let i = 0; i < n; i++) buf[i] -= mean;
	const start = Math.round(t0 * SR);
	const total = Math.round(len * SR);
	const release = Math.round(0.06 * SR);
	let idx = 0;
	for (let i = 0; i < total; i++) {
		const next = (idx + 1) % n;
		const v = buf[idx];
		buf[idx] = 0.996 * 0.5 * (buf[idx] + buf[next]);
		idx = next;
		const env = i > total - release ? (total - i) / release : 1;
		out(start + i, v * gain * env * 2.2);
	}
};

// Glockenspiel / music box
const glock = (t0, midi, gain, pan, len = 1.6) => {
	const out = writer(leadL, leadR, pan, 0.35);
	const f = mtof(midi);
	const partials = [
		[1, 1, 0.75],
		[2, 0.12, 0.35],
		[2.76, 0.28, 0.16],
		[5.4, 0.09, 0.06],
	];
	const start = Math.round(t0 * SR);
	const total = Math.round(len * SR);
	for (let i = 0; i < total; i++) {
		const t = i / SR;
		const att = Math.min(1, t / 0.002);
		let s = 0;
		for (const [ratio, amp, tau] of partials) {
			s += amp * Math.exp(-t / tau) * Math.sin(2 * Math.PI * f * ratio * t);
		}
		const tail = i > total - 2000 ? (total - i) / 2000 : 1;
		out(start + i, s * att * tail * gain);
	}
};

// Round sine bass with a little harmonic bite for small speakers
const bass = (t0, midi, dur, gain) => {
	const f = mtof(midi);
	const start = Math.round(t0 * SR);
	const total = Math.round((dur + 0.06) * SR);
	for (let i = 0; i < total; i++) {
		const t = i / SR;
		const att = Math.min(1, t / 0.006);
		const body = 0.65 + 0.35 * Math.exp(-t / 0.18);
		const rel = t > dur ? Math.max(0, 1 - (t - dur) / 0.06) : 1;
		const ph = 2 * Math.PI * f * t;
		const s = Math.sin(ph) + 0.3 * Math.sin(2 * ph) + 0.1 * Math.sin(3 * ph);
		const idx = start + i;
		if (idx >= 0 && idx < TOTAL) bassBus[idx] += s * att * body * rel * gain;
	}
};

const kick = (t0, gain) => {
	const out = writer(drumsL, drumsR, 0, 0);
	const start = Math.round(t0 * SR);
	const total = Math.round(0.42 * SR);
	let ph = 0;
	for (let i = 0; i < total; i++) {
		const t = i / SR;
		const f = 46 + 120 * Math.exp(-t * 32);
		ph += (2 * Math.PI * f) / SR;
		let s = Math.sin(ph) * Math.exp(-t * 7);
		if (t < 0.004) s += noise() * 0.35 * (1 - t / 0.004);
		out(start + i, s * gain);
	}
	// Sidechain pump on chords/pad
	const duckLen = Math.round(0.3 * SR);
	for (let i = 0; i < duckLen; i++) {
		const idx = start + i;
		if (idx >= TOTAL) break;
		const d = 1 - 0.4 * Math.exp(-(i / SR) / 0.09);
		duck[idx] = Math.min(duck[idx], d);
	}
};

const clap = (t0, gain, pan = 0) => {
	const out = writer(drumsL, drumsR, pan, 0.25);
	const bp = new Filter('bp', 1300, 0.9);
	const start = Math.round(t0 * SR);
	const total = Math.round(0.35 * SR);
	for (let i = 0; i < total; i++) {
		const t = i / SR;
		let env = 0;
		for (const b of [0, 0.011, 0.022]) {
			if (t >= b) env = Math.max(env, Math.exp(-(t - b) / 0.005));
		}
		if (t >= 0.03) env = Math.max(env, 0.55 * Math.exp(-(t - 0.03) / 0.09));
		out(start + i, bp.process(noise()) * env * gain * 3);
	}
};

const snare = (t0, gain) => {
	const out = writer(drumsL, drumsR, 0.05, 0.2);
	const bp = new Filter('bp', 2000, 0.7);
	const start = Math.round(t0 * SR);
	const total = Math.round(0.18 * SR);
	for (let i = 0; i < total; i++) {
		const t = i / SR;
		const s =
			bp.process(noise()) * 2.2 * Math.exp(-t / 0.05) +
			Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t / 0.035) * 0.6;
		out(start + i, s * gain);
	}
};

const hat = (t0, gain, open = false, pan = 0.25) => {
	const out = writer(drumsL, drumsR, pan, 0.05);
	const hp = new Filter('hp', 7500, 0.8);
	const start = Math.round(t0 * SR);
	const tau = open ? 0.13 : 0.028;
	const total = Math.round(tau * 5 * SR);
	for (let i = 0; i < total; i++) {
		const t = i / SR;
		out(start + i, hp.process(noise()) * Math.exp(-t / tau) * gain);
	}
};

const crash = (t0, gain) => {
	const outL = writer(drumsL, drumsR, -0.3, 0.15);
	const outR = writer(drumsL, drumsR, 0.3, 0.15);
	const hpL = new Filter('hp', 4500, 0.7);
	const hpR = new Filter('hp', 4500, 0.7);
	const start = Math.round(t0 * SR);
	const total = Math.round(2.2 * SR);
	for (let i = 0; i < total; i++) {
		const t = i / SR;
		const env = Math.min(1, t / 0.003) * Math.exp(-t / 0.75);
		outL(start + i, hpL.process(noise()) * env * gain);
		outR(start + i, hpR.process(noise()) * env * gain);
	}
};

// Filtered-noise sweep leading into a downbeat
const riser = (t0, dur, gain) => {
	const out = writer(drumsL, drumsR, 0, 0.3);
	const lp = new Filter('lp', 300, 1.2);
	const start = Math.round(t0 * SR);
	const total = Math.round(dur * SR);
	for (let i = 0; i < total; i++) {
		const p = i / total;
		if (i % 64 === 0) lp.set(300 + 7500 * p * p);
		out(start + i, lp.process(noise()) * p * p * gain);
	}
};

const pad = (t0, notes, dur, gain) => {
	const out = writer(musicL, musicR, 0, 0.5);
	const start = Math.round(t0 * SR);
	const total = Math.round((dur + 0.4) * SR);
	for (let i = 0; i < total; i++) {
		const t = i / SR;
		const att = Math.min(1, t / 0.35);
		const rel = t > dur ? Math.max(0, 1 - (t - dur) / 0.4) : 1;
		let s = 0;
		for (const m of notes) {
			const f = mtof(m);
			s +=
				Math.sin(2 * Math.PI * f * 1.0023 * t) +
				Math.sin(2 * Math.PI * f * 0.9977 * t) +
				0.25 * Math.sin(2 * Math.PI * f * 2 * t);
		}
		out(start + i, s * att * rel * gain);
	}
};

// ---------- Arrangement ----------

const chords = {
	C: {strum: [60, 64, 67, 72], bass: 36, pad: [60, 64, 67]},
	G: {strum: [59, 62, 67, 71], bass: 43, pad: [59, 62, 67]},
	Am: {strum: [57, 60, 64, 69], bass: 45, pad: [57, 60, 64]},
	F: {strum: [57, 60, 65, 69], bass: 41, pad: [57, 60, 65]},
};
const progression = ['C', 'G', 'Am', 'F'];

// [8th-note position, midi, length in 8ths]
const melodyA = [
	[[0, 76, 1], [1, 79, 1], [3, 76, 1], [4, 72, 1], [5, 74, 1], [6, 76, 2]],
	[[0, 74, 1], [1, 71, 1], [2, 74, 1], [3, 79, 2], [6, 77, 1], [7, 76, 1]],
	[[0, 76, 1], [1, 72, 1], [2, 76, 1], [3, 81, 2], [6, 79, 1], [7, 76, 1]],
	[[0, 77, 1], [1, 76, 1], [2, 74, 1], [3, 72, 3]],
];
const melodyA2 = [
	melodyA[0],
	melodyA[1],
	melodyA[2],
	[[0, 77, 1], [1, 79, 1], [2, 81, 1], [4, 79, 4]],
];
const melodyB = [
	[[0, 84, 2], [2, 79, 1], [3, 76, 1], [4, 79, 2], [6, 84, 2]],
	[[0, 83, 2], [2, 79, 1], [3, 74, 1], [4, 79, 4]],
	[[0, 81, 2], [2, 76, 1], [3, 72, 1], [4, 76, 2], [6, 81, 2]],
	[[0, 81, 1], [1, 79, 1], [2, 77, 1], [3, 76, 1], [4, 77, 1], [5, 79, 3]],
];

const strumPattern = [
	[0, 'D', 1.0],
	[2, 'D', 0.75],
	[3, 'U', 0.55],
	[5, 'U', 0.55],
	[6, 'D', 0.8],
	[7, 'U', 0.5],
];

const strum = (t0, notes, dir, vel, len = 0.55) => {
	const order = dir === 'D' ? notes : notes.slice(1).reverse();
	order.forEach((m, k) => {
		pluck(t0 + k * 0.011, m, 0.22 * vel, -0.25 + k * 0.12, len);
	});
};

const playMelody = (barStart, bar, gain, doubleOctave = false) => {
	for (const [pos, midi, len] of bar) {
		const t = barStart + pos * E8;
		glock(t, midi, 0.26 * gain, 0.15);
		if (doubleOctave) pluck(t, midi - 12, 0.13 * gain, -0.1, len * E8 + 0.15, 0.7);
	}
};

const drumsBar = (barStart, {kicks = true, extraKick = false, claps = true}) => {
	if (kicks) {
		kick(barStart, 0.95);
		kick(barStart + 4 * E8, 0.9);
		if (extraKick) kick(barStart + 5 * E8, 0.6);
	}
	if (claps) {
		clap(barStart + 2 * E8, 0.38, -0.05);
		clap(barStart + 6 * E8, 0.38, 0.05);
	}
	for (let s = 0; s < 16; s++) {
		const t = barStart + s * (E8 / 2);
		if (s === 14) {
			hat(t, 0.16, true);
			continue;
		}
		const vel = s % 4 === 2 ? 0.2 : s % 2 === 1 ? 0.07 : 0.11;
		hat(t, vel);
	}
};

const bassBar = (barStart, root, bounce = true) => {
	if (!bounce) {
		bass(barStart, root, BAR - 0.05, 0.42);
		return;
	}
	bass(barStart, root, 1.4 * E8, 0.45);
	bass(barStart + 3 * E8, root, 0.8 * E8, 0.38);
	bass(barStart + 4 * E8, root + 7, 1.4 * E8, 0.4);
	bass(barStart + 6 * E8, root + 12, 0.8 * E8, 0.36);
	bass(barStart + 7 * E8, root + 7, 0.8 * E8, 0.34);
};

const snareRoll = (t0, beats) => {
	const steps = beats * 4;
	for (let s = 0; s < steps; s++) {
		snare(t0 + s * (E8 / 2), 0.08 + 0.32 * (s / steps));
	}
};

// Intro: bars 0-1 (F -> G), building into the drop on C at 4s
const intro = [
	['F', [65, 69, 72, 69, 65, 69, 72, 77]],
	['G', [67, 71, 74, 71, 67, 71, 74, 79]],
];
intro.forEach(([name, arp], b) => {
	const t = b * BAR;
	const c = chords[name];
	pad(t, c.pad, BAR, 0.035);
	strum(t, c.strum, 'D', 0.8, 1.8);
	strum(t + 4 * E8, c.strum, 'D', 0.55, 1.8);
	arp.forEach((m, k) => glock(t + k * E8, m, 0.2, 0.2));
	bass(t, c.bass, BAR - 0.05, 0.25);
});
riser(BAR, BAR, 0.35);
snareRoll(BAR + 2 * BEAT, 2);

// Main body: bars 2-21 (five passes through C G Am F)
for (let bar = 2; bar <= 21; bar++) {
	const t = bar * BAR;
	const loop = Math.floor((bar - 2) / 4);
	const inLoop = (bar - 2) % 4;
	const c = chords[progression[inLoop]];

	const breakdown = bar === 10 || bar === 11;
	drumsBar(t, {kicks: !breakdown, extraKick: inLoop % 2 === 1, claps: true});
	bassBar(t, c.bass, !breakdown);
	pad(t, c.pad, BAR, breakdown ? 0.05 : 0.03);
	for (const [pos, dir, vel] of strumPattern) {
		strum(t + pos * E8, c.strum, dir, vel);
	}

	const melody = [melodyA, melodyA2, melodyB, melodyA, melodyA2][loop];
	playMelody(t, melody[inLoop], loop === 2 ? 0.9 : 1, loop === 4);
}

// Build back after the breakdown, and accents on section starts
riser(12 * BAR, 2 * BAR, 0.2);
snareRoll(13 * BAR + 2 * BEAT, 2);
crash(2 * BAR, 0.16);
crash(14 * BAR, 0.14);

// Ending hit on C at 44s, rings out to 45s
{
	const t = 22 * BAR;
	const c = chords.C;
	kick(t, 1);
	crash(t, 0.18);
	strum(t, [48, 55, 60, 64, 67, 72], 'D', 1.1, 1.0);
	glock(t, 84, 0.3, 0.1, 1.0);
	glock(t + 0.03, 79, 0.2, -0.1, 1.0);
	bass(t, c.bass, 0.9, 0.5);
	pad(t, c.pad, 0.6, 0.04);
}

// ---------- Reverb (Freeverb-style) ----------

const freeverb = (input, spread) => {
	const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((n) => ({
		buf: new Float32Array(n + spread),
		idx: 0,
		store: 0,
	}));
	const allpasses = [556, 441, 341, 225].map((n) => ({
		buf: new Float32Array(n + spread),
		idx: 0,
	}));
	const feedback = 0.82;
	const damp = 0.25;
	const out = new Float32Array(TOTAL);
	for (let i = 0; i < TOTAL; i++) {
		const x = input[i] * 0.015;
		let s = 0;
		for (const c of combs) {
			const y = c.buf[c.idx];
			c.store = y * (1 - damp) + c.store * damp;
			c.buf[c.idx] = x + c.store * feedback;
			c.idx = (c.idx + 1) % c.buf.length;
			s += y;
		}
		for (const a of allpasses) {
			const b = a.buf[a.idx];
			a.buf[a.idx] = s + b * 0.5;
			a.idx = (a.idx + 1) % a.buf.length;
			s = b - s;
		}
		out[i] = s;
	}
	return out;
};

const revL = freeverb(reverbSend, 0);
const revR = freeverb(reverbSend, 23);

// ---------- Mix & master ----------

const L = new Float32Array(TOTAL);
const R = new Float32Array(TOTAL);
const bassLp = new Filter('lp', 900, 0.707);
for (let i = 0; i < TOTAL; i++) {
	const b = bassLp.process(bassBus[i]);
	L[i] = drumsL[i] + musicL[i] * duck[i] + leadL[i] + b + revL[i] * 0.9;
	R[i] = drumsR[i] + musicR[i] * duck[i] + leadR[i] + b + revR[i] * 0.9;
}

let peak = 0;
for (let i = 0; i < TOTAL; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const drive = 1.4;
const norm = Math.tanh(drive);
const fadeStart = TOTAL - Math.round(0.3 * SR);
for (let i = 0; i < TOTAL; i++) {
	const fade = i > fadeStart ? (TOTAL - i) / (TOTAL - fadeStart) : 1;
	L[i] = (Math.tanh((L[i] / peak) * drive) / norm) * 0.9 * fade;
	R[i] = (Math.tanh((R[i] / peak) * drive) / norm) * 0.9 * fade;
}

// ---------- Write WAV ----------

const dataSize = TOTAL * 2 * 2;
const wav = Buffer.alloc(44 + dataSize);
wav.write('RIFF', 0);
wav.writeUInt32LE(36 + dataSize, 4);
wav.write('WAVE', 8);
wav.write('fmt ', 12);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(2, 22);
wav.writeUInt32LE(SR, 24);
wav.writeUInt32LE(SR * 4, 28);
wav.writeUInt16LE(4, 32);
wav.writeUInt16LE(16, 34);
wav.write('data', 36);
wav.writeUInt32LE(dataSize, 40);
for (let i = 0; i < TOTAL; i++) {
	const o = 44 + i * 4;
	wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), o);
	wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), o + 2);
}

const outPath = join(
	dirname(fileURLToPath(import.meta.url)),
	'..',
	'public',
	'music',
	'kita-boo-theme.wav',
);
mkdirSync(dirname(outPath), {recursive: true});
writeFileSync(outPath, wav);
console.log(`Wrote ${outPath} (${DURATION}s, peak before master ${peak.toFixed(2)})`);
