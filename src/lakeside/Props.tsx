import type React from 'react';
import {INK, OUTLINE} from './theme';

const BALL_SEGMENTS = ['#FF5A5F', '#FFFFFF', '#3DA5F5', '#FFFFFF', '#FFD23F', '#FFFFFF'].map(
	(color, i) => ({id: `segment-${i}`, color, i}),
);

type BallProps = {
	readonly x: number;
	readonly y: number;
	readonly r: number;
	readonly spin: number;
};

export const BeachBall: React.FC<BallProps> = ({x, y, r, spin}) => (
	<g transform={`translate(${x}, ${y})`}>
		<g transform={`rotate(${spin})`}>
			{BALL_SEGMENTS.map(({id, color, i}) => {
				const a1 = (i / BALL_SEGMENTS.length) * Math.PI * 2;
				const a2 = ((i + 1) / BALL_SEGMENTS.length) * Math.PI * 2;
				return (
					<path
						key={id}
						d={`M 0 0 L ${r * Math.cos(a1)} ${r * Math.sin(a1)} A ${r} ${r} 0 0 1 ${r * Math.cos(a2)} ${r * Math.sin(a2)} Z`}
						fill={color}
					/>
				);
			})}
			<circle r={r * 0.22} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
		</g>
		<circle r={r} fill="none" stroke={INK} strokeWidth={OUTLINE} />
		<ellipse
			cx={-r * 0.35}
			cy={-r * 0.42}
			rx={r * 0.28}
			ry={r * 0.16}
			fill="#FFFFFF"
			opacity={0.7}
			transform={`rotate(-30 ${-r * 0.35} ${-r * 0.42})`}
		/>
	</g>
);

type ButterflyProps = {
	readonly x: number;
	readonly y: number;
	readonly flap: number;
	readonly tilt: number;
	readonly color: string;
};

export const Butterfly: React.FC<ButterflyProps> = ({x, y, flap, tilt, color}) => (
	<g transform={`translate(${x}, ${y}) rotate(${tilt})`}>
		{[-1, 1].map((side) => (
			<g key={side} transform={`scale(${side * flap}, 1)`}>
				<ellipse cx={16} cy={-8} rx={17} ry={13} fill={color} stroke={INK} strokeWidth={3} />
				<ellipse cx={12} cy={10} rx={11} ry={9} fill={color} stroke={INK} strokeWidth={3} />
				<circle cx={18} cy={-9} r={4.5} fill="#FFFFFF" opacity={0.7} />
			</g>
		))}
		<ellipse rx={4} ry={15} fill={INK} />
		<path
			d="M -2 -13 Q -8 -26 -12 -28 M 2 -13 Q 8 -26 12 -28"
			stroke={INK}
			strokeWidth={2.5}
			fill="none"
			strokeLinecap="round"
		/>
	</g>
);

type FloaterProps = {
	readonly x: number;
	readonly y: number;
	readonly scale: number;
	readonly rotate: number;
	readonly opacity: number;
};

export const Heart: React.FC<FloaterProps> = ({x, y, scale, rotate, opacity}) => (
	<g transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`} opacity={opacity}>
		<path
			d="M 0 -8 C 0 -20 -20 -20 -20 -8 C -20 2 -6 8 0 14 C 6 8 20 2 20 -8 C 20 -20 0 -20 0 -8 Z"
			fill="#FF6B9A"
			stroke={INK}
			strokeWidth={3}
			strokeLinejoin="round"
		/>
		<ellipse cx={-10} cy={-10} rx={4} ry={2.5} fill="#FFFFFF" opacity={0.75} />
	</g>
);

export const Sparkle: React.FC<FloaterProps> = ({x, y, scale, rotate, opacity}) => (
	<g transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`} opacity={opacity}>
		<path
			d="M 0 -20 Q 3 -3 20 0 Q 3 3 0 20 Q -3 3 -20 0 Q -3 -3 0 -20 Z"
			fill="#FFE45C"
			stroke={INK}
			strokeWidth={3}
			strokeLinejoin="round"
		/>
	</g>
);
