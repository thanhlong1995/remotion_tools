// Print an episode's scenes (global frames, marks) and every line with its time in the video.
// Usage (from the repo root): node .claude/skills/daytro-episode/scripts/episode_info.mjs ep01 [speaker]
import {createRequire} from 'node:module';
import {mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const [ep, speaker] = process.argv.slice(2);
if (!ep) {
	console.error('usage: node episode_info.mjs <ep01|ep02|…> [speaker]');
	process.exit(1);
}
const root = process.cwd();
const timeline = path.join(root, 'src', 'daytro', 'episodes', ep, 'timeline.ts').replaceAll('\\', '/');
const require = createRequire(path.join(root, 'package.json'));
const esbuild = require('esbuild');

const source = `
import {LINES, SCENES} from '${timeline}';
const time = (f: number) => { const s = f / 30; return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0'); };
const who = ${JSON.stringify(speaker ?? null)};
const last = SCENES[SCENES.length - 1];
console.log('total ' + (last.from + last.duration) + ' frames = ' + time(last.from + last.duration));
for (const s of SCENES) {
	console.log('\\n[' + s.key + '] from ' + s.from + ' (' + time(s.from) + '), ' + s.duration + ' frames, marks ' + JSON.stringify(s.marks));
	for (const [id, c] of Object.entries(s.cues)) {
		const l = LINES[id];
		if (who && l.speaker !== who) continue;
		console.log('  ' + [id, time(s.from + c.from), s.from + c.from, l.kind, l.speaker, l.text].join(' | '));
	}
}
`;

const dir = mkdtempSync(path.join(tmpdir(), 'daytro-info-'));
const out = path.join(dir, 'info.mjs');
try {
	esbuild.buildSync({
		stdin: {contents: source, loader: 'ts', resolveDir: root},
		bundle: true,
		platform: 'node',
		format: 'esm',
		loader: {'.json': 'json'},
		outfile: out,
		logLevel: 'error',
	});
	writeFileSync(path.join(dir, 'package.json'), '{"type": "module"}');
	await import(pathToFileURL(out).href);
} finally {
	rmSync(dir, {recursive: true, force: true});
}
