import type React from 'react';
import {type Side, SIDES} from '../shared/Arm';
import {Eye} from '../shared/Eye';
import {LaughEye} from '../shared/LaughEye';
import {fontFamily, INK, OUTLINE} from '../../theme';
import {SAU} from './palette';

export type SauMood = 'grin' | 'brag' | 'drunk' | 'wink' | 'laugh';

// Per side, screen-left first
const FACES: Record<
	SauMood,
	{
		lids: [number, number];
		tilt: number;
		size: number;
		brows: [{raise: number; tilt: number}, {raise: number; tilt: number}];
	}
> = {
	grin: {
		lids: [0.4, 0.4],
		tilt: 0,
		size: 1,
		brows: [
			{raise: 4, tilt: 0},
			{raise: 4, tilt: 0},
		],
	},
	brag: {
		lids: [0, 0],
		tilt: 0,
		size: 1.15,
		brows: [
			{raise: 12, tilt: 4},
			{raise: 12, tilt: 4},
		],
	},
	drunk: {
		lids: [0.72, 0.72],
		tilt: 10,
		size: 1,
		brows: [
			{raise: 4, tilt: 12},
			{raise: 4, tilt: 12},
		],
	},
	wink: {
		lids: [0.25, 1],
		tilt: 0,
		size: 1,
		brows: [
			{raise: 12, tilt: -4},
			{raise: -3, tilt: -8},
		],
	},
	laugh: {
		lids: [1, 1],
		tilt: 0,
		size: 1,
		brows: [
			{raise: 10, tilt: 8},
			{raise: 10, tilt: 8},
		],
	},
};

// Big grin under the moustache with a missing front tooth
const GapGrin: React.FC<{open: number; lopsided?: boolean}> = ({open, lopsided}) => {
	const bottom = -20 + open * 12;
	const tilt = lopsided ? -4 : 0;
	return (
		<g transform={`rotate(${tilt}, 0, -20)`}>
			<path d={`M -16 -26 Q 0 -22 16 -26 Q 12 ${bottom} 0 ${bottom + 1} Q -12 ${bottom} -16 -26 Z`} fill={SAU.mouth} />
			<path d="M -13 -25 L 13 -25 L 12 -19 L -12 -19 Z" fill="#FFFDF5" />
			<rect x={2} y={-25} width={5} height={6} fill={SAU.mouth} />
			<path d="M -6 -25 L -6 -19 M 9 -25 L 9 -19" stroke={INK} strokeWidth={1} opacity={0.5} />
			<path
				d={`M -16 -26 Q 0 -22 16 -26 Q 12 ${bottom} 0 ${bottom + 1} Q -12 ${bottom} -16 -26 Z`}
				fill="none"
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
		</g>
	);
};

type HeadProps = {
	readonly mood: SauMood;
	readonly blink: number;
	readonly lookX: number;
	readonly lookY: number;
	readonly mouthOpen: number;
};

// Chú Sáu's head: long face, jug ears, hooked nose, bushy moustache, bucket hat.
// The origin is under his chin
export const SauHead: React.FC<HeadProps> = ({mood, blink, lookX, lookY, mouthOpen}) => {
	const face = FACES[mood];
	return (
		<g>
			{SIDES.map((side: Side) => (
				<g key={`ear-${side}`} transform={`rotate(${side * 16}, ${side * 46}, -92)`}>
					<ellipse cx={side * 50} cy={-92} rx={14} ry={23} fill={SAU.skin} stroke={INK} strokeWidth={OUTLINE} />
					<path
						d={`M ${side * 48} -106 Q ${side * 58} -92 ${side * 49} -78`}
						fill="none"
						stroke={SAU.skinShade}
						strokeWidth={2.5}
						strokeLinecap="round"
					/>
				</g>
			))}
			{/* A long, horsey face */}
			<path
				d="M -42 -98 C -44 -148 -24 -166 0 -166 C 24 -166 44 -148 42 -98 L 40 -34 C 38 -8 22 6 0 6 C -22 6 -38 -8 -40 -34 Z"
				fill={SAU.skin}
				stroke={INK}
				strokeWidth={OUTLINE}
			/>
			{mood === 'drunk' ? <ellipse cx={0} cy={-58} rx={34} ry={12} fill={SAU.flush} opacity={0.5} /> : null}
			{SIDES.map((side) => (
				<path
					key={`burn-${side}`}
					d={`M ${side * 42} -124 L ${side * 42} -86 L ${side * 35} -90 L ${side * 35} -122 Z`}
					fill={SAU.hair}
				/>
			))}
			<path d="M -2 -4 Q 0 0 2 -4" fill="none" stroke={SAU.skinShade} strokeWidth={2.2} strokeLinecap="round" />
			{SIDES.map((side, i) => {
				const b = face.brows[i];
				const cx = side * 18;
				const cy = -104 - b.raise;
				const lid = face.lids[i] >= 0.97 ? 1 : face.lids[i] + (1 - face.lids[i]) * (1 - blink);
				return (
					<g key={`face-${side}`}>
						<path
							d={`M ${cx - 12} ${cy + 2} Q ${cx} ${cy - 6} ${cx + 12} ${cy + 1}`}
							transform={`rotate(${side * b.tilt}, ${cx}, ${cy})`}
							fill="none"
							stroke={SAU.hair}
							strokeWidth={7}
							strokeLinecap="round"
						/>
						{mood === 'laugh' ? (
							<LaughEye x={cx} y={-86} w={9} side={side} tear="#9ED3F0" />
						) : (
							<Eye
								x={cx}
								y={-86}
								rx={9 * face.size}
								ry={7.5 * face.size}
								lid={lid}
								lidColor={SAU.skin}
								tilt={side * face.tilt}
								pupilX={lookX * 2}
								pupilY={lookY * 2 + 1}
								pupilR={mood === 'brag' ? 2.4 : 2.8}
							/>
						)}
						<path
							d={`M ${side * 29} -84 l ${side * 7} 3 M ${side * 29} -89 l ${side * 7} -2`}
							stroke={SAU.skinShade}
							strokeWidth={2}
							strokeLinecap="round"
						/>
						<path
							d={`M ${side * 16} -54 Q ${side * 26} -40 ${side * 22} -26`}
							fill="none"
							stroke={SAU.skinShade}
							strokeWidth={2.5}
							strokeLinecap="round"
						/>
					</g>
				);
			})}
			{/* Long hooked nose */}
			<path
				d="M -4 -86 Q -2 -60 9 -48 Q 13 -40 4 -37 Q -3 -35 -7 -40"
				fill={SAU.skin}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			{mood === 'laugh' ? (
				<GapGrin open={1.5 + 0.6 * mouthOpen} />
			) : mood === 'brag' || mouthOpen > 0.08 ? (
				<ellipse
					cx={0}
					cy={-19}
					rx={11}
					ry={6 + Math.max(mouthOpen, mood === 'brag' ? 1 : 0) * 6}
					fill={SAU.mouth}
					stroke={INK}
					strokeWidth={OUTLINE}
				/>
			) : mood === 'wink' ? (
				<path d="M -14 -24 Q 2 -20 16 -28" fill="none" stroke={INK} strokeWidth={OUTLINE} strokeLinecap="round" />
			) : (
				<GapGrin open={mood === 'drunk' ? 0.7 : 1} lopsided={mood === 'drunk'} />
			)}
			{/* Bushy handlebar moustache */}
			<path
				d="M -2 -40 C -10 -44 -26 -44 -32 -34 C -36 -26 -28 -24 -22 -28 C -14 -32 -6 -32 0 -30 C 6 -32 14 -32 22 -28 C 28 -24 36 -26 32 -34 C 26 -44 10 -44 2 -40 Z"
				fill={SAU.hair}
				stroke={INK}
				strokeWidth={2}
				strokeLinejoin="round"
			/>
			{/* The toothpick never leaves his mouth, except when he's busy exaggerating */}
			{mood === 'brag' ? null : (
				<g>
					<path d="M 13 -24 L 36 -32" stroke={INK} strokeWidth={5} strokeLinecap="round" />
					<path d="M 13 -24 L 36 -32" stroke={SAU.toothpick} strokeWidth={2.6} strokeLinecap="round" />
				</g>
			)}
			{/* Army-green bucket hat, pulled low */}
			<path
				d="M -46 -126 C -46 -176 -24 -196 0 -196 C 24 -196 46 -176 46 -126 Z"
				fill={SAU.hat}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			<path d="M -46 -142 L 46 -142" stroke={SAU.hatDark} strokeWidth={7} />
			{SIDES.map((side) => (
				<circle key={`vent-${side}`} cx={side * 26} cy={-166} r={3} fill={SAU.hatDark} stroke={INK} strokeWidth={1.5} />
			))}
			<path
				d="M -74 -122 Q -78 -140 -46 -138 L 46 -138 Q 78 -140 74 -122 Q 72 -110 46 -116 L -46 -116 Q -72 -110 -74 -122 Z"
				fill={SAU.hatLight}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			<path d="M -64 -124 Q 0 -132 64 -124" fill="none" stroke={SAU.hatDark} strokeWidth={1.8} strokeDasharray="4 4" />
			{mood === 'drunk' ? (
				<text
					x={46}
					y={-150}
					fontFamily={fontFamily}
					fontWeight={800}
					fontSize={18}
					fill={INK}
					transform="rotate(12, 46, -150)"
				>
					hic!
				</text>
			) : null}
		</g>
	);
};
