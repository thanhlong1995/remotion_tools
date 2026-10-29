import type React from 'react';
import {type Side, SIDES} from '../shared/Arm';
import {Eye} from '../shared/Eye';
import {LaughEye} from '../shared/LaughEye';
import {INK, OUTLINE} from '../../theme';
import {HUNG} from './palette';

export type HungMood = 'sing' | 'cool' | 'hurt' | 'angry' | 'laugh';

const FACES: Record<
	HungMood,
	{lid: number; tilt: number; brow: number; browTilt: number; shut?: boolean; shades?: boolean}
> = {
	sing: {lid: 1, tilt: 0, brow: 10, browTilt: 14, shut: true},
	cool: {lid: 0.45, tilt: 0, brow: 2, browTilt: -4, shades: true},
	hurt: {lid: 0, tilt: 14, brow: 8, browTilt: 18},
	angry: {lid: 0.35, tilt: -18, brow: -4, browTilt: -20},
	laugh: {lid: 1, tilt: 0, brow: 12, browTilt: 8, shut: true},
};

// A quaver: note head, stem and flag
const Note: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 0}) => (
	<g transform={`translate(${x}, ${y}) rotate(${r})`}>
		<ellipse cx={0} cy={0} rx={7} ry={5} transform="rotate(-20)" fill={HUNG.note} />
		<path d="M 6 -2 L 6 -30 Q 16 -24 18 -14" fill="none" stroke={HUNG.note} strokeWidth={3} strokeLinecap="round" />
	</g>
);

const Shades: React.FC<{y: number}> = ({y}) => (
	<g>
		{SIDES.map((side) => (
			<path
				key={side}
				d={`M ${side * 4} ${y - 9} L ${side * 32} ${y - 9} Q ${side * 33} ${y + 10} ${side * 18} ${y + 10} Q ${side * 5} ${y + 9} ${side * 4} ${y - 9} Z`}
				fill={HUNG.lens}
				stroke={HUNG.gold}
				strokeWidth={2.5}
				strokeLinejoin="round"
			/>
		))}
		<path d={`M -4 ${y - 8} Q 0 ${y - 11} 4 ${y - 8}`} fill="none" stroke={HUNG.gold} strokeWidth={2.5} />
		<path d={`M -24 ${y - 4} L -14 ${y - 7}`} stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
	</g>
);

type HeadProps = {
	readonly mood: HungMood;
	readonly blink: number;
	readonly lookX: number;
	readonly lookY: number;
	readonly mouthOpen: number;
};

// Chú Hùng's head: square jaw, pencil moustache, long sideburns, and a towering dyed pompadour
// with his sunglasses parked on it. The origin is under his chin
export const HungHead: React.FC<HeadProps> = ({mood, blink, lookX, lookY, mouthOpen}) => {
	const face = FACES[mood];
	const lid = face.shut ? 1 : face.lid + (1 - face.lid) * (1 - blink);
	const laugh = mood === 'laugh';
	const open = Math.max(mouthOpen, mood === 'sing' ? 1 : mood === 'angry' ? 0.8 : laugh ? 0.7 : 0);
	return (
		<g>
			{SIDES.map((side) => (
				<ellipse
					key={`ear-${side}`}
					cx={side * 51}
					cy={-74}
					rx={9}
					ry={15}
					fill={HUNG.skin}
					stroke={INK}
					strokeWidth={OUTLINE}
				/>
			))}
			<path
				d="M -50 -76 C -52 -120 -28 -136 0 -136 C 28 -136 52 -120 50 -76 L 50 -40 C 48 -10 30 4 0 6 C -30 4 -48 -10 -50 -40 Z"
				fill={HUNG.skin}
				stroke={INK}
				strokeWidth={OUTLINE}
			/>
			{SIDES.map((side: Side) => (
				<path
					key={`burn-${side}`}
					d={`M ${side * 50} -112 L ${side * 50} -50 L ${side * 42} -56 L ${side * 42} -110 Z`}
					fill={HUNG.hair}
				/>
			))}
			{/* The pompadour: half his height and all of his pride */}
			<path
				d="M -50 -108 C -58 -150 -42 -192 -4 -202 C 30 -212 66 -198 68 -176 C 68 -162 54 -158 44 -166 C 40 -150 48 -130 50 -108 C 40 -124 20 -130 0 -128 C -20 -130 -40 -124 -50 -108 Z"
				fill={HUNG.hair}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			{['M -30 -170 Q -6 -196 30 -192', 'M -38 -150 Q -14 -178 22 -178', 'M -40 -128 Q -20 -152 12 -156'].map((d) => (
				<path key={d} d={d} fill="none" stroke={HUNG.hairShine} strokeWidth={3.5} strokeLinecap="round" />
			))}
			{face.shades ? null : (
				<g transform="translate(-6, -150) rotate(-8)">
					<Shades y={0} />
				</g>
			)}
			{SIDES.map((side) => {
				const cx = side * 21;
				return (
					<g key={`face-${side}`}>
						<path
							d={`M ${cx - 13} ${-96 - face.brow + 2} Q ${cx} ${-104 - face.brow} ${cx + 13} ${-97 - face.brow}`}
							transform={`rotate(${side * face.browTilt}, ${cx}, ${-98 - face.brow})`}
							fill="none"
							stroke={HUNG.hair}
							strokeWidth={6.5}
							strokeLinecap="round"
						/>
						{laugh ? (
							<LaughEye x={cx} y={-82} w={10} side={side} tear={HUNG.tear} />
						) : face.shades ? null : (
							<Eye
								x={cx}
								y={-82}
								rx={9.5}
								ry={8}
								lid={lid}
								lidColor={HUNG.skin}
								tilt={side * face.tilt}
								pupilX={lookX * 2}
								pupilY={lookY * 2 + 1}
								pupilR={mood === 'hurt' ? 2.4 : 3}
							/>
						)}
						<path
							d={`M ${side * 18} -52 Q ${side * 27} -40 ${side * 24} -28`}
							fill="none"
							stroke={HUNG.skinShade}
							strokeWidth={2.5}
							strokeLinecap="round"
						/>
					</g>
				);
			})}
			{face.shades ? <Shades y={-82} /> : null}
			{/* Broad, flat nose */}
			<path
				d="M -5 -76 Q -6 -62 -15 -54 Q -18 -46 -8 -45 Q 0 -42 8 -45 Q 18 -46 15 -54 Q 6 -62 5 -76"
				fill={HUNG.skin}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			{open >= 0.08 ? (
				<g>
					<ellipse
						cx={0}
						cy={laugh ? -19 : -22}
						rx={mood === 'sing' ? 13 : laugh ? 19 : 15}
						ry={6 + open * (laugh ? 12 : 9)}
						fill={HUNG.mouth}
						stroke={INK}
						strokeWidth={OUTLINE}
					/>
					<ellipse cx={0} cy={-22 + open * 6} rx={7} ry={3.5} fill={HUNG.tongue} />
				</g>
			) : (
				<path
					d={mood === 'hurt' ? 'M -13 -22 Q -6 -28 0 -23 Q 6 -18 13 -24' : 'M -13 -23 Q 2 -20 16 -28'}
					fill="none"
					stroke={INK}
					strokeWidth={OUTLINE}
					strokeLinecap="round"
				/>
			)}
			{/* Pencil moustache */}
			<path
				d="M -18 -37 Q -9 -41 0 -38 Q 9 -41 18 -37"
				fill="none"
				stroke={HUNG.hair}
				strokeWidth={4}
				strokeLinecap="round"
			/>
			<path d="M -14 8 Q 0 14 14 8" fill="none" stroke={HUNG.skinShade} strokeWidth={2.5} strokeLinecap="round" />
			{mood === 'sing' ? (
				<g>
					<Note x={64} y={-110} r={10} />
					<Note x={84} y={-150} r={-8} />
					<Note x={-74} y={-128} r={-12} />
				</g>
			) : null}
			{mood === 'hurt'
				? [-1, 1].map((s) => (
						<path
							key={s}
							d={`M ${s * 26} -72 Q ${s * 32} -58 ${s * 27} -52 Q ${s * 22} -58 ${s * 26} -72 Z`}
							fill={HUNG.tear}
							stroke={INK}
							strokeWidth={1.8}
						/>
					))
				: null}
		</g>
	);
};
