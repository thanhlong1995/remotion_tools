import type React from 'react';
import {type Side, SIDES} from '../shared/Arm';
import {Eye} from '../shared/Eye';
import {INK, OUTLINE} from '../../theme';
import {TU} from './palette';

export type TuMood = 'neutral' | 'counting' | 'happy' | 'yell' | 'suspicious';

// Big permed hair: curls behind the face and a curly fringe
const BACK_CURLS = [
	[-74, -30],
	[-88, -62],
	[-90, -98],
	[-78, -130],
	[-54, -154],
	[-20, -166],
	[18, -166],
	[52, -154],
	[78, -130],
	[90, -98],
	[88, -62],
	[74, -30],
] as const;
const FRINGE_CURLS = [
	[-40, -126],
	[-20, -134],
	[2, -137],
	[24, -133],
	[43, -122],
] as const;
const ROLLERS = [
	{x: -36, y: -176, angle: -22},
	{x: 0, y: -186, angle: 0},
	{x: 36, y: -176, angle: 22},
] as const;

type MouthKind = 'closed' | 'pout' | 'grin' | 'yell' | 'press';
type EyeState = {lid: number; tilt: number; lookX: number; lookY: number; happy?: boolean};

// Per side, screen-left first. Brows: raise lifts them, tilt > 0 lifts the inner end
const FACES: Record<
	TuMood,
	{eyes: [EyeState, EyeState]; brows: [{raise: number; tilt: number}, {raise: number; tilt: number}]; mouth: MouthKind}
> = {
	neutral: {
		eyes: [
			{lid: 0.4, tilt: 0, lookX: 0, lookY: 0},
			{lid: 0.4, tilt: 0, lookX: 0, lookY: 0},
		],
		brows: [{raise: 0, tilt: 0}, {raise: 0, tilt: 0}],
		mouth: 'closed',
	},
	counting: {
		eyes: [
			{lid: 0.3, tilt: 0, lookX: 3, lookY: -1},
			{lid: 1, tilt: 0, lookX: 0, lookY: 0},
		],
		brows: [{raise: 6, tilt: -4}, {raise: -4, tilt: -10}],
		mouth: 'pout',
	},
	happy: {
		eyes: [
			{lid: 1, tilt: 0, lookX: 0, lookY: 0, happy: true},
			{lid: 1, tilt: 0, lookX: 0, lookY: 0, happy: true},
		],
		brows: [{raise: 6, tilt: 4}, {raise: 6, tilt: 4}],
		mouth: 'grin',
	},
	yell: {
		eyes: [
			{lid: 1, tilt: -16, lookX: 0, lookY: 0},
			{lid: 1, tilt: -16, lookX: 0, lookY: 0},
		],
		brows: [{raise: -4, tilt: -20}, {raise: -4, tilt: -20}],
		mouth: 'yell',
	},
	suspicious: {
		eyes: [
			{lid: 0.6, tilt: 0, lookX: 4, lookY: 0},
			{lid: 0.6, tilt: 0, lookX: 4, lookY: 0},
		],
		brows: [{raise: 10, tilt: -2}, {raise: -3, tilt: -8}],
		mouth: 'press',
	},
};

const Curls: React.FC<{points: readonly (readonly [number, number])[]; r: number}> = ({points, r}) => (
	<g>
		{points.map(([x, y]) => (
			<circle key={`ink-${x}-${y}`} cx={x} cy={y} r={r + OUTLINE} fill={INK} />
		))}
		{points.map(([x, y]) => (
			<circle key={`fill-${x}-${y}`} cx={x} cy={y} r={r} fill={TU.hair} />
		))}
		{points.map(([x, y]) => (
			<path
				key={`curl-${x}-${y}`}
				d={`M ${x - r * 0.45} ${y + r * 0.1} Q ${x - r * 0.1} ${y - r * 0.55} ${x + r * 0.4} ${y - r * 0.2}`}
				fill="none"
				stroke={TU.hairLight}
				strokeWidth={2.5}
				strokeLinecap="round"
			/>
		))}
	</g>
);

const Mouth: React.FC<{kind: MouthKind; mouthOpen: number}> = ({kind, mouthOpen}) => {
	const minOpen = kind === 'grin' ? 0.7 : kind === 'yell' ? 1 : 0;
	const open = Math.max(mouthOpen, minOpen);
	if (open >= 0.08) {
		const w = kind === 'yell' ? 20 : kind === 'grin' ? 21 : 13;
		const top = kind === 'yell' ? -34 : -28;
		const bottom = top + 6 + open * (kind === 'yell' ? 40 : 18);
		const shape = `M ${-w} ${top} Q 0 ${top - (kind === 'yell' ? 6 : -3)} ${w} ${top} Q ${w * 0.95} ${bottom} 0 ${bottom} Q ${-w * 0.95} ${bottom} ${-w} ${top} Z`;
		return (
			<g>
				<path d={shape} fill={TU.mouth} />
				{open > 0.3 ? (
					<path
						d={`M ${-w * 0.75} ${top + 1} Q 0 ${top + (kind === 'yell' ? -3 : 4)} ${w * 0.75} ${top + 1} L ${w * 0.68} ${top + 6} Q 0 ${top + (kind === 'yell' ? 3 : 10)} ${-w * 0.68} ${top + 6} Z`}
						fill="#FFFFFF"
					/>
				) : null}
				{open > 0.5 ? <ellipse cx={0} cy={bottom - 6} rx={w * 0.5} ry={5.5} fill={TU.tongue} /> : null}
				<path d={shape} fill="none" stroke={TU.lips} strokeWidth={5} strokeLinejoin="round" />
				<path d={shape} fill="none" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
			</g>
		);
	}
	if (kind === 'pout') {
		// Lips pushed to one side while she does the sums
		return (
			<g>
				<ellipse cx={9} cy={-24} rx={8} ry={6} fill={TU.lips} stroke={INK} strokeWidth={2} />
				<ellipse cx={9} cy={-24} rx={2.5} ry={1.8} fill={TU.lipsDark} />
			</g>
		);
	}
	if (kind === 'press') {
		return <path d="M -13 -23 Q 0 -26 15 -21" fill="none" stroke={TU.lips} strokeWidth={6} strokeLinecap="round" />;
	}
	return (
		<g>
			<path
				d="M -14 -26 Q -7 -31 0 -27 Q 7 -31 14 -26 Q 7 -17 0 -17 Q -7 -17 -14 -26 Z"
				fill={TU.lips}
				stroke={INK}
				strokeWidth={2}
				strokeLinejoin="round"
			/>
			<path d="M -13 -26 Q 0 -22 13 -26" fill="none" stroke={TU.lipsDark} strokeWidth={2} />
		</g>
	);
};

type HeadProps = {
	readonly mood: TuMood;
	readonly blink: number;
	readonly lookX: number;
	readonly lookY: number;
	readonly mouthOpen: number;
};

// Bà Tư's head; the origin is under her chin
export const BaTuHead: React.FC<HeadProps> = ({mood, blink, lookX, lookY, mouthOpen}) => {
	const face = FACES[mood];
	return (
		<g>
			<Curls points={BACK_CURLS} r={28} />
			{SIDES.map((side) => (
				<g key={`ear-${side}`}>
					<ellipse cx={side * 52} cy={-70} rx={9} ry={14} fill={TU.skin} stroke={INK} strokeWidth={OUTLINE} />
					<circle cx={side * 53} cy={-55} r={5} fill={TU.gold} stroke={INK} strokeWidth={2} />
				</g>
			))}
			<path
				d="M -52 -78 C -54 -122 -30 -138 0 -138 C 30 -138 54 -122 52 -78 C 52 -34 40 -6 20 2 C 8 6 -8 6 -20 2 C -40 -6 -52 -34 -52 -78 Z"
				fill={TU.skin}
				stroke={INK}
				strokeWidth={OUTLINE}
			/>
			<Curls points={FRINGE_CURLS} r={14} />
			{ROLLERS.map((r) => (
				<g key={r.x} transform={`translate(${r.x}, ${r.y}) rotate(${r.angle})`}>
					<rect x={-21} y={-12} width={42} height={24} rx={12} fill={TU.roller} stroke={INK} strokeWidth={OUTLINE} />
					{[-9, 0, 9].map((dx) => (
						<path key={dx} d={`M ${dx} -10 L ${dx} 10`} stroke={TU.rollerDark} strokeWidth={2.5} />
					))}
				</g>
			))}
			{SIDES.map((side: Side, i) => {
				const b = face.brows[i];
				const e = face.eyes[i];
				const cx = side * 22;
				const cy = -98 - b.raise;
				const lid = e.lid >= 0.97 ? 1 : e.lid + (1 - e.lid) * (1 - blink);
				return (
					<g key={`face-${side}`}>
						{/* Thin, high, tattooed brows */}
						<path
							d={`M ${cx - side * 14} ${cy + 3} Q ${cx - side * 2} ${cy - 12} ${cx + side * 16} ${cy + 2}`}
							transform={`rotate(${side * b.tilt}, ${cx}, ${cy})`}
							fill="none"
							stroke={TU.brow}
							strokeWidth={4.5}
							strokeLinecap="round"
						/>
						{e.happy ? (
							<path
								d={`M ${cx - 9} -80 Q ${cx} -90 ${cx + 9} -80`}
								fill="none"
								stroke={INK}
								strokeWidth={OUTLINE}
								strokeLinecap="round"
							/>
						) : (
							<Eye
								x={cx}
								y={-82}
								rx={9}
								ry={7.5}
								lid={lid}
								lidColor={TU.skin}
								tilt={side * e.tilt}
								pupilX={e.lookX + lookX * 2}
								pupilY={e.lookY + lookY * 2 + 1}
								pupilR={3}
							/>
						)}
						{e.happy || lid >= 0.97 ? null : (
							<path
								d={`M ${cx + side * 9} -86 l ${side * 6} -4 M ${cx + side * 9} -82 l ${side * 7} -1`}
								stroke={INK}
								strokeWidth={2}
								strokeLinecap="round"
							/>
						)}
						<path
							d={`M ${side * 14} -44 Q ${side * 21} -34 ${side * 18} -24`}
							fill="none"
							stroke={TU.skinShade}
							strokeWidth={2.2}
							strokeLinecap="round"
						/>
					</g>
				);
			})}
			<path
				d="M -4 -76 Q -6 -60 -11 -55 Q -15 -46 -6 -45 Q 0 -42 6 -45 Q 15 -46 11 -55 Q 6 -60 4 -76"
				fill={TU.skin}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			{/* Reading glasses slid down to the tip of the nose, on a gold chain */}
			{SIDES.map((side) => {
				const x0 = side === -1 ? -28 : 4;
				return (
					<g key={`lens-${side}`}>
						<path
							d={`M ${side * 28} -50 Q ${side * 60} -20 ${side * 46} 14`}
							fill="none"
							stroke={TU.gold}
							strokeWidth={2}
							strokeDasharray="2 4"
							strokeLinecap="round"
						/>
						<rect x={x0} y={-56} width={24} height={14} rx={4} fill="#FFFFFF" opacity={0.35} />
						<path d={`M ${x0} -54 Q ${x0 + 12} -58 ${x0 + 24} -54`} fill="none" stroke={TU.frame} strokeWidth={3.5} strokeLinecap="round" />
						<rect x={x0} y={-56} width={24} height={14} rx={4} fill="none" stroke={TU.frame} strokeWidth={1.5} opacity={0.7} />
					</g>
				);
			})}
			<path d="M -4 -55 Q 0 -58 4 -55" fill="none" stroke={TU.frame} strokeWidth={2.5} />
			<Mouth kind={face.mouth} mouthOpen={mouthOpen} />
			{/* Mole with its one stubborn hair */}
			<circle cx={20} cy={-12} r={2.6} fill={INK} />
			<path d="M 21 -13 q 4 -4 8 -2" fill="none" stroke={INK} strokeWidth={1.2} strokeLinecap="round" />
			<path d="M -13 6 Q 0 13 13 6" fill="none" stroke={TU.skinShade} strokeWidth={2.2} strokeLinecap="round" />
		</g>
	);
};
