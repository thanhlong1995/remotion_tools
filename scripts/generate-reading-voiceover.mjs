// Voiceover + word-level captions for the "AI content workflow" reading video.
//
// Needs in `.env.elevenlabs`:
//   ELEVENLABS_API_KEY=sk_...
//   ELEVENLABS_READING_VOICE_ID=...   (male Vietnamese voice; separate from the
//                                     Kita Boo voice so the two don't clash)
//
// Usage:
//   node scripts/generate-reading-voiceover.mjs                generate all scenes
//   node scripts/generate-reading-voiceover.mjs hook cta       regenerate some scenes
//   node scripts/generate-reading-voiceover.mjs --placeholder  timing estimate, no API
//   node scripts/generate-reading-voiceover.mjs --retempo      re-apply TEMPO, no API
//
// Saves the voice as generated to public/voiceover/reading/raw/<id>.mp3, then
// a sped-up copy to public/voiceover/reading/<id>.mp3, and writes
// src/reading/voiceover.elevenlabs.json (raw timings + tempo, which the video
// scales). Each sped-up clip is transcribed back with Scribe so
// mispronunciations show up as text. The script lives in reading-script.mjs.

import {execSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {ENV_FILE, loadEnv, probeDurationMs, ROOT, SCENES, toCaption} from './reading-script.mjs';

const AUDIO_DIR = join(ROOT, 'public', 'voiceover', 'reading');
const RAW_DIR = join(AUDIO_DIR, 'raw');
const MANIFEST = join(ROOT, 'src', 'reading', 'voiceover.elevenlabs.json');
const API = 'https://api.elevenlabs.io/v1';
const MODEL = 'eleven_v3';
// The male voice reads slowly. ElevenLabs' `speed` setting garbles eleven_v3,
// and Remotion's playbackRate raises the pitch, so the files are time-stretched
// with ffmpeg's atempo instead (same pitch). 1 = as generated.
const TEMPO = 1.1;

// Group character timings from ElevenLabs into word captions
const captionsFromAlignment = ({characters, character_start_times_seconds: starts, character_end_times_seconds: ends}) => {
	const captions = [];
	let word = '';
	let wordStart = 0;
	let wordEnd = 0;
	const flush = () => {
		if (!word) return;
		captions.push(toCaption(word, wordStart * 1000, wordEnd * 1000, captions.length === 0));
		word = '';
	};
	characters.forEach((ch, i) => {
		if (/\s/.test(ch)) {
			flush();
			return;
		}
		if (!word) wordStart = starts[i];
		word += ch;
		wordEnd = ends[i];
	});
	flush();
	return captions;
};

// Keep the spoken timings but show the written words
const withDisplayText = (captions, text) => {
	const words = text.split(/\s+/);
	if (words.length !== captions.length) {
		throw new Error(`"say" has ${captions.length} words but "text" has ${words.length}`);
	}
	return captions.map((c, i) => ({...c, text: i === 0 ? words[i] : ` ${words[i]}`}));
};

// Rough timing (~4.3 syllables/s, pauses on punctuation) to lay out scenes
// before any audio exists
const estimateCaptions = (text) => {
	let t = 0;
	return text.split(/\s+/).map((word, i) => {
		const start = t;
		t += 230;
		const caption = toCaption(word, start, t, i === 0);
		if (/[.,?:!]$/.test(word)) t += 260;
		return caption;
	});
};

const readManifest = () =>
	existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {scenes: []};

const writeManifest = (scenes, voiceId, tempo) => {
	mkdirSync(dirname(MANIFEST), {recursive: true});
	writeFileSync(MANIFEST, `${JSON.stringify({voiceId, model: MODEL, tempo, scenes}, null, '\t')}\n`);
};

const stretch = (id) => {
	execSync(
		`npx remotion ffmpeg -y -hide_banner -loglevel error -i "${join(RAW_DIR, `${id}.mp3`)}" -filter:a atempo=${TEMPO} -codec:a libmp3lame -b:a 128k "${join(AUDIO_DIR, `${id}.mp3`)}"`,
		{cwd: ROOT},
	);
};

const retempo = () => {
	const manifest = readManifest();
	for (const scene of manifest.scenes) {
		if (scene.audio) stretch(scene.id);
	}
	writeManifest(manifest.scenes, manifest.voiceId, TEMPO);
	console.log(`Re-stretched ${manifest.scenes.filter((s) => s.audio).length} clips at tempo ${TEMPO}`);
};

const placeholder = () => {
	const scenes = SCENES.map(({id, text}) => {
		const captions = estimateCaptions(text);
		return {id, audio: null, durationMs: captions.at(-1).endMs + 200, captions};
	});
	writeManifest(scenes, null, 1);
	const total = scenes.reduce((sum, s) => sum + s.durationMs, 0);
	console.log(`Wrote placeholder timings (${(total / 1000).toFixed(1)}s of speech) to ${MANIFEST}`);
};

const generate = async () => {
	const env = loadEnv();
	const apiKey = env.ELEVENLABS_API_KEY;
	const voiceId = env.ELEVENLABS_READING_VOICE_ID;
	if (!apiKey || !voiceId) {
		throw new Error(`Add ELEVENLABS_API_KEY and ELEVENLABS_READING_VOICE_ID to ${ENV_FILE}`);
	}

	const call = async (path, init) => {
		const res = await fetch(`${API}${path}`, {...init, headers: {'xi-api-key': apiKey, ...init.headers}});
		if (!res.ok) throw new Error(`${path} -> ${res.status}: ${(await res.text()).slice(0, 300)}`);
		return res.json();
	};

	const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
	const targets = only.length ? SCENES.filter((s) => only.some((o) => s.id.includes(o))) : SCENES;
	const existing = new Map(readManifest().scenes.map((s) => [s.id, s]));

	mkdirSync(RAW_DIR, {recursive: true});
	console.log(`Model ${MODEL}, voice ${voiceId}, tempo ${TEMPO}\n`);

	for (const scene of targets) {
		const result = await call(`/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				text: scene.say ?? scene.text,
				model_id: MODEL,
				language_code: 'vi',
				seed: scene.seed ?? 1310,
				voice_settings: {stability: 0.5, similarity_boost: 0.75},
			}),
		});
		const rawFile = join(RAW_DIR, `${scene.id}.mp3`);
		writeFileSync(rawFile, Buffer.from(result.audio_base64, 'base64'));
		stretch(scene.id);

		// Check what the viewer actually hears: the sped-up file
		const form = new FormData();
		form.append('model_id', 'scribe_v2');
		form.append('language_code', 'vi');
		form.append(
			'file',
			new Blob([readFileSync(join(AUDIO_DIR, `${scene.id}.mp3`))], {type: 'audio/mpeg'}),
			`${scene.id}.mp3`,
		);
		const transcript = await call('/speech-to-text', {method: 'POST', body: form});

		const durationMs = probeDurationMs(rawFile);
		existing.set(scene.id, {
			id: scene.id,
			audio: `voiceover/reading/${scene.id}.mp3`,
			durationMs,
			captions: scene.say
				? withDisplayText(captionsFromAlignment(result.alignment), scene.text)
				: captionsFromAlignment(result.alignment),
		});
		console.log(
			`${scene.id.padEnd(14)} ${(durationMs / 1000).toFixed(2)}s -> ${(durationMs / 1000 / TEMPO).toFixed(2)}s sped up`,
		);
		console.log(`  script: ${scene.text}`);
		console.log(`  heard:  ${transcript.text}\n`);
	}

	const scenes = SCENES.map(({id, text}) => existing.get(id) ?? {
		id,
		audio: null,
		durationMs: estimateCaptions(text).at(-1).endMs + 200,
		captions: estimateCaptions(text),
	});
	writeManifest(scenes, voiceId, TEMPO);
	const total = scenes.reduce((sum, s) => sum + s.durationMs, 0);
	console.log(`Total speech ${(total / 1000).toFixed(1)}s. Manifest: ${MANIFEST}`);
};

try {
	if (process.argv.includes('--placeholder')) placeholder();
	else if (process.argv.includes('--retempo')) retempo();
	else await generate();
} catch (err) {
	console.error(`\n${err.message}`);
	process.exitCode = 1;
}
