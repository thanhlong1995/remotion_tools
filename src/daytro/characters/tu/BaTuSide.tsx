import type React from 'react';
import {Arm, type ArmPose, type ArmShape} from '../shared/Arm';
import {Eye} from '../shared/Eye';
import {Leg} from '../shared/Leg';
import type {LegPose} from '../shared/walk';
import {INK, OUTLINE} from '../../theme';
import type {TuMood} from './BaTuHead';
import {TU} from './palette';

const FLORAL = 'tu-side-floral';
const SHOULDER = {x: -4, y: -440};
const ARM: ArmShape = {upper: 128, fore: 118, width: 30, hand: 19, sleeve: 56};
const HEAD_SCALE = 1.15;
const HIP = {y: -200, thigh: 92, shin: 86};
export const TU_LEG_LENGTH = HIP.thigh + HIP.shin;

const CURLS = [
	[-60, -40],
	[-74, -72],
	[-72, -108],
	[-56, -138],
	[-26, -156],
	[8, -160],
	[38, -148],
	[-46, -20],
] as const;
const FRINGE = [
	[10, -134],
	[30, -126],
	[44, -112],
] as const;

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

const Slipper: React.FC<{dark?: boolean}> = ({dark}) => (
	<g>
		<rect x={-16} y={12} width={56} height={9} rx={4.5} fill={TU.slipper} stroke={INK} strokeWidth={OUTLINE} />
		<path d="M -10 13 Q -8 0 6 -2 L 18 -2 Q 30 2 34 13 Z" fill={dark ? TU.skinShade : TU.skin} stroke={INK} strokeWidth={OUTLINE} />
		<path d="M 6 13 Q 10 -4 22 -2 L 26 13 Z" fill={TU.slipper} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
	</g>
);

type HeadProps = {readonly mood: TuMood; readonly blink: number; readonly mouthOpen: number};

// Bà Tư's head in profile, facing +x; the origin is under her chin
export const BaTuSideHead: React.FC<HeadProps> = ({mood, blink, mouthOpen}) => {
	const baseLid = mood === 'yell' || mood === 'happy' ? 1 : mood === 'suspicious' ? 0.6 : 0.4;
	const lid = baseLid >= 0.97 ? 1 : baseLid + (1 - baseLid) * (1 - blink);
	const open = Math.max(mouthOpen, mood === 'yell' ? 1 : mood === 'happy' ? 0.6 : 0);
	return (
		<g>
			<Curls points={CURLS} r={26} />
			<path
				d="M -8 6 C -36 2 -48 -26 -48 -66 C -48 -110 -22 -136 8 -136 C 34 -136 50 -118 50 -94 C 50 -82 48 -74 48 -64 C 48 -54 52 -46 52 -38 C 52 -24 46 -12 36 -4 C 24 6 8 8 -8 6 Z"
				fill={TU.skin}
				stroke={INK}
				strokeWidth={OUTLINE}
			/>
			<Curls points={FRINGE} r={13} />
			{[
				{x: -16, y: -176, a: -12},
				{x: 20, y: -172, a: 14},
			].map((r) => (
				<g key={r.x} transform={`translate(${r.x}, ${r.y}) rotate(${r.a})`}>
					<rect x={-20} y={-12} width={40} height={24} rx={12} fill={TU.roller} stroke={INK} strokeWidth={OUTLINE} />
					{[-8, 0, 8].map((dx) => (
						<path key={dx} d={`M ${dx} -10 L ${dx} 10`} stroke={TU.rollerDark} strokeWidth={2.5} />
					))}
				</g>
			))}
			<ellipse cx={-12} cy={-66} rx={9} ry={14} fill={TU.skin} stroke={INK} strokeWidth={OUTLINE} />
			<circle cx={-12} cy={-50} r={5} fill={TU.gold} stroke={INK} strokeWidth={2} />
			<path
				d={mood === 'yell' ? 'M 22 -104 Q 34 -104 48 -94' : 'M 22 -100 Q 34 -114 48 -101'}
				fill="none"
				stroke={TU.brow}
				strokeWidth={4.5}
				strokeLinecap="round"
			/>
			<Eye x={36} y={-84} rx={8} ry={7} lid={lid} lidColor={TU.skin} pupilX={3} pupilY={1} pupilR={2.8} />
			{lid < 0.97 ? <path d="M 28 -87 l -6 -4" stroke={INK} strokeWidth={2} strokeLinecap="round" /> : null}
			<path d="M 40 -46 Q 36 -36 40 -28" fill="none" stroke={TU.skinShade} strokeWidth={2.2} strokeLinecap="round" />
			<path
				d="M 48 -80 Q 52 -66 62 -58 Q 68 -52 60 -48 Q 54 -46 50 -48"
				fill={TU.skin}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			{/* Glasses perched on the tip of the nose, chain looping back behind the ear */}
			<path d="M 52 -54 Q 20 -36 -10 -48" fill="none" stroke={TU.gold} strokeWidth={2} strokeDasharray="2 4" strokeLinecap="round" />
			<g transform="rotate(-10, 58, -56)">
				<rect x={50} y={-62} width={18} height={12} rx={3} fill="#FFFFFF" opacity={0.4} />
				<path d="M 50 -60 L 68 -60" stroke={TU.frame} strokeWidth={3.5} strokeLinecap="round" />
				<rect x={50} y={-62} width={18} height={12} rx={3} fill="none" stroke={TU.frame} strokeWidth={1.5} opacity={0.7} />
			</g>
			{open >= 0.08 ? (
				<path
					d={`M 52 -42 Q 58 ${-36 + open * 4} 54 ${-28 + open * 12} Q 46 ${-22 + open * 12} 42 ${-30 + open * 6} Z`}
					fill={TU.mouth}
					stroke={TU.lips}
					strokeWidth={4}
					strokeLinejoin="round"
				/>
			) : (
				<path d="M 51 -39 Q 57 -34 52 -28 Q 47 -26 44 -31 Q 48 -34 51 -39 Z" fill={TU.lips} stroke={INK} strokeWidth={2} />
			)}
			<circle cx={38} cy={-20} r={2.4} fill={INK} />
			<path d="M 30 2 Q 18 9 4 7" fill="none" stroke={TU.skinShade} strokeWidth={2.2} strokeLinecap="round" />
		</g>
	);
};

type BaTuSideProps = {
	readonly mood?: TuMood;
	readonly blink?: number;
	readonly mouthOpen?: number;
	readonly headTilt?: number;
	readonly nearLeg: LegPose;
	readonly farLeg: LegPose;
	readonly nearArm: ArmPose;
	readonly farArm: ArmPose;
	readonly bob?: number;
	// Degrees everything above the hips tips forward (+) or back (-)
	readonly lean?: number;
};

// Bà Tư walking, seen from her left side and facing +x; the origin is on the ground under her hips
export const BaTuSide: React.FC<BaTuSideProps> = ({
	mood = 'neutral',
	blink = 1,
	mouthOpen = 0,
	headTilt = 0,
	nearLeg,
	farLeg,
	nearArm,
	farArm,
	bob = 0,
	lean = 0,
}) => {
	const upper = `translate(0, ${bob}) rotate(${lean}, 0, ${HIP.y})`;
	const arm = (pose: ArmPose, far: boolean) =>
		(['ink', 'skin', 'cloth'] as const).map((layer) => (
			<Arm
				key={layer}
				side={1}
				pose={pose}
				layer={layer}
				shape={ARM}
				shoulder={SHOULDER}
				skin={far ? TU.skinShade : TU.skin}
				sleeve={`url(#${FLORAL})`}
				cuff={TU.outfitDark}
			/>
		));
	return (
		<g>
			<defs>
				<pattern id={FLORAL} width={44} height={44} patternUnits="userSpaceOnUse">
					<rect width={44} height={44} fill={TU.outfit} />
					{[
						[11, 11],
						[33, 33],
					].map(([cx, cy]) => (
						<g key={`${cx}`}>
							{[0, 72, 144, 216, 288].map((a) => (
								<circle
									key={a}
									cx={cx + Math.cos((a * Math.PI) / 180) * 4.4}
									cy={cy + Math.sin((a * Math.PI) / 180) * 4.4}
									r={3.4}
									fill={TU.flower}
								/>
							))}
							<circle cx={cx} cy={cy} r={2.4} fill={TU.flowerCenter} />
						</g>
					))}
				</pattern>
			</defs>
			<g transform={upper}>{arm(farArm, true)}</g>
			<Leg x={-4} y={HIP.y + bob} pose={farLeg} thigh={HIP.thigh} shin={HIP.shin} top={74} bottom={64} fill={`url(#${FLORAL})`} foot={<Slipper dark />} />
			<Leg x={4} y={HIP.y + bob} pose={nearLeg} thigh={HIP.thigh} shin={HIP.shin} top={74} bottom={64} fill={`url(#${FLORAL})`} foot={<Slipper />} />
			<g transform={upper}>
				<rect x={-14} y={-504} width={28} height={40} fill={TU.skin} stroke={INK} strokeWidth={OUTLINE} />
				{/* Floral top over a round tummy and a generous seat */}
				<path
					d="M -20 -486 C -40 -480 -50 -466 -52 -440 L -56 -380 C -62 -340 -80 -300 -72 -264 C -68 -250 -60 -244 -50 -244 L 60 -244 C 76 -248 84 -280 76 -320 C 70 -360 52 -400 40 -430 C 32 -456 24 -476 14 -486 Z"
					fill={`url(#${FLORAL})`}
					stroke={INK}
					strokeWidth={OUTLINE}
					strokeLinejoin="round"
				/>
				<path d="M -4 -488 Q 6 -470 18 -486" fill="none" stroke={TU.outfitDark} strokeWidth={4} />
				{/* Hip pocket with the 500k note */}
				<g transform="translate(38, -290) rotate(-14)">
					<rect x={-10} y={-14} width={20} height={18} rx={2} fill={TU.money} stroke={INK} strokeWidth={2} />
				</g>
				<path d="M 18 -286 L 56 -286 L 54 -260 L 20 -260 Z" fill={`url(#${FLORAL})`} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
				{arm(nearArm, false)}
				<g transform={`translate(4, -490) rotate(${headTilt}) scale(${HEAD_SCALE})`}>
					<BaTuSideHead mood={mood} blink={blink} mouthOpen={mouthOpen} />
				</g>
			</g>
		</g>
	);
};
