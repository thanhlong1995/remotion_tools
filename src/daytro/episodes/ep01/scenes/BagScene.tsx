import type React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Minh, minhHand} from '../../../characters/minh/Minh';
import {BaTu} from '../../../characters/tu/BaTu';
import {Vang} from '../../../characters/vang/Vang';
import {type Cam, toScreen, visibleX, World} from '../../../camera';
import {PlasticBag} from '../../../props/Props';
import {Alley, GROUND_Y} from '../../../sets/Alley';
import {INK} from '../../../theme';
import {boxAt} from '../../../ui/layout';
import {Group, groupBoxes, vangHead} from '../Group';
import {blinkAt, clamp, Leash, LineOverlay, ramp, SCALE, WALK} from '../kit';
import {mouthOf, scene, speaking} from '../timeline';

const S = scene('bag');
const START_X = 9000;

// How far Minh has been dragged by this frame: fast at first, easing off as he digs in
const draggedAt = (frame: number) => {
	const t = interpolate(frame, [S.marks.lunge, S.marks.hold], [0, 1], clamp);
	return 300 * (1 - (1 - t) ** 2);
};

// Skid marks from Minh's sandals, and puffs of dust kicked up behind him while he's dragged
const DragMarks: React.FC<{frame: number; x: number}> = ({frame, x}) => {
	const {lunge, hold} = S.marks;
	if (frame < lunge) {
		return null;
	}
	const reach = draggedAt(frame);
	const puffs = Array.from({length: Math.ceil((hold - lunge) / 4)}, (_, k) => lunge + k * 4).filter(
		(born) => frame >= born && frame < born + 18,
	);
	return (
		<g>
			{[-14, 22].map((dy) => (
				<path
					key={dy}
					d={`M ${x + 30} ${GROUND_Y + dy * 0.3} L ${x + 30 + reach} ${GROUND_Y + dy * 0.3}`}
					stroke={INK}
					strokeWidth={5}
					strokeLinecap="round"
					opacity={0.22}
				/>
			))}
			{puffs.map((born) => {
				const age = (frame - born) / 18;
				return (
					<circle
						key={born}
						cx={x + draggedAt(born) - 10 - 40 * age}
						cy={GROUND_Y - 12 - 30 * age}
						r={12 + 26 * age}
						fill="#D8CDB8"
						stroke={INK}
						strokeWidth={2.5}
						opacity={0.7 * (1 - age)}
					/>
				);
			})}
		</g>
	);
};

// Side view: a plastic bag tumbles in, Vàng lunges at it, Minh is dragged half a metre and holds on
const SideShot: React.FC<{frame: number; fps: number}> = ({frame, fps}) => {
	const {lunge, hold} = S.marks;
	// Walking stops as the dog lunges; time keeps the gait frozen where it stopped
	const walking = 1 - ramp(frame, lunge - 4, 6);
	const tFrozen = Math.min(frame, lunge) / fps;
	const x = START_X + WALK.speed * tFrozen;
	// Vàng bolts and drags Minh a good three metres down the alley before he digs his heels in
	const dragged = draggedAt(frame);
	const cam: Cam = {x: START_X + WALK.speed * (lunge / fps) + 150 + 0.5 * dragged, y: 560, zoom: 1};
	const pull = ramp(frame, lunge, 4) * (1 - ramp(frame, hold, 14));
	const braced = ramp(frame, hold - 6, 10);
	const slide = dragged;
	const vangDx = dragged + 130 * pull + 60 * braced;
	const dragging = frame >= lunge && frame < hold + 4;
	const stepT = (frame - lunge) / fps;
	// The bag rides the wind towards Vàng, then a gust carries it up and away
	const bagIn = interpolate(frame, [0, lunge], [0, 1], clamp);
	const bagUp = ramp(frame, lunge + 6, 30);
	const vangHeadW = vangHead(x, vangDx);
	const bag = {
		x: interpolate(bagIn, [0, 1], [x + 1400, vangHeadW.x + 130]) - 520 * bagUp,
		y: vangHeadW.y - 40 + 30 * Math.sin(frame / 5) - 700 * bagUp,
		r: frame * 9,
	};
	const head = toScreen(cam, vangHeadW.x, vangHeadW.y);
	const alert = speaking(S, frame, 's3-01');
	return (
		<>
			<World cam={cam}>
				<Alley {...visibleX(cam)} />
				<Group
					x={x}
					t={tFrozen}
					amount={walking}
					frame={frame}
					minh={{
						mood: frame >= lunge ? 'shock' : 'neutral',
						mouthOpen: dragging ? 0.7 : 0,
						lean: 30 * pull - 16 * braced,
						dx: slide,
						leashArm: frame >= lunge ? {shoulder: 82 - 35 * braced, elbow: 2} : undefined,
						steps: dragging ? {t: stepT * 1.3, amount: 0.8} : undefined,
						blink: blinkAt(frame, 0, 84),
					}}
					tu={{mood: frame >= lunge ? 'suspicious' : 'neutral', mouthOpen: 0, blink: blinkAt(frame, 30, 70)}}
					vang={{
						blink: alert ? 1 : blinkAt(frame, 12, 60),
						panting: alert || frame >= lunge ? 0 : 0.7,
						lean: 26 * pull + 4 * braced,
						dx: vangDx,
						tailWag: alert ? 0 : undefined,
						steps: frame >= lunge && frame < hold + 10 ? {t: stepT * 1.6, amount: 1} : undefined,
					}}
					taut={frame >= lunge ? 1 : 0}
				/>
				<DragMarks frame={frame} x={x} />
				{bagUp < 1 ? (
					<g transform={`translate(${bag.x}, ${bag.y}) rotate(${bag.r})`}>
						<PlasticBag flap={0.5 + 0.5 * Math.sin(frame / 3)} />
					</g>
				) : null}
			</World>
			<LineOverlay
				scene={S}
				frame={frame}
				anchors={{vang: {x: head.x, y: head.y, side: 'right'}}}
				avoid={groupBoxes(cam, x, {vangDx})}
			/>
		</>
	);
};

const FRONT_CAM: Cam = {x: 1000, y: 600, zoom: 1.12};
const THUMP = {shoulder: 12, elbow: -140};
const LEASH_HAND = {shoulder: 18, elbow: 10};

// Facing us: Minh beats his chest, Bà Tư is unimpressed, Vàng pretends nothing happened
const FrontShot: React.FC<{frame: number}> = ({frame}) => {
	const bragging = speaking(S, frame, 's3-03');
	const thump = bragging
		? {shoulder: THUMP.shoulder, elbow: THUMP.elbow + 16 * Math.abs(Math.sin(frame / 2.4))}
		: {shoulder: 9, elbow: -4};
	const minh = {x: 1060, y: 1030, scale: 0.74};
	const vang = {x: 1460, y: 1040};
	const hand = minhHand(1, LEASH_HAND);
	const head = toScreen(FRONT_CAM, vang.x, vang.y - 330 * SCALE);
	return (
		<>
			<World cam={FRONT_CAM}>
				<Alley {...visibleX(FRONT_CAM)} />
				<g transform={`translate(700, 1020) scale(0.72)`}>
					<BaTu
						mood={speaking(S, frame, 's3-04') ? 'suspicious' : 'neutral'}
						blink={blinkAt(frame, 30, 70)}
						lookX={2}
						mouthOpen={mouthOf(S, 'tu', frame)}
						armLeft={{shoulder: 38, elbow: -95}}
						armRight={{shoulder: 38, elbow: -95}}
					/>
				</g>
				<g transform={`translate(${minh.x}, ${minh.y}) scale(${minh.scale})`}>
					<Minh
						mood={bragging ? 'smug' : 'neutral'}
						blink={blinkAt(frame, 0, 84)}
						mouthOpen={mouthOf(S, 'minh', frame)}
						armLeft={thump}
						armRight={LEASH_HAND}
						headTilt={bragging ? -5 : 0}
					/>
				</g>
				<Leash
					x1={minh.x + hand.x * minh.scale}
					y1={minh.y + hand.y * minh.scale}
					x2={vang.x}
					y2={vang.y - 182 * 0.95 * SCALE}
					sag={30}
				/>
				<g transform={`translate(${vang.x}, ${vang.y}) scale(${0.95 * SCALE})`}>
					<Vang
						mood="neutral"
						blink={blinkAt(frame, 12, 60)}
						lookX={-1.5}
						lookY={-1}
						headTilt={-6}
						tailWag={6 * Math.sin(frame / 6)}
					/>
				</g>
			</World>
			<LineOverlay
				scene={S}
				frame={frame}
				anchors={{vang: {x: head.x, y: head.y, side: 'left'}}}
				avoid={[
					boxAt(FRONT_CAM, 700, 1020, 300 * 0.72, 730 * 0.72, 0.36),
					boxAt(FRONT_CAM, minh.x, minh.y, 300 * minh.scale, 750 * minh.scale, 0.36),
					boxAt(FRONT_CAM, vang.x + 20, vang.y, 300 * 0.95 * SCALE, 420 * 0.95 * SCALE, 0.55),
				]}
			/>
		</>
	);
};

export const BagScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill>
			{frame < S.marks.front ? <SideShot frame={frame} fps={fps} /> : <FrontShot frame={frame} />}
		</AbsoluteFill>
	);
};
