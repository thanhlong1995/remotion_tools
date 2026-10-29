import type React from 'react';
import type {Mood} from '../../characters/minh/MinhHead';
import {MINH_SIDE_ARM, MINH_SIDE_SHOULDER, MinhSide} from '../../characters/minh/MinhSide';
import {type ArmPose, handPosition} from '../../characters/shared/Arm';
import type {TuMood} from '../../characters/tu/BaTuHead';
import {BaTuSide} from '../../characters/tu/BaTuSide';
import {vangCollarRing, VangSide} from '../../characters/vang/VangSide';
import {GROUND_Y} from '../../sets/Alley';
import {biped, dog, Leash, RUN, SCALE, swingArm, TU_BACK, TU_SCALE, WALK} from './kit';
import type {Cam} from '../../camera';
import {type Box, boxAt} from '../../ui/layout';

export const TU_OFFSET = -120;
export const VANG_OFFSET = 430;
const HIP_Y = -250;

export const DEFAULT_LEASH_ARM = (phase: number, amount: number): ArmPose => ({
	shoulder: 30 + 3 * amount * Math.sin(phase * Math.PI * 2),
	elbow: 22,
});

// World position of the hand holding the leash, tipped with Minh's lean about his hips
export const minhHandWorld = (minhX: number, bob: number, lean: number, arm: ArmPose) => {
	const h = handPosition(1, arm, MINH_SIDE_ARM, MINH_SIDE_SHOULDER);
	const a = (lean * Math.PI) / 180;
	const hy = h.y + bob - HIP_Y;
	return {
		x: minhX + SCALE * (h.x * Math.cos(a) - hy * Math.sin(a)),
		y: GROUND_Y + SCALE * (HIP_Y + h.x * Math.sin(a) + hy * Math.cos(a)),
	};
};

// Where Vàng's head is in the world, for thought clouds
// Screen boxes of the walking trio, so captions stay off them
export const groupBoxes = (cam: Cam, x: number, {tu = true, vang = true, vangDx = 0} = {}): Box[] => [
	boxAt(cam, x, GROUND_Y, 230 * SCALE, 760 * SCALE, 0.36),
	...(tu ? [boxAt(cam, x + TU_OFFSET, GROUND_Y - TU_BACK, 250 * TU_SCALE, 730 * TU_SCALE, 0.36)] : []),
	...(vang ? [boxAt(cam, x + VANG_OFFSET + vangDx + 40 * SCALE, GROUND_Y, 440 * SCALE, 380 * SCALE, 0.6)] : []),
];

export const vangHead = (x: number, dx = 0) => ({x: x + VANG_OFFSET + dx + 100 * SCALE, y: GROUND_Y - 200 * SCALE});

type GroupProps = {
	// Minh's world x; Bà Tư walks a step behind on the far side, Vàng out in front
	readonly x: number;
	// Seconds, for the walking cycle
	readonly t: number;
	// 1 walking, 0 standing still
	readonly amount: number;
	readonly frame: number;
	readonly minh: {
		mood: Mood;
		mouthOpen: number;
		headTilt?: number;
		lean?: number;
		dx?: number;
		leashArm?: ArmPose;
		blink: number;
		// Own legs instead of the group's walk, e.g. stumbling steps while being dragged
		steps?: {t: number; amount: number};
	};
	readonly tu: {mood: TuMood; mouthOpen: number; headTilt?: number; blink: number};
	readonly vang: {
		blink: number;
		panting: number;
		lean?: number;
		dx?: number;
		tailWag?: number;
		// Own legs, e.g. scrabbling at a run while the leash holds him back
		steps?: {t: number; amount: number};
		// 0..1 snarl, see VangSideHead
		fierce?: number;
	};
	// 0 slack .. 1 pulled tight
	readonly taut?: number;
	// 0 in hand .. 1 the handle has slipped right out
	readonly slip?: number;
	readonly showVang?: boolean;
	// Minh walking Vàng on his own
	readonly showTu?: boolean;
};

export const Group: React.FC<GroupProps> = ({
	x,
	t,
	amount,
	frame,
	minh,
	tu,
	vang,
	taut = 0,
	slip = 0,
	showVang = true,
	showTu = true,
}) => {
	const m = minh.steps ? biped(minh.steps.t, RUN.minh, 0, minh.steps.amount) : biped(t, WALK.minh, 0, amount);
	const b = biped(t, WALK.tu, 0.3, amount);
	const d = vang.steps ? dog(vang.steps.t, RUN.vang, vang.steps.amount) : dog(t, WALK.vang, amount);
	const minhX = x + (minh.dx ?? 0);
	const vangX = x + VANG_OFFSET + (vang.dx ?? 0);
	const leashArm = minh.leashArm ?? DEFAULT_LEASH_ARM(m.phase, amount);
	const hand = minhHandWorld(minhX, m.bob, minh.lean ?? 0, leashArm);
	const ring = vangCollarRing({bob: d.bob, headBob: d.headBob, lean: vang.lean});
	const ringW = {x: vangX + SCALE * ring.x, y: GROUND_Y + SCALE * ring.y};
	// A slipping handle slides along the leash towards the dog
	const handle = {x: hand.x + (ringW.x - hand.x) * 0.18 * slip, y: hand.y + 30 * slip};
	return (
		<g>
			{showTu ? (
				<g>
					<ellipse cx={x + TU_OFFSET} cy={GROUND_Y - TU_BACK} rx={70} ry={8} fill="#000000" opacity={0.12} />
					<g transform={`translate(${x + TU_OFFSET}, ${GROUND_Y - TU_BACK}) scale(${TU_SCALE})`}>
						<BaTuSide
							mood={tu.mood}
							blink={tu.blink}
							mouthOpen={tu.mouthOpen}
							headTilt={tu.headTilt ?? 0}
							nearLeg={b.nearLeg}
							farLeg={b.farLeg}
							nearArm={swingArm(b, amount, false)}
							farArm={swingArm(b, amount, true)}
							bob={b.bob}
						/>
					</g>
				</g>
			) : null}
			<ellipse cx={minhX + 10} cy={GROUND_Y} rx={78} ry={9} fill="#000000" opacity={0.12} />
			<g transform={`translate(${minhX}, ${GROUND_Y}) scale(${SCALE})`}>
				<MinhSide
					mood={minh.mood}
					blink={minh.blink}
					mouthOpen={minh.mouthOpen}
					headTilt={minh.headTilt ?? 0}
					nearLeg={m.nearLeg}
					farLeg={m.farLeg}
					nearArm={leashArm}
					farArm={swingArm(m, minh.steps ? minh.steps.amount : amount, true, Boolean(minh.steps))}
					bob={m.bob}
					lean={minh.lean ?? 0}
				/>
			</g>
			{showVang ? (
				<g>
					<ellipse cx={vangX} cy={GROUND_Y} rx={80} ry={8} fill="#000000" opacity={0.12} />
					<g transform={`translate(${vangX}, ${GROUND_Y}) scale(${SCALE})`}>
						<VangSide
							blink={vang.blink}
							frontNear={d.frontNear}
							frontFar={d.frontFar}
							backNear={d.backNear}
							backFar={d.backFar}
							bob={d.bob}
							headBob={d.headBob}
							earBounce={d.earBounce}
							tailWag={vang.tailWag ?? 14 * Math.sin(frame / 3.2)}
							panting={vang.panting}
							lean={vang.lean ?? 0}
							fierce={vang.fierce ?? 0}
						/>
					</g>
					<Leash
						x1={handle.x}
						y1={handle.y}
						x2={ringW.x}
						y2={ringW.y}
						sag={(1 - taut) * (46 + 10 * Math.sin(frame / 5))}
					/>
					<circle cx={handle.x} cy={handle.y} r={9} fill="none" stroke="#C0392B" strokeWidth={4} />
				</g>
			) : null}
		</g>
	);
};
