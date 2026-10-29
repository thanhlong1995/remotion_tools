import type React from 'react';
import {fontFamily, INK} from '../theme';

export const GROUND_Y = 960;
// One room of the boarding house: door, barred window, air-con unit, pot plant and a power pole
export const TILE = 1120;
const LINE = 2.5;
const SKY_TOP = -600;
const GROUND_BOTTOM = 1500;

const C = {
	sky: '#D3E7F1',
	wall: '#EFE2B6',
	wallTop: '#D8C792',
	baseboard: '#CDBB88',
	stain: '#D9CA98',
	door: '#5B8DB8',
	doorDark: '#4A779F',
	frame: '#8C9AA6',
	plaque: '#FBF8EE',
	glass: '#BFD9E6',
	curtain: '#E9A6B8',
	bars: '#3A3A3A',
	sill: '#BDB29A',
	ac: '#F1F0EA',
	acDark: '#C9C8C0',
	pot: '#C46A45',
	potDark: '#A2553A',
	leaf: '#6FA86B',
	leafDark: '#4F8A52',
	pole: '#A3A29C',
	wire: '#2E2E2E',
	ground: '#CBC5BA',
	groundDark: '#B6AFA3',
	curb: '#BDB6A9',
	step: '#BAB4A8',
	gate: '#4F6B5E',
	gateDark: '#3C5248',
	sign: '#B8443B',
	courtyard: '#8F8A80',
	night: '#141B33',
	windowLit: '#FFE3A0',
	lampMetal: '#5E6670',
	bulbOff: '#D9D6CC',
	bulbOn: '#FFF4C2',
	glow: '#FFE9A8',
} as const;

const PotPlant: React.FC<{x: number}> = ({x}) => (
	<g transform={`translate(${x}, ${GROUND_Y})`}>
		{[
			[-34, -120, -30],
			[30, -126, 28],
			[0, -150, 0],
			[-16, -100, -60],
			[22, -98, 60],
		].map(([lx, ly, a]) => (
			<ellipse
				key={`${lx}${ly}`}
				cx={lx}
				cy={ly}
				rx={16}
				ry={44}
				transform={`rotate(${a}, ${lx}, ${ly})`}
				fill={a === 0 ? C.leafDark : C.leaf}
				stroke={INK}
				strokeWidth={LINE}
			/>
		))}
		<path d="M -46 -78 L 46 -78 L 36 0 L -36 0 Z" fill={C.pot} stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
		<rect x={-52} y={-90} width={104} height={16} rx={4} fill={C.potDark} stroke={INK} strokeWidth={LINE} />
	</g>
);

const Wall: React.FC = () => (
	<g>
		<rect x={0} y={128} width={TILE} height={GROUND_Y - 128} fill={C.wall} />
		<rect x={0} y={116} width={TILE} height={22} fill={C.wallTop} stroke={INK} strokeWidth={LINE} />
		<rect x={0} y={GROUND_Y - 42} width={TILE} height={42} fill={C.baseboard} />
		<path d={`M 0 ${GROUND_Y - 42} L ${TILE} ${GROUND_Y - 42}`} stroke={INK} strokeWidth={LINE} />
		{/* Damp stains and a crack: the wall has seen a few rainy seasons */}
		<path d="M 520 140 Q 540 220 528 300 Q 520 340 540 380" fill="none" stroke={C.stain} strokeWidth={10} strokeLinecap="round" opacity={0.7} />
		<path d="M 980 620 L 1000 660 L 990 690 L 1012 730" fill="none" stroke={INK} strokeWidth={1.5} opacity={0.4} />
	</g>
);

const Room: React.FC<{index: number}> = ({index}) => (
	<g>
		<Wall />
		{/* Blue iron door with the room number above */}
		<rect x={110} y={292} width={380} height={GROUND_Y - 292} fill={C.frame} stroke={INK} strokeWidth={LINE} />
		<rect x={128} y={310} width={344} height={GROUND_Y - 310} fill={C.door} stroke={INK} strokeWidth={LINE} />
		<path d={`M 300 310 L 300 ${GROUND_Y}`} stroke={INK} strokeWidth={LINE} />
		{[150, 322].map((px) =>
			[340, 560, 760].map((py) => (
				<rect key={`${px}-${py}`} x={px} y={py} width={128} height={py === 340 ? 190 : 170} rx={4} fill="none" stroke={C.doorDark} strokeWidth={4} />
			)),
		)}
		<rect x={278} y={620} width={10} height={42} rx={4} fill="#D9D9D9" stroke={INK} strokeWidth={2} />
		<rect x={312} y={620} width={10} height={42} rx={4} fill="#D9D9D9" stroke={INK} strokeWidth={2} />
		<rect x={250} y={236} width={100} height={42} rx={6} fill={C.plaque} stroke={INK} strokeWidth={LINE} />
		<text x={300} y={266} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={24} fill={INK}>
			{`P.${String(index + 1).padStart(2, '0')}`}
		</text>
		<rect x={92} y={GROUND_Y - 14} width={416} height={14} fill={C.step} stroke={INK} strokeWidth={LINE} />
		{/* Barred window with a curtain */}
		<rect x={600} y={360} width={340} height={300} fill={C.sill} stroke={INK} strokeWidth={LINE} />
		<rect x={616} y={376} width={308} height={268} fill={C.glass} stroke={INK} strokeWidth={LINE} />
		<path d="M 616 376 L 760 376 Q 740 520 770 644 L 616 644 Z" fill={C.curtain} stroke={INK} strokeWidth={LINE} />
		{Array.from({length: 9}, (_, i) => 640 + i * 34).map((bx) => (
			<rect key={bx} x={bx} y={376} width={6} height={268} fill={C.bars} />
		))}
		<rect x={588} y={656} width={364} height={16} fill={C.sill} stroke={INK} strokeWidth={LINE} />
		{/* Air-con unit with its drip pipe */}
		<rect x={662} y={186} width={214} height={94} rx={6} fill={C.ac} stroke={INK} strokeWidth={LINE} />
		{Array.from({length: 7}, (_, i) => 680 + i * 18).map((gx) => (
			<path key={gx} d={`M ${gx} 202 L ${gx} 264`} stroke={C.acDark} strokeWidth={4} />
		))}
		<circle cx={830} cy={233} r={30} fill={C.acDark} stroke={INK} strokeWidth={LINE} />
		<path d="M 870 280 Q 880 320 872 360" fill="none" stroke={INK} strokeWidth={2} />
		<PotPlant x={1000} />
	</g>
);

// The entrance: a sign over a wide sliding iron gate. open = 0 shut, 1 fully open
const Gate: React.FC<{open: number}> = ({open}) => {
	const left = 140;
	const width = 760;
	const leaf = width / 2;
	const slide = open * (leaf - 30);
	const bars = (x: number) =>
		Array.from({length: 9}, (_, i) => x + 22 + i * ((leaf - 44) / 8)).map((bx) => (
			<rect key={bx} x={bx - 4} y={300} width={8} height={GROUND_Y - 330} fill={C.gateDark} />
		));
	return (
		<g>
			<Wall />
			{/* Courtyard seen through the gate */}
			<rect x={left} y={290} width={width} height={GROUND_Y - 290} fill={C.courtyard} stroke={INK} strokeWidth={LINE} />
			<rect x={left} y={GROUND_Y - 120} width={width} height={120} fill={C.groundDark} />
			{[left - slide, left + leaf + slide].map((x) => (
				<g key={x}>
					<rect x={x} y={290} width={leaf} height={GROUND_Y - 290} fill="none" stroke={C.gate} strokeWidth={18} />
					{bars(x)}
					<rect x={x} y={560} width={leaf} height={14} fill={C.gate} />
					<rect x={x} y={290} width={leaf} height={GROUND_Y - 290} fill="none" stroke={INK} strokeWidth={LINE} />
				</g>
			))}
			<rect x={left - 30} y={200} width={width + 60} height={76} rx={8} fill={C.sign} stroke={INK} strokeWidth={LINE} />
			<text x={left + width / 2} y={252} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={44} fill="#FFF4D6">
				DÃY TRỌ SỐ 17
			</text>
			<PotPlant x={1000} />
		</g>
	);
};

// Concrete power pole with a tangle of cable and wires slung to the next pole
const Pole: React.FC<{x: number}> = ({x}) => (
	<g>
		{[30, 52, 74, 96].map((y, i) => (
			<path key={y} d={`M ${x} ${y + 20} Q ${x + TILE / 2} ${y + 70 + i * 6} ${x + TILE} ${y + 20}`} fill="none" stroke={C.wire} strokeWidth={2.5} />
		))}
		<rect x={x - 18} y={SKY_TOP} width={36} height={GROUND_Y - SKY_TOP} fill={C.pole} stroke={INK} strokeWidth={LINE} />
		<rect x={x - 46} y={44} width={92} height={14} fill={C.pole} stroke={INK} strokeWidth={LINE} />
		{[0, 1, 2, 3, 4].map((i) => (
			<ellipse
				key={i}
				cx={x + (i % 2 === 0 ? -4 : 6)}
				cy={200 + i * 7}
				rx={34 - i * 3}
				ry={14}
				fill="none"
				stroke={C.wire}
				strokeWidth={3}
				transform={`rotate(${i * 9 - 18}, ${x}, ${200 + i * 7})`}
			/>
		))}
		<path d={`M ${x + 20} 220 Q ${x + 40} 300 ${x + 16} 380`} fill="none" stroke={C.wire} strokeWidth={3} />
	</g>
);

type AlleyProps = {
	// Visible span in world x; tiles outside it are skipped
	readonly left: number;
	readonly right: number;
	// Tile index that shows the entrance gate instead of a room
	readonly gateTile?: number;
	readonly gateOpen?: number;
	// 0 daylight .. 1 deep night
	readonly night?: number;
	// Room lights showing in the windows (only noticeable after dark)
	readonly lit?: boolean;
	// The lamp over the gate: 0 off .. 1 fully on (flicker by animating it)
	readonly lamp?: number;
};

// Lamp on its bracket above the gate sign, and the pool of light it throws
const GateLamp: React.FC<{x: number; on: number}> = ({x, on}) => (
	<g>
		{on > 0.05 ? (
			<g>
				<ellipse cx={x} cy={420} rx={420} ry={520} fill="url(#lamp-glow)" opacity={on} />
				<ellipse cx={x} cy={GROUND_Y + 20} rx={360} ry={50} fill={C.glow} opacity={0.35 * on} />
			</g>
		) : null}
		<path d={`M ${x} 120 L ${x} 150`} stroke={C.lampMetal} strokeWidth={8} />
		<path d={`M ${x - 40} 150 L ${x + 40} 150 L ${x + 26} 172 L ${x - 26} 172 Z`} fill={C.lampMetal} stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
		<ellipse cx={x} cy={182} rx={18} ry={14} fill={on > 0.5 ? C.bulbOn : C.bulbOff} stroke={INK} strokeWidth={LINE} />
	</g>
);

// The alley in front of the boarding house, drawn in world coordinates (y = GROUND_Y is the ground)
export const Alley: React.FC<AlleyProps> = ({left, right, gateTile, gateOpen = 0, night = 0, lit = false, lamp}) => {
	const first = Math.floor(left / TILE) - 1;
	const last = Math.ceil(right / TILE);
	const tiles = Array.from({length: last - first + 1}, (_, i) => first + i);
	return (
		<g>
			<defs>
				<radialGradient id="lamp-glow">
					<stop offset="0" stopColor={C.glow} stopOpacity={0.75} />
					<stop offset="1" stopColor={C.glow} stopOpacity={0} />
				</radialGradient>
			</defs>
			<rect x={left - 10} y={SKY_TOP} width={right - left + 20} height={GROUND_Y - SKY_TOP} fill={C.sky} />
			{tiles.map((i) => (
				<g key={`room-${i}`} transform={`translate(${i * TILE}, 0)`}>
					{i === gateTile ? <Gate open={gateOpen} /> : <Room index={((i % 9) + 9) % 9} />}
				</g>
			))}
			{tiles.map((i) => (
				<Pole key={`pole-${i}`} x={i * TILE + 1080} />
			))}
			<rect x={left - 10} y={GROUND_Y} width={right - left + 20} height={GROUND_BOTTOM - GROUND_Y} fill={C.ground} />
			<rect x={left - 10} y={GROUND_Y} width={right - left + 20} height={12} fill={C.curb} />
			<path d={`M ${left - 10} ${GROUND_Y} L ${right + 10} ${GROUND_Y}`} stroke={INK} strokeWidth={LINE} />
			{Array.from({length: Math.ceil((right - left) / 280) + 2}, (_, i) => (Math.floor(left / 280) + i) * 280).map((jx) => (
				<path key={jx} d={`M ${jx} ${GROUND_Y + 12} L ${jx - 40} 1120`} stroke={C.groundDark} strokeWidth={3} />
			))}
			{night > 0 ? (
				<rect x={left - 10} y={SKY_TOP} width={right - left + 20} height={GROUND_BOTTOM - SKY_TOP} fill={C.night} opacity={0.62 * night} />
			) : null}
			{night > 0 && lit
				? tiles
						.filter((i) => i !== gateTile)
						.map((i) => (
							<g key={`lit-${i}`} transform={`translate(${i * TILE}, 0)`} opacity={Math.min(1, night * 1.4)}>
								<rect x={616} y={376} width={308} height={268} fill={C.windowLit} opacity={0.85} />
								{Array.from({length: 9}, (_, k) => 640 + k * 34).map((bx) => (
									<rect key={bx} x={bx} y={376} width={6} height={268} fill={C.bars} />
								))}
							</g>
						))
				: null}
			{gateTile !== undefined && lamp !== undefined ? <GateLamp x={gateTile * TILE + 520} on={lamp} /> : null}
		</g>
	);
};

// Window centre of a room tile, for putting someone at it
export const windowOf = (tile: number) => ({x: tile * TILE + 770, y: 510});

// Draws the window bars again on top of whoever stands behind them
export const WindowBars: React.FC<{tile: number}> = ({tile}) => (
	<g transform={`translate(${tile * TILE}, 0)`}>
		{Array.from({length: 9}, (_, k) => 640 + k * 34).map((bx) => (
			<rect key={bx} x={bx} y={376} width={6} height={268} fill={C.bars} />
		))}
		<rect x={588} y={656} width={364} height={16} fill={C.sill} stroke={INK} strokeWidth={LINE} />
	</g>
);

// Darkness laid over the characters after dark, with a pool of light under the gate lamp
export const NightVeil: React.FC<{left: number; right: number; night: number; lampX?: number; lamp?: number}> = ({
	left,
	right,
	night,
	lampX,
	lamp = 0,
}) =>
	night > 0 ? (
		<g>
			<defs>
				<radialGradient id="veil-hole" cx={lampX ?? 0} cy={460} r={620} gradientUnits="userSpaceOnUse">
					<stop offset="0" stopColor={C.night} stopOpacity={0.5 * night * (1 - 0.9 * lamp)} />
					<stop offset="0.7" stopColor={C.night} stopOpacity={0.5 * night * (1 - 0.4 * lamp)} />
					<stop offset="1" stopColor={C.night} stopOpacity={0.5 * night} />
				</radialGradient>
			</defs>
			<rect
				x={left - 10}
				y={SKY_TOP}
				width={right - left + 20}
				height={GROUND_BOTTOM - SKY_TOP}
				fill={lampX === undefined ? C.night : 'url(#veil-hole)'}
				opacity={lampX === undefined ? 0.5 * night : 1}
			/>
		</g>
	) : null;
