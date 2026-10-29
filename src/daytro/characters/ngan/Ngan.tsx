import type React from 'react';
import {Arm, ARM_REST, type ArmPose, type ArmShape, type Side, SIDES} from '../shared/Arm';
import {INK, OUTLINE} from '../../theme';
import {NganHairBack, NganHead, type NganMood} from './NganHead';
import {NGAN} from './palette';

const SHOULDER = {x: 62, y: -498};
const ARM: ArmShape = {upper: 136, fore: 126, width: 24, hand: 16, sleeve: 52};
const HEAD = {y: -546, scale: 1.18};

export type NganProp = 'phone' | 'parcels';

// Phone seen from the back while she takes a selfie: pink case, camera bump, grip
export const Phone: React.FC = () => (
	<g transform="translate(0, -26)">
		<rect x={-19} y={-38} width={38} height={70} rx={8} fill={NGAN.phone} stroke={INK} strokeWidth={OUTLINE} />
		<rect x={-14} y={-33} width={15} height={19} rx={4} fill={NGAN.camera} />
		<circle cx={-6.5} cy={-28} r={3} fill="#6B7280" />
		<circle cx={-6.5} cy={-19} r={3} fill="#6B7280" />
		<circle cx={0} cy={6} r={8} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
	</g>
);

// A stack of online-shopping parcels, gripped by their right-hand edge
export const Parcels: React.FC = () => (
	<g transform="translate(-30, 4)">
		{[
			{x: -40, y: -24, w: 76, h: 46},
			{x: -32, y: -60, w: 60, h: 36},
			{x: -22, y: -86, w: 40, h: 26},
		].map((b) => (
			<g key={b.y}>
				<rect x={b.x} y={b.y} width={b.w} height={b.h} rx={3} fill={NGAN.parcel} stroke={INK} strokeWidth={OUTLINE} />
				<rect x={b.x + b.w / 2 - 5} y={b.y} width={10} height={b.h} fill={NGAN.tape} />
				<rect x={b.x + 6} y={b.y + 6} width={b.w * 0.3} height={b.h * 0.35} fill={NGAN.label} stroke={INK} strokeWidth={1.2} />
				<rect x={b.x} y={b.y} width={b.w} height={b.h} rx={3} fill="none" stroke={INK} strokeWidth={OUTLINE} />
			</g>
		))}
	</g>
);

const HELD: Record<NganProp, React.ReactNode> = {phone: <Phone />, parcels: <Parcels />};

type NganProps = {
	readonly mood?: NganMood;
	readonly blink?: number;
	readonly lookX?: number;
	readonly lookY?: number;
	readonly mouthOpen?: number;
	readonly headTilt?: number;
	// Named by the side of the screen they are on
	readonly armLeft?: ArmPose;
	readonly armRight?: ArmPose;
	readonly holdLeft?: NganProp;
	readonly holdRight?: NganProp;
};

// Chị Ngân, 27, office worker, online-shopping addict, never off camera.
// Facing the viewer; the origin sits between her feet
export const Ngan: React.FC<NganProps> = ({
	mood = 'neutral',
	blink = 1,
	lookX = 0,
	lookY = 0,
	mouthOpen = 0,
	headTilt = 0,
	armLeft = ARM_REST,
	armRight = ARM_REST,
	holdLeft,
	holdRight,
}) => {
	const arms = [
		{side: -1 as Side, pose: armLeft, held: holdLeft ? HELD[holdLeft] : undefined},
		{side: 1 as Side, pose: armRight, held: holdRight ? HELD[holdRight] : undefined},
	];
	const headTransform = `translate(0, ${HEAD.y}) rotate(${headTilt}) scale(${HEAD.scale})`;
	return (
		<g>
			{/* Chunky white sneakers */}
			{SIDES.map((side) => (
				<g key={`foot-${side}`}>
					<rect x={side * 40 - 30} y={-14} width={60} height={14} rx={6} fill={NGAN.sneakerShade} stroke={INK} strokeWidth={OUTLINE} />
					<path d={`M ${side * 40 - 27} -13 Q ${side * 40} -46 ${side * 40 + 27} -13 Z`} fill={NGAN.sneaker} stroke={INK} strokeWidth={OUTLINE} strokeLinejoin="round" />
					<path d={`M ${side * 40 - 8} -30 L ${side * 40 + 8} -30 M ${side * 40 - 9} -24 L ${side * 40 + 9} -24`} stroke={INK} strokeWidth={2} strokeLinecap="round" />
				</g>
			))}
			<g transform={headTransform}>
				<NganHairBack />
			</g>
			{/* High-waisted wide-leg trousers */}
			<path
				d="M -70 -352 L 70 -352 L 84 -30 Q 84 -22 76 -22 L 12 -22 Q 6 -22 6 -30 L 3 -228 L -3 -228 L -6 -30 Q -6 -22 -12 -22 L -76 -22 Q -84 -22 -84 -30 Z"
				fill={NGAN.pants}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			{SIDES.map((side) => (
				<path key={`crease-${side}`} d={`M ${side * 42} -330 L ${side * 46} -40`} stroke={NGAN.pantsShade} strokeWidth={2.5} strokeLinecap="round" />
			))}
			<rect x={-13} y={-556} width={26} height={34} fill={NGAN.skin} stroke={INK} strokeWidth={OUTLINE} />
			{/* Lilac blouse tucked in, with a black bow at the neck */}
			<path
				d="M -24 -528 C -46 -524 -60 -518 -64 -504 L -66 -458 C -66 -428 -60 -388 -58 -352 L 58 -352 C 60 -388 66 -428 66 -458 L 64 -504 C 60 -518 46 -524 24 -528 Z"
				fill={NGAN.blouse}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			<path d="M -16 -529 Q 0 -512 16 -529 Z" fill={NGAN.skin} />
			<path d="M -40 -470 Q -44 -420 -36 -380 M 40 -470 Q 44 -420 36 -380" fill="none" stroke={NGAN.blouseDark} strokeWidth={2.5} strokeLinecap="round" />
			<g transform="translate(0, -516)">
				<path d="M 0 0 L -16 -9 L -16 9 Z M 0 0 L 16 -9 L 16 9 Z" fill={NGAN.bow} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
				<path d="M -3 2 L -8 20 M 3 2 L 8 20" stroke={NGAN.bow} strokeWidth={4} strokeLinecap="round" />
				<circle cx={0} cy={0} r={4.5} fill={NGAN.bow} />
			</g>
			<rect x={-60} y={-358} width={120} height={9} fill={NGAN.belt} stroke={INK} strokeWidth={2} />
			<rect x={-7} y={-361} width={14} height={14} rx={2} fill="none" stroke={NGAN.gold} strokeWidth={3} />
			{(['ink', 'skin', 'cloth'] as const).map((layer) =>
				arms.map((a) => (
					<Arm
						key={`${layer}-${a.side}`}
						side={a.side}
						pose={a.pose}
						layer={layer}
						held={a.held}
						shape={ARM}
						shoulder={SHOULDER}
						skin={NGAN.skin}
						sleeve={NGAN.blouse}
						cuff={NGAN.blouseDark}
					/>
				)),
			)}
			<g transform={headTransform}>
				<NganHead mood={mood} blink={blink} lookX={lookX} lookY={lookY} mouthOpen={mouthOpen} />
			</g>
		</g>
	);
};
