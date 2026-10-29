// Generates the Vietnamese voiceover for the Kita Boo video with ElevenLabs.
//
// Setup: put your key in `.env.elevenlabs` (NOT `.env` — Remotion exposes every
// `.env` variable to the Studio bundle in the browser):
//   ELEVENLABS_API_KEY=sk_...
//   ELEVENLABS_VOICE_ID=...        (optional, auto-picked if missing)
//   ELEVENLABS_MODEL=eleven_v3     (optional)
//
// Usage:
//   node scripts/generate-voiceover.mjs                 generate all lines
//   node scripts/generate-voiceover.mjs hook cta        regenerate some lines
//   node scripts/generate-voiceover.mjs --list-voices   browse Vietnamese female voices
//
// Output: public/voiceover/kita-boo/<id>.mp3, plus a timing report.

import {execSync} from 'node:child_process';
import {appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ENV_FILE = join(ROOT, '.env.elevenlabs');
const OUT_DIR = join(ROOT, 'public', 'voiceover', 'kita-boo');
const API = 'https://api.elevenlabs.io/v1';

// `text` is what the voice reads, spelled phonetically where Vietnamese TTS
// would otherwise stumble (brand name, units, English words).
// `maxSeconds` is the room the line has before the next scene's downbeat.
const LINES = [
	{
		id: '01-hook',
		maxSeconds: 3.6,
		tag: '[curious]',
		// Seed 1010 swallowed the opening "Bé"
		seed: 7,
		text: 'Bé nhà mình lười uống nước? Để Kita Bu lo nhé!',
	},
	{
		id: '02-reveal',
		maxSeconds: 5.6,
		tag: '[cheerful]',
		// Seed 21 gives a take that fits before the cut with the current voice
		seed: 21,
		text: 'Đây là bình nước Kita Bu, dung tích bốn trăm tám mươi mi-li-lít, nhỏ xinh vừa tay bé.',
	},
	{
		id: '03-design',
		maxSeconds: 5.6,
		// No tag: with [cheerful] "vòm" came out closer to "phòm"
		tag: '',
		text: 'Nắp mái vòm hình gấu phi hành gia siêu đáng yêu, lại có quai xách tiện lợi.',
	},
	{
		id: '04-one-touch',
		maxSeconds: 5.6,
		tag: '[cheerful]',
		text: 'Chỉ cần bấm nút, nắp bật mở ngay, bé tự uống nước thật dễ dàng.',
	},
	{
		id: '05-straw',
		maxSeconds: 5.6,
		tag: '[warmly]',
		text: 'Ống hút xi-li-côn mềm mại, có nắp đậy giữ ống hút luôn sạch sẽ.',
	},
	{
		id: '06-safety',
		maxSeconds: 5.6,
		tag: '[warmly]',
		text: 'Nhựa Tri-tan cao cấp, không chứa bê-pê-a, có vạch chia dung tích rõ ràng.',
	},
	{
		id: '07-colors',
		maxSeconds: 5.6,
		tag: '[cheerful]',
		text: 'Có ba màu hồng, xanh lá và xanh na-vi, bé thích màu nào cũng có.',
	},
	{
		id: '08-cta',
		maxSeconds: 3.7,
		tag: '[excited]',
		text: 'Bấm vào giỏ hàng để rinh Kita Bu về cho bé ngay nhé!',
	},
];

const loadEnv = () => {
	const env = {};
	if (existsSync(ENV_FILE)) {
		for (const line of readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
			const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
			if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, '');
		}
	}
	return {...env, ...Object.fromEntries(Object.entries(process.env).filter(([k]) => k.startsWith('ELEVENLABS_')))};
};

const env = loadEnv();
const apiKey = env.ELEVENLABS_API_KEY;
const model = env.ELEVENLABS_MODEL || 'eleven_v3';

if (!apiKey) {
	console.error(`Missing ELEVENLABS_API_KEY. Add it to ${ENV_FILE}`);
	process.exit(1);
}

const api = async (path, init = {}) => {
	const res = await fetch(`${API}${path}`, {
		...init,
		headers: {'xi-api-key': apiKey, 'Content-Type': 'application/json', ...init.headers},
	});
	if (!res.ok) {
		const body = await res.text();
		const permission = body.match(/missing the permission (\w+)/)?.[1];
		const err = new Error(
			permission
				? `Your API key is missing the "${permission}" permission. Edit the key at https://elevenlabs.io/app/settings/api-keys and enable it.`
				: `${init.method ?? 'GET'} ${path} -> ${res.status}: ${body.slice(0, 400)}`,
		);
		err.status = res.status;
		err.body = body;
		throw err;
	}
	return res;
};

const listVietnameseVoices = async (pageSize = 20) => {
	const params = new URLSearchParams({
		language: 'vi',
		gender: 'female',
		sort: 'usage_character_count_1y',
		page_size: String(pageSize),
	});
	const res = await api(`/shared-voices?${params}`);
	const {voices} = await res.json();
	return voices;
};

const pickVoice = async () => {
	if (env.ELEVENLABS_VOICE_ID) return env.ELEVENLABS_VOICE_ID;

	const voices = await listVietnameseVoices();
	if (voices.length === 0) throw new Error('No Vietnamese female voices found in the voice library.');
	const preferred = ['advertisement', 'social_media', 'conversational', 'narrative_story'];
	const chosen =
		voices.find((v) => preferred.includes(v.use_case) && v.age !== 'old') ?? voices[0];

	console.log(`Auto-picked voice "${chosen.name}" (${chosen.age ?? '?'}, ${chosen.use_case ?? '?'})`);
	console.log(`  preview: ${chosen.preview_url}`);
	const res = await api(`/voices/add/${chosen.public_owner_id}/${chosen.voice_id}`, {
		method: 'POST',
		body: JSON.stringify({new_name: `Kita Boo VO - ${chosen.name}`}),
	});
	const {voice_id: voiceId} = await res.json();
	appendFileSync(ENV_FILE, `\nELEVENLABS_VOICE_ID=${voiceId}\n`);
	console.log(`  added to your library as ${voiceId} and saved to .env.elevenlabs\n`);
	return voiceId;
};

const synthesize = async (voiceId, line) => {
	const expressive = model.startsWith('eleven_v3') || model.startsWith('eleven_v4');
	const body = {
		text: expressive && line.tag ? `${line.tag} ${line.text}` : line.text,
		model_id: model,
		language_code: 'vi',
		seed: line.seed ?? 1010,
		voice_settings: {stability: 0.5, similarity_boost: 0.75},
	};
	const path = `/text-to-speech/${voiceId}?output_format=mp3_44100_128`;
	try {
		return await api(path, {method: 'POST', body: JSON.stringify(body)});
	} catch (err) {
		// Some models reject language_code; retry once without it
		if (err.status === 400 || err.status === 422) {
			delete body.language_code;
			return api(path, {method: 'POST', body: JSON.stringify(body)});
		}
		throw err;
	}
};

const probeDuration = (file) => {
	const out = execSync(
		`npx remotion ffprobe -v error -show_entries format=duration -of csv=p=0 "${file}"`,
		{cwd: ROOT, encoding: 'utf8'},
	);
	return Number.parseFloat(out.trim());
};

const listVoices = async () => {
	const voices = await listVietnameseVoices(30);
	for (const v of voices) {
		console.log(`${v.name} | ${v.age ?? '?'} | ${v.use_case ?? '?'} | ${v.descriptive ?? ''}`);
		console.log(`  ELEVENLABS_VOICE_ID=${v.voice_id}  (owner ${v.public_owner_id})`);
		console.log(`  preview: ${v.preview_url}`);
	}
	console.log('\nTo use a library voice, add it in the ElevenLabs UI (or let this script auto-add one).');
};

const generate = async () => {
	const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
	const lines = only.length ? LINES.filter((l) => only.some((o) => l.id.includes(o))) : LINES;

	mkdirSync(OUT_DIR, {recursive: true});
	const voiceId = await pickVoice();
	console.log(`Model ${model}, voice ${voiceId}\n`);

	let tooLong = 0;
	for (const line of lines) {
		const res = await synthesize(voiceId, line);
		const file = join(OUT_DIR, `${line.id}.mp3`);
		writeFileSync(file, Buffer.from(await res.arrayBuffer()));
		const duration = probeDuration(file);
		const ok = duration <= line.maxSeconds;
		if (!ok) tooLong++;
		console.log(
			`${ok ? 'OK  ' : 'LONG'} ${line.id.padEnd(13)} ${duration.toFixed(2)}s / ${line.maxSeconds}s  ${line.text}`,
		);
	}

	if (tooLong > 0) {
		console.log(`\n${tooLong} line(s) run past their scene. Shorten the text or speed up that <Audio>.`);
	}
};

try {
	await (process.argv.includes('--list-voices') ? listVoices() : generate());
} catch (err) {
	console.error(`\n${err.message}`);
	process.exitCode = 1;
}
