import type React from 'react';
import {type Side, SIDES} from '../shared/Arm';
import {Eye} from '../shared/Eye';
import {INK, OUTLINE} from '../../theme';
import {MUOP} from './palette';

export type MuopMood = 'judge' | 'smug' | 'shock' | 'annoyed';

// Narrowed, judging eyes are his resting face
const FACES: Record<MuopMood, {lid: number; tilt: number; slit: boolean; ears: number; shut?: boolean}> = {
	judge: {lid: 0.55, tilt: 0, slit: true, ears: 0},
	smug: {lid: 1, tilt: 0, slit: true, ears: 0, shut: true},
	shock: {lid: 0, tilt: 0, slit: false, ears: -10},
	annoyed: {lid: 0.45, tilt: -16, slit: true, ears: 40},
};

type HeadProps = {readonly mood: MuopMood; readonly blink: number; readonly lookX: number; readonly mouthOpen: number};

// Mướp's head; the origin is under his chin. The screen-left ear has a notch from his street days
export const MuopHead: React.FC<HeadProps> = ({mood, blink, lookX, mouthOpen}) => {
	const face = FACES[mood];
	const lid = face.shut ? 1 : face.lid + (1 - face.lid) * (1 - blink);
	return (
		<g>
			{SIDES.map((side: Side) => (
				<g key={`ear-${side}`} transform={`translate(${side * 30}, -76) rotate(${side * (14 + face.ears)})`}>
					<path
						d={side === -1 ? 'M -18 8 L -6 -16 L -2 -8 L 2 -28 L 18 8 Z' : 'M -18 8 L 0 -28 L 18 8 Z'}
						fill={MUOP.fur}
						stroke={INK}
						strokeWidth={OUTLINE}
						strokeLinejoin="round"
					/>
					<path d="M -9 4 L 0 -14 L 9 4 Z" fill={MUOP.innerEar} />
				</g>
			))}
			{/* Broad tomcat face with cheek ruffs */}
			<path
				d="M -46 -40 C -50 -76 -26 -92 0 -92 C 26 -92 50 -76 46 -40 L 54 -30 L 44 -24 L 48 -14 C 36 -2 18 2 0 2 C -18 2 -36 -2 -48 -14 L -44 -24 L -54 -30 Z"
				fill={MUOP.fur}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			{/* Tabby "M" on the forehead and stripes on the cheeks */}
			<path d="M -16 -66 L -10 -80 L 0 -68 L 10 -80 L 16 -66" fill="none" stroke={MUOP.stripe} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
			{SIDES.map((side) => (
				<path
					key={`stripe-${side}`}
					d={`M ${side * 46} -40 L ${side * 34} -38 M ${side * 46} -30 L ${side * 36} -28`}
					stroke={MUOP.stripe}
					strokeWidth={3.5}
					strokeLinecap="round"
				/>
			))}
			<ellipse cx={0} cy={-18} rx={20} ry={14} fill={MUOP.white} />
			{SIDES.map((side) => (
				<Eye
					key={`eye-${side}`}
					x={side * 18}
					y={-48}
					rx={11}
					ry={9.5}
					lid={lid}
					lidColor={MUOP.fur}
					tilt={side * face.tilt}
					pupilX={lookX * 2}
					pupilR={face.slit ? 1.8 : 4}
					pupilRy={face.slit ? 6.5 : 4}
					iris={MUOP.iris}
					irisR={7.5}
				/>
			))}
			<path d="M -5 -30 L 5 -30 L 0 -24 Z" fill={MUOP.nose} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
			{mood === 'shock' || mouthOpen > 0.08 ? (
				<ellipse cx={0} cy={-14} rx={5} ry={4 + Math.max(mouthOpen, mood === 'shock' ? 1 : 0) * 3} fill={MUOP.mouth} stroke={INK} strokeWidth={2} />
			) : (
				<path
					d={mood === 'smug' ? 'M -9 -20 Q -4 -15 0 -22 Q 4 -15 11 -22' : 'M -8 -18 Q -4 -15 0 -22 Q 4 -15 8 -18'}
					fill="none"
					stroke={INK}
					strokeWidth={2.2}
					strokeLinecap="round"
				/>
			)}
			{SIDES.map((side) => (
				<path
					key={`whiskers-${side}`}
					d={`M ${side * 16} -22 L ${side * 46} -28 M ${side * 16} -18 L ${side * 48} -18 M ${side * 16} -14 L ${side * 44} -8`}
					stroke={MUOP.whisker}
					strokeWidth={1.4}
					strokeLinecap="round"
				/>
			))}
		</g>
	);
};

type MuopProps = {
	readonly mood?: MuopMood;
	readonly blink?: number;
	readonly lookX?: number;
	readonly mouthOpen?: number;
	readonly tailFlick?: number;
};

const TAIL = 'M 34 -16 C 66 -24 72 4 44 8 C 20 11 -12 10 -34 2';

// Mướp, anh Khoa's tabby, sitting upright with his tail wrapped round his paws; origin on the ground
export const Muop: React.FC<MuopProps> = ({mood = 'judge', blink = 1, lookX = 0, mouthOpen = 0, tailFlick = 0}) => (
	<g>
		<path
			d="M -36 -110 C -60 -80 -62 -30 -50 -6 Q 0 6 50 -6 C 62 -30 60 -80 36 -110 Z"
			fill={MUOP.fur}
			stroke={INK}
			strokeWidth={OUTLINE}
			strokeLinejoin="round"
		/>
		{SIDES.map((side) => (
			<path
				key={`band-${side}`}
				d={`M ${side * 52} -70 Q ${side * 40} -66 ${side * 34} -58 M ${side * 56} -44 Q ${side * 44} -40 ${side * 38} -32`}
				fill="none"
				stroke={MUOP.stripe}
				strokeWidth={4}
				strokeLinecap="round"
			/>
		))}
		<path d="M -22 -96 Q 0 -110 22 -96 Q 26 -50 14 -14 L -14 -14 Q -26 -50 -22 -96 Z" fill={MUOP.white} />
		{SIDES.map((side) => (
			<g key={`paw-${side}`}>
				<rect x={side * 15 - 10} y={-58} width={20} height={56} rx={10} fill={MUOP.fur} stroke={INK} strokeWidth={OUTLINE} />
				<ellipse cx={side * 15} cy={-6} rx={13} ry={8} fill={MUOP.white} stroke={INK} strokeWidth={OUTLINE} />
			</g>
		))}
		<g transform={`rotate(${tailFlick}, 34, -16)`}>
			<path d={TAIL} fill="none" stroke={INK} strokeWidth={16 + OUTLINE * 2} strokeLinecap="round" />
			<path d={TAIL} fill="none" stroke={MUOP.fur} strokeWidth={16} strokeLinecap="round" />
			<path d="M 60 -6 L 68 -2 M 52 6 L 56 12 M 10 9 L 12 3" stroke={MUOP.stripe} strokeWidth={3.5} strokeLinecap="round" />
		</g>
		<g transform="translate(0, -100)">
			<MuopHead mood={mood} blink={blink} lookX={lookX} mouthOpen={mouthOpen} />
		</g>
	</g>
);
