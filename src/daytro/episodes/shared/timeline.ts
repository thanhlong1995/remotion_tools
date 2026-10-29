export const FPS = 30;

export type Line = {
	readonly id: string;
	readonly speaker: string;
	// speech: heard by everyone; thought: a pet thinking near humans; bark: a real bark
	// laugh: a recorded laugh (no subtitle); the scene shows the speaker, or several people, laughing
	readonly kind: 'speech' | 'thought' | 'bark' | 'laugh';
	readonly text: string;
	readonly volume?: number;
};

type AudioLine = {file: string; seconds: number; env: number[]};
export type AudioManifest = {lines: Record<string, AudioLine>};

export type Step = {line: string; gap?: number} | {wait: number} | {mark: string};

export type Cue = {readonly from: number; readonly to: number};

export type Scene = {
	readonly key: string;
	readonly from: number;
	readonly duration: number;
	// Scene-local frames
	readonly cues: Record<string, Cue>;
	readonly marks: Record<string, number>;
};

// An episode's timing, built from its script: each scene is a list of steps (say a line, wait,
// drop a named mark). Line lengths come from the rendered voices, or are estimated until then
export const makeEpisode = (lineData: Line[], audio: AudioManifest, script: {key: string; steps: Step[]}[]) => {
	const LINES: Record<string, Line> = Object.fromEntries(lineData.map((l) => [l.id, l]));
	const AUDIO = audio.lines;
	const estimate = (text: string) => text.split(/\s+/).length / 4.6 + 0.3;
	const lineFrames = (id: string) => Math.ceil((AUDIO[id]?.seconds ?? estimate(LINES[id].text)) * FPS);

	const build = (key: string, steps: Step[], from: number): Scene => {
		let t = 0;
		const cues: Record<string, Cue> = {};
		const marks: Record<string, number> = {};
		for (const s of steps) {
			if ('line' in s) {
				const d = lineFrames(s.line);
				cues[s.line] = {from: t, to: t + d};
				t += d + Math.round((s.gap ?? 0.25) * FPS);
			} else if ('wait' in s) {
				t += Math.round(s.wait * FPS);
			} else {
				marks[s.mark] = t;
			}
		}
		return {key, from, duration: t, cues, marks};
	};

	const SCENES: Scene[] = script.reduce<Scene[]>((acc, s) => {
		const prev = acc[acc.length - 1];
		return [...acc, build(s.key, s.steps, prev ? prev.from + prev.duration : 0)];
	}, []);

	const scene = (key: string): Scene => {
		const found = SCENES.find((s) => s.key === key);
		if (!found) {
			throw new Error(`No scene ${key}`);
		}
		return found;
	};

	// Any of these lines currently playing?
	const speaking = (s: Scene, frame: number, ...ids: string[]) =>
		ids.some((id) => s.cues[id] && frame >= s.cues[id].from && frame < s.cues[id].to);

	// How open a speaker's mouth is on a scene-local frame: follows the loudness of their line
	const mouth = (s: Scene, id: string, frame: number): number => {
		const cue = s.cues[id];
		if (!cue || frame < cue.from || frame >= cue.to || LINES[id].kind === 'thought') {
			return 0;
		}
		const env = AUDIO[id]?.env;
		const v = env ? (env[frame - cue.from] ?? 0) : 0.5 + 0.5 * Math.sin(frame * 1.9);
		return Math.max(0, Math.min(1, (v - 0.12) / 0.6));
	};

	return {
		LINES,
		SCENES,
		DURATION: SCENES.reduce((sum, s) => sum + s.duration, 0),
		scene,
		speaking,
		mouth,
		audioFile: (id: string): string | undefined => AUDIO[id]?.file,
		// Mouth openness for a speaker, whichever of their lines is playing
		mouthOf: (s: Scene, speaker: string, frame: number) =>
			Object.keys(s.cues).reduce((m, id) => (LINES[id].speaker === speaker ? Math.max(m, mouth(s, id, frame)) : m), 0),
		// Is this pet thinking one of its lines right now?
		thinking: (s: Scene, speaker: string, frame: number) =>
			Object.keys(s.cues).some((id) => LINES[id].speaker === speaker && LINES[id].kind === 'thought' && speaking(s, frame, id)),
	};
};

export type Episode = ReturnType<typeof makeEpisode>;
