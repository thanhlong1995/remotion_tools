import type React from 'react';
import {Arm, ARM_REST, type ArmPose, type ArmShape, type Side, SIDES} from '../shared/Arm';
import {fontFamily, INK, OUTLINE} from '../../theme';
import {KhoaHead, type KhoaMood} from './KhoaHead';
import {KHOA} from './palette';

const SHOULDER = {x: 80, y: -536};
const ARM: ArmShape = {upper: 140, fore: 128, width: 32, hand: 17, sleeve: 60};
const HEAD = {y: -556, scale: 1.22};

// Cup of instant noodles with a fork in it, still steaming
export const NoodleCup: React.FC = () => (
	<g transform="translate(0, -8)">
		{['M -10 -62 Q -16 -76 -10 -88 Q -4 -100 -10 -112', 'M 6 -64 Q 0 -80 6 -92 Q 12 -104 6 -116'].map((d) => (
			<path key={d} d={d} fill="none" stroke={KHOA.steam} strokeWidth={4} strokeLinecap="round" opacity={0.9} />
		))}
		<path d="M 6 -46 L 18 -92" stroke={INK} strokeWidth={6.5} strokeLinecap="round" />
		<path d="M 6 -46 L 18 -92" stroke={KHOA.fork} strokeWidth={3.5} strokeLinecap="round" />
		<path d="M 14 -92 L 16 -104 M 18 -92 L 20 -104 M 22 -91 L 24 -103" stroke={INK} strokeWidth={2} strokeLinecap="round" />
		<path d="M -24 -50 Q -12 -60 0 -52 Q 12 -60 24 -50 Z" fill={KHOA.noodle} stroke={INK} strokeWidth={2.5} />
		<path d="M -24 -50 L 24 -50 L 19 8 L -19 8 Z" fill={KHOA.cup} stroke={INK} strokeWidth={OUTLINE} strokeLinejoin="round" />
		<path d="M -22.5 -34 L 22.5 -34 L 21.4 -22 L -21.4 -22 Z" fill={KHOA.cupBand} />
	</g>
);

type KhoaProps = {
	readonly mood?: KhoaMood;
	readonly blink?: number;
	readonly lookX?: number;
	readonly lookY?: number;
	readonly mouthOpen?: number;
	readonly headTilt?: number;
	// Named by the side of the screen they are on
	readonly armLeft?: ArmPose;
	readonly armRight?: ArmPose;
	readonly holdLeft?: boolean;
};

// Anh Khoa, 25, programmer on the night shift: oversized hoodie, shorts, skinny legs, slides.
// Facing the viewer; the origin sits between his feet
export const Khoa: React.FC<KhoaProps> = ({
	mood = 'zombie',
	blink = 1,
	lookX = 0,
	lookY = 0,
	mouthOpen = 0,
	headTilt = 0,
	armLeft = ARM_REST,
	armRight = ARM_REST,
	holdLeft = false,
}) => {
	const arms = [
		{side: -1 as Side, pose: armLeft, held: holdLeft ? <NoodleCup /> : undefined},
		{side: 1 as Side, pose: armRight, held: undefined},
	];
	return (
		<g>
			{/* Black slides and two very skinny legs */}
			{SIDES.map((side) => (
				<g key={`leg-${side}`}>
					<rect x={side * 26 - 12} y={-262} width={24} height={250} rx={10} fill={KHOA.skin} stroke={INK} strokeWidth={OUTLINE} />
					<path d={`M ${side * 26 - 5} -140 Q ${side * 26} -134 ${side * 26 + 5} -140`} fill="none" stroke={KHOA.skinShade} strokeWidth={2.5} strokeLinecap="round" />
					<rect x={side * 30 - 28} y={-12} width={56} height={12} rx={5} fill={KHOA.slide} stroke={INK} strokeWidth={OUTLINE} />
					<rect x={side * 30 - 24} y={-28} width={48} height={18} rx={7} fill={KHOA.slideBand} stroke={INK} strokeWidth={OUTLINE} />
				</g>
			))}
			<path
				d="M -66 -380 L 66 -380 L 70 -250 Q 70 -244 64 -244 L 10 -244 Q 4 -244 4 -250 L 2 -300 L -2 -300 L -4 -250 Q -4 -244 -10 -244 L -64 -244 Q -70 -244 -70 -250 Z"
				fill={KHOA.shorts}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			{/* The hood, bunched up behind his neck */}
			<path
				d="M -42 -560 Q -50 -594 -20 -600 L 20 -600 Q 50 -594 42 -560 Q 20 -548 0 -548 Q -20 -548 -42 -560 Z"
				fill={KHOA.hoodieDark}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			{/* Oversized hoodie */}
			<path
				d="M -26 -566 C -60 -562 -80 -552 -86 -532 L -90 -470 C -92 -420 -90 -390 -84 -364 Q -84 -356 -76 -356 L 76 -356 Q 84 -356 84 -364 C 90 -390 92 -420 90 -470 L 86 -532 C 80 -552 60 -562 26 -566 Z"
				fill={KHOA.hoodie}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			<path d="M -22 -567 L 0 -540 L 22 -567 Z" fill={KHOA.skin} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
			<rect x={-84} y={-374} width={168} height={18} rx={4} fill={KHOA.hoodieDark} stroke={INK} strokeWidth={OUTLINE} />
			<path d="M -54 -448 L 54 -448 L 64 -380 L -64 -380 Z" fill={KHOA.hoodie} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
			<path d="M -50 -444 Q -60 -412 -62 -384 M 50 -444 Q 60 -412 62 -384" fill="none" stroke={KHOA.hoodieDark} strokeWidth={2.5} />
			<text x={0} y={-484} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={30} fill={KHOA.hoodieLight}>
				{'</>'}
			</text>
			{SIDES.map((side) => (
				<g key={`string-${side}`}>
					<path d={`M ${side * 10} -548 Q ${side * 14} -526 ${side * 12} -506`} fill="none" stroke={KHOA.hoodieLight} strokeWidth={3} strokeLinecap="round" />
					<rect x={side * 12 - 2.5} y={-508} width={5} height={10} rx={2} fill={KHOA.hoodieLight} stroke={INK} strokeWidth={1.5} />
				</g>
			))}
			{/* Headphones parked round his neck */}
			<path d="M -40 -560 Q 0 -530 40 -560" fill="none" stroke={KHOA.headphones} strokeWidth={8} strokeLinecap="round" />
			{SIDES.map((side) => (
				<g key={`cup-${side}`} transform={`translate(${side * 40}, -552) rotate(${side * 30})`}>
					<ellipse rx={13} ry={18} fill={KHOA.headphones} stroke={INK} strokeWidth={OUTLINE} />
					<ellipse rx={7} ry={11} fill="none" stroke={KHOA.headphonesAccent} strokeWidth={3} />
				</g>
			))}
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
						skin={KHOA.hoodie}
						handSkin={KHOA.skin}
						sleeve={KHOA.hoodie}
						cuff={KHOA.hoodieDark}
					/>
				)),
			)}
			<g transform={`translate(0, ${HEAD.y}) rotate(${headTilt}) scale(${HEAD.scale})`}>
				<KhoaHead mood={mood} blink={blink} lookX={lookX} lookY={lookY} mouthOpen={mouthOpen} />
			</g>
		</g>
	);
};
