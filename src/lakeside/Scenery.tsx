import type React from 'react';
import {random} from 'remotion';
import {INK, OUTLINE, wave} from './theme';

export const WIDTH = 1080;
export const HEIGHT = 1920;
const HORIZON = 890;

// Top edge of the grassy bank in the foreground
export const bankEdge = (x: number) => 1390 + 16 * Math.sin(x / 160) + 9 * Math.sin(x / 57 + 1.3);

export const SceneDefs: React.FC = () => (
	<defs>
		<linearGradient id="lake-sky" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stopColor="#6EC6FF" />
			<stop offset="1" stopColor="#D4F1FF" />
		</linearGradient>
		<linearGradient id="lake-water" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stopColor="#A6E8FF" />
			<stop offset="0.45" stopColor="#4CC0F5" />
			<stop offset="1" stopColor="#1F97DD" />
		</linearGradient>
		<linearGradient id="lake-bank" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stopColor="#A8E063" />
			<stop offset="1" stopColor="#56AB2F" />
		</linearGradient>
		<linearGradient id="petal-back" x1="0" y1="1" x2="0" y2="0">
			<stop offset="0" stopColor="#FFE6F0" />
			<stop offset="1" stopColor="#FF8DBA" />
		</linearGradient>
		<linearGradient id="petal-front" x1="0" y1="1" x2="0" y2="0">
			<stop offset="0" stopColor="#FFF4F8" />
			<stop offset="1" stopColor="#FF6FA8" />
		</linearGradient>
		<radialGradient id="lake-vignette" cx="0.5" cy="0.5" r="0.75">
			<stop offset="0.6" stopColor="#000000" stopOpacity="0" />
			<stop offset="1" stopColor="#1B3A4B" stopOpacity="0.22" />
		</radialGradient>
	</defs>
);

const Cloud: React.FC<{readonly x: number; readonly y: number; readonly scale: number}> = ({
	x,
	y,
	scale,
}) => (
	<g transform={`translate(${x}, ${y}) scale(${scale})`}>
		<ellipse cx={95} cy={38} rx={118} ry={30} fill="#DDF1FF" />
		<circle cx={30} cy={10} r={48} fill="#FFFFFF" />
		<circle cx={95} cy={-18} r={66} fill="#FFFFFF" />
		<circle cx={160} cy={8} r={50} fill="#FFFFFF" />
		<ellipse cx={95} cy={22} rx={115} ry={30} fill="#FFFFFF" />
	</g>
);

const CLOUDS = [
	{x: 60, y: 330, scale: 1, speed: 0.35},
	{x: 560, y: 150, scale: 0.8, speed: 0.25},
	{x: 420, y: 560, scale: 0.6, speed: 0.45},
	{x: -260, y: 470, scale: 0.85, speed: 0.3},
];

const Tree: React.FC<{readonly x: number; readonly y: number; readonly scale: number}> = ({
	x,
	y,
	scale,
}) => (
	<g transform={`translate(${x}, ${y}) scale(${scale})`}>
		<rect x={-6} y={-12} width={12} height={30} rx={4} fill="#8D6E63" />
		<circle cx={0} cy={-34} r={30} fill="#5CBF60" />
		<circle cx={-18} cy={-18} r={20} fill="#5CBF60" />
		<circle cx={18} cy={-18} r={20} fill="#5CBF60" />
		<circle cx={-9} cy={-44} r={10} fill="#86DB86" />
	</g>
);

const TREES = [
	{x: 70, y: 862, scale: 0.9},
	{x: 130, y: 875, scale: 0.7},
	{x: 860, y: 852, scale: 0.85},
	{x: 935, y: 866, scale: 1},
	{x: 1010, y: 872, scale: 0.75},
];

export const Sky: React.FC<{readonly frame: number}> = ({frame}) => (
	<g>
		<rect x={0} y={0} width={WIDTH} height={HORIZON + 40} fill="url(#lake-sky)" />
		<g transform="translate(860, 250)">
			<circle r={150} fill="#FFF3B0" opacity={0.45} />
			<g transform={`rotate(${frame * 0.4})`}>
				{Array.from({length: 12}, (_, i) => i * 30).map((angle) => (
					<line
						key={angle}
						x1={0}
						y1={-115}
						x2={0}
						y2={-150}
						transform={`rotate(${angle})`}
						stroke="#FFD43B"
						strokeWidth={14}
						strokeLinecap="round"
					/>
				))}
			</g>
			<circle r={95} fill="#FFE066" />
			<path
				d="M -46 -12 Q -32 -28 -18 -12 M 18 -12 Q 32 -28 46 -12"
				fill="none"
				stroke="#E08E00"
				strokeWidth={6}
				strokeLinecap="round"
			/>
			<path d="M -24 18 Q 0 42 24 18" fill="none" stroke="#E08E00" strokeWidth={6} strokeLinecap="round" />
			<ellipse cx={-52} cy={14} rx={14} ry={8} fill="#FFA8A8" opacity={0.7} />
			<ellipse cx={52} cy={14} rx={14} ry={8} fill="#FFA8A8" opacity={0.7} />
		</g>
		{CLOUDS.map((cloud) => (
			<Cloud
				key={`${cloud.x}-${cloud.y}`}
				x={cloud.x + frame * cloud.speed}
				y={cloud.y + wave(frame, 150, cloud.x) * 6}
				scale={cloud.scale}
			/>
		))}
		<path
			d="M 0 860 C 150 760 300 760 420 840 C 520 780 700 740 860 820 C 960 780 1040 790 1080 810 L 1080 920 L 0 920 Z"
			fill="#B5E8A0"
		/>
		<path
			d="M 0 900 C 200 820 380 850 520 900 C 680 850 880 830 1080 880 L 1080 930 L 0 930 Z"
			fill="#8ED67E"
		/>
		{TREES.map((tree) => (
			<Tree key={tree.x} {...tree} />
		))}
	</g>
);

const SPARKLES = Array.from({length: 26}, (_, i) => {
	const y = HORIZON + 15 + random(`spark-y-${i}`) * 480;
	const depth = (y - HORIZON) / 500;
	return {
		id: i,
		x: 20 + random(`spark-x-${i}`) * 1040,
		y,
		length: (14 + random(`spark-l-${i}`) * 26) * (0.6 + depth),
		phase: random(`spark-p-${i}`) * Math.PI * 2,
	};
});

export const Lake: React.FC<{readonly frame: number}> = ({frame}) => (
	<g>
		<rect x={0} y={HORIZON} width={WIDTH} height={620} fill="url(#lake-water)" />
		<rect x={0} y={HORIZON - 4} width={WIDTH} height={9} fill="#E6FAFF" opacity={0.85} />
		{[0, 1, 2, 3, 4].map((i) => (
			<ellipse
				key={i}
				cx={860 + wave(frame, 30, i) * 8}
				cy={910 + i * 22}
				rx={(46 - i * 6) * (0.8 + 0.2 * wave(frame, 20, i * 1.7))}
				ry={4}
				fill="#FFF6C8"
				opacity={0.65 - i * 0.1}
			/>
		))}
		{SPARKLES.map((s) => (
			<line
				key={s.id}
				x1={s.x + wave(frame, 100, s.phase) * 6}
				y1={s.y}
				x2={s.x + s.length + wave(frame, 100, s.phase) * 6}
				y2={s.y}
				stroke="#FFFFFF"
				strokeWidth={5}
				strokeLinecap="round"
				opacity={0.15 + 0.5 * (0.5 + 0.5 * wave(frame, 60, s.phase))}
			/>
		))}
	</g>
);

export const LilyPad: React.FC = () => (
	<g>
		<path
			d="M 0 0 L 20 35.5 A 125 36 0 1 0 -20 35.5 Z"
			fill="#43A047"
			stroke={INK}
			strokeWidth={OUTLINE}
			strokeLinejoin="round"
		/>
		<path
			d="M 0 0 L -80 -20 M 0 0 L 0 -30 M 0 0 L 80 -20 M 0 0 L -100 12 M 0 0 L 100 12"
			stroke="#7CCB6B"
			strokeWidth={4}
			strokeLinecap="round"
		/>
	</g>
);

const PETAL = 'M 0 0 C -30 -22 -24 -72 0 -98 C 24 -72 30 -22 0 0 Z';

type FloatingProps = {
	readonly x: number;
	readonly y: number;
	readonly scale: number;
	readonly bob: number;
};

export const Lotus: React.FC<FloatingProps> = ({x, y, scale, bob}) => (
	<g transform={`translate(${x}, ${y + bob}) scale(${scale})`}>
		<g transform="translate(0, 8) scale(0.9)">
			<LilyPad />
		</g>
		<g transform="translate(0, -4)">
			{[-62, -31, 0, 31, 62].map((angle) => (
				<path
					key={angle}
					d={PETAL}
					transform={`rotate(${angle})`}
					fill="url(#petal-back)"
					stroke={INK}
					strokeWidth={4}
					strokeLinejoin="round"
				/>
			))}
			<ellipse cx={0} cy={-40} rx={22} ry={9} fill="#FFD43B" stroke={INK} strokeWidth={3} />
			{[-44, -15, 15, 44].map((angle) => (
				<path
					key={angle}
					d={PETAL}
					transform={`rotate(${angle}) scale(0.72)`}
					fill="url(#petal-front)"
					stroke={INK}
					strokeWidth={4}
					strokeLinejoin="round"
				/>
			))}
		</g>
	</g>
);

export const FloatingPad: React.FC<FloatingProps> = ({x, y, scale, bob}) => (
	<g transform={`translate(${x}, ${y + bob}) scale(${scale})`}>
		<LilyPad />
	</g>
);

type Ripples = {readonly frame: number; readonly x: number; readonly y: number};

export const Ripples: React.FC<Ripples> = ({frame, x, y}) => (
	<g>
		{[0, 30].map((offset) => {
			const t = ((frame + offset) % 60) / 60;
			return (
				<ellipse
					key={offset}
					cx={x}
					cy={y}
					rx={130 + 80 * t}
					ry={38 + 24 * t}
					fill="none"
					stroke="#FFFFFF"
					strokeWidth={4}
					opacity={(1 - t) * 0.6}
				/>
			);
		})}
	</g>
);

const Cattail: React.FC<{
	readonly x: number;
	readonly h: number;
	readonly lean: number;
	readonly sway: number;
}> = ({x, h, lean, sway}) => (
	<g transform={`translate(${x}, ${bankEdge(x) + 20}) rotate(${lean + sway})`}>
		<path
			d={`M -8 0 Q ${-lean * 3} ${-h * 0.5} ${-lean * 4 - 18} ${-h * 0.75} Q ${-lean * 2} ${-h * 0.45} 8 0 Z`}
			fill="#6CC24A"
			stroke={INK}
			strokeWidth={3}
			strokeLinejoin="round"
		/>
		<line x1={0} y1={0} x2={0} y2={-h} stroke="#4E9F3D" strokeWidth={7} strokeLinecap="round" />
		<line x1={0} y1={-h} x2={0} y2={-h - 34} stroke="#4E9F3D" strokeWidth={4} strokeLinecap="round" />
		<rect x={-11} y={-h - 10} width={22} height={64} rx={11} fill="#9C6B3F" stroke={INK} strokeWidth={4} />
	</g>
);

const CATTAILS = [
	{x: 30, h: 250, lean: -8},
	{x: 75, h: 320, lean: 2},
	{x: 120, h: 230, lean: 10},
	{x: 1000, h: 240, lean: -6},
	{x: 1050, h: 300, lean: 6},
];

export const Cattails: React.FC<{readonly frame: number}> = ({frame}) => (
	<g>
		{CATTAILS.map((c, i) => (
			<Cattail key={c.x} x={c.x} h={c.h} lean={c.lean} sway={wave(frame, 100, i) * 3} />
		))}
	</g>
);

const BANK_POINTS = Array.from({length: 57}, (_, i) => {
	const x = -20 + i * 20;
	return `${x} ${bankEdge(x).toFixed(1)}`;
});

const TUFTS = Array.from({length: 30}, (_, i) => ({
	id: i,
	x: 10 + i * 37 + random(`tuft-x-${i}`) * 14,
	h: 18 + random(`tuft-h-${i}`) * 16,
}));

const FLOWER_COLORS = ['#FFFFFF', '#FFB3D1', '#D7C2FF', '#FFF1A8'];

const FLOWERS = Array.from({length: 22}, (_, i) => {
	const y = 1450 + random(`flower-y-${i}`) * 440;
	return {
		id: i,
		x: 30 + random(`flower-x-${i}`) * 1020,
		y,
		scale: 0.55 + ((y - 1450) / 440) * 0.6,
		color: FLOWER_COLORS[i % FLOWER_COLORS.length],
	};
});

const PATCHES = [
	{cx: 180, cy: 1560, rx: 160, ry: 40},
	{cx: 820, cy: 1500, rx: 190, ry: 36},
	{cx: 520, cy: 1820, rx: 240, ry: 50},
];

const Daisy: React.FC<{
	readonly x: number;
	readonly y: number;
	readonly scale: number;
	readonly sway: number;
	readonly color: string;
}> = ({x, y, scale, sway, color}) => (
	<g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${sway})`}>
		<path d="M 0 0 Q -4 -20 0 -40" stroke="#3E8E2F" strokeWidth={5} fill="none" strokeLinecap="round" />
		<g transform="translate(0, -40)">
			{[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
				<ellipse
					key={angle}
					cx={0}
					cy={-15}
					rx={8}
					ry={14}
					transform={`rotate(${angle})`}
					fill={color}
					stroke={INK}
					strokeWidth={3}
				/>
			))}
			<circle r={10} fill="#FFC93C" stroke={INK} strokeWidth={3} />
		</g>
	</g>
);

export const Bank: React.FC<{readonly frame: number}> = ({frame}) => (
	<g>
		<path d={`M -20 1960 L ${BANK_POINTS.join(' L ')} L 1100 1960 Z`} fill="url(#lake-bank)" />
		{PATCHES.map((p) => (
			<ellipse key={p.cx} {...p} fill="#C5F08A" opacity={0.45} />
		))}
		<path
			d={`M ${BANK_POINTS.join(' L ')}`}
			fill="none"
			stroke={INK}
			strokeWidth={6}
			strokeLinejoin="round"
		/>
		{TUFTS.map((t) => {
			const y = bankEdge(t.x) + 4;
			const sway = wave(frame, 75, t.id) * 4;
			return (
				<path
					key={t.id}
					d={`M ${t.x - 8} ${y} L ${t.x - 14 + sway} ${y - t.h * 0.8} M ${t.x} ${y} L ${t.x + sway} ${y - t.h} M ${t.x + 8} ${y} L ${t.x + 14 + sway} ${y - t.h * 0.75}`}
					stroke="#5DBB3F"
					strokeWidth={6}
					strokeLinecap="round"
				/>
			);
		})}
		{FLOWERS.map((f) => (
			<Daisy
				key={f.id}
				x={f.x}
				y={f.y}
				scale={f.scale}
				color={f.color}
				sway={wave(frame, 100, f.id) * 6}
			/>
		))}
	</g>
);

const BLADES = Array.from({length: 30}, (_, i) => ({
	id: i,
	x: -10 + i * 38,
	h: 60 + random(`blade-h-${i}`) * 90,
	lean: (random(`blade-l-${i}`) - 0.5) * 40,
	color: i % 2 === 0 ? '#4CAF50' : '#66BB45',
}));

export const ForegroundGrass: React.FC<{readonly frame: number}> = ({frame}) => (
	<g>
		{BLADES.map((b) => (
			<g key={b.id} transform={`translate(${b.x}, ${HEIGHT + 10}) rotate(${wave(frame, 60, b.id) * 4})`}>
				<path
					d={`M -14 0 Q -6 ${-b.h * 0.6} ${b.lean} ${-b.h} Q 6 ${-b.h * 0.5} 14 0 Z`}
					fill={b.color}
					stroke={INK}
					strokeWidth={3}
					strokeLinejoin="round"
				/>
			</g>
		))}
		<rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="url(#lake-vignette)" />
	</g>
);
