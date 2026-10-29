import type React from 'react';
import {INK} from '../theme';

const LINE = 2.5;
const C = {
	skyTop: '#F4B183',
	skyBottom: '#FBE3C4',
	sun: '#FFE7A8',
	far: '#C9A9A0',
	farDark: '#B08F87',
	tin: '#8FA3B5',
	tinDark: '#6F8396',
	tinLight: '#B5C5D3',
	ridge: '#5E7183',
	tank: '#D9DDE2',
	tankDark: '#AEB4BC',
	wire: '#2E2E2E',
	nightTop: '#141B33',
	nightBottom: '#2E3A66',
	moon: '#F4F1DE',
} as const;

// Rooftop of the boarding house at sunset: corrugated tin sloping down to the right, a stainless
// water tank, a TV aerial and wires. Screen coordinates; the ridge runs along y = RIDGE_Y
export const RIDGE_Y = 700;

export const Roof: React.FC<{night?: boolean}> = ({night = false}) => (
	<g>
		<defs>
			<linearGradient id="roof-sky" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor={night ? C.nightTop : C.skyTop} />
				<stop offset="1" stopColor={night ? C.nightBottom : C.skyBottom} />
			</linearGradient>
		</defs>
		<rect x={0} y={0} width={1920} height={1080} fill="url(#roof-sky)" />
		{night ? (
			<g>
				<circle cx={1480} cy={220} r={70} fill={C.moon} />
				{[
					[200, 120],
					[420, 260],
					[760, 90],
					[980, 300],
					[1180, 140],
					[1700, 380],
					[1820, 110],
				].map(([x, y]) => (
					<circle key={x} cx={x} cy={y} r={3} fill={C.moon} />
				))}
			</g>
		) : (
			<circle cx={1500} cy={560} r={110} fill={C.sun} opacity={0.9} />
		)}
		{/* Neighbouring rooftops in the distance */}
		{[
			[0, 560, 300],
			[280, 600, 260],
			[520, 540, 340],
			[1180, 590, 300],
			[1460, 620, 260],
			[1700, 560, 260],
		].map(([x, y, w]) => (
			<g key={x}>
				<rect x={x} y={y} width={w} height={1080 - y} fill={C.far} stroke={C.farDark} strokeWidth={2} />
				<rect x={x + w * 0.2} y={y + 40} width={w * 0.18} height={50} fill={C.farDark} opacity={0.5} />
			</g>
		))}
		{[80, 140, 210].map((y, i) => (
			<path key={y} d={`M -20 ${y} Q 960 ${y + 90 + i * 14} 1940 ${y + 10}`} fill="none" stroke={C.wire} strokeWidth={2.5} />
		))}
		{/* TV aerial */}
		<g transform="translate(1660, 470)">
			<path d="M 0 0 L 0 -260" stroke={INK} strokeWidth={5} />
			{[-230, -190, -150].map((y, i) => (
				<path key={y} d={`M ${-60 + i * 10} ${y} L ${60 - i * 10} ${y}`} stroke={INK} strokeWidth={4} />
			))}
		</g>
		{/* Stainless water tank on its stand */}
		<g transform="translate(330, 470)">
			<path d="M -70 0 L -60 120 M 70 0 L 60 120" stroke={INK} strokeWidth={6} />
			<rect x={-130} y={-120} width={260} height={130} rx={60} fill={C.tank} stroke={INK} strokeWidth={LINE} />
			{[-70, 0, 70].map((x) => (
				<path key={x} d={`M ${x} -116 L ${x} 6`} stroke={C.tankDark} strokeWidth={4} />
			))}
			<rect x={-20} y={-140} width={40} height={22} rx={4} fill={C.tankDark} stroke={INK} strokeWidth={LINE} />
		</g>
		{/* Corrugated tin roof */}
		<path d={`M -20 ${RIDGE_Y} L 1940 ${RIDGE_Y} L 1940 1100 L -20 1100 Z`} fill={C.tin} />
		{Array.from({length: 40}, (_, i) => i * 52 - 20).map((x) => (
			<g key={x}>
				<path d={`M ${x} ${RIDGE_Y} L ${x + 30} 1100`} stroke={C.tinDark} strokeWidth={10} />
				<path d={`M ${x + 18} ${RIDGE_Y} L ${x + 48} 1100`} stroke={C.tinLight} strokeWidth={5} />
			</g>
		))}
		<rect x={-20} y={RIDGE_Y - 18} width={1960} height={30} rx={10} fill={C.ridge} stroke={INK} strokeWidth={LINE} />
		{night ? <rect x={0} y={420} width={1920} height={660} fill={C.nightTop} opacity={0.45} /> : null}
	</g>
);
