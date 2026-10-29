// Shared by the reading video's voiceover generators (ElevenLabs and VieNeu).

import {execSync} from 'node:child_process';
import {existsSync, readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const ENV_FILE = join(ROOT, '.env.elevenlabs');

// The approved narration. Captions always show `text`.
// ElevenLabs-only tweaks: `say` (phonetic spelling, same word count) and `seed`.
export const SCENES = [
	{
		id: '01-hook',
		text: 'Mất cả buổi tối mới xong một clip 60 giây? Mình đã rút xuống còn 20 phút, mà gần như không tốn đồng nào.',
	},
	{
		id: '02-problem',
		// The ElevenLabs file is a hand-picked take (captions rebuilt from Scribe
		// word timings) that says "CapCut" cleanly. Seeds 1310 and 7 both
		// re-generated it as "kháp khắt", so check the transcript if you redo it.
		seed: 7,
		text: 'Hồi mới xây kênh, mình ngại đứng trước ống kính, lười ngồi CapCut cắt từng nhịp thở, gõ từng dòng phụ đề. Còn mấy công cụ AI trên web thì dùng thử vài lần là hết credit, mua gói tháng lại khá chát.',
		// VieNeu reads "CapCut" as "cắp khất". Spelled "cáp cắt" it is clear, and
		// the comma stops it from merging with the next "cắt"
		vieneuSay:
			'Hồi mới xây kênh, mình ngại đứng trước ống kính, lười ngồi cáp cắt, cắt từng nhịp thở, gõ từng dòng phụ đề. Còn mấy công cụ AI trên web thì dùng thử vài lần là hết credit, mua gói tháng lại khá chát.',
	},
	{
		id: '03-trio',
		text: 'Sau gần 3 tháng thử sai, mình ráp được một quy trình gần như tự động với bộ ba: Superpower, Remotion và VieNeu TTS.',
	},
	{
		id: '04-superpower',
		text: 'Superpower giúp AI viết kịch bản đúng khung: hook 3 giây, đặt vấn đề, giải thích, đưa giải pháp, rồi kêu gọi hành động.',
	},
	{
		id: '05-tts',
		text: 'VieNeu TTS đọc kịch bản tiếng Việt ngay trên máy, chạy offline, miễn phí, còn clone được giọng của bạn chỉ từ 10 đến 20 giây thu mẫu.',
		// Spelled as written, ElevenLabs read the brand as "Vianu"
		seed: 7,
		say: 'Vi-niu TTS đọc kịch bản tiếng Việt ngay trên máy, chạy offline, miễn phí, còn clone được giọng của bạn chỉ từ 10 đến 20 giây thu mẫu.',
	},
	{
		id: '06-remotion',
		text: 'Remotion dựng video bằng code: phụ đề nhảy theo từng chữ, cảnh tự khớp với giọng đọc, gõ một dòng lệnh là ra file MP4.',
	},
	{
		id: '07-workflow',
		text: 'Mỗi ngày mình chỉ chọn chủ đề, cho AI lên khung, tự sửa lại cho giống cách nói chuyện đời thường, rồi bấm chạy. Tổng cộng chừng 20 đến 30 phút một clip.',
	},
	{
		id: '08-lessons',
		text: 'Nhưng đừng phó mặc hết cho AI. Kịch bản AI viết hay sáo rỗng, phải tự tay gọt giũa thì video mới có hồn. Và cứ bắt đầu từ cái đơn giản nhất, đẹp dần sau.',
	},
	{
		id: '09-cta',
		text: 'Bạn làm nội dung một mình mà ngại lộ mặt? Thử ngay nhé, và theo dõi kênh để xem chi tiết từng bước.',
	},
];

export const toCaption = (text, startMs, endMs, first) => ({
	text: first ? text : ` ${text}`,
	startMs: Math.round(startMs),
	endMs: Math.round(endMs),
	timestampMs: Math.round((startMs + endMs) / 2),
	confidence: null,
});

export const loadEnv = () => {
	if (!existsSync(ENV_FILE)) return {};
	return Object.fromEntries(
		readFileSync(ENV_FILE, 'utf8')
			.split(/\r?\n/)
			.map((line) => line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/))
			.filter(Boolean)
			.map((m) => [m[1], m[2]]),
	);
};

export const probeDurationMs = (file) => {
	const out = execSync(
		`npx remotion ffprobe -v error -show_entries format=duration -of csv=p=0 "${file}"`,
		{cwd: ROOT, encoding: 'utf8'},
	);
	return Math.round(Number.parseFloat(out.trim()) * 1000);
};

// Speech-to-text with ElevenLabs Scribe; returns {text, words: [{text, start, end}]}
export const transcribe = async (apiKey, file) => {
	const form = new FormData();
	form.append('model_id', 'scribe_v2');
	form.append('language_code', 'vi');
	form.append('timestamps_granularity', 'word');
	form.append('file', new Blob([readFileSync(file)], {type: 'audio/mpeg'}), 'clip.mp3');
	const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
		method: 'POST',
		headers: {'xi-api-key': apiKey},
		body: form,
	});
	if (!res.ok) throw new Error(`speech-to-text -> ${res.status}: ${(await res.text()).slice(0, 300)}`);
	const json = await res.json();
	return {text: json.text, words: json.words.filter((w) => w.type === 'word')};
};
