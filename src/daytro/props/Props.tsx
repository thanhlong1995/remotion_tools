import type React from 'react';
import {INK, OUTLINE} from '../theme';

const P = {
	table: '#3E7CC0',
	tableDark: '#2F6299',
	plate: '#FBFAF5',
	squid: '#E3A15A',
	chicken: '#B5652E',
	beer: '#E8B33D',
	foam: '#FFF9E8',
	bottle: '#3E8A5A',
	crate: '#E9C23A',
	crateDark: '#C9A12A',
	cap: '#C0392B',
	ice: '#F7F7F2',
	iceShade: '#DCDCD4',
	lid: '#4F86C6',
	bag: '#F4F6F7',
	bagShade: '#D6DCE0',
	box: '#C99A63',
	boxDark: '#A97C49',
	tape: '#E9D7A8',
	smoke: '#FFFFFF',
} as const;

// A glass of beer on ice, drawn standing on its base at the origin
export const BeerGlass: React.FC<{tilt?: number}> = ({tilt = 0}) => (
	<g transform={`rotate(${tilt})`}>
		<path d="M -14 -46 L 14 -46 L 11 0 L -11 0 Z" fill={P.beer} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
		<rect x={-8} y={-30} width={11} height={11} rx={2} fill={P.ice} opacity={0.8} />
		<path d="M -15 -46 Q -8 -56 0 -48 Q 8 -56 15 -46 Z" fill={P.foam} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
	</g>
);

// Cardboard parcel with tape and a label, standing on its base at the origin
export const Parcel: React.FC<{w?: number; h?: number}> = ({w = 70, h = 46}) => (
	<g>
		<rect x={-w / 2} y={-h} width={w} height={h} rx={3} fill={P.box} stroke={INK} strokeWidth={OUTLINE} />
		<rect x={-5} y={-h} width={10} height={h} fill={P.tape} />
		<rect x={-w / 2 + 6} y={-h + 6} width={w * 0.3} height={h * 0.32} fill="#FFFFFF" stroke={INK} strokeWidth={1.2} />
		<path d={`M ${-w / 2} ${-h + 8} L ${w / 2} ${-h + 8}`} stroke={P.boxDark} strokeWidth={2} />
		<rect x={-w / 2} y={-h} width={w} height={h} rx={3} fill="none" stroke={INK} strokeWidth={OUTLINE} />
	</g>
);

// A plastic carrier bag caught by the wind; flap 0..1 crumples it as it tumbles
export const PlasticBag: React.FC<{flap: number}> = ({flap}) => (
	<g transform={`scale(${1 - 0.25 * flap}, ${0.85 + 0.25 * flap})`}>
		<path
			d="M -34 -20 Q -40 30 -26 46 Q 0 56 26 46 Q 40 30 34 -20 Q 20 -14 12 -24 Q 14 -46 6 -48 Q 0 -30 -6 -48 Q -14 -46 -12 -24 Q -20 -14 -34 -20 Z"
			fill={P.bag}
			stroke={INK}
			strokeWidth={3}
			strokeLinejoin="round"
			opacity={0.95}
		/>
		<path d="M -18 0 Q -10 16 -16 30 M 6 -6 Q 14 10 8 28 M 20 4 Q 24 18 18 34" fill="none" stroke={P.bagShade} strokeWidth={3} strokeLinecap="round" />
	</g>
);

// Wavy lines rising from grilled food; t animates them
export const Smoke: React.FC<{t: number; height?: number}> = ({t, height = 90}) => (
	<g>
		{[-14, 6, 24].map((dx, i) => {
			const phase = t * 3 + i * 2;
			const sway = 6 * Math.sin(phase);
			return (
				<path
					key={dx}
					d={`M ${dx} 0 Q ${dx + 10 + sway} ${-height * 0.33} ${dx - sway} ${-height * 0.6} Q ${dx - 10 + sway} ${-height * 0.85} ${dx + sway} ${-height}`}
					fill="none"
					stroke={P.smoke}
					strokeWidth={4}
					strokeLinecap="round"
					opacity={0.75 - i * 0.12}
				/>
			);
		})}
	</g>
);

// Street drinking corner seen from the front: low plastic table with dried squid, grilled chicken
// feet and beer, a stack of crates and a styrofoam ice box in front hiding the drinkers' legs.
// Origin on the ground at the centre of the table. `behind` is drawn between the table and the props
export const NhauTable: React.FC<{t: number; behind?: React.ReactNode}> = ({t, behind}) => (
	<g>
		{behind}
		{/* Table */}
		{[-200, 200].map((x) => (
			<rect key={x} x={x - 7} y={-160} width={14} height={160} fill={P.tableDark} stroke={INK} strokeWidth={2.5} />
		))}
		<rect x={-240} y={-178} width={480} height={22} rx={4} fill={P.table} stroke={INK} strokeWidth={OUTLINE} />
		{/* Dried squid and grilled chicken feet */}
		<ellipse cx={-110} cy={-182} rx={58} ry={12} fill={P.plate} stroke={INK} strokeWidth={2.5} />
		{[-140, -120, -100, -84].map((x, i) => (
			<path key={x} d={`M ${x} -184 l ${18 - i * 3} -10`} stroke={P.squid} strokeWidth={6} strokeLinecap="round" />
		))}
		<ellipse cx={30} cy={-182} rx={56} ry={12} fill={P.plate} stroke={INK} strokeWidth={2.5} />
		{[6, 26, 46].map((x) => (
			<path key={x} d={`M ${x} -186 q 6 -14 2 -22 m -2 22 q -6 -10 -12 -14 m 12 14 q 8 -6 14 -6`} fill="none" stroke={P.chicken} strokeWidth={5} strokeLinecap="round" />
		))}
		<g transform="translate(26, -196)">
			<Smoke t={t} />
		</g>
		<g transform="translate(-200, -178)">
			<BeerGlass />
		</g>
		<g transform="translate(130, -178)">
			<BeerGlass />
		</g>
		<g transform="translate(176, -178)">
			<path d="M -11 0 L 11 0 L 11 -54 Q 11 -66 4 -72 L 4 -92 L -4 -92 L -4 -72 Q -11 -66 -11 -54 Z" fill={P.bottle} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
		</g>
		{/* Crates of beer and the ice box, hiding the drinkers' legs */}
		{[0, -86].map((y) => (
			<g key={y} transform={`translate(-170, ${y})`}>
				<rect x={-90} y={-86} width={180} height={86} rx={6} fill={P.crate} stroke={INK} strokeWidth={OUTLINE} />
				{[-60, -20, 20, 60].map((x) => (
					<rect key={x} x={x - 12} y={-70} width={24} height={26} rx={4} fill={P.crateDark} />
				))}
				{y !== 0
					? [-60, -20, 20, 60].map((x) => <circle key={x} cx={x} cy={-92} r={9} fill={P.cap} stroke={INK} strokeWidth={2} />)
					: null}
			</g>
		))}
		<g transform="translate(130, 0)">
			<rect x={-120} y={-150} width={240} height={150} rx={6} fill={P.ice} stroke={INK} strokeWidth={OUTLINE} />
			<rect x={-126} y={-168} width={252} height={24} rx={6} fill={P.lid} stroke={INK} strokeWidth={OUTLINE} />
			<path d="M -100 -110 L 100 -110 M -100 -60 L 100 -60" stroke={P.iceShade} strokeWidth={4} />
		</g>
	</g>
);

// Aluminium ladder leaning on the wall, seen from the front; origin on the ground at its foot
export const Ladder: React.FC<{height: number}> = ({height}) => {
	const rungs = Array.from({length: Math.floor(height / 62)}, (_, i) => (i + 1) * 62);
	const railAt = (y: number, side: number) => side * (55 - (20 * y) / height);
	return (
		<g>
			{rungs.map((y) => (
				<path key={y} d={`M ${railAt(y, -1)} ${-y} L ${railAt(y, 1)} ${-y}`} stroke="#9FA7B0" strokeWidth={10} />
			))}
			{rungs.map((y) => (
				<path key={`ink-${y}`} d={`M ${railAt(y, -1)} ${-y - 5} L ${railAt(y, 1)} ${-y - 5} M ${railAt(y, -1)} ${-y + 5} L ${railAt(y, 1)} ${-y + 5}`} stroke={INK} strokeWidth={1.5} opacity={0.6} />
			))}
			{[-1, 1].map((side) => (
				<path
					key={side}
					d={`M ${side * 55 - 8} 0 L ${side * 35 - 7} ${-height} L ${side * 35 + 7} ${-height} L ${side * 55 + 8} 0 Z`}
					fill="#C3CAD2"
					stroke={INK}
					strokeWidth={OUTLINE}
					strokeLinejoin="round"
				/>
			))}
		</g>
	);
};

// Wall-mounted breaker box; lever 1 = up (power on), 0 = down (off)
export const BreakerBox: React.FC<{lever: number}> = ({lever}) => (
	<g>
		<rect x={-46} y={-62} width={92} height={124} rx={8} fill="#A9AEB4" stroke={INK} strokeWidth={OUTLINE} />
		<rect x={-30} y={-40} width={60} height={70} rx={4} fill="#7E848C" stroke={INK} strokeWidth={2.5} />
		<g transform={`rotate(${180 * (1 - lever)}, 0, -5)`}>
			<rect x={-7} y={-36} width={14} height={34} rx={5} fill="#2B2628" />
			<circle cx={0} cy={-36} r={8} fill="#D9473C" stroke={INK} strokeWidth={2} />
		</g>
		<path d="M -10 44 L 0 26 L 10 44 Z" fill="#F2C14E" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
	</g>
);

// Red metal toolbox on the ground
export const Toolbox: React.FC = () => (
	<g>
		<path d="M -30 -50 L -30 -64 Q -30 -72 -22 -72 L 22 -72 Q 30 -72 30 -64 L 30 -50" fill="none" stroke={INK} strokeWidth={6} />
		<rect x={-62} y={-52} width={124} height={52} rx={6} fill="#C8463E" stroke={INK} strokeWidth={OUTLINE} />
		<path d="M -62 -34 L 62 -34" stroke="#9E3530" strokeWidth={4} />
		<rect x={-8} y={-40} width={16} height={10} rx={2} fill="#D9DDE2" stroke={INK} strokeWidth={2} />
	</g>
);

// Jagged electric arcs radiating from the origin; seed varies the shape frame to frame
export const Sparks: React.FC<{seed: number; size?: number}> = ({seed, size = 160}) => {
	const rnd = (n: number) => {
		const x = Math.sin(seed * 91.7 + n * 12.9) * 43758.5;
		return x - Math.floor(x);
	};
	const bolts = Array.from({length: 6}, (_, b) => {
		const a = (b / 6) * Math.PI * 2 + rnd(b) * 0.6;
		let d = 'M 0 0';
		for (let k = 1; k <= 4; k++) {
			const r = (size * k) / 4;
			const jitter = (rnd(b * 10 + k) - 0.5) * 0.7;
			d += ` L ${Math.cos(a + jitter) * r} ${Math.sin(a + jitter) * r}`;
		}
		return d;
	});
	return (
		<g>
			{bolts.map((d) => (
				<g key={d}>
					<path d={d} fill="none" stroke="#FFD93D" strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
					<path d={d} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
				</g>
			))}
		</g>
	);
};

// A grilled chicken foot, Vàng's weak spot; origin where it is held, toes pointing up
export const ChickenFoot: React.FC<{scale?: number}> = ({scale = 1}) => (
	<g transform={`scale(${scale})`}>
		<path d="M 0 10 L 0 -30" stroke={INK} strokeWidth={13} strokeLinecap="round" />
		<path d="M 0 10 L 0 -30" stroke="#B5652E" strokeWidth={8} strokeLinecap="round" />
		{[-34, 0, 34].map((a) => (
			<g key={a} transform={`rotate(${a}, 0, -30)`}>
				<path d="M 0 -30 L 0 -56" stroke={INK} strokeWidth={10} strokeLinecap="round" />
				<path d="M 0 -30 L 0 -56" stroke="#C97A3E" strokeWidth={6} strokeLinecap="round" />
			</g>
		))}
	</g>
);

// Hand-lettered cardboard sign taped to a wall; origin at its centre
export const CardboardSign: React.FC<{lines: string[]; fontFamily: string}> = ({lines, fontFamily}) => (
	<g transform="rotate(-3)">
		<rect x={-250} y={-70} width={500} height={140} rx={6} fill="#D9B27C" stroke={INK} strokeWidth={OUTLINE} />
		{[-230, 230].map((x) => (
			<rect key={x} x={x - 22} y={-80} width={44} height={20} fill="#F1E6C8" opacity={0.85} transform={`rotate(${x < 0 ? -30 : 30}, ${x}, -70)`} />
		))}
		{lines.map((line, i) => (
			<text key={line} x={0} y={-12 + i * 52 - ((lines.length - 1) * 26 - 26)} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={46} fill="#B8443B">
				{line}
			</text>
		))}
	</g>
);
