import type React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {minhHand} from '../../../characters/minh/Minh';
import type {Mood} from '../../../characters/minh/MinhHead';
import {Muop} from '../../../characters/muop/Muop';
import type {SauMood} from '../../../characters/sau/SauHead';
import type {ArmPose, Side} from '../../../characters/shared/Arm';
import {SHIPPER_SCALE, ShipperBike, shipperBox} from '../../../characters/shipper/ShipperBike';
import type {TuMood} from '../../../characters/tu/BaTuHead';
import type {VangPose} from '../../../characters/vang/Vang';
import type {VangMood} from '../../../characters/vang/VangHead';
import {type Cam, toScreen} from '../../../camera';
import {ActionText, PuffTrail, SweatFlicks} from '../../../props/Effects';
import {BeerGlass, CardboardSign, ChickenFoot, Parcel, Toolbox} from '../../../props/Props';
import {fontFamily, INK} from '../../../theme';
import {Caption} from '../../../ui/Caption';
import {EpisodeTitle} from '../../../ui/EpisodeTitle';
import {Drinkers} from '../../shared/Drinkers';
import {Outro} from '../../shared/Outro';
import {BELLY_HUNG, BELLY_MINH, MINH_SCALE, SPOT, Stage} from '../../shared/Stage';
import {clamp, laughShake, Leash, LineOverlay, ramp, SCALE} from '../kit';
import {mouthOf, scene, speaking} from '../timeline';

const VANG_SCALE = 0.95 * SCALE;
const POINT_UP: ArmPose = {shoulder: 150, elbow: 10};
const GESTURE: ArmPose = {shoulder: 50, elbow: 40};
const COMMAND: ArmPose = {shoulder: 34, elbow: 24};
const HANDS_ON_HIPS: ArmPose = {shoulder: 38, elbow: -95};
const BEER: ArmPose = {shoulder: 26, elbow: -105};
const LEASH_HAND: ArmPose = {shoulder: 16, elbow: -10};
const HOLD: ArmPose = {shoulder: 30, elbow: -70};
// Minh's screen-left hand held out at Vàng's mouth, or right down low for a paw or a belly
const OFFER: ArmPose = {shoulder: 57, elbow: 0};
const LOW: ArmPose = {shoulder: 8, elbow: -4};

// World position of one of Minh's hands when he stands at (x, y)
const handAt = (x: number, y: number, pose: ArmPose, side: Side = -1) => {
	const h = minhHand(side, pose);
	return {x: x + h.x * MINH_SCALE, y: y + h.y * MINH_SCALE};
};

// Points on Vàng (front view) and Minh, in world coordinates
const vangHead = (x: number, y: number, pose: VangPose = 'sit') =>
	pose === 'lie' ? {x, y: y - 130} : pose === 'belly' ? {x: x - 110, y: y - 90} : {x, y: y - 330 * SCALE};
const vangNose = (x: number, y: number) => ({x, y: y - 270 * VANG_SCALE});
const vangPaw = (x: number, y: number) => ({x: x + 137 * VANG_SCALE, y: y - 164 * VANG_SCALE});
const pocketOf = (x: number, y: number) => ({x: x + 46 * MINH_SCALE, y: y - 430 * MINH_SCALE});

const anchorAt = (cam: Cam, p: {x: number; y: number}, side: 'left' | 'right' = 'left', lift = 0) => {
	const s = toScreen(cam, p.x, p.y);
	return {x: s.x, y: s.y, side, lift};
};

const fadeIn = (frame: number, from: number, to: number) =>
	interpolate(frame, [from, from + 8, to - 8, to], [0, 1, 1, 0], clamp);

// A dotted whiff of chicken feet curling from Minh's pocket to Vàng's nose
const Smell: React.FC<{from: {x: number; y: number}; to: {x: number; y: number}; frame: number}> = ({
	from,
	to,
	frame,
}) => (
	<path
		d={`M ${from.x} ${from.y} C ${from.x - 40} ${from.y - 150 + 20 * Math.sin(frame / 6)} ${to.x + 170} ${to.y - 70} ${to.x + 22} ${to.y}`}
		fill="none"
		stroke="#FFFFFF"
		strokeWidth={6}
		strokeLinecap="round"
		strokeDasharray="18 14"
		strokeDashoffset={-frame * 2}
		opacity={0.9}
	/>
);

// Vàng's tongue (front view) and the long lick it gives Minh's hand
const vangTongue = (x: number, y: number) => ({x: x + 12 * 1.15 * VANG_SCALE, y: y - 222 * VANG_SCALE});
const Tongue: React.FC<{from: {x: number; y: number}; to: {x: number; y: number}; out: boolean}> = ({
	from,
	to,
	out,
}) => {
	const tip = out ? {x: to.x - 6, y: to.y + 4} : {x: (from.x + to.x) / 2, y: from.y + 10};
	const d = `M ${from.x} ${from.y} Q ${(from.x + tip.x) / 2} ${Math.max(from.y, tip.y) + 22} ${tip.x} ${tip.y}`;
	return (
		<g>
			<path d={d} fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" />
			<path d={d} fill="none" stroke="#DE7C78" strokeWidth={15} strokeLinecap="round" />
		</g>
	);
};

// Wet little lick marks around Minh's hand
const Slurp: React.FC<{x: number; y: number; frame: number}> = ({x, y, frame}) => (
	<g transform={`translate(${x}, ${y})`} opacity={0.4 + 0.4 * Math.abs(Math.sin(frame / 3))}>
		{[-1, 1].map((k) => (
			<path
				key={k}
				d={`M ${k * 34} -34 Q ${k * 52} -10 ${k * 38} 14`}
				fill="none"
				stroke={INK}
				strokeWidth={5}
				strokeLinecap="round"
			/>
		))}
		<path d="M -6 30 Q 0 44 6 30 Q 0 20 -6 30 Z" fill="#9ED3F0" stroke={INK} strokeWidth={2.5} />
	</g>
);

// A chicken foot poking out of Minh's chest pocket
const PocketFoot: React.FC<{x: number; y: number}> = ({x, y}) => {
	const p = pocketOf(x, y);
	return (
		<g transform={`translate(${p.x}, ${p.y}) rotate(-14) scale(${MINH_SCALE})`}>
			<ChickenFoot scale={0.8} />
		</g>
	);
};

// ---------------------------------------------------------------------------------------------
// 1. The bet, at the street drinking table: Bà Tư is at a wedding, so Minh walks Vàng alone

const BET = {table: 1190, minh: {x: 650, y: 1025}, vang: {x: 370, y: 1035}};
const BET_CAM: Cam = {x: 800, y: 580, zoom: 1};

export const BetScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const S = scene('bet');
	const m = S.marks;
	// Minh strolls in with Vàng on the leash
	const enter = ramp(frame, 0, 40);
	const walking = enter > 0 && enter < 1;
	const dx = -560 * (1 - enter);
	const minh = {x: BET.minh.x + dx, y: BET.minh.y - (walking ? Math.abs(Math.sin(frame / 4)) * 8 : 0)};
	const vang = {x: BET.vang.x + dx, y: BET.vang.y - (walking ? Math.abs(Math.sin(frame / 3)) * 6 : 0)};
	// "Một ly thôi nha!" — and a glass is in his hand
	const drinking = frame >= S.cues.a3.to;
	const close = speaking(S, frame, 'a9');
	const cam: Cam = close ? {x: vang.x + 60, y: vang.y - 250, zoom: 2.1} : BET_CAM;
	const hand = handAt(minh.x, minh.y, LEASH_HAND);
	const tag = {x: vang.x, y: vang.y - 182 * VANG_SCALE};
	const title = spring({frame: frame - m.title, fps, config: {damping: 12, stiffness: 120}});
	const titleOut = interpolate(frame, [S.cues.a1.from - 8, S.cues.a1.from + 4], [1, 0], clamp);
	const sauStand = ramp(frame, m.stand, 10);
	const brag = speaking(S, frame, 'a5', 'a8c');
	const minhMood: Mood = brag
		? 'smug'
		: speaking(S, frame, 'a7')
			? 'happy'
			: speaking(S, frame, 'a3', 'a8')
				? 'scared'
				: 'neutral';
	const vangMood: VangMood = speaking(S, frame, 'a1', 'a8b', 'a9')
		? 'gossip'
		: speaking(S, frame, 'a5')
			? 'happy'
			: 'neutral';
	return (
		<AbsoluteFill>
			<Stage
				frame={frame}
				cam={cam}
				night={0.12}
				lit={false}
				lamp={0}
				gate={false}
				behind={
					<Drinkers
						x={BET.table}
						frame={frame}
						sauStand={sauStand}
						sauArm={speaking(S, frame, 'a2', 'a6', 'a8b') ? 110 : 30 + 40 * sauStand}
						sauMood={speaking(S, frame, 'a6') ? 'brag' : speaking(S, frame, 'a8b') ? 'wink' : 'grin'}
						sauMouth={mouthOf(S, 'sau', frame)}
						hungMouth={mouthOf(S, 'hung', frame)}
						hungMood={speaking(S, frame, 'a8') ? 'sing' : 'cool'}
					/>
				}
				minh={{
					...minh,
					mood: minhMood,
					mouth: mouthOf(S, 'minh', frame),
					tilt: brag ? -6 : 0,
					armLeft: LEASH_HAND,
					armRight: speaking(S, frame, 'a5', 'a7', 'a8c') ? GESTURE : drinking ? BEER : undefined,
					held: drinking ? <BeerGlass /> : undefined,
				}}
				tu={null}
				vang={{
					...vang,
					mood: vangMood,
					lookX: close ? 1 : speaking(S, frame, 'a4') ? 1 : 0,
					tilt: close ? 10 : speaking(S, frame, 'a4') ? -8 : 0,
				}}
				fx={<Leash x1={hand.x} y1={hand.y} x2={tag.x} y2={tag.y} sag={40} />}
				overlay={(avoid) => (
					<LineOverlay
						scene={S}
						frame={frame}
						anchors={{vang: anchorAt(cam, vangHead(vang.x, vang.y), 'right', close ? 0 : 160)}}
						avoid={avoid}
					/>
				)}
			/>
			{frame >= m.title && titleOut > 0 ? (
				<EpisodeTitle number={3} title="Chó khôn của xóm" scale={title} opacity={titleOut} />
			) : null}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------------------------
// 2. Training at the gate: Vàng lies down when told to sit, licks the hand he should shake,
//    rolls over for a belly rub, and Minh gives in

const TRAIN = {vang: {x: 560, y: 1035}, minhY: 1040};
const TRAIN_CAM: Cam = {x: 640, y: 600, zoom: 1.05};

export const TrainScene: React.FC = () => {
	const frame = useCurrentFrame();
	const S = scene('train');
	const m = S.marks;
	const v = TRAIN.vang;
	const pose: VangPose = frame >= m.belly ? 'belly' : frame >= m.lie && frame < S.cues.b4.from ? 'lie' : 'sit';
	const licking = frame >= m.lick && frame < S.cues.b6.from;
	const scratching = frame >= m.scratch;
	// He stands back to offer his hand, then steps in over the belly
	const stepIn = ramp(frame, m.scratch - 14, 14);
	const minh = {x: interpolate(stepIn, [0, 1], [v.x + 320, v.x + 120]), y: TRAIN.minhY};
	const offering = frame >= S.cues.b4.from && frame < S.cues.b6.from;
	const commanding = speaking(S, frame, 'b1', 'b3', 'b9');
	const leftArm: ArmPose = scratching
		? {shoulder: LOW.shoulder + 6 * Math.sin(frame / 2), elbow: LOW.elbow}
		: offering
			? OFFER
			: commanding
				? COMMAND
				: {shoulder: 20, elbow: -10};
	const hand = handAt(minh.x, minh.y, leftArm);
	const tuIn = ramp(frame, S.cues.b6.from - 14, 16);
	const minhMood: Mood = scratching
		? 'happy'
		: licking
			? 'shock'
			: speaking(S, frame, 'b7')
				? 'smug'
				: speaking(S, frame, 'b3')
					? 'shock'
					: 'neutral';
	const vangMood: VangMood =
		licking || scratching || speaking(S, frame, 'b10')
			? 'happy'
			: speaking(S, frame, 'b2', 'b5', 'b8')
				? 'gossip'
				: 'neutral';
	const cam: Cam = licking
		? {x: v.x + 70, y: v.y - 230, zoom: 2.1}
		: scratching && frame < S.cues.b12.from
			? {x: v.x + 20, y: v.y - 170, zoom: 1.8}
			: TRAIN_CAM;
	const caption = fadeIn(frame, 0, S.cues.b1.from);
	return (
		<AbsoluteFill>
			<Stage
				frame={frame}
				cam={cam}
				night={0}
				lit={false}
				lamp={0}
				minh={{
					...minh,
					mood: minhMood,
					mouth: mouthOf(S, 'minh', frame),
					tilt: commanding ? 8 : speaking(S, frame, 'b7') ? -6 : 0,
					armLeft: leftArm,
					armRight: speaking(S, frame, 'b7') ? GESTURE : HANDS_ON_HIPS,
				}}
				tu={
					tuIn > 0
						? {
								x: interpolate(tuIn, [0, 1], [-260, 220]),
								y: SPOT.tu.y,
								mood: speaking(S, frame, 'b12') ? 'yell' : speaking(S, frame, 'b6') ? 'suspicious' : 'neutral',
								mouth: mouthOf(S, 'tu', frame),
								armLeft: HANDS_ON_HIPS,
								armRight: speaking(S, frame, 'b6', 'b12') ? GESTURE : HANDS_ON_HIPS,
							}
						: null
				}
				vang={{
					...v,
					pose,
					mood: vangMood,
					lookX: licking ? 1 : pose === 'sit' ? -0.4 : 0,
					tilt: licking ? 6 + 4 * Math.sin(frame / 2.5) : 0,
				}}
				fx={
					licking ? (
						<g>
							<Tongue from={vangTongue(v.x, v.y)} to={hand} out={(frame - m.lick) % 10 < 6} />
							<Slurp x={hand.x} y={hand.y} frame={frame} />
						</g>
					) : null
				}
				overlay={(avoid) => (
					<LineOverlay
						scene={S}
						frame={frame}
						anchors={{vang: anchorAt(cam, vangHead(v.x, v.y, pose), 'left', 60)}}
						avoid={avoid}
					/>
				)}
			/>
			<Caption text="Hôm sau…" opacity={caption} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------------------------
// 3. That night Vàng asks Mướp for advice (pets only, so they really talk)

export const PetsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const S = scene('pets');
	const cam: Cam = {x: 690, y: 820, zoom: 1.7};
	return (
		<AbsoluteFill>
			<Stage
				frame={frame}
				cam={cam}
				night={0.6}
				lit
				lamp={1}
				behind={
					<g transform={`translate(${SPOT.toolbox.x}, ${SPOT.toolbox.y}) scale(0.8)`}>
						<Toolbox />
					</g>
				}
				minh={null}
				tu={null}
				vang={{
					x: SPOT.vang.x + 80,
					y: SPOT.vang.y,
					mood: speaking(S, frame, 'c5', 'c7') ? 'scared' : speaking(S, frame, 'c3') ? 'hungry' : 'neutral',
					mouth: mouthOf(S, 'vang', frame),
					lookX: -1,
					tilt: speaking(S, frame, 'c3') ? -10 : 6,
				}}
				muop={{
					...SPOT.muopToolbox,
					s: 0.9,
					mood: speaking(S, frame, 'c4', 'c6') ? 'smug' : speaking(S, frame, 'c3') ? 'annoyed' : 'judge',
					mouth: mouthOf(S, 'muop', frame),
				}}
				overlay={(avoid) => <LineOverlay scene={S} frame={frame} anchors={{}} avoid={avoid} />}
			/>
			<Caption text="Tối hôm đó…" opacity={fadeIn(frame, 0, S.cues.c1.from + 30)} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------------------------
// 4–5. The contest at the gate, three days later, and Bà Tư's chicken feet

const CONTEST = {vang: {x: 560, y: 1035}, minhY: 1040, sau: {x: 1110, y: 1030}, hung: {x: 1460, y: 1035}};
// Minh stands just where his lowered hand meets Vàng's raised paw
const CONTEST_MINH_X = vangPaw(CONTEST.vang.x, CONTEST.vang.y).x - minhHand(-1, LOW).x * MINH_SCALE;
const CONTEST_CAM: Cam = {x: 960, y: 580, zoom: 0.92};
const BIKE = {x: 1760, y: 1060, scale: SHIPPER_SCALE};
const SIGN = {x: 1290, y: 360};

// The contest's banner, taped to the wall by the gate
const ContestSign: React.FC = () => (
	<g transform={`translate(${SIGN.x}, ${SIGN.y})`}>
		<CardboardSign lines={['THI CHÓ KHÔN', 'CỦA XÓM']} fontFamily={fontFamily} />
	</g>
);

// Vàng's whole repertoire in 2.4 seconds: sit, lie, roll, sit
const TRICKS: VangPose[] = ['sit', 'lie', 'belly', 'sit'];
const trick = (frame: number, at: number) => {
	const t = frame - at;
	if (t < 0 || t >= 72) {
		return null;
	}
	const k = t % 18;
	return {pose: TRICKS[Math.floor(t / 18)], hop: k < 10 ? 34 * Math.sin((Math.PI * k) / 10) : 0};
};

export const ContestScene: React.FC = () => {
	const frame = useCurrentFrame();
	const S = scene('contest');
	const m = S.marks;
	const v = CONTEST.vang;
	const minh = {x: CONTEST_MINH_X, y: CONTEST.minhY};
	const shaking = frame >= m.shake && frame < S.cues.d6.from;
	const tricks = trick(frame, m.tricks);
	const treat = frame >= m.treat;
	const sitting = frame >= m.sit;
	const torn = speaking(S, frame, 'd10');
	const sniff = speaking(S, frame, 'd4');
	const pose: VangPose = shaking ? 'paw' : tricks ? tricks.pose : 'sit';
	const barking = speaking(S, frame, 'd9b');
	const vangMood: VangMood = barking
		? 'bark'
		: torn
			? Math.floor(frame / 12) % 2
				? 'bark'
				: 'hungry'
			: sniff
				? 'hungry'
				: shaking || tricks || sitting
					? 'happy'
					: speaking(S, frame, 'd12')
						? 'gossip'
						: 'neutral';
	// Bike: brakes in from the right, then wobbles off the way it came
	const arrivingAt = (f: number) =>
		interpolate(f, [m.arrive - 8, m.arrive + 22], [BIKE.x + 900, BIKE.x], {...clamp, easing: Easing.out(Easing.cubic)});
	const leavingAt = (f: number) => BIKE.x + Math.max(0, (f - m.leave) / 30 - 0.3) ** 2 * 1100;
	const leaving = frame >= m.leave;
	const lt = (frame - m.leave) / 30;
	const arriving = interpolate(frame, [m.arrive - 8, m.arrive + 22], [BIKE.x + 900, BIKE.x], {
		...clamp,
		easing: Easing.out(Easing.cubic),
	});
	const bikeX = leaving ? BIKE.x + Math.max(0, lt - 0.3) ** 2 * 1100 : arriving;
	const facingRight = leaving && lt > 0.3;
	const braking = interpolate(frame, [m.arrive + 6, m.arrive + 22, m.arrive + 34], [0, 1, 0], clamp);
	// He loses a parcel as he turns round, naturally, and never notices
	const fall = ramp(frame, m.leave + 12, 12);
	const parcel = {
		x: BIKE.x - 150 - 60 * fall,
		y: interpolate(fall, [0, 1], [BIKE.y - 272 * BIKE.scale, BIKE.y]),
		r: -100 * fall,
	};
	// Sáu's protest sets Hùng and Minh off laughing
	const laughing = speaking(S, frame, 'd17');
	const giggle = laughShake(frame);
	const giggleB = laughShake(frame + 3);
	const leftArm: ArmPose = shaking
		? {shoulder: LOW.shoulder + 5 * Math.sin(frame / 2), elbow: LOW.elbow}
		: speaking(S, frame, 'd3')
			? LOW
			: speaking(S, frame, 'd6', 'd11')
				? COMMAND
				: {shoulder: 20, elbow: -10};
	const rightArm: ArmPose | undefined = treat
		? frame < S.cues.d14.from && !laughing
			? POINT_UP
			: HOLD
		: speaking(S, frame, 'd8')
			? POINT_UP
			: undefined;
	const minhMood: Mood = laughing
		? 'happy'
		: speaking(S, frame, 'd3')
			? 'scared'
			: speaking(S, frame, 'd8') || (treat && !speaking(S, frame, 'd16'))
				? 'smug'
				: shaking || tricks
					? 'happy'
					: 'neutral';
	// He has lost the bet: exclaiming, then sulking while the others laugh
	const sauMood: SauMood = speaking(S, frame, 'd5', 'd14', 'd16') ? 'brag' : 'grin';
	const nose = vangNose(v.x, v.y);
	const pocket = pocketOf(minh.x, minh.y);
	const cam: Cam = sniff
		? {x: (nose.x + pocket.x) / 2, y: (nose.y + pocket.y) / 2 + 30, zoom: 2.0}
		: torn
			? {x: v.x + 60, y: v.y - 240, zoom: 2.2}
			: CONTEST_CAM;
	const vy = v.y - (tricks ? tricks.hop : 0);
	return (
		<AbsoluteFill>
			<Stage
				frame={frame}
				cam={cam}
				night={0.15}
				lit={false}
				lamp={0}
				behind={<ContestSign />}
				minh={{
					...minh,
					mood: minhMood,
					mouth: laughing ? mouthOf(S, 'hung', frame + 3) : mouthOf(S, 'minh', frame),
					tilt: laughing ? giggleB.tilt : speaking(S, frame, 'd8') ? -6 : speaking(S, frame, 'd3', 'd11') ? 8 : 0,
					squash: laughing ? giggleB.squash : 0,
					armLeft: laughing ? BELLY_MINH : leftArm,
					armRight: rightArm,
					held: treat ? <ChickenFoot scale={1.4} /> : undefined,
				}}
				tu={null}
				vang={{
					x: v.x,
					y: vy,
					pose,
					mood: vangMood,
					lookX: torn ? (Math.floor(frame / 12) % 2 ? 1 : 0.3) : sniff || sitting ? 1 : 0,
					tilt: sniff ? 14 : sitting ? 10 : 0,
				}}
				sau={{...CONTEST.sau, mood: sauMood, mouth: mouthOf(S, 'sau', frame)}}
				hung={{
					...CONTEST.hung,
					mood: laughing ? 'laugh' : speaking(S, frame, 'd1', 'd7', 'd15') ? 'sing' : 'cool',
					mouth: mouthOf(S, 'hung', frame),
					speakerOn: true,
					...(laughing ? {armLeft: BELLY_HUNG, squash: giggle.squash, tilt: giggle.tilt} : {}),
				}}
				fx={
					<g>
						{treat ? null : <PocketFoot {...minh} />}
						{sniff ? <Smell from={pocket} to={nose} frame={frame} /> : null}
						{fall > 0 ? (
							<g transform={`translate(${parcel.x}, ${parcel.y}) rotate(${parcel.r})`}>
								<Parcel w={66 * BIKE.scale} h={38 * BIKE.scale} />
							</g>
						) : null}
						{frame >= m.arrive - 8 ? (
							<g
								transform={`translate(${bikeX}, ${BIKE.y}) scale(${facingRight ? BIKE.scale : -BIKE.scale}, ${BIKE.scale})`}
							>
								<ShipperBike
									mood={barking || (speaking(S, frame, 'd9') && frame > S.cues.d9.from + 45) ? 'panic' : 'rush'}
									blink={1}
									mouthOpen={mouthOf(S, 'shipper', frame)}
									spin={leaving ? lt * 1400 : (BIKE.x + 900 - arriving) * 0.9}
									lean={-10 * braking + (facingRight ? 12 : 0) + (barking ? -8 : 0)}
									parcels={fall > 0 ? 2 : 3}
									wobble={6 * Math.sin(frame / 2)}
								/>
							</g>
						) : null}
						{/* Dust as he brakes in and as he speeds off, exhaust, sweat, puffs under Vàng's landings */}
						<PuffTrail
							frame={frame}
							from={m.arrive - 8}
							at={(f) => (f <= m.arrive + 24 ? {x: arrivingAt(f) + 128 * BIKE.scale, y: BIKE.y - 8} : null)}
							every={2}
							drift={{x: 90, y: -50}}
							size={20}
						/>
						<PuffTrail
							frame={frame}
							from={m.leave + 8}
							at={(f) => ({x: leavingAt(f) - 128 * BIKE.scale, y: BIKE.y - 8})}
							every={2}
							drift={{x: -110, y: -50}}
							size={20}
						/>
						<PuffTrail
							frame={frame}
							from={m.leave + 4}
							at={(f) => ({x: leavingAt(f) - 175 * BIKE.scale, y: BIKE.y - 70 * BIKE.scale})}
							every={3}
							life={14}
							drift={{x: -140, y: -40}}
							size={13}
							color="#A7A3A6"
						/>
						<PuffTrail
							frame={frame}
							from={m.tricks + 4}
							at={(f) => {
								const tr = trick(f, m.tricks);
								return tr && tr.hop < 4 ? {x: v.x, y: v.y - 4} : null;
							}}
							every={4}
							life={12}
							drift={{x: 0, y: -30}}
							size={14}
						/>
						{speaking(S, frame, 'd9', 'd9b', 'd10', 'd13') ? (
							<SweatFlicks
								frame={frame}
								x={bikeX + (facingRight ? 10 : -10) * BIKE.scale}
								y={BIKE.y - 360 * BIKE.scale}
								dir={facingRight ? -1 : 1}
								scale={1.8}
							/>
						) : null}
						{braking > 0 ? (
							<path
								d={`M ${BIKE.x + 160} ${BIKE.y - 2} L ${BIKE.x + 160 + 240 * braking} ${BIKE.y - 2}`}
								stroke={INK}
								strokeWidth={6}
								opacity={0.35}
								strokeLinecap="round"
							/>
						) : null}
					</g>
				}
				overlay={(avoid) => (
					<LineOverlay
						scene={S}
						frame={frame}
						anchors={{vang: anchorAt(cam, vangHead(v.x, vy, pose), 'left', 40)}}
						avoid={avoid}
					/>
				)}
				extraAvoid={frame >= m.arrive - 8 ? [shipperBox(cam, bikeX, BIKE.y)] : []}
			/>
			<Caption text="Ba ngày sau…" opacity={fadeIn(frame, 0, S.cues.d1.from + 20)} />
			<ActionText
				text="KÉÉÉT!"
				x={1560}
				y={360}
				frame={frame}
				from={m.arrive + 2}
				life={28}
				rotate={6}
				color="#FF8A3D"
			/>
			<ActionText text="VÈO!" x={1650} y={380} frame={frame} from={m.leave + 10} life={26} rotate={-8} />
		</AbsoluteFill>
	);
};

// Mướp's leap: from off right, through Minh's raised hand, up and over the wall
const muopLeap = (frame: number, at: number, hand: {x: number; y: number}) => {
	const a = ramp(frame, at, 10);
	const b = ramp(frame, at + 10, 16);
	const start = {x: 2000, y: 980};
	const end = {x: -200, y: 300};
	if (b > 0) {
		return {
			x: interpolate(b, [0, 1], [hand.x, end.x]),
			y: interpolate(b, [0, 1], [hand.y, end.y]) - 160 * Math.sin(Math.PI * b),
			got: true,
		};
	}
	return {
		x: interpolate(a, [0, 1], [start.x, hand.x]),
		y: interpolate(a, [0, 1], [start.y, hand.y]) - 120 * Math.sin(Math.PI * a),
		got: false,
	};
};

export const TwistScene: React.FC = () => {
	const frame = useCurrentFrame();
	const S = scene('twist');
	const m = S.marks;
	const v = CONTEST.vang;
	const minh = {x: CONTEST_MINH_X, y: CONTEST.minhY};
	const tuIn = ramp(frame, m.enter, 18);
	const rightArm: ArmPose = speaking(S, frame, 'e4') ? GESTURE : HOLD;
	const hand = handAt(minh.x, minh.y, rightArm, 1);
	const leap = frame >= m.snatch ? muopLeap(frame, m.snatch, {x: hand.x, y: hand.y - 40}) : null;
	const stolen = leap ? leap.got : false;
	const tuMood: TuMood = speaking(S, frame, 'e1', 'e3') ? 'yell' : speaking(S, frame, 'e6') ? 'happy' : 'suspicious';
	const minhMood: Mood = stolen
		? 'shock'
		: speaking(S, frame, 'e4')
			? 'happy'
			: speaking(S, frame, 'e1', 'e2', 'e3')
				? 'scared'
				: 'neutral';
	const closeUp = speaking(S, frame, 'e7');
	const cam: Cam = closeUp ? {x: v.x + 40, y: v.y - 240, zoom: 2.2} : CONTEST_CAM;
	return (
		<AbsoluteFill>
			<Stage
				frame={frame}
				cam={cam}
				night={0.2}
				lit={false}
				lamp={0}
				behind={<ContestSign />}
				minh={{
					...minh,
					mood: minhMood,
					mouth: mouthOf(S, 'minh', frame),
					tilt: speaking(S, frame, 'e2') ? 10 : 0,
					armLeft: speaking(S, frame, 'e2') ? {shoulder: 150, elbow: 60} : {shoulder: 20, elbow: -10},
					armRight: rightArm,
					held: stolen ? undefined : <ChickenFoot scale={1.4} />,
				}}
				tu={
					tuIn > 0
						? {
								x: interpolate(tuIn, [0, 1], [-260, 250]),
								y: SPOT.tu.y,
								mood: tuMood,
								mouth: mouthOf(S, 'tu', frame),
								armLeft: HANDS_ON_HIPS,
								armRight: speaking(S, frame, 'e1', 'e3') ? GESTURE : HANDS_ON_HIPS,
							}
						: null
				}
				vang={{
					...v,
					mood: closeUp || stolen ? 'scared' : speaking(S, frame, 'e1', 'e3') ? 'scared' : 'happy',
					lookX: stolen ? -1 : 1,
					tilt: stolen ? -12 : 8,
				}}
				sau={{
					...CONTEST.sau,
					mood: speaking(S, frame, 'e4', 'e5') ? 'brag' : 'grin',
					mouth: mouthOf(S, 'sau', frame),
				}}
				hung={{...CONTEST.hung, mood: 'cool', speakerOn: true}}
				fx={
					<g>
						{/* Bà Tư storms in, kicking up dust; Minh sweats */}
						<PuffTrail
							frame={frame}
							from={m.enter}
							at={(f) =>
								f < m.enter + 20
									? {x: interpolate(ramp(f, m.enter, 18), [0, 1], [-260, 250]) - 30, y: SPOT.tu.y - 4}
									: null
							}
							every={3}
							drift={{x: -70, y: -40}}
							size={16}
						/>
						{speaking(S, frame, 'e1', 'e2', 'e3') ? (
							<SweatFlicks frame={frame} x={minh.x} y={minh.y - 520} scale={1.8} dir={1} />
						) : null}
						{leap && leap.x > -200 && leap.x < 2100 ? (
							<g transform={`translate(${leap.x}, ${leap.y}) rotate(${leap.got ? -25 : 20}) scale(0.75)`}>
								<path
									d="M 60 -60 L 220 -40 M 60 -100 L 240 -110 M 60 -20 L 200 20"
									stroke={INK}
									strokeWidth={6}
									strokeLinecap="round"
									opacity={0.5}
								/>
								<Muop mood="smug" blink={1} lookX={-1} tailFlick={20} />
								{leap.got ? (
									<g transform="translate(0, -80) rotate(90)">
										<ChickenFoot scale={1.2} />
									</g>
								) : null}
							</g>
						) : null}
					</g>
				}
				overlay={(avoid) => (
					<LineOverlay
						scene={S}
						frame={frame}
						anchors={{vang: anchorAt(cam, vangHead(v.x, v.y), 'right', 40)}}
						avoid={avoid}
					/>
				)}
			/>
			<ActionText text="VỤT!" x={900} y={300} frame={frame} from={m.snatch + 6} life={24} rotate={-12} />
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------------------------
// 6. Up on the roof, Mướp enjoys the spoils

export const OutroScene: React.FC = () => (
	<Outro
		scene={scene('outro')}
		overlay={LineOverlay}
		muopMood="smug"
		loot={
			<g transform="translate(4, -6) rotate(-90)">
				<ChickenFoot scale={0.6} />
			</g>
		}
		teaser="Tập sau: Đòi lại chân gà"
	/>
);
