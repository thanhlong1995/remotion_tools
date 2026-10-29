import type React from 'react';
import {Eye} from '../shared/Eye';
import {INK, OUTLINE} from '../../theme';
import {Parcel} from '../../props/Props';
import type {Cam} from '../../camera';
import {type Box, boxAt} from '../../ui/layout';

export const SHIPPER = {
	skin: '#E2B08A',
	skinShade: '#C9926C',
	hair: '#231E20',
	jacket: '#2E9C9A',
	jacketDark: '#237A78',
	reflect: '#E8ECEC',
	pants: '#3A3F4A',
	shoe: '#2A2A2E',
	helmet: '#F0C23C',
	helmetDark: '#C99A22',
	strap: '#2A2A2E',
	mouth: '#6E2A2A',
	sweat: '#9ED3F0',
	bike: '#C8463E',
	bikeDark: '#9E3530',
	tyre: '#2A2A2E',
	rim: '#B9BEC6',
	chrome: '#D9DDE2',
	seat: '#2F2B2C',
	light: '#FFF2B0',
} as const;

const Wheel: React.FC<{x: number; spin: number}> = ({x, spin}) => (
	<g transform={`translate(${x}, -44)`}>
		<circle r={44} fill={SHIPPER.tyre} stroke={INK} strokeWidth={OUTLINE} />
		<circle r={28} fill={SHIPPER.rim} stroke={INK} strokeWidth={2.5} />
		<g transform={`rotate(${spin})`}>
			{[0, 60, 120].map((a) => (
				<path key={a} d="M -28 0 L 28 0" transform={`rotate(${a})`} stroke={INK} strokeWidth={2.5} />
			))}
		</g>
		<circle r={7} fill={SHIPPER.chrome} stroke={INK} strokeWidth={2} />
	</g>
);

export type ShipperMood = 'rush' | 'panic';

type ShipperBikeProps = {
	readonly mood?: ShipperMood;
	readonly blink?: number;
	readonly mouthOpen?: number;
	// Wheel rotation in degrees
	readonly spin?: number;
	// Rider's lean over the handlebars, degrees
	readonly lean?: number;
	// How many parcels are still on the rack (0-3); the top one wobbles
	readonly parcels?: number;
	readonly wobble?: number;
};

// Draw scale that puts the rider in proportion with the cast (characters are drawn at ~0.75)
export const SHIPPER_SCALE = 1.25;

// Screen box of the bike and rider standing at world (x, y), for keeping captions off him
export const shipperBox = (cam: Cam, x: number, y: number, s = SHIPPER_SCALE): Box =>
	boxAt(cam, x, y, 420 * s, 390 * s, 0.3);

// The delivery guy on his step-through motorbike, side view facing +x; origin on the ground
// between the wheels. Always in a hurry
export const ShipperBike: React.FC<ShipperBikeProps> = ({
	mood = 'rush',
	blink = 1,
	mouthOpen = 0,
	spin = 0,
	lean = 0,
	parcels = 3,
	wobble = 0,
}) => {
	const lid = mood === 'panic' ? 0 : 0.2 + 0.8 * (1 - blink);
	return (
		<g>
			{/* Parcels bungeed to the rear rack */}
			<rect x={-176} y={-176} width={110} height={10} fill={SHIPPER.chrome} stroke={INK} strokeWidth={2.5} />
			{[
				{x: -124, y: -176, w: 104, h: 52},
				{x: -122, y: -228, w: 88, h: 44},
				{x: -118, y: -272, w: 66, h: 38},
			]
				.slice(0, parcels)
				.map((b, i) => (
					<g key={b.y} transform={`translate(${b.x}, ${b.y}) rotate(${i === parcels - 1 ? wobble : 0}, 0, 0)`}>
						<Parcel w={b.w} h={b.h} />
					</g>
				))}
			<Wheel x={-128} spin={spin} />
			<Wheel x={124} spin={spin} />
			{/* Step-through frame, legshield and front fork */}
			<path
				d="M -150 -96 Q -120 -140 -60 -140 L 20 -140 Q 40 -100 70 -100 L 110 -170 L 130 -170 L 136 -100 Q 150 -86 160 -60 L 130 -60 Q 110 -96 80 -86 Q 40 -70 10 -86 L -60 -86 Q -110 -80 -150 -96 Z"
				fill={SHIPPER.bike}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			<path d="M 118 -170 L 124 -44" stroke={SHIPPER.chrome} strokeWidth={8} />
			<path d="M 118 -170 L 124 -44" stroke={INK} strokeWidth={2} opacity={0.5} />
			<path d="M -150 -60 L -40 -60" stroke={SHIPPER.chrome} strokeWidth={9} strokeLinecap="round" />
			<rect x={-110} y={-158} width={120} height={20} rx={10} fill={SHIPPER.seat} stroke={INK} strokeWidth={OUTLINE} />
			<path d="M 104 -196 L 140 -206" stroke={INK} strokeWidth={6} strokeLinecap="round" />
			<ellipse cx={146} cy={-176} rx={12} ry={16} fill={SHIPPER.light} stroke={INK} strokeWidth={3} />
			{/* Rider */}
			<g transform={`rotate(${lean}, -40, -150)`}>
				{/* Legs folded onto the footboard */}
				<path
					d="M -50 -150 L 30 -150 L 40 -80 L 20 -80 L 12 -126 L -50 -126 Z"
					fill={SHIPPER.pants}
					stroke={INK}
					strokeWidth={OUTLINE}
					strokeLinejoin="round"
				/>
				<path d="M 14 -86 L 56 -86 Q 62 -74 50 -70 L 14 -70 Z" fill={SHIPPER.shoe} stroke={INK} strokeWidth={3} />
				{/* Jacket with a reflective band */}
				<path
					d="M -64 -146 Q -70 -220 -40 -270 Q -10 -296 22 -282 Q 44 -260 40 -210 L 30 -146 Z"
					fill={SHIPPER.jacket}
					stroke={INK}
					strokeWidth={OUTLINE}
					strokeLinejoin="round"
				/>
				<path d="M -66 -190 Q -14 -180 36 -192" fill="none" stroke={SHIPPER.reflect} strokeWidth={8} />
				{/* Arms out to the handlebar */}
				<path d="M -6 -262 Q 40 -240 100 -206" fill="none" stroke={INK} strokeWidth={26} strokeLinecap="round" />
				<path
					d="M -6 -262 Q 40 -240 100 -206"
					fill="none"
					stroke={SHIPPER.jacket}
					strokeWidth={19}
					strokeLinecap="round"
				/>
				<circle cx={104} cy={-204} r={12} fill={SHIPPER.skin} stroke={INK} strokeWidth={3} />
				{/* Head in a half helmet, caricature-sized like the rest of the cast */}
				<g transform="translate(6, -282) scale(1.4)">
					<path
						d="M -30 -10 C -34 -50 -6 -66 18 -60 C 40 -54 48 -30 44 -10 C 42 8 30 16 14 16 C -6 16 -26 8 -30 -10 Z"
						fill={SHIPPER.skin}
						stroke={INK}
						strokeWidth={OUTLINE}
					/>
					<path
						d="M 42 -22 Q 56 -16 50 -6 Q 46 -2 42 -4"
						fill={SHIPPER.skin}
						stroke={INK}
						strokeWidth={3}
						strokeLinejoin="round"
					/>
					<Eye
						x={26}
						y={-20}
						rx={7.5}
						ry={7}
						lid={lid}
						lidColor={SHIPPER.skin}
						pupilX={2.5}
						pupilR={mood === 'panic' ? 1.8 : 2.6}
						stroke={2.5}
					/>
					<path
						d={mood === 'panic' ? 'M 18 -36 L 34 -30' : 'M 18 -32 L 34 -33'}
						stroke={SHIPPER.hair}
						strokeWidth={4}
						strokeLinecap="round"
					/>
					{mouthOpen > 0.08 || mood === 'panic' ? (
						<ellipse
							cx={38}
							cy={4}
							rx={6}
							ry={3 + Math.max(mouthOpen, mood === 'panic' ? 0.8 : 0) * 5}
							fill={SHIPPER.mouth}
							stroke={INK}
							strokeWidth={2.5}
						/>
					) : (
						<path d="M 32 4 L 44 3" stroke={INK} strokeWidth={3} strokeLinecap="round" />
					)}
					<path
						d="M -32 -14 C -34 -60 0 -78 30 -66 C 46 -58 52 -44 48 -30 L -32 -24 Z"
						fill={SHIPPER.helmet}
						stroke={INK}
						strokeWidth={OUTLINE}
						strokeLinejoin="round"
					/>
					<path d="M -32 -26 L 50 -30" stroke={SHIPPER.helmetDark} strokeWidth={5} />
					<path d="M -8 -24 L 4 14" stroke={SHIPPER.strap} strokeWidth={3} />
					<path
						d="M -22 -40 Q -6 -58 20 -58"
						fill="none"
						stroke="#FFFFFF"
						strokeWidth={4}
						strokeLinecap="round"
						opacity={0.6}
					/>
					<path d="M -30 2 Q -36 -6 -32 -12" fill="none" stroke={SHIPPER.hair} strokeWidth={5} strokeLinecap="round" />
					<path d="M 50 -40 Q 58 -28 52 -22 Q 46 -28 50 -40 Z" fill={SHIPPER.sweat} stroke={INK} strokeWidth={1.8} />
				</g>
			</g>
		</g>
	);
};
