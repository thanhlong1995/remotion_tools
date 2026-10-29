// Free, offline storyteller voice for the LakesidePlay cartoon with VieNeu-TTS.
//
// Needs the Python env in .venv (`pip install vieneu`). With --check and
// ELEVENLABS_API_KEY in .env.elevenlabs, it also prints what a speech
// recognizer hears, to catch misread words.
//
// Usage:
//   node scripts/generate-lakeside-vieneu.mjs
//   node scripts/generate-lakeside-vieneu.mjs --voice="Ngọc Linh" --check
//
// Writes public/voiceover/lakeside/<id>.mp3 and src/lakeside/voiceover.json.

import {execFileSync, execSync} from 'node:child_process';
import {existsSync, mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {loadEnv, probeDurationMs, ROOT, transcribe} from './reading-script.mjs';

const PYTHON = join(ROOT, '.venv', 'Scripts', 'python.exe');
const AUDIO_DIR = join(ROOT, 'public', 'voiceover', 'lakeside');
const MANIFEST = join(ROOT, 'src', 'lakeside', 'voiceover.json');
const DEFAULT_VOICE = 'Quỳnh Anh';

const LINES = [
	{id: '01-intro', text: 'Bên hồ sen xanh mát, cún bông và vịt vàng đang chơi bóng cùng nhau.'},
	{id: '02-frog', text: 'Chú ếch xanh trên lá sen vỗ tay reo vui: giỏi quá đi thôi!'},
	{id: '03-outro', text: 'Một ngày thật vui bên hồ sen!'},
];

const main = async () => {
	if (!existsSync(PYTHON)) throw new Error(`No Python env at ${PYTHON}. Run setup.bat first`);

	const voiceArg = process.argv.find((a) => a.startsWith('--voice='));
	const voice = voiceArg ? voiceArg.slice('--voice='.length) : DEFAULT_VOICE;
	const apiKey = process.argv.includes('--check') ? loadEnv().ELEVENLABS_API_KEY : null;

	const workDir = join(tmpdir(), 'lakeside-vieneu');
	mkdirSync(workDir, {recursive: true});
	mkdirSync(AUDIO_DIR, {recursive: true});
	const input = join(workDir, 'lines.json');
	writeFileSync(input, JSON.stringify(LINES.map(({id, text}) => ({id, text, seed: 1310}))));

	console.log(`VieNeu voice "${voice}", ${LINES.length} line(s)\n`);
	execFileSync(PYTHON, [join(ROOT, 'scripts', 'vieneu_synth.py'), input, workDir, voice], {
		stdio: 'inherit',
		env: {...process.env, PYTHONIOENCODING: 'utf-8', HF_HUB_DISABLE_SYMLINKS_WARNING: '1'},
	});

	console.log('');
	const lines = [];
	for (const line of LINES) {
		const wav = join(workDir, `${line.id}.wav`);
		const mp3 = join(AUDIO_DIR, `${line.id}.mp3`);
		execSync(
			`npx remotion ffmpeg -y -hide_banner -loglevel error -i "${wav}" -codec:a libmp3lame -b:a 128k "${mp3}"`,
			{cwd: ROOT},
		);
		rmSync(wav);
		const durationMs = probeDurationMs(mp3);
		lines.push({id: line.id, text: line.text, audio: `voiceover/lakeside/${line.id}.mp3`, durationMs});
		console.log(`${line.id.padEnd(10)} ${(durationMs / 1000).toFixed(2)}s`);
		console.log(`  script: ${line.text}`);
		if (apiKey) console.log(`  heard:  ${(await transcribe(apiKey, mp3)).text}`);
	}

	writeFileSync(MANIFEST, `${JSON.stringify({engine: 'vieneu', voice, lines}, null, '\t')}\n`);
	const total = lines.reduce((sum, l) => sum + l.durationMs, 0);
	console.log(`\nTotal speech ${(total / 1000).toFixed(1)}s. Manifest: ${MANIFEST}`);
};

try {
	await main();
} catch (err) {
	console.error(`\n${err.message}`);
	process.exitCode = 1;
}
