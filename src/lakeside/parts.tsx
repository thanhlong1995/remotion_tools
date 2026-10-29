import type React from 'react';
import {CHEEK, INK, OUTLINE} from './theme';

type FluffProps = {
	readonly cx: number;
	readonly cy: number;
	readonly rx: number;
	readonly ry: number;
	readonly puffs: number;
	readonly puffR: number;
	readonly fill: string;
};

// A cloud-like blob: an ellipse ringed by puffs, outlined as one shape
export const Fluff: React.FC<FluffProps> = ({cx, cy, rx, ry, puffs, puffR, fill}) => {
	const points = Array.from({length: puffs}, (_, i) => {
		const angle = (i / puffs) * Math.PI * 2;
		return {id: i, x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry};
	});
	return (
		<g>
			<ellipse cx={cx} cy={cy} rx={rx + OUTLINE} ry={ry + OUTLINE} fill={INK} />
			{points.map((p) => (
				<circle key={`ink-${p.id}`} cx={p.x} cy={p.y} r={puffR + OUTLINE} fill={INK} />
			))}
			<ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={fill} />
			{points.map((p) => (
				<circle key={`fill-${p.id}`} cx={p.x} cy={p.y} r={puffR} fill={fill} />
			))}
		</g>
	);
};

type EyeProps = {
	readonly x: number;
	readonly y: number;
	readonly rx: number;
	readonly ry: number;
	readonly blink: number;
};

export const Eye: React.FC<EyeProps> = ({x, y, rx, ry, blink}) => (
	<g transform={`translate(${x}, ${y}) scale(1, ${blink})`}>
		<ellipse rx={rx} ry={ry} fill={INK} />
		<circle cx={rx * 0.3} cy={-ry * 0.35} r={rx * 0.38} fill="#FFFFFF" />
		<circle cx={-rx * 0.35} cy={ry * 0.35} r={rx * 0.18} fill="#FFFFFF" />
	</g>
);

type CheekProps = {
	readonly x: number;
	readonly y: number;
	readonly rx: number;
	readonly ry: number;
};

export const Cheek: React.FC<CheekProps> = ({x, y, rx, ry}) => (
	<ellipse cx={x} cy={y} rx={rx} ry={ry} fill={CHEEK} opacity={0.75} />
);
