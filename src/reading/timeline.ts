import type {Caption} from '@remotion/captions';
import {useCallback} from 'react';
import {useVideoConfig} from 'remotion';
import elevenlabs from './voiceover.elevenlabs.json';
import vieneu from './voiceover.vieneu.json';

// Which narration the video uses. 'vieneu' is free and offline
// (scripts/generate-reading-vieneu.mjs); 'elevenlabs' is the paid voice
// (scripts/generate-reading-voiceover.mjs).
const ENGINE: 'vieneu' | 'elevenlabs' = 'vieneu';
const voiceover = ENGINE === 'vieneu' ? vieneu : elevenlabs;

export type ReadingScene = {
	readonly id: string;
	readonly audio: string | null;
	readonly durationMs: number;
	readonly captions: Caption[];
};

export const FPS = 30;
// Voice starts once the incoming transition has finished
export const AUDIO_DELAY = 8;
export const TAIL = 10;
export const TRANSITION = 8;
// Let the call to action sit on screen after the last word
export const END_HOLD = 45;
// The voice files may already be time-stretched by this factor (TEMPO in
// the ElevenLabs script); the manifests keep raw timings.
const VOICE_RATE: number = voiceover.tempo ?? 1;
// Keep at most this much of the silence the TTS leaves after the last word
const TRAILING_SILENCE_MS = 250;

// Timings as heard in the video: trailing silence trimmed, then scaled by
// the tempo so scene lengths, cues and captions match the sped-up files.
export const scenes: ReadingScene[] = (voiceover.scenes as ReadingScene[]).map((scene) => {
	const lastWordEnd = scene.captions[scene.captions.length - 1].endMs;
	const durationMs = Math.min(scene.durationMs, lastWordEnd + TRAILING_SILENCE_MS);
	return {
		...scene,
		durationMs: durationMs / VOICE_RATE,
		captions: scene.captions.map((c) => ({
			...c,
			startMs: c.startMs / VOICE_RATE,
			endMs: c.endMs / VOICE_RATE,
			timestampMs: c.timestampMs === null ? null : c.timestampMs / VOICE_RATE,
		})),
	};
});

export const getScene = (id: string): ReadingScene => {
	const scene = scenes.find((s) => s.id === id);
	if (!scene) throw new Error(`No voiceover for scene ${id}`);
	return scene;
};

export const sceneFrames = (id: string): number =>
	AUDIO_DELAY + Math.ceil((getScene(id).durationMs / 1000) * FPS) + TAIL;

export const totalFrames = (): number =>
	scenes.reduce((sum, s) => sum + sceneFrames(s.id), 0) -
	TRANSITION * (scenes.length - 1) +
	END_HOLD;

const normalize = (text: string) =>
	text
		.toLowerCase()
		.normalize('NFC')
		.replace(/[.,?!:;"]/g, '')
		.trim();

// Frame (local to the scene) at which the narrator starts saying `word`.
// Lets visuals land on the spoken word whatever the voice's pacing.
export const useCue = (captions: Caption[] | undefined) => {
	const {fps} = useVideoConfig();
	return useCallback(
		(word: string, fallback: number, occurrence = 0): number => {
			if (!captions) return fallback;
			const target = normalize(word);
			const hit = captions.filter((c) => normalize(c.text) === target)[occurrence];
			return hit ? AUDIO_DELAY + Math.round((hit.startMs / 1000) * fps) : fallback;
		},
		[captions, fps],
	);
};
