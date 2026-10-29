import type React from 'react';
import {type Side, SIDES} from '../shared/Arm';
import {Eye} from '../shared/Eye';
import {Fluff} from '../shared/Fluff';
import {INK, OUTLINE} from '../../theme';
import {BONG} from './palette';

export type BongMood = 'snob' | 'yap' | 'scared' | 'selfie';

// lid per side (screen-left first); a heavy, unimpressed lid is her resting face
const FACES: Record<BongMood, {lids: [number, number]; tilt: number; lookY: number; head: number}> = {
	snob: {lids: [0.6, 0.6], tilt: 0, lookY: -2, head: -10},
	yap: {lids: [0.35, 0.35], tilt: -18, lookY: 0, head: 4},
	scared: {lids: [0, 0], tilt: 14, lookY: 0, head: 0},
	selfie: {lids: [0.15, 1], tilt: 0, lookY: 0, head: 8},
};

type HeadProps = {readonly mood: BongMood; readonly blink: number; readonly mouthOpen: number};

// Bông's head: a ball of fluff with a small, haughty face; the origin is under her chin
export const BongHead: React.FC<HeadProps> = ({mood, blink, mouthOpen}) => {
	const face = FACES[mood];
	const ear = mood === 'scared' ? 50 : 0;
	return (
		<g>
			{SIDES.map((side: Side) => (
				<g key={`ear-${side}`} transform={`translate(${side * 28}, -66) rotate(${side * (12 + ear)})`}>
					<path d="M -12 6 L 0 -24 L 12 6 Z" fill={BONG.fur} stroke={INK} strokeWidth={OUTLINE} strokeLinejoin="round" />
					<path d="M -6 2 L 0 -14 L 6 2 Z" fill={BONG.innerEar} />
				</g>
			))}
			<Fluff cx={0} cy={-38} rx={40} ry={34} puffs={14} puffR={13} fill={BONG.fur} />
			<ellipse cx={0} cy={-32} rx={26} ry={22} fill={BONG.furLight} />
			{/* Pink bow, slightly askew */}
			<g transform="translate(16, -74) rotate(18)">
				<path d="M 0 0 L -15 -10 L -15 10 Z M 0 0 L 15 -10 L 15 10 Z" fill={BONG.bow} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
				<circle cx={0} cy={0} r={5} fill={BONG.bowDark} stroke={INK} strokeWidth={2} />
			</g>
			{SIDES.map((side, i) => {
				const lid = face.lids[i] >= 0.97 ? 1 : face.lids[i] + (1 - face.lids[i]) * (1 - blink);
				return (
					<g key={`eye-${side}`}>
						<Eye
							x={side * 11}
							y={-38}
							rx={7}
							ry={6.5}
							lid={lid}
							lidColor={BONG.furLight}
							tilt={side * face.tilt}
							pupilY={face.lookY + 0.5}
							pupilR={mood === 'scared' ? 1.6 : 2.4}
							stroke={2.5}
						/>
						{lid < 0.97 ? (
							<path d={`M ${side * 17} -40 l ${side * 5} -4 M ${side * 15} -43 l ${side * 3} -5`} stroke={INK} strokeWidth={2} strokeLinecap="round" />
						) : null}
					</g>
				);
			})}
			<ellipse cx={0} cy={-26} rx={5} ry={3.8} fill={BONG.nose} />
			{mood === 'selfie' ? (
				<g>
					<path d="M -4 -21 Q -3 -12 2 -11 Q 7 -12 6 -21 Z" fill={BONG.tongue} stroke={INK} strokeWidth={1.8} />
					<path d="M -7 -21 Q 0 -18 7 -21" fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
				</g>
			) : mood === 'yap' || mouthOpen > 0.08 ? (
				<path
					d={`M -7 -21 Q 0 -19 7 -21 Q 5 ${-14 + Math.max(mouthOpen, mood === 'yap' ? 1 : 0) * 4} 0 ${-13 + Math.max(mouthOpen, mood === 'yap' ? 1 : 0) * 5} Q -5 ${-14 + Math.max(mouthOpen, mood === 'yap' ? 1 : 0) * 4} -7 -21 Z`}
					fill={BONG.mouth}
					stroke={INK}
					strokeWidth={2}
					strokeLinejoin="round"
				/>
			) : (
				<path
					d={mood === 'scared' ? 'M -6 -19 Q -3 -22 0 -19 Q 3 -16 6 -19' : 'M -5 -19 Q 0 -21 5 -19'}
					fill="none"
					stroke={INK}
					strokeWidth={2}
					strokeLinecap="round"
				/>
			)}
			{mood === 'scared' ? <path d="M 36 -60 Q 42 -50 37 -45 Q 32 -50 36 -60 Z" fill={BONG.sweat} stroke={INK} strokeWidth={1.8} /> : null}
		</g>
	);
};

type BongProps = {
	readonly mood?: BongMood;
	readonly blink?: number;
	readonly mouthOpen?: number;
	readonly tailWag?: number;
};

// Bông, chị Ngân's Pomeranian, sitting and facing the viewer; the origin is on the ground beneath her
export const Bong: React.FC<BongProps> = ({mood = 'snob', blink = 1, mouthOpen = 0, tailWag = 0}) => (
	<g>
		<g transform={`rotate(${tailWag}, 28, -60)`}>
			<Fluff cx={38} cy={-88} rx={22} ry={18} puffs={9} puffR={12} fill={BONG.fur} phase={0.3} />
		</g>
		<Fluff cx={0} cy={-46} rx={42} ry={36} puffs={12} puffR={14} fill={BONG.fur} />
		<Fluff cx={0} cy={-52} rx={22} ry={20} puffs={8} puffR={9} fill={BONG.cream} outline={false} />
		{SIDES.map((side) => (
			<ellipse key={`paw-${side}`} cx={side * 14} cy={-5} rx={11} ry={7} fill={BONG.cream} stroke={INK} strokeWidth={OUTLINE} />
		))}
		{/* Rhinestone collar */}
		<path d="M -26 -78 Q 0 -66 26 -78 L 24 -70 Q 0 -58 -24 -70 Z" fill={BONG.collar} stroke={INK} strokeWidth={2.5} />
		{[-16, -6, 4, 14].map((x) => (
			<path key={x} d={`M ${x} -72 l 3 -3 l 3 3 l -3 3 Z`} fill={BONG.gem} stroke="#A9B4D6" strokeWidth={1} />
		))}
		<g transform={`translate(0, -66) rotate(${FACES[mood].head})`}>
			<BongHead mood={mood} blink={blink} mouthOpen={mouthOpen} />
		</g>
	</g>
);
