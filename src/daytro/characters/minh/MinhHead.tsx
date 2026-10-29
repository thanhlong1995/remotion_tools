import type React from 'react';
import {type Side, SIDES} from '../shared/Arm';
import {Eye} from '../shared/Eye';
import {INK, OUTLINE} from '../../theme';
import {MINH} from './palette';

export type Mood = 'neutral' | 'happy' | 'smug' | 'shock' | 'scared' | 'crave' | 'zapped';

type MouthKind = 'flat' | 'laugh' | 'smirk' | 'o' | 'wobbly' | 'drool';

// tilt > 0 slants the lids down towards the nose (worried), < 0 the other way (cross)
const FACES: Record<
	Mood,
	{
		lid: number;
		tilt: number;
		size: number;
		pupil: number;
		lookX: number;
		brows: [{raise: number; tilt: number}, {raise: number; tilt: number}];
		mouth: MouthKind;
	}
> = {
	neutral: {lid: 0.45, tilt: 0, size: 1, pupil: 3.6, lookX: 0, brows: [{raise: 0, tilt: 0}, {raise: 0, tilt: 0}], mouth: 'flat'},
	happy: {lid: 1, tilt: 0, size: 1, pupil: 3.6, lookX: 0, brows: [{raise: 6, tilt: 4}, {raise: 6, tilt: 4}], mouth: 'laugh'},
	smug: {lid: 0.55, tilt: 0, size: 1, pupil: 3.6, lookX: 3, brows: [{raise: 7, tilt: -4}, {raise: -2, tilt: -6}], mouth: 'smirk'},
	shock: {lid: 0, tilt: 0, size: 1.2, pupil: 2.4, lookX: 0, brows: [{raise: 12, tilt: 0}, {raise: 12, tilt: 0}], mouth: 'o'},
	scared: {lid: 0.12, tilt: 14, size: 1.05, pupil: 2.8, lookX: 0, brows: [{raise: 8, tilt: 16}, {raise: 8, tilt: 16}], mouth: 'wobbly'},
	crave: {lid: 0.05, tilt: 0, size: 1.15, pupil: 4.8, lookX: 2, brows: [{raise: 10, tilt: 6}, {raise: 10, tilt: 6}], mouth: 'drool'},
	zapped: {lid: 0, tilt: 0, size: 1.25, pupil: 1.4, lookX: 0, brows: [{raise: 14, tilt: -10}, {raise: 4, tilt: 12}], mouth: 'o'},
};

const Mouth: React.FC<{kind: MouthKind; mouthOpen: number}> = ({kind, mouthOpen}) => {
	if (kind === 'drool') {
		// Mouth hanging open, a string of drool from the corner
		return (
			<g>
				<ellipse cx={0} cy={-18} rx={10} ry={6 + mouthOpen * 4} fill={MINH.mouth} stroke={INK} strokeWidth={OUTLINE} />
				<path d="M 8 -14 Q 10 -4 9 4 Q 6 10 9 14 Q 13 9 11 3" fill={MINH.drool} stroke={INK} strokeWidth={1.8} />
			</g>
		);
	}
	if (kind === 'o') {
		return (
			<ellipse cx={0} cy={-17} rx={8 + mouthOpen * 2} ry={10 + mouthOpen * 3} fill={MINH.mouth} stroke={INK} strokeWidth={OUTLINE} />
		);
	}
	const open = Math.max(mouthOpen, kind === 'laugh' ? 1 : 0);
	if (open >= 0.08) {
		const w = kind === 'laugh' ? 22 : 15;
		const top = -24;
		const bottom = top + 6 + open * (kind === 'laugh' ? 26 : 18);
		const shape = `M ${-w} ${top} Q 0 ${top + 3} ${w} ${top} Q ${w * 0.8} ${bottom} 0 ${bottom} Q ${-w * 0.8} ${bottom} ${-w} ${top} Z`;
		return (
			<g>
				<path d={shape} fill={MINH.mouth} />
				{open > 0.3 ? (
					<path
						d={`M ${-w * 0.8} ${top + 1} Q 0 ${top + 4} ${w * 0.8} ${top + 1} L ${w * 0.72} ${top + 6} Q 0 ${top + 9} ${-w * 0.72} ${top + 6} Z`}
						fill="#FFFFFF"
					/>
				) : null}
				{open > 0.5 ? <ellipse cx={0} cy={bottom - 5} rx={w * 0.45} ry={4.5} fill={MINH.tongue} /> : null}
				<path d={shape} fill="none" stroke={INK} strokeWidth={OUTLINE} strokeLinejoin="round" />
			</g>
		);
	}
	const d = {
		flat: 'M -15 -19 Q 0 -17 15 -20',
		smirk: 'M -13 -18 Q 3 -16 18 -25',
		wobbly: 'M -15 -16 Q -8 -22 0 -17 Q 8 -12 15 -18',
		laugh: '',
		o: '',
		drool: '',
	}[kind];
	return <path d={d} fill="none" stroke={INK} strokeWidth={OUTLINE} strokeLinecap="round" />;
};

type HeadProps = {
	readonly mood: Mood;
	readonly blink: number;
	readonly lookX: number;
	readonly lookY: number;
	readonly mouthOpen: number;
};

// Chú Minh's head; the origin is under his chin. Bald on top with a hopeful comb-over
export const MinhHead: React.FC<HeadProps> = ({mood, blink, lookX, lookY, mouthOpen}) => {
	const face = FACES[mood];
	const lid = face.lid >= 0.97 ? 1 : face.lid + (1 - face.lid) * (1 - blink);
	return (
		<g>
			{SIDES.map((side) => (
				<g key={`ear-${side}`}>
					<ellipse cx={side * 57} cy={-66} rx={10} ry={16} fill={MINH.skin} stroke={INK} strokeWidth={OUTLINE} />
					<path
						d={`M ${side * 55} -76 Q ${side * 62} -66 ${side * 56} -56`}
						fill="none"
						stroke={MINH.skinShade}
						strokeWidth={2.5}
						strokeLinecap="round"
					/>
				</g>
			))}
			<path
				d="M -56 -70 C -58 -120 -32 -138 0 -138 C 32 -138 58 -120 56 -70 C 56 -30 46 -4 22 4 C 10 8 -10 8 -22 4 C -46 -4 -56 -30 -56 -70 Z"
				fill={MINH.skin}
				stroke={INK}
				strokeWidth={OUTLINE}
			/>
			{/* Horseshoe of grey hair above the ears */}
			{SIDES.map((side: Side) => (
				<path
					key={`hair-${side}`}
					d={`M ${side * 46} -118 Q ${side * 64} -108 ${side * 63} -86 Q ${side * 62} -68 ${side * 57} -60 L ${side * 53} -64 Q ${side * 55} -88 ${side * 48} -106 Z`}
					fill={MINH.hair}
					stroke={INK}
					strokeWidth={OUTLINE}
					strokeLinejoin="round"
				/>
			))}
			<path d="M -22 -129 Q -8 -136 8 -133" fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.6} />
			{mood === 'zapped'
				? // Every hair he has left, standing straight up
					[-46, -30, -14, 0, 14, 30, 46].map((x, i) => (
						<path
							key={x}
							d={`M ${x} ${-126 + Math.abs(x) * 0.4} l ${x * 0.25} ${-46 - (i % 2) * 14} l ${(i % 2 ? -1 : 1) * 6} 10 l 4 -18`}
							fill="none"
							stroke={MINH.hairDark}
							strokeWidth={3}
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					))
				: ['M -50 -112 Q -10 -150 40 -126', 'M -48 -104 Q -2 -146 46 -116', 'M -46 -96 Q 8 -140 50 -108'].map((d) => (
						<path key={d} d={d} fill="none" stroke={MINH.hairDark} strokeWidth={2.5} strokeLinecap="round" />
					))}
			{['M -24 -108 Q 0 -112 24 -108', 'M -18 -100 Q 0 -103 18 -100'].map((d) => (
				<path key={d} d={d} fill="none" stroke={MINH.skinShade} strokeWidth={2.5} strokeLinecap="round" />
			))}
			{SIDES.map((side, i) => {
				const b = face.brows[i];
				const cx = side * 22;
				const cy = -92 - b.raise;
				return (
					<path
						key={`brow-${side}`}
						d={`M ${cx - 14} ${cy + 1} Q ${cx} ${cy - 4} ${cx + 14} ${cy + 1}`}
						transform={`rotate(${side * b.tilt}, ${cx}, ${cy})`}
						fill="none"
						stroke={MINH.brow}
						strokeWidth={7}
						strokeLinecap="round"
					/>
				);
			})}
			{SIDES.map((side) => (
				<g key={`eye-${side}`}>
					<Eye
						x={side * 22}
						y={-76}
						rx={11 * face.size}
						ry={9 * face.size}
						lid={lid}
						lidColor={MINH.skin}
						tilt={side * face.tilt}
						pupilX={(face.lookX + lookX) * 2}
						pupilY={lookY * 2 + 1}
						pupilR={face.pupil}
					/>
					<path
						d={`M ${side * 22 - 9} -63 Q ${side * 22} -59 ${side * 22 + 9} -63`}
						fill="none"
						stroke={MINH.skinShade}
						strokeWidth={2.2}
						strokeLinecap="round"
					/>
					<path
						d={`M ${side * 16} -50 Q ${side * 25} -37 ${side * 23} -24`}
						fill="none"
						stroke={MINH.skinShade}
						strokeWidth={2.5}
						strokeLinecap="round"
					/>
				</g>
			))}
			{/* Big bulbous nose */}
			<path
				d="M -5 -80 Q -7 -60 -14 -54 Q -21 -44 -10 -40 Q -4 -36 0 -40 Q 4 -36 10 -40 Q 21 -44 14 -54 Q 7 -60 5 -80"
				fill={MINH.skin}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			<path d="M -8 -44 Q -5 -42 -3 -44 M 3 -44 Q 5 -42 8 -44" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
			<path d="M -14 6 Q 0 12 14 6" fill="none" stroke={MINH.skinShade} strokeWidth={2.5} strokeLinecap="round" />
			<Mouth kind={face.mouth} mouthOpen={mouthOpen} />
			{mood === 'scared' ? (
				<path d="M 48 -116 Q 56 -100 50 -92 Q 42 -96 48 -116 Z" fill={MINH.sweat} stroke={INK} strokeWidth={2.2} />
			) : null}
			{mood === 'zapped' ? (
				<g>
					{/* Soot smudges and a wisp of smoke */}
					<ellipse cx={-30} cy={-44} rx={14} ry={8} fill={MINH.soot} opacity={0.55} />
					<ellipse cx={26} cy={-100} rx={18} ry={9} fill={MINH.soot} opacity={0.5} />
					<ellipse cx={14} cy={-30} rx={10} ry={6} fill={MINH.soot} opacity={0.45} />
					<path d="M 10 -176 Q 0 -196 14 -206 Q 28 -216 18 -232" fill="none" stroke="#9A9A9A" strokeWidth={8} strokeLinecap="round" opacity={0.7} />
				</g>
			) : null}
		</g>
	);
};
