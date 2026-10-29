import type React from 'react';
import {interpolate} from 'remotion';
import {MINH_LEG_LENGTH} from '../../characters/minh/MinhSide';
import type {ArmPose} from '../../characters/shared/Arm';
import {armSwing, groundSpeed, legSwing, type LegPose, walkBob} from '../../characters/shared/walk';
import {TU_LEG_LENGTH} from '../../characters/tu/BaTuSide';
import {VANG_LEG_LENGTH} from '../../characters/vang/VangSide';
import {BarkBurst} from '../../ui/BarkBurst';
import {DogBubble} from '../../ui/DogBubble';
import {Subtitle} from '../../ui/Subtitle';
import {type Box, subtitleAtTop} from '../../ui/layout';
import {ThoughtBubble} from '../../ui/ThoughtBubble';
import {INK} from '../../theme';
import type {Line, Scene} from './timeline';

// World scale of the cast in this episode, and the slightly smaller, further-back Bà Tư
export const SCALE = 0.78;
export const TU_SCALE = 0.75;
export const TU_BACK = 12;

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Lid closes for a few frames once per period
export const blinkAt = (frame: number, offset: number, period: number) =>
	interpolate((frame + offset) % period, [0, 2, 4], [1, 0, 1], clamp);

// Shaking with laughter: the body squashes and stretches from the feet a few times a second, so the
// shoulders bounce, and the head rocks back. `squash` goes to a character's vertical scale
export const laughShake = (frame: number, amount = 1) => ({
	squash: 0.025 * amount * Math.abs(Math.sin((frame * Math.PI) / 7)),
	tilt: amount * (-6 + 3 * Math.sin((frame * Math.PI) / 7)),
});

// Climbing a ladder rung by rung, front view: one foot steps up (or down) while the hand on that
// side reaches for the next rung, and the body rises one rung at a time. Starts at `start`, takes
// `perRung` frames per rung, from fromY to toY (feet positions); works for climbing down too
export const ladderClimb = (frame: number, start: number, rungs: number, perRung: number, fromY: number, toY: number) => {
	const t = Math.max(0, Math.min(rungs, (frame - start) / perRung));
	const done = t >= rungs;
	const rung = Math.min(rungs - 1, Math.floor(t));
	const u = done ? 1 : t - rung;
	const eased = u * u * (3 - 2 * u);
	const leftFoot = rung % 2 === 0;
	const lift = done || t <= 0 ? 0 : Math.sin(Math.PI * u) * 45;
	const reach: ArmPose = {shoulder: 170, elbow: -15};
	const grip: ArmPose = {shoulder: 135, elbow: -55};
	return {
		y: fromY + ((toY - fromY) * (rung + eased)) / rungs,
		started: t > 0,
		done,
		legLift: [leftFoot ? lift : 0, leftFoot ? 0 : lift] as const,
		armLeft: leftFoot ? reach : grip,
		armRight: leftFoot ? grip : reach,
	};
};

// 0 before `at`, easing to 1 over `frames`
export const ramp = (frame: number, at: number, frames = 8) =>
	interpolate(frame, [at, at + frames], [0, 1], {...clamp, easing: (x) => x * x * (3 - 2 * x)});

type Gait = {stride: number; lift: number; period: number; bob: number};

// Minh sets the pace; shorter legs take quicker steps so nobody's feet skate
const gaits = (stride: number, lift: number, minhPeriod: number) => {
	const local = groundSpeed(MINH_LEG_LENGTH, stride, minhPeriod);
	const period = (leg: number, s: number) => (4 * leg * Math.sin((s * Math.PI) / 180)) / local;
	return {
		speed: local * SCALE,
		minh: {stride, lift, period: minhPeriod, bob: stride / 4},
		tu: {stride, lift, period: period(TU_LEG_LENGTH, stride), bob: stride / 3.3},
		vang: {stride: stride + 6, lift: lift * 0.8, period: period(VANG_LEG_LENGTH, stride + 6), bob: 4},
	};
};

export const WALK = gaits(20, 40, 1.1);
export const RUN = gaits(34, 75, 0.62);

const phaseOf = (t: number, g: Gait, offset: number) => (((t / g.period + offset) % 1) + 1) % 1;

export type Biped = {nearLeg: LegPose; farLeg: LegPose; bob: number; phase: number};

// Legs and bounce for a person at time t (seconds); amount 0 stands still, 1 full stride
export const biped = (t: number, g: Gait, offset: number, amount = 1): Biped => {
	const p = phaseOf(t, g, offset);
	const near = legSwing(p, g.stride * amount, g.lift * amount);
	const far = legSwing(p + 0.5, g.stride * amount, g.lift * amount);
	return {nearLeg: near, farLeg: far, bob: walkBob(p, g.bob * amount), phase: p};
};

// Swinging arm; bent and pumping when running
export const swingArm = (b: Biped, amount: number, far: boolean, run = false): ArmPose => ({
	shoulder: armSwing(b.phase + (far ? 0.5 : 0), (run ? 34 : 16) * amount),
	elbow: run ? 70 : 12,
});

export type Dog = {
	frontNear: LegPose;
	frontFar: LegPose;
	backNear: LegPose;
	backFar: LegPose;
	bob: number;
	headBob: number;
	earBounce: number;
};

// Trot: diagonal legs move together
export const dog = (t: number, g: Gait, amount = 1): Dog => {
	const p = phaseOf(t, g, 0.1);
	const a = legSwing(p, g.stride * amount, g.lift * amount);
	const b = legSwing(p + 0.5, g.stride * amount, g.lift * amount);
	return {
		frontNear: a,
		backFar: a,
		frontFar: b,
		backNear: b,
		bob: walkBob(p, g.bob * amount),
		headBob: walkBob(p + 0.15, 3 * amount),
		earBounce: 12 * amount * Math.sin(p * Math.PI * 4),
	};
};

// Red leash from hand to collar ring, sagging unless pulled tight
export const Leash: React.FC<{x1: number; y1: number; x2: number; y2: number; sag: number}> = ({
	x1,
	y1,
	x2,
	y2,
	sag,
}) => {
	const d = `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.max(y1, y2) + sag} ${x2} ${y2}`;
	return (
		<g>
			<path d={d} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
			<path d={d} fill="none" stroke="#C0392B" strokeWidth={3.5} strokeLinecap="round" />
		</g>
	);
};

export type Anchor = {readonly x: number; readonly y: number; readonly side?: 'left' | 'right'; readonly lift?: number};

// Subtitles for speech, thought clouds for pets, bursts for barks, for whatever line is playing.
// `anchors` gives the screen position of each pet's head for its clouds and barks; `avoid` lists the
// characters on screen so clouds and subtitles stay off them
export const makeLineOverlay =
	(
		LINES: Record<string, Line>,
	): React.FC<{scene: Scene; frame: number; anchors: Record<string, Anchor>; avoid?: readonly Box[]}> =>
	({scene, frame, anchors, avoid = []}) => (
		<>
			{Object.entries(scene.cues).map(([id, cue]) => {
				if (frame < cue.from || frame >= cue.to + 4) {
					return null;
				}
				const line = LINES[id];
				if (line.kind === 'laugh') {
					return null;
				}
				const show = interpolate(frame, [cue.from, cue.from + 5, cue.to - 2, cue.to + 4], [0, 1, 1, 0], clamp);
				const anchor = anchors[line.speaker];
				// Vàng's words and thoughts always come in his own round dog-shaped bubble
				if (line.speaker === 'vang' && anchor && (line.kind === 'thought' || line.kind === 'speech')) {
					return (
						<DogBubble
							key={id}
							text={line.text}
							toX={anchor.x}
							toY={anchor.y}
							side={anchor.side}
							lift={anchor.lift}
							show={show}
							avoid={avoid}
							mode={line.kind}
						/>
					);
				}
				if (line.kind === 'thought' && anchor) {
					return (
						<ThoughtBubble
							key={id}
							text={line.text}
							toX={anchor.x}
							toY={anchor.y}
							side={anchor.side}
							lift={anchor.lift}
							show={show}
							avoid={avoid}
						/>
					);
				}
				if (line.kind === 'bark' && anchor) {
					return (
						<BarkBurst
							key={id}
							x={anchor.x}
							y={anchor.y - 120}
							text={line.text.toUpperCase()}
							progress={(frame - cue.from) / 30}
						/>
					);
				}
				return <Subtitle key={id} text={line.text} opacity={show} top={subtitleAtTop(avoid)} />;
			})}
		</>
	);
