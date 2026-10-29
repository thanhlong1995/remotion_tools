import type React from 'react';
import {Eye} from '../shared/Eye';
import type {LegPose} from '../shared/walk';
import {INK, OUTLINE} from '../../theme';
import {VANG} from './palette';

const LEG = {upper: 38, lower: 40};
export const VANG_LEG_LENGTH = LEG.upper + LEG.lower;
// Where the leash clips on, in body coordinates
export const VANG_COLLAR_RING = {x: 70, y: -150};
const HEAD_PIVOT = {x: 62, y: -146};
const TAIL = 'M -74 -128 C -102 -150 -98 -198 -66 -198 C -44 -198 -46 -170 -62 -170';

// One dog leg in profile hanging from (x, y): the paw stays level with the ground
const DogLeg: React.FC<{x: number; y: number; pose: LegPose; far?: boolean}> = ({x, y, pose, far}) => {
	const fur = far ? VANG.furShade : VANG.fur;
	const parts = (paint: React.SVGProps<SVGRectElement>) => (
		<g transform={`translate(${x}, ${y}) rotate(${-pose.hip})`}>
			<rect x={-14} y={-10} width={28} height={LEG.upper + 14} rx={14} {...paint} />
			<g transform={`translate(0, ${LEG.upper}) rotate(${pose.knee})`}>
				<rect x={-11} y={-8} width={22} height={LEG.lower + 8} rx={11} {...paint} />
			</g>
		</g>
	);
	return (
		<g>
			{parts({fill: INK, stroke: INK, strokeWidth: OUTLINE * 2})}
			{parts({fill: fur})}
			<g
				transform={`translate(${x}, ${y}) rotate(${-pose.hip}) translate(0, ${LEG.upper}) rotate(${pose.knee}) translate(0, ${LEG.lower}) rotate(${pose.hip - pose.knee})`}
			>
				<ellipse
					cx={7}
					cy={2}
					rx={17}
					ry={9}
					fill={far ? VANG.furShade : VANG.cream}
					stroke={INK}
					strokeWidth={OUTLINE}
				/>
			</g>
		</g>
	);
};

type HeadProps = {
	readonly blink: number;
	readonly panting: number;
	readonly earBounce: number;
	// 0..1: brows down, muzzle wrinkled, teeth bared (in hot pursuit)
	readonly fierce?: number;
};

// Vàng's head in profile, facing +x; the origin is where it meets the neck
export const VangSideHead: React.FC<HeadProps> = ({blink, panting, earBounce, fierce = 0}) => {
	const angry = fierce > 0.5;
	const lid = angry ? 0.45 : 0.42 + 0.58 * (1 - blink);
	return (
		<g>
			{/* The far ear stands up behind the head */}
			<path
				d="M -18 -48 Q -16 -100 2 -112 Q 16 -98 18 -52 Z"
				fill={VANG.furShade}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			<path
				d="M -30 -10 C -36 -50 -10 -72 20 -70 C 44 -68 56 -54 60 -40 L 92 -34 C 104 -32 108 -20 102 -10 C 96 0 84 2 70 2 L 40 6 C 20 14 -24 10 -30 -10 Z"
				fill={VANG.fur}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			<path
				d="M 52 -36 L 92 -32 C 102 -30 106 -18 100 -10 C 94 -2 82 0 70 0 L 50 4 C 44 -10 44 -26 52 -36 Z"
				fill={VANG.cream}
			/>
			{['M 12 -69 Q 8 -84 0 -88', 'M 18 -70 Q 20 -88 16 -96', 'M 24 -69 Q 30 -82 38 -84'].map((d) => (
				<path key={d} d={d} fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
			))}
			<ellipse cx={34} cy={-58} rx={9} ry={5} fill={VANG.cream} />
			<Eye
				x={36}
				y={-44}
				rx={11}
				ry={10}
				lid={lid}
				lidColor={VANG.fur}
				pupilX={4}
				pupilY={1}
				pupilR={angry ? 3 : 4}
				tilt={angry ? 18 : 0}
			/>
			{angry ? (
				<g>
					{/* Brow clamped down over the eye, and the muzzle wrinkled in a snarl */}
					<path d="M 20 -62 L 52 -50" stroke={INK} strokeWidth={7} strokeLinecap="round" />
					{['M 70 -40 Q 74 -46 78 -40', 'M 80 -38 Q 84 -44 88 -38'].map((d) => (
						<path key={d} d={d} fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
					))}
				</g>
			) : null}
			<g transform="translate(14, -60) rotate(24)">
				<rect x={-13} y={-5} width={26} height={10} rx={4} fill={VANG.plaster} stroke={INK} strokeWidth={2} />
				<rect x={-4} y={-5} width={8} height={10} fill={VANG.plasterPad} />
			</g>
			<ellipse cx={102} cy={-27} rx={9} ry={7} fill={VANG.nose} stroke={INK} strokeWidth={2} />
			{angry ? (
				// Jaws open, a row of teeth bared, drool flying
				<g>
					<path
						d="M 62 -6 Q 82 -2 100 -8 Q 94 16 72 12 Q 62 6 62 -6 Z"
						fill={VANG.mouth}
						stroke={INK}
						strokeWidth={OUTLINE}
						strokeLinejoin="round"
					/>
					<path
						d="M 66 -5 l 4 7 l 4 -7 l 4 7 l 4 -7 l 4 7 l 4 -7 l 4 7 l 4 -7"
						fill="#FFFDF5"
						stroke={INK}
						strokeWidth={1.8}
						strokeLinejoin="round"
					/>
					<path
						d="M 72 10 l 4 -6 l 4 6 l 4 -6 l 4 6"
						fill="#FFFDF5"
						stroke={INK}
						strokeWidth={1.8}
						strokeLinejoin="round"
					/>
					<path d="M 64 8 Q 58 18 62 24 Q 68 20 64 8 Z" fill={VANG.drool} stroke={INK} strokeWidth={1.6} />
				</g>
			) : null}
			{/* Panting: tongue lolls out, the snaggletooth stays on show */}
			{panting > 0.05 && !angry ? (
				<path
					d={`M 66 -2 Q ${68 + panting * 2} ${12 + panting * 14} 78 ${14 + panting * 14} Q 88 ${12 + panting * 12} 84 -2 Z`}
					fill={VANG.tongue}
					stroke={INK}
					strokeWidth={OUTLINE}
					strokeLinejoin="round"
				/>
			) : null}
			<path d="M 100 -8 Q 86 -2 64 -6" fill="none" stroke={INK} strokeWidth={OUTLINE} strokeLinecap="round" />
			<path d="M 86 -6 L 89 -16 L 92 -6 Z" fill="#FFFDF5" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
			{/* The near ear: up at the base, tip flopped forward and bouncing with each step */}
			<g transform="translate(2, -56)">
				<path
					d="M -16 4 Q -12 -30 8 -32 Q 22 -26 20 2 Z"
					fill={VANG.fur}
					stroke={INK}
					strokeWidth={OUTLINE}
					strokeLinejoin="round"
				/>
				<path d="M -8 0 Q -4 -22 8 -24 Q 14 -18 12 0 Z" fill={VANG.innerEar} />
				<g transform={`rotate(${earBounce}, 6, -32)`}>
					<path
						d="M 4 -32 Q 30 -38 42 -16 Q 28 -18 16 -10 Z"
						fill={VANG.furShade}
						stroke={INK}
						strokeWidth={OUTLINE}
						strokeLinejoin="round"
					/>
				</g>
			</g>
		</g>
	);
};

type VangSideProps = {
	readonly blink?: number;
	readonly frontNear: LegPose;
	readonly frontFar: LegPose;
	readonly backNear: LegPose;
	readonly backFar: LegPose;
	readonly bob?: number;
	readonly headBob?: number;
	readonly tailWag?: number;
	readonly earBounce?: number;
	readonly panting?: number;
	// Degrees the whole dog pitches nose-up about his back paws: a lunge
	readonly lean?: number;
	readonly fierce?: number;
};

const PIVOT = {x: -50, y: 0};

// Where the leash ring is once bob, head bob and lean are applied, in the dog's own coordinates
export const vangCollarRing = ({bob = 0, headBob = 0, lean = 0}: {bob?: number; headBob?: number; lean?: number}) => {
	const a = (-lean * Math.PI) / 180;
	const x = VANG_COLLAR_RING.x - PIVOT.x;
	const y = VANG_COLLAR_RING.y + bob + headBob * 0.3 - PIVOT.y;
	return {x: PIVOT.x + x * Math.cos(a) - y * Math.sin(a), y: PIVOT.y + x * Math.sin(a) + y * Math.cos(a)};
};

// Vàng trotting, seen from his left side and facing +x; the origin is on the ground under his belly
export const VangSide: React.FC<VangSideProps> = ({
	blink = 1,
	frontNear,
	frontFar,
	backNear,
	backFar,
	bob = 0,
	headBob = 0,
	tailWag = 0,
	earBounce = 0,
	panting = 0,
	lean = 0,
	fierce = 0,
}) => {
	const hipY = -84 + bob;
	return (
		<g transform={`rotate(${-lean}, ${PIVOT.x}, ${PIVOT.y})`}>
			<DogLeg x={36} y={hipY} pose={frontFar} far />
			<DogLeg x={-56} y={hipY} pose={backFar} far />
			<g transform={`translate(0, ${bob})`}>
				<g transform={`rotate(${tailWag}, -74, -128)`}>
					<path d={TAIL} fill="none" stroke={INK} strokeWidth={20 + OUTLINE * 2} strokeLinecap="round" />
					<path d={TAIL} fill="none" stroke={VANG.fur} strokeWidth={20} strokeLinecap="round" />
				</g>
				{/* A sausage body with a well-fed sag */}
				<path
					d="M -78 -120 C -80 -150 -50 -160 -10 -156 C 30 -152 64 -150 78 -126 C 88 -104 80 -76 56 -66 C 30 -56 -20 -54 -50 -62 C -76 -70 -82 -96 -78 -120 Z"
					fill={VANG.fur}
					stroke={INK}
					strokeWidth={OUTLINE}
				/>
				<path d="M -46 -64 C -20 -56 30 -58 56 -68 C 40 -82 -30 -82 -46 -64 Z" fill={VANG.cream} />
			</g>
			<DogLeg x={-46} y={hipY} pose={backNear} />
			<DogLeg x={46} y={hipY} pose={frontNear} />
			<g transform={`translate(0, ${bob})`}>
				<g transform={`translate(${HEAD_PIVOT.x}, ${HEAD_PIVOT.y + headBob})`}>
					<VangSideHead blink={blink} panting={panting} earBounce={earBounce} fierce={fierce} />
				</g>
				{/* Collar with its tag and the ring the leash clips to */}
				<g transform="translate(64, -134) rotate(-28)">
					<rect x={-8} y={-22} width={16} height={44} rx={7} fill={VANG.collar} stroke={INK} strokeWidth={OUTLINE} />
				</g>
				<circle cx={76} cy={-116} r={7} fill={VANG.tag} stroke={INK} strokeWidth={2.5} />
				<circle
					cx={VANG_COLLAR_RING.x}
					cy={VANG_COLLAR_RING.y + headBob * 0.3}
					r={5}
					fill="none"
					stroke="#9AA0A8"
					strokeWidth={3}
				/>
			</g>
		</g>
	);
};
