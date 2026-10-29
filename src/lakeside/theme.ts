import {interpolate} from 'remotion';

export const INK = '#3D2C4A';
export const OUTLINE = 5;
export const CHEEK = '#FF9EB5';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Sine wave with its period in frames, so loops line up with the composition length
export const wave = (frame: number, period: number, phase = 0) =>
	Math.sin((frame / period) * Math.PI * 2 + phase);

// Eyelid scale: 1 when open, dipping to 0.1 for a quick blink once per period
export const blinkAt = (frame: number, offset: number, period = 96) =>
	interpolate((frame + offset) % period, [0, 3, 6], [1, 0.1, 1], clamp);
