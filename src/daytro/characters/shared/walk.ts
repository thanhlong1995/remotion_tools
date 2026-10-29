const TAU = Math.PI * 2;

// Degrees. hip > 0 swings the leg forward (towards +x, the way a side-view character faces);
// knee > 0 folds the shin back
export type LegPose = {readonly hip: number; readonly knee: number};

// 0..1 through one full stride (two steps) lasting `period` seconds
export const strideCycle = (frame: number, fps: number, period: number, offset = 0) =>
	((((frame / fps) / period + offset) % 1) + 1) % 1;

// The leg swings like a pendulum and bends at the knee only while travelling forward in the air
export const legSwing = (phase: number, stride: number, lift: number): LegPose => ({
	hip: stride * Math.sin(phase * TAU),
	knee: lift * Math.max(0, Math.cos(phase * TAU)) ** 1.5,
});

// Up/down bounce: highest as the legs pass each other, lowest when both feet are down
export const walkBob = (phase: number, amount: number) => -amount * Math.cos(phase * 2 * TAU);

// Arms swing against the leg on the same side
export const armSwing = (phase: number, amount: number) => -amount * Math.sin(phase * TAU);

// How fast the ground must slide under a planted foot so it doesn't skate: during the half stride
// the foot is down it sweeps 2 * leg * sin(stride) backwards
export const groundSpeed = (legLength: number, strideDeg: number, period: number) =>
	(2 * legLength * Math.sin((strideDeg * Math.PI) / 180)) / (period / 2);
