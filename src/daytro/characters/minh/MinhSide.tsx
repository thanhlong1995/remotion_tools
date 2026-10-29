import type React from 'react';
import {Arm, type ArmPose, type ArmShape} from '../shared/Arm';
import {Eye} from '../shared/Eye';
import {Leg} from '../shared/Leg';
import type {LegPose} from '../shared/walk';
import {INK, OUTLINE} from '../../theme';
import type {Mood} from './MinhHead';
import {MINH} from './palette';

const PLAID = 'minh-side-plaid';
export const MINH_SIDE_SHOULDER = {x: -6, y: -424};
export const MINH_SIDE_ARM: ArmShape = {upper: 140, fore: 126, width: 30, hand: 19, sleeve: 58};
export const MINH_SIDE_HEAD_SCALE = 1.3;
const HIP = {y: -250, thigh: 118, shin: 106};
export const MINH_LEG_LENGTH = HIP.thigh + HIP.shin;

const EYES: Record<Mood, {lid: number; size: number; pupil: number}> = {
	neutral: {lid: 0.45, size: 1, pupil: 3.2},
	happy: {lid: 1, size: 1, pupil: 3.2},
	smug: {lid: 0.55, size: 1, pupil: 3.2},
	shock: {lid: 0, size: 1.25, pupil: 2.2},
	scared: {lid: 0.12, size: 1.1, pupil: 2.5},
	crave: {lid: 0.05, size: 1.2, pupil: 4},
	zapped: {lid: 0, size: 1.3, pupil: 1.4},
};

// Honeycomb plastic sandal in profile; the origin is the ankle, the toe points +x
const Sandal: React.FC<{dark?: boolean}> = ({dark}) => (
	<g>
		<rect x={-18} y={14} width={64} height={10} rx={5} fill={MINH.sandalHole} stroke={INK} strokeWidth={OUTLINE} />
		<path
			d="M -16 15 Q -12 -6 14 -8 Q 40 -6 46 15 Z"
			fill={dark ? MINH.sandalHole : MINH.sandal}
			stroke={INK}
			strokeWidth={OUTLINE}
			strokeLinejoin="round"
		/>
		{[
			[6, 4],
			[20, 4],
			[34, 8],
			[13, -2],
			[27, -1],
		].map(([x, y]) => (
			<circle key={`${x}${y}`} cx={x} cy={y} r={2.6} fill={dark ? MINH.sandal : MINH.sandalHole} />
		))}
	</g>
);

type HeadProps = {readonly mood: Mood; readonly blink: number; readonly mouthOpen: number};

// Chú Minh's head in profile, facing +x; the origin is under his chin
export const MinhSideHead: React.FC<HeadProps> = ({mood, blink, mouthOpen}) => {
	const eye = EYES[mood];
	const lid = eye.lid >= 0.97 ? 1 : eye.lid + (1 - eye.lid) * (1 - blink);
	const open = Math.max(mouthOpen, mood === 'happy' ? 0.9 : mood === 'shock' ? 0.7 : mood === 'crave' ? 0.35 : 0);
	return (
		<g>
			<path
				d="M -10 6 C -42 2 -60 -30 -60 -72 C -60 -118 -30 -140 4 -140 C 38 -140 54 -118 54 -92 C 54 -80 52 -70 52 -58 C 52 -46 55 -40 55 -32 C 55 -20 50 -10 42 -4 C 28 6 10 8 -10 6 Z"
				fill={MINH.skin}
				stroke={INK}
				strokeWidth={OUTLINE}
			/>
			{/* Grey fringe round the back of the head, under the ear */}
			<path
				d="M -28 -104 Q -50 -106 -59 -84 Q -63 -64 -53 -50 Q -46 -48 -40 -54 Q -34 -60 -32 -72 Q -26 -88 -28 -104 Z"
				fill={MINH.hair}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			<ellipse cx={-16} cy={-70} rx={10} ry={15} fill={MINH.skin} stroke={INK} strokeWidth={OUTLINE} />
			<path d="M -18 -80 Q -10 -70 -17 -60" fill="none" stroke={MINH.skinShade} strokeWidth={2.5} strokeLinecap="round" />
			{['M -46 -114 Q -12 -150 36 -128', 'M -44 -106 Q -6 -144 42 -120', 'M -42 -98 Q 2 -138 46 -112'].map((d) => (
				<path key={d} d={d} fill="none" stroke={MINH.hairDark} strokeWidth={2.5} strokeLinecap="round" />
			))}
			<path d="M -12 -131 Q 4 -137 18 -134" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.6} />
			{['M 38 -116 Q 46 -114 52 -110', 'M 40 -108 Q 47 -106 53 -102'].map((d) => (
				<path key={d} d={d} fill="none" stroke={MINH.skinShade} strokeWidth={2.2} strokeLinecap="round" />
			))}
			<path
				d={mood === 'scared' ? 'M 26 -100 Q 38 -103 50 -94' : 'M 26 -96 Q 38 -101 50 -97'}
				fill="none"
				stroke={MINH.brow}
				strokeWidth={7}
				strokeLinecap="round"
			/>
			<Eye x={38} y={-82} rx={8 * eye.size} ry={8 * eye.size} lid={lid} lidColor={MINH.skin} pupilX={3} pupilY={1} pupilR={eye.pupil} />
			<path d="M 31 -71 Q 38 -67 45 -71" fill="none" stroke={MINH.skinShade} strokeWidth={2.2} strokeLinecap="round" />
			<path d="M 47 -52 Q 41 -42 45 -32" fill="none" stroke={MINH.skinShade} strokeWidth={2.5} strokeLinecap="round" />
			{/* The famous nose */}
			<path
				d="M 52 -88 Q 58 -74 70 -68 Q 82 -59 73 -50 Q 64 -44 53 -48"
				fill={MINH.skin}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			<path d="M 61 -52 Q 65 -50 68 -53" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
			{open >= 0.08 ? (
				<path
					d={`M 56 -36 L 42 -34 Q ${44} ${-30 + open * 16} ${54} ${-28 + open * 14} Z`}
					fill={MINH.mouth}
					stroke={INK}
					strokeWidth={OUTLINE}
					strokeLinejoin="round"
				/>
			) : (
				<path d="M 55 -30 Q 48 -28 41 -31" fill="none" stroke={INK} strokeWidth={OUTLINE} strokeLinecap="round" />
			)}
			<path d="M 32 2 Q 20 9 6 7" fill="none" stroke={MINH.skinShade} strokeWidth={2.5} strokeLinecap="round" />
			{mood === 'crave' ? (
				<path d="M 46 -22 Q 48 -8 46 4 Q 43 12 47 18 Q 52 11 50 2" fill={MINH.drool} stroke={INK} strokeWidth={1.8} />
			) : null}
		</g>
	);
};

type MinhSideProps = {
	readonly mood?: Mood;
	readonly blink?: number;
	readonly mouthOpen?: number;
	readonly headTilt?: number;
	readonly nearLeg: LegPose;
	readonly farLeg: LegPose;
	readonly nearArm: ArmPose;
	readonly farArm: ArmPose;
	// Vertical bounce of everything above the hips
	readonly bob?: number;
	// Degrees everything above the hips tips forward (+) or back (-)
	readonly lean?: number;
};

// Chú Minh walking, seen from his left side and facing +x; the origin is on the ground under his hips
export const MinhSide: React.FC<MinhSideProps> = ({
	mood = 'neutral',
	blink = 1,
	mouthOpen = 0,
	headTilt = 0,
	nearLeg,
	farLeg,
	nearArm,
	farArm,
	bob = 0,
	lean = 0,
}) => {
	const upper = `translate(0, ${bob}) rotate(${lean}, 0, ${HIP.y})`;
	const arm = (pose: ArmPose, far: boolean) =>
		(['ink', 'skin', 'cloth'] as const).map((layer) => (
			<Arm
				key={layer}
				side={1}
				pose={pose}
				layer={layer}
				shape={MINH_SIDE_ARM}
				shoulder={MINH_SIDE_SHOULDER}
				skin={far ? MINH.skinShade : MINH.skin}
				sleeve={`url(#${PLAID})`}
				cuff={MINH.shirtDark}
			/>
		));
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
			<g transform={upper}>{arm(farArm, true)}</g>
			<Leg x={-4} y={HIP.y + bob} pose={farLeg} thigh={HIP.thigh} shin={HIP.shin} top={66} bottom={54} fill={MINH.pantsShade} foot={<Sandal dark />} />
			<Leg x={4} y={HIP.y + bob} pose={nearLeg} thigh={HIP.thigh} shin={HIP.shin} top={66} bottom={54} fill={MINH.pants} foot={<Sandal />} />
			<g transform={upper}>
				<rect x={-16} y={-482} width={30} height={44} fill={MINH.skin} stroke={INK} strokeWidth={OUTLINE} />
				{/* Shirt tucked in under a belly that leads the way */}
				<path
					d="M -22 -452 C -40 -448 -48 -436 -50 -410 L -50 -330 C -50 -312 -52 -302 -52 -296 L 74 -296 C 92 -302 104 -330 98 -360 C 92 -392 62 -410 40 -428 C 30 -440 24 -450 16 -456 Z"
					fill={`url(#${PLAID})`}
					stroke={INK}
					strokeWidth={OUTLINE}
					strokeLinejoin="round"
				/>
				<path d="M 14 -452 C 28 -440 58 -414 82 -390 C 96 -370 98 -342 86 -316" fill="none" stroke={MINH.shirtDark} strokeWidth={3} />
				{[
					[24, -442],
					[46, -420],
					[70, -398],
					[90, -366],
					[90, -332],
				].map(([x, y]) => (
					<circle key={y} cx={x} cy={y} r={3.8} fill="#EFE6D8" stroke={INK} strokeWidth={1.8} />
				))}
				<path d="M -2 -458 L 14 -432 L 26 -452 Z" fill={MINH.shirtLight} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
				<path d="M -56 -306 L 76 -306 Q 84 -300 76 -292 L -56 -292 Z" fill={MINH.belt} stroke={INK} strokeWidth={OUTLINE} strokeLinejoin="round" />
				{/* Chest pocket with the screwdriver and the reading glasses */}
				<rect x={8} y={-446} width={9} height={28} rx={4} fill={MINH.tool} stroke={INK} strokeWidth={2.5} />
				<rect x={-6} y={-428} width={34} height={34} rx={4} fill={`url(#${PLAID})`} stroke={INK} strokeWidth={2.5} />
				<circle cx={14} cy={-412} r={8} fill={MINH.lens} stroke={INK} strokeWidth={2.5} />
				{arm(nearArm, false)}
				<g transform={`translate(2, -470) rotate(${headTilt}) scale(${MINH_SIDE_HEAD_SCALE})`}>
					<MinhSideHead mood={mood} blink={blink} mouthOpen={mouthOpen} />
				</g>
			</g>
		</g>
	);
};
