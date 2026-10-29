import type React from 'react';
import {Arm, type ArmPose, type ArmShape, handPosition, type Side, SIDES} from '../shared/Arm';
import {INK, OUTLINE} from '../../theme';
import {MinhHead, type Mood} from './MinhHead';
import {MINH} from './palette';
import {SteppedLegs} from '../shared/SteppedLegs';

const PLAID = 'minh-plaid';
const SHOULDER = {x: 82, y: -536};
const ARM: ArmShape = {
	upper: 140,
	fore: 126,
	width: 30,
	hand: 19,
	sleeve: 58,
};
// The torso was drawn for longer legs; sitting it lower gives the short, stocky comic build
const TORSO_DROP = 100;
// A caricature-sized head so the face carries the jokes
const HEAD_SCALE = 1.3;
// Arms splay out around the belly
const ARM_HANG: ArmPose = {shoulder: 24, elbow: -12};

// Centre of a hand in Minh's own coordinates, e.g. to hang a leash from it
export const minhHand = (side: Side, pose: ArmPose) => {
	const p = handPosition(side, pose, ARM, SHOULDER);
	return {x: p.x, y: p.y + TORSO_DROP};
};

type MinhProps = {
	readonly mood?: Mood;
	readonly blink?: number;
	readonly lookX?: number;
	readonly lookY?: number;
	readonly mouthOpen?: number;
	readonly headTilt?: number;
	// Named by the side of the screen they are on, not Minh's own left and right
	readonly armLeft?: ArmPose;
	readonly armRight?: ArmPose;
	// Drawn upright in the screen-right fist
	readonly held?: React.ReactNode;
	// Lift of each foot (screen-left, screen-right) while walking, see frontStep
	readonly legLift?: readonly [number, number];
};

// Chú Minh, 63, the landlady's husband and the boarding house's fix-it man: shirt tucked into
// trousers belted high over his belly. Facing the viewer; the origin sits between his feet
export const Minh: React.FC<MinhProps> = ({
	mood = 'neutral',
	blink = 1,
	lookX = 0,
	lookY = 0,
	mouthOpen = 0,
	headTilt = 0,
	armLeft = ARM_HANG,
	armRight = ARM_HANG,
	held,
	legLift,
}) => {
	const arms = [
		{side: -1 as Side, pose: armLeft, held: undefined},
		{side: 1 as Side, pose: armRight, held},
	];
	const armStyle = {
		shape: ARM,
		shoulder: SHOULDER,
		skin: MINH.skin,
		sleeve: `url(#${PLAID})`,
		cuff: MINH.shirtDark,
	};
	return (
		<g>
			<defs>
				<pattern id={PLAID} width={32} height={32} patternUnits="userSpaceOnUse">
					<rect width={32} height={32} fill={MINH.shirt} />
					<rect x={0} y={11} width={32} height={10} fill={MINH.shirtDark} opacity={0.45} />
					<rect x={11} y={0} width={10} height={32} fill={MINH.shirtDark} opacity={0.45} />
					<rect x={0} y={27} width={32} height={2} fill={MINH.shirtLight} opacity={0.8} />
					<rect x={27} y={0} width={2} height={32} fill={MINH.shirtLight} opacity={0.8} />
				</pattern>
			</defs>
			<SteppedLegs hipY={-220} lift={legLift}>
				{/* Honeycomb plastic sandals */}
				{SIDES.map((side) => (
					<g key={`foot-${side}`}>
						<ellipse cx={side * 46} cy={-6} rx={34} ry={9} fill={MINH.sandalHole} stroke={INK} strokeWidth={OUTLINE} />
						<path
							d={`M ${side * 46 - 30} -8 Q ${side * 46} -46 ${side * 46 + 30} -8 Z`}
							fill={MINH.sandal}
							stroke={INK}
							strokeWidth={OUTLINE}
							strokeLinejoin="round"
						/>
						{[
							[-14, -14],
							[0, -14],
							[14, -14],
							[-7, -24],
							[7, -24],
						].map(([dx, y]) => (
							<circle key={`${dx}${y}`} cx={side * 46 + dx} cy={y} r={3.2} fill={MINH.sandalHole} />
						))}
					</g>
				))}
				<path
					d="M -112 -298 L 112 -298 L 94 -40 Q 93 -32 84 -32 L 22 -32 Q 14 -32 13 -40 L 6 -215 L -6 -215 L -13 -40 Q -14 -32 -22 -32 L -84 -32 Q -93 -32 -94 -40 Z"
					fill={MINH.pants}
					stroke={INK}
					strokeWidth={OUTLINE}
					strokeLinejoin="round"
				/>
				{SIDES.map((side) => (
					<path
						key={`crease-${side}`}
						d={`M ${side * 52} -205 L ${side * 52} -50`}
						stroke={MINH.pantsShade}
						strokeWidth={2.5}
						strokeLinecap="round"
					/>
				))}
			</SteppedLegs>
			<g transform={`translate(0, ${TORSO_DROP})`}>
				<rect x={-17} y={-604} width={34} height={60} fill={MINH.skin} stroke={INK} strokeWidth={OUTLINE} />
				{/* Plaid shirt tucked in over a proud belly */}
				<path
					d="M -30 -570 C -58 -566 -76 -560 -82 -544 L -96 -510 C -130 -486 -150 -446 -138 -414 C -134 -406 -124 -401 -112 -400 L 112 -400 C 124 -401 134 -406 138 -414 C 150 -446 130 -486 96 -510 L 82 -544 C 76 -560 58 -566 30 -570 Z"
					fill={`url(#${PLAID})`}
					stroke={INK}
					strokeWidth={OUTLINE}
					strokeLinejoin="round"
				/>
				<path d="M -26 -571 L 0 -540 L 26 -571 Z" fill={MINH.skin} />
				<path d="M 0 -540 L 0 -404" stroke={MINH.shirtDark} strokeWidth={3} />
				{/* Buttons straining over the belly, skin showing through the gaps */}
				{[
					{y: -449, h: 13},
					{y: -423, h: 9},
				].map((g) => (
					<path
						key={g.y}
						d={`M 0 ${g.y - g.h} Q 6 ${g.y} 0 ${g.y + g.h} Q -6 ${g.y} 0 ${g.y - g.h} Z`}
						fill={MINH.skin}
						stroke={INK}
						strokeWidth={2}
					/>
				))}
				{[-526, -496, -466, -436, -410].map((y) => (
					<circle key={y} cx={0} cy={y} r={4} fill="#EFE6D8" stroke={INK} strokeWidth={1.8} />
				))}
				{SIDES.map((side) => (
					<path
						key={`collar-${side}`}
						d={`M ${side * 31} -573 L ${side * 3} -539 L ${side * 26} -531 L ${side * 44} -558 Z`}
						fill={MINH.shirtLight}
						stroke={INK}
						strokeWidth={3}
						strokeLinejoin="round"
					/>
				))}
				<rect x={-114} y={-410} width={228} height={16} fill={MINH.belt} stroke={INK} strokeWidth={OUTLINE} />
				<rect x={-11} y={-413} width={22} height={22} rx={3} fill={MINH.buckle} stroke={INK} strokeWidth={2.5} />
				{/* Chest pocket: reading glasses hooked on it, a screwdriver tucked in for repairs */}
				<rect x={52} y={-548} width={10} height={32} rx={4} fill={MINH.tool} stroke={INK} strokeWidth={2.5} />
				<rect x={30} y={-528} width={36} height={40} rx={4} fill={`url(#${PLAID})`} stroke={INK} strokeWidth={2.5} />
				<path d="M 36 -520 L 38 -530" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
				{[39, 57].map((x) => (
					<circle key={`lens-${x}`} cx={x} cy={-512} r={8} fill={MINH.lens} stroke={INK} strokeWidth={2.5} />
				))}
				<path d="M 47 -514 Q 48 -517 49 -514" fill="none" stroke={INK} strokeWidth={2.5} />
				{(['ink', 'skin', 'cloth'] as const).map((layer) =>
					arms.map((a) => (
						<Arm key={`${layer}-${a.side}`} side={a.side} pose={a.pose} layer={layer} held={a.held} {...armStyle} />
					)),
				)}
				<g transform={`translate(0, -588) rotate(${headTilt}) scale(${HEAD_SCALE})`}>
					<MinhHead mood={mood} blink={blink} lookX={lookX} lookY={lookY} mouthOpen={mouthOpen} />
				</g>
			</g>
		</g>
	);
};
