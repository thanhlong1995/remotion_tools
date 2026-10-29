// Free, offline voiceover for the reading video with VieNeu-TTS.
//
// Needs the Python env in .venv (`pip install vieneu`) and, for word-level
// caption timings, ELEVENLABS_API_KEY in .env.elevenlabs (Scribe costs far
// less than generating speech).
//
// Usage:
//   node scripts/generate-reading-vieneu.mjs                 all scenes
//   node scripts/generate-reading-vieneu.mjs hook cta        some scenes
//   node scripts/generate-reading-vieneu.mjs --voice="Thiện Minh"
//
// Writes public/voiceover/reading-vieneu/<id>.mp3 and
// src/reading/voiceover.vieneu.json. Pick the engine in src/reading/timeline.ts.

import {execFileSync, execSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {loadEnv, probeDurationMs, ROOT, SCENES, toCaption, transcribe} from './reading-script.mjs';

const PYTHON = join(ROOT, '.venv', 'Scripts', 'python.exe');
const AUDIO_DIR = join(ROOT, 'public', 'voiceover', 'reading-vieneu');
const MANIFEST = join(ROOT, 'src', 'reading', 'voiceover.vieneu.json');
const DEFAULT_VOICE = 'Hải Đăng';

const norm = (w) => w.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}]/gu, '');

// Map the transcriber's word timings onto the script's words. A token-level
// edit-distance alignment absorbs recognition slips ("CapCut" heard as two
// words, "3" heard as "ba"), so captions always show the script text.
const alignCaptions = (text, heard) => {
	const words = text.split(/\s+/);
	const n = words.length;
	const m = heard.length;
	const GAP = 0.7;
	const sub = (a, b) => {
		const x = norm(a);
		const y = norm(b);
		if (x === y) return 0;
		if (x && y && (x[0] === y[0] || x.includes(y) || y.includes(x))) return 0.6;
		return 1;
	};
	const cost = Array.from({length: n + 1}, () => new Array(m + 1).fill(0));
	for (let i = 1; i <= n; i++) cost[i][0] = i * GAP;
	for (let j = 1; j <= m; j++) cost[0][j] = j * GAP;
	for (let i = 1; i <= n; i++) {
		for (let j = 1; j <= m; j++) {
			cost[i][j] = Math.min(
				cost[i - 1][j - 1] + sub(words[i - 1], heard[j - 1].text),
				cost[i - 1][j] + GAP,
				cost[i][j - 1] + GAP,
			);
		}
	}

	// Walk back: matched heard words time their script word; extra heard words
	// stretch the script word before them
	const spans = words.map(() => null);
	const extend = (i, w) => {
		spans[i] = spans[i]
			? {start: Math.min(spans[i].start, w.start), end: Math.max(spans[i].end, w.end)}
			: {start: w.start, end: w.end};
	};
	let i = n;
	let j = m;
	while (i > 0 || j > 0) {
		if (i > 0 && j > 0 && cost[i][j] === cost[i - 1][j - 1] + sub(words[i - 1], heard[j - 1].text)) {
			extend(i - 1, heard[j - 1]);
			i--;
			j--;
		} else if (j > 0 && (i === 0 || cost[i][j] === cost[i][j - 1] + GAP)) {
			extend(Math.max(0, i - 1), heard[j - 1]);
			j--;
		} else {
			i--;
		}
	}

	// Script words nobody heard share the gap between their neighbours
	for (let k = 0; k < n; k++) {
		if (spans[k]) continue;
		let next = k;
		while (next < n && !spans[next]) next++;
		const from = k > 0 ? spans[k - 1].end : 0;
		const to = next < n ? spans[next].start : from + 0.3 * (next - k);
		const step = (to - from) / (next - k);
		for (let q = k; q < next; q++) spans[q] = {start: from + step * (q - k), end: from + step * (q - k + 1)};
		k = next - 1;
	}

	return words.map((w, k) => toCaption(w, spans[k].start * 1000, spans[k].end * 1000, k === 0));
};

const readManifest = () =>
	existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {scenes: []};

const main = async () => {
	const apiKey = loadEnv().ELEVENLABS_API_KEY;
	if (!apiKey) throw new Error('ELEVENLABS_API_KEY is needed for caption timings (.env.elevenlabs)');
	if (!existsSync(PYTHON)) throw new Error(`No Python env at ${PYTHON}. Run: py -3.12 -m venv .venv`);

	const voiceArg = process.argv.find((a) => a.startsWith('--voice='));
	const voice = voiceArg ? voiceArg.slice('--voice='.length) : DEFAULT_VOICE;
	const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
	const targets = only.length ? SCENES.filter((s) => only.some((o) => s.id.includes(o))) : SCENES;
	const previous = readManifest();
	if (previous.voice && previous.voice !== voice && only.length) {
		throw new Error(`Manifest uses "${previous.voice}"; regenerate all scenes to switch voice`);
	}

	const workDir = join(tmpdir(), 'reading-vieneu');
	mkdirSync(workDir, {recursive: true});
	mkdirSync(AUDIO_DIR, {recursive: true});
	const input = join(workDir, 'scenes.json');
	// `vieneuSay` is what VieNeu reads when the written text trips it up;
	// captions still show `text` (the alignment absorbs the difference)
	writeFileSync(
		input,
		JSON.stringify(targets.map(({id, text, vieneuSay}) => ({id, text: vieneuSay ?? text, seed: 1310}))),
	);

	console.log(`VieNeu voice "${voice}", ${targets.length} scene(s)\n`);
	execFileSync(PYTHON, [join(ROOT, 'scripts', 'vieneu_synth.py'), input, workDir, voice], {
		stdio: 'inherit',
		env: {...process.env, PYTHONIOENCODING: 'utf-8', HF_HUB_DISABLE_SYMLINKS_WARNING: '1'},
	});

	const scenes = new Map(previous.scenes.map((s) => [s.id, s]));
	console.log('');
	for (const scene of targets) {
		const wav = join(workDir, `${scene.id}.wav`);
		const mp3 = join(AUDIO_DIR, `${scene.id}.mp3`);
		execSync(
			`npx remotion ffmpeg -y -hide_banner -loglevel error -i "${wav}" -codec:a libmp3lame -b:a 128k "${mp3}"`,
			{cwd: ROOT},
		);
		rmSync(wav);

		// Scribe occasionally returns a bogus tag like "[outro jingle]" for clean
		// speech; a retry fixes it
		let heard = await transcribe(apiKey, mp3);
		for (let attempt = 0; attempt < 2 && heard.words.length < scene.text.split(/\s+/).length / 2; attempt++) {
			heard = await transcribe(apiKey, mp3);
		}
		const durationMs = probeDurationMs(mp3);
		scenes.set(scene.id, {
			id: scene.id,
			audio: `voiceover/reading-vieneu/${scene.id}.mp3`,
			durationMs,
			captions: alignCaptions(scene.text, heard.words),
		});
		console.log(`${scene.id.padEnd(14)} ${(durationMs / 1000).toFixed(2)}s`);
		console.log(`  script: ${scene.text}`);
		console.log(`  heard:  ${heard.text}\n`);
	}

	const ordered = SCENES.map(({id}) => scenes.get(id)).filter(Boolean);
	if (ordered.length !== SCENES.length) {
		throw new Error('Some scenes have no VieNeu audio yet; run without scene filters first');
	}
	writeFileSync(MANIFEST, `${JSON.stringify({engine: 'vieneu', voice, tempo: 1, scenes: ordered}, null, '\t')}\n`);
	const total = ordered.reduce((sum, s) => sum + s.durationMs, 0);
	console.log(`Total speech ${(total / 1000).toFixed(1)}s. Manifest: ${MANIFEST}`);
};

try {
	await main();
} catch (err) {
	console.error(`\n${err.message}`);
	process.exitCode = 1;
}
