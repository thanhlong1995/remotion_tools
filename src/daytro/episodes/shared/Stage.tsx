import type React from 'react';
import {Hung, HUNG_MIC_POSE, KaraokeSpeaker} from '../../characters/hung/Hung';
import type {HungMood} from '../../characters/hung/HungHead';
import type {Mood} from '../../characters/minh/MinhHead';
import {Minh} from '../../characters/minh/Minh';
import {MinhSide} from '../../characters/minh/MinhSide';
import type {MuopMood} from '../../characters/muop/Muop';
import {Muop} from '../../characters/muop/Muop';
import type {SauMood} from '../../characters/sau/SauHead';
import {Sau} from '../../characters/sau/Sau';
import type {ArmPose} from '../../characters/shared/Arm';
import type {TuMood} from '../../characters/tu/BaTuHead';
import {BaTu} from '../../characters/tu/BaTu';
import {BaTuSide} from '../../characters/tu/BaTuSide';
import type {VangMood} from '../../characters/vang/VangHead';
import type {VangPose} from '../../characters/vang/Vang';
import {Vang} from '../../characters/vang/Vang';
import {VangSide} from '../../characters/vang/VangSide';
import {frontStep} from '../../characters/shared/SteppedLegs';
import {type Cam, visibleX, World} from '../../camera';
import {BreakerBox, Ladder, Toolbox} from '../../props/Props';
import {Alley, NightVeil} from '../../sets/Alley';
import {type Box, boxAt} from '../../ui/layout';
import {biped, blinkAt, dog, RUN, SCALE, swingArm, WALK} from './kit';

// Where everyone stands in front of the gate (tile 0), in world coordinates
export const SPOT = {
	lamp: {x: 520, y: 185},
	ladder: {x: 520, y: 1000, h: 760},
	minhGround: {x: 380, y: 1025},
	minhLadder: {x: 520, y: 690},
	tu: {x: 230, y: 1020},
	tuBreaker: {x: 1000, y: 1020},
	vang: {x: 690, y: 1035},
	sau: {x: 930, y: 1030},
	hung: {x: 1150, y: 1035},
	speaker: {x: 1330, y: 1040},
	breaker: {x: 1010, y: 540},
	muop: {x: 860, y: 122},
	toolbox: {x: 610, y: 1010},
	// Mướp hops down onto the toolbox to talk to Vàng
	muopToolbox: {x: 590, y: 968},
} as const;

export const MINH_SCALE = 0.74;
export const ARMS_UP: ArmPose = {shoulder: 165, elbow: -25};
// Hands clutching the belly, for a big laugh
export const BELLY_HUNG: ArmPose = {shoulder: 23, elbow: -110};
export const BELLY_MINH: ArmPose = {shoulder: 40, elbow: -135};
const REST: ArmPose = {shoulder: 9, elbow: -4};

type Who<M> = {
	x: number;
	y: number;
	mood: M;
	mouth?: number;
	tilt?: number;
	armLeft?: ArmPose;
	armRight?: ArmPose;
	s?: number;
	// Vertical squash from the feet (laughing), see laughShake
	squash?: number;
	// Walking on the spot or towards/away from us, front view: the walk cycle phase (in strides)
	walk?: number;
	// Explicit foot lifts (screen-left, screen-right), e.g. climbing a ladder, see ladderClimb
	legLift?: readonly [number, number];
} | null;

// Walking across the stage in profile instead of facing us (Minh, Bà Tư and Vàng have side views).
// Nobody slides: anything that moves sideways walks with `side`, anything else steps with `walk`
export type SideWalk = {facing: 1 | -1; t: number; amount?: number; run?: boolean};

// Front-view placement: feet at (x, y), bobbing and swaying with the walk
const place = (
	who: {x: number; y: number; squash?: number; walk?: number; legLift?: readonly [number, number]},
	scale: number,
) => {
	const phase = who.walk;
	const step = phase === undefined ? null : frontStep(phase);
	return {
		transform: `translate(${who.x}, ${who.y - (step ? step.bob : 0)}) rotate(${step ? step.sway : 0}) scale(${scale}, ${scale * (1 - (who.squash ?? 0))})`,
		legLift: who.legLift ?? (step ? step.lift : undefined),
		// Arms swing with the stride unless the scene poses them
		swing: (side: -1 | 1): ArmPose | undefined =>
			phase === undefined ? undefined : {shoulder: 9 + side * 10 * Math.sin(phase * 2 * Math.PI), elbow: -8},
	};
};

type StageProps = {
	readonly frame: number;
	readonly cam: Cam;
	readonly night: number;
	readonly lit: boolean;
	readonly lamp: number;
	readonly ladder?: boolean;
	readonly breaker?: number;
	readonly minh: (Who<Mood> & {held?: React.ReactNode; side?: SideWalk}) | null;
	readonly tu: (Who<TuMood> & {side?: SideWalk}) | null;
	readonly vang: (Who<VangMood> & {lookX?: number; pose?: VangPose; flip?: boolean; side?: SideWalk}) | null;
	readonly sau?: (Who<SauMood> & {coverMouth?: boolean}) | null;
	readonly hung?: (Who<HungMood> & {speakerOn?: boolean}) | null;
	readonly muop?: Who<MuopMood>;
	// Drawn over the characters (sparks and so on)
	readonly fx?: React.ReactNode;
	// Drawn on the set behind everyone (a table, a sign)
	readonly behind?: React.ReactNode;
	// false for a plain stretch of alley without the entrance
	readonly gate?: boolean;
	// Captions drawn over the shot; told where everyone is so they can stay off them
	readonly overlay?: (avoid: readonly Box[]) => React.ReactNode;
	// Anyone else on screen the captions should avoid (someone drawn in `behind`, a bike)
	readonly extraAvoid?: readonly Box[];
};

type Cast = Pick<StageProps, 'minh' | 'tu' | 'vang' | 'sau' | 'hung' | 'muop'>;

// Screen boxes of everyone on the stage, sized from how each character is drawn
export const castBoxes = (cam: Cam, {minh, tu, vang, sau, hung, muop}: Cast): Box[] => {
	const boxes: Box[] = [];
	if (minh) {
		boxes.push(boxAt(cam, minh.x, minh.y, 300 * MINH_SCALE, 750 * MINH_SCALE, 0.36));
	}
	if (tu) {
		boxes.push(boxAt(cam, tu.x, tu.y, 300 * 0.72, 730 * 0.72, 0.36));
	}
	if (sau) {
		boxes.push(boxAt(cam, sau.x, sau.y, 230 * 0.7, 940 * 0.7, 0.3));
	}
	if (hung) {
		boxes.push(boxAt(cam, hung.x, hung.y, 250 * 0.72, 700 * 0.72, 0.4));
	}
	if (vang) {
		const v = 0.95 * SCALE;
		boxes.push(
			vang.pose === 'lie'
				? boxAt(cam, vang.x, vang.y, 300 * v, 220 * v, 0.6)
				: vang.pose === 'belly'
					? boxAt(cam, vang.x - 30 * v, vang.y, 380 * v, 240 * v, 0.6)
					: boxAt(cam, vang.x + 20 * v, vang.y, 300 * v, 420 * v, 0.55),
		);
	}
	if (muop) {
		const s = muop.s ?? 0.85;
		boxes.push(boxAt(cam, muop.x, muop.y, 150 * s, 260 * s, 0.55));
	}
	return boxes;
};

// The boarding-house alley staged from the front (by default at the gate), with whoever is in the scene
export const Stage: React.FC<StageProps> = ({
	frame,
	cam,
	night,
	lit,
	lamp,
	ladder = false,
	breaker = 1,
	minh,
	tu,
	vang,
	sau,
	hung,
	muop,
	fx,
	behind,
	gate = true,
	overlay,
	extraAvoid = [],
}) => {
	const span = visibleX(cam);
	return (
		<>
			<World cam={cam}>
				<Alley {...span} gateTile={gate ? 0 : undefined} night={night} lit={lit} lamp={gate ? lamp : undefined} />
				{gate ? (
					<g transform={`translate(${SPOT.breaker.x}, ${SPOT.breaker.y})`}>
						<BreakerBox lever={breaker} />
					</g>
				) : null}
				{behind}
				{ladder ? (
					<g>
						<g transform={`translate(${SPOT.ladder.x}, ${SPOT.ladder.y})`}>
							<Ladder height={SPOT.ladder.h} />
						</g>
						<g transform={`translate(${SPOT.toolbox.x}, ${SPOT.toolbox.y}) scale(0.8)`}>
							<Toolbox />
						</g>
					</g>
				) : null}
				{muop ? (
					<g transform={`translate(${muop.x}, ${muop.y}) scale(${muop.s ?? 0.85})`}>
						<Muop
							mood={muop.mood}
							blink={blinkAt(frame, 22, 80)}
							lookX={-1}
							mouthOpen={muop.mouth ?? 0}
							tailFlick={6 * Math.sin(frame / 14)}
						/>
					</g>
				) : null}
				{hung ? (
					<g>
						<g transform={`translate(${SPOT.speaker.x}, ${SPOT.speaker.y}) scale(0.6)`}>
							<KaraokeSpeaker on={hung.speakerOn ?? true} />
						</g>
						<g transform={place(hung, 0.72).transform}>
							<Hung
								legLift={place(hung, 0.72).legLift}
								mood={hung.mood}
								blink={blinkAt(frame, 8, 90)}
								mouthOpen={hung.mouth ?? 0}
								headTilt={hung.tilt ?? 0}
								armLeft={hung.armLeft ?? place(hung, 0.72).swing(-1)}
								armRight={hung.armRight ?? HUNG_MIC_POSE}
								mic
							/>
						</g>
					</g>
				) : null}
				{sau ? (
					<g transform={place(sau, 0.7).transform}>
						<Sau
							legLift={place(sau, 0.7).legLift}
							mood={sau.mood}
							blink={blinkAt(frame, 40, 76)}
							mouthOpen={sau.mouth ?? 0}
							headTilt={sau.tilt ?? 0}
							armLeft={{shoulder: 22, elbow: -62}}
							holdFish
							armRight={sau.armRight ?? place(sau, 0.7).swing(1)}
							coverMouth={sau.coverMouth}
						/>
					</g>
				) : null}
				{tu?.side ? (
					<g transform={`translate(${tu.x}, ${tu.y}) scale(${tu.side.facing * 0.72}, 0.72)`}>
						<SideTu frame={frame} who={tu} walk={tu.side} />
					</g>
				) : tu ? (
					<g transform={place(tu, 0.72).transform}>
						<BaTu
							mood={tu.mood}
							blink={blinkAt(frame, 30, 70)}
							mouthOpen={tu.mouth ?? 0}
							headTilt={tu.tilt ?? 0}
							armLeft={tu.armLeft ?? place(tu, 0.72).swing(-1) ?? REST}
							armRight={tu.armRight ?? place(tu, 0.72).swing(1) ?? REST}
							legLift={place(tu, 0.72).legLift}
						/>
					</g>
				) : null}
				{minh?.side ? (
					<g transform={`translate(${minh.x}, ${minh.y}) scale(${minh.side.facing * MINH_SCALE}, ${MINH_SCALE})`}>
						<SideMinh frame={frame} who={minh} walk={minh.side} />
					</g>
				) : minh ? (
					<g transform={place(minh, MINH_SCALE).transform}>
						<Minh
							mood={minh.mood}
							blink={blinkAt(frame, 0, 84)}
							mouthOpen={minh.mouth ?? 0}
							headTilt={minh.tilt ?? 0}
							armLeft={minh.armLeft ?? place(minh, MINH_SCALE).swing(-1)}
							armRight={minh.armRight ?? place(minh, MINH_SCALE).swing(1)}
							held={minh.held}
							legLift={place(minh, MINH_SCALE).legLift}
						/>
					</g>
				) : null}
				{vang ? (
					<g>
						<ellipse cx={vang.x} cy={vang.y} rx={150} ry={14} fill="#000000" opacity={0.12} />
						{vang.side ? (
							<g
								transform={`translate(${vang.x}, ${vang.y}) scale(${vang.side.facing * 0.95 * SCALE}, ${0.95 * SCALE})`}
							>
								<SideVang frame={frame} walk={vang.side} />
							</g>
						) : (
							<g
								transform={`translate(${vang.x}, ${vang.y}) scale(${(vang.flip ? -1 : 1) * 0.95 * SCALE}, ${0.95 * SCALE})`}
							>
								<Vang
									mood={vang.mood}
									blink={blinkAt(frame, 12, 60)}
									mouthOpen={vang.mouth ?? 0}
									headTilt={vang.tilt ?? 0}
									lookX={vang.lookX ?? 0}
									tailWag={8 * Math.sin(frame / 5)}
									pose={vang.pose}
								/>
							</g>
						)}
					</g>
				) : null}
				<NightVeil {...span} night={night} lampX={lamp > 0.05 ? SPOT.lamp.x : undefined} lamp={lamp} />
				{fx}
			</World>
			{overlay ? overlay([...castBoxes(cam, {minh, tu, vang, sau, hung, muop}), ...extraAvoid]) : null}
		</>
	);
};

// Side views for walking across the stage, with the walk (or run) cycle from the kit
const gaitOf = (w: SideWalk) => (w.run ? RUN : WALK);

type SideWho<M> = {mood: M; mouth?: number; tilt?: number};

const SideMinh: React.FC<{frame: number; who: SideWho<Mood>; walk: SideWalk}> = ({frame, who, walk}) => {
	const amount = walk.amount ?? 1;
	const b = biped(walk.t, gaitOf(walk).minh, 0, amount);
	return (
		<MinhSide
			mood={who.mood}
			blink={blinkAt(frame, 0, 84)}
			mouthOpen={who.mouth ?? 0}
			headTilt={who.tilt ?? 0}
			nearLeg={b.nearLeg}
			farLeg={b.farLeg}
			nearArm={swingArm(b, amount, false, walk.run)}
			farArm={swingArm(b, amount, true, walk.run)}
			bob={b.bob}
			lean={walk.run ? 10 : 0}
		/>
	);
};

const SideTu: React.FC<{frame: number; who: SideWho<TuMood>; walk: SideWalk}> = ({frame, who, walk}) => {
	const amount = walk.amount ?? 1;
	const b = biped(walk.t, gaitOf(walk).tu, 0.3, amount);
	return (
		<BaTuSide
			mood={who.mood}
			blink={blinkAt(frame, 30, 70)}
			mouthOpen={who.mouth ?? 0}
			headTilt={who.tilt ?? 0}
			nearLeg={b.nearLeg}
			farLeg={b.farLeg}
			nearArm={swingArm(b, amount, false, walk.run)}
			farArm={swingArm(b, amount, true, walk.run)}
			bob={b.bob}
			lean={walk.run ? 10 : 0}
		/>
	);
};

const SideVang: React.FC<{frame: number; walk: SideWalk}> = ({frame, walk}) => {
	const d = dog(walk.t, gaitOf(walk).vang, walk.amount ?? 1);
	return (
		<VangSide
			blink={blinkAt(frame, 12, 60)}
			{...d}
			tailWag={14 * Math.sin(frame / 3.2)}
			panting={0.5}
			lean={walk.run ? 6 : 0}
		/>
	);
};

// Screen-space anchor of Vàng's head (front view), for clouds
export const vangHeadAt = (x: number, y: number) => ({x, y: y - 330 * SCALE});
