// Generates a royalty-free lo-fi bed for narrated videos: 80 BPM swung
// drums, FM electric piano on Fmaj7-Em7-Dm7-Cmaj7, sub bass and vinyl
// crackle. It sits under a voice, so it stays sparse and darkish.
//
// Usage: node scripts/generate-lofi.mjs [seconds=100] [name=lofi-reading]
// Output: public/music/<name>.wav (the video fades it out at the end)

import {mkdirSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const SR = 44100;
const DURATION = Number(process.argv[2] ?? 100);
const NAME = process.argv[3] ?? 'lofi-reading';
const BPM = 80;
const BEAT = 60 / BPM;
const BAR = 4 * BEAT;
const SWING = 0.6;
const TOTAL = Math.round(DURATION * SR);

let seed = 1310;
const rand = () => {
	seed |= 0;
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rand() * 2 - 1;
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);

const keysL = new Float32Array(TOTAL);
const keysR = new Float32Array(TOTAL);
const drums = new Float32Array(TOTAL);
const bassBus = new Float32Array(TOTAL);

class Filter {
	constructor(type, f, q = 0.707) {
		const w0 = (2 * Math.PI * f) / SR;
		const cos = Math.cos(w0);
		const alpha = Math.sin(w0) / (2 * q);
		const a0 = 1 + alpha;
		const b =
			type === 'lp'
				? [(1 - cos) / 2, 1 - cos, (1 - cos) / 2]
				: type === 'hp'
					? [(1 + cos) / 2, -(1 + cos), (1 + cos) / 2]
					: [alpha, 0, -alpha];
		this.b0 = b[0] / a0;
		this.b1 = b[1] / a0;
		this.b2 = b[2] / a0;
		this.a1 = (-2 * cos) / a0;
		this.a2 = (1 - alpha) / a0;
		this.x1 = this.x2 = this.y1 = this.y2 = 0;
	}

	process(x) {
		const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
		this.x2 = this.x1;
		this.x1 = x;
		this.y2 = this.y1;
		this.y1 = y;
		return y;
	}
}

const add = (buf, i, v) => {
	if (i >= 0 && i < TOTAL) buf[i] += v;
};

// FM electric piano with a slow wobble, like a worn tape
const epiano = (t0, midi, dur, gain, pan) => {
	const f = mtof(midi);
	const start = Math.round(t0 * SR);
	const total = Math.round((dur + 0.6) * SR);
	const gl = Math.cos(((pan + 1) * Math.PI) / 4);
	const gr = Math.sin(((pan + 1) * Math.PI) / 4);
	for (let i = 0; i < total; i++) {
		const t = i / SR;
		const wobble = 1 + 0.0025 * Math.sin(2 * Math.PI * 0.6 * (t0 + t));
		const index = 1.6 * Math.exp(-t / 0.22) + 0.25;
		const mod = Math.sin(2 * Math.PI * f * wobble * t) * index;
		const env =
			Math.min(1, t / 0.006) * Math.exp(-t / 1.8) * (t > dur ? Math.max(0, 1 - (t - dur) / 0.6) : 1);
		const tremolo = 1 + 0.12 * Math.sin(2 * Math.PI * 4.2 * t);
		const s = (Math.sin(2 * Math.PI * f * wobble * t + mod) + 0.15 * Math.sin(4 * Math.PI * f * t)) * env * tremolo;
		add(keysL, start + i, s * gain * gl);
		add(keysR, start + i, s * gain * gr);
	}
};

const kick = (t0, gain) => {
	const start = Math.round(t0 * SR);
	let ph = 0;
	for (let i = 0; i < Math.round(0.35 * SR); i++) {
		const t = i / SR;
		ph += (2 * Math.PI * (48 + 70 * Math.exp(-t * 28))) / SR;
		add(drums, start + i, Math.sin(ph) * Math.exp(-t * 9) * gain);
	}
};

const snare = (t0, gain) => {
	const start = Math.round(t0 * SR);
	const bp = new Filter('bp', 1600, 0.8);
	for (let i = 0; i < Math.round(0.3 * SR); i++) {
		const t = i / SR;
		const s = bp.process(noise()) * 2 * Math.exp(-t / 0.07) + Math.sin(2 * Math.PI * 185 * t) * Math.exp(-t / 0.04) * 0.5;
		add(drums, start + i, s * gain);
	}
};

const hat = (t0, gain) => {
	const start = Math.round(t0 * SR);
	const hp = new Filter('hp', 7000, 0.7);
	for (let i = 0; i < Math.round(0.08 * SR); i++) {
		add(drums, start + i, hp.process(noise()) * Math.exp(-i / SR / 0.02) * gain);
	}
};

const bass = (t0, midi, dur, gain) => {
	const f = mtof(midi);
	const start = Math.round(t0 * SR);
	for (let i = 0; i < Math.round((dur + 0.1) * SR); i++) {
		const t = i / SR;
		const env = Math.min(1, t / 0.02) * (t > dur ? Math.max(0, 1 - (t - dur) / 0.1) : 1) * (0.7 + 0.3 * Math.exp(-t / 0.4));
		add(bassBus, start + i, (Math.sin(2 * Math.PI * f * t) + 0.2 * Math.sin(4 * Math.PI * f * t)) * env * gain);
	}
};

const chords = [
	{notes: [53, 57, 60, 64, 67], root: 41}, // Fmaj9
	{notes: [52, 55, 59, 62], root: 40}, // Em7
	{notes: [50, 53, 57, 60, 64], root: 38}, // Dm9
	{notes: [48, 52, 55, 59, 62], root: 36}, // Cmaj9
];

// Swung 8th-note position within a bar
const at8 = (barStart, i) => barStart + Math.floor(i / 2) * BEAT + (i % 2 ? SWING * BEAT : 0);

const bars = Math.ceil(DURATION / BAR);
for (let b = 0; b < bars; b++) {
	const t = b * BAR;
	const chord = chords[b % 4];
	chord.notes.forEach((m, k) => epiano(t + k * 0.018, m, BAR * 0.92, 0.07, -0.3 + k * 0.15));
	// A soft re-voicing on the "and" of 3 every other bar
	if (b % 2 === 1) chord.notes.slice(-3).forEach((m, k) => epiano(at8(t, 5) + k * 0.015, m + 12, BEAT, 0.035, 0.2));
	bass(t, chord.root, 2 * BEAT - 0.1, 0.32);
	bass(at8(t, 5), chord.root + (b % 2 ? 7 : 0), BEAT, 0.26);

	if (b < 1) continue; // first bar: keys only
	kick(t, 0.8);
	kick(at8(t, 3), 0.55);
	if (b % 4 === 3) kick(at8(t, 7), 0.45);
	snare(at8(t, 2), 0.32);
	snare(at8(t, 6), 0.32);
	for (let i = 0; i < 8; i++) hat(at8(t, i), i % 2 ? 0.05 : 0.08);
}

// Mix: dark low-pass on keys, vinyl hiss and crackle on top
const L = new Float32Array(TOTAL);
const R = new Float32Array(TOTAL);
const lpL = new Filter('lp', 2600);
const lpR = new Filter('lp', 2600);
const drumLp = new Filter('lp', 5000);
const bassLp = new Filter('lp', 400);
const hissLp = new Filter('lp', 3500);
for (let i = 0; i < TOTAL; i++) {
	const d = drumLp.process(drums[i]);
	const b = bassLp.process(bassBus[i]);
	let vinyl = hissLp.process(noise()) * 0.012;
	if (rand() < 7 / SR) vinyl += noise() * 0.25;
	L[i] = lpL.process(keysL[i]) + d + b + vinyl;
	R[i] = lpR.process(keysR[i]) + d + b + vinyl;
}

let peak = 0;
for (let i = 0; i < TOTAL; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const fadeIn = Math.round(0.5 * SR);
for (let i = 0; i < TOTAL; i++) {
	const g = (0.85 / peak) * Math.min(1, i / fadeIn);
	L[i] = Math.tanh(L[i] * g * 1.2) / Math.tanh(1.2);
	R[i] = Math.tanh(R[i] * g * 1.2) / Math.tanh(1.2);
}

const dataSize = TOTAL * 4;
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
	wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), 44 + i * 4);
	wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), 46 + i * 4);
}

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'music', `${NAME}.wav`);
mkdirSync(dirname(out), {recursive: true});
writeFileSync(out, wav);
console.log(`Wrote ${out} (${DURATION}s)`);
