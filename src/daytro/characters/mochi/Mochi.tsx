import type React from 'react';
import {SIDES} from '../shared/Arm';
import {fontFamily, INK, OUTLINE} from '../../theme';
import {MOCHI} from './palette';

export type MochiMood = 'neutral' | 'stuffed' | 'scared' | 'curious';

type MochiProps = {
	readonly mood?: MochiMood;
	readonly blink?: number;
	readonly mouthOpen?: number;
};

// Mochi, bé Thư's hamster: a round golden ball with cheek pouches and buck teeth, holding a
// sunflower seed. The origin is on the ground beneath her
export const Mochi: React.FC<MochiProps> = ({mood = 'neutral', blink = 1, mouthOpen = 0}) => {
	// Cheeks are soft cream patches; stuffed, they bulge out past her outline
	const stuffed = mood === 'stuffed';
	const tilt = mood === 'curious' ? -12 : 0;
	return (
		<g transform={`rotate(${tilt}, 0, -30)`}>
			{SIDES.map((side) => (
				<g key={`ear-${side}`} transform={`rotate(${mood === 'scared' ? side * 30 : 0}, ${side * 20}, -60)`}>
					<circle cx={side * 20} cy={-62} r={10} fill={MOCHI.fur} stroke={INK} strokeWidth={OUTLINE} />
					<circle cx={side * 20} cy={-62} r={5.5} fill={MOCHI.innerEar} />
				</g>
			))}
			<path
				d="M -34 -30 C -36 -56 -20 -70 0 -70 C 20 -70 36 -56 34 -30 C 32 -8 18 0 0 0 C -18 0 -32 -8 -34 -30 Z"
				fill={MOCHI.fur}
				stroke={INK}
				strokeWidth={OUTLINE}
			/>
			<ellipse cx={0} cy={-16} rx={20} ry={15} fill={MOCHI.belly} />
			{SIDES.map((side) =>
				stuffed ? (
					<ellipse key={`cheek-${side}`} cx={side * 26} cy={-26} rx={18} ry={15} fill={MOCHI.belly} stroke={INK} strokeWidth={OUTLINE} />
				) : (
					<ellipse key={`cheek-${side}`} cx={side * 20} cy={-24} rx={11} ry={8} fill={MOCHI.belly} />
				),
			)}
			{stuffed
				? [-1, 1].map((s) => <path key={s} d={`M ${s * 32} -30 l ${s * 4} -6 l ${s * 2} 7 Z`} fill={MOCHI.seed} stroke={INK} strokeWidth={1.2} />)
				: null}
			{/* Big glossy eyes, no whites: the cute kind */}
			{SIDES.map((side) =>
				mood === 'scared' ? (
					<g key={`eye-${side}`}>
						<circle cx={side * 12} cy={-44} r={7} fill="#FFFFFF" stroke={INK} strokeWidth={2.2} />
						<circle cx={side * 12} cy={-44} r={2.6} fill={INK} />
					</g>
				) : (
					<g key={`eye-${side}`} transform={`translate(${side * 12}, -44) scale(1, ${blink})`}>
						<ellipse rx={5.5} ry={6.5} fill={INK} />
						<circle cx={2} cy={-2.5} r={2.2} fill="#FFFFFF" />
						<circle cx={-2} cy={2.5} r={1} fill="#FFFFFF" />
					</g>
				),
			)}
			<ellipse cx={0} cy={-35} rx={3.4} ry={2.6} fill={MOCHI.nose} stroke={INK} strokeWidth={1.4} />
			<path d="M -5 -30 Q -2.5 -27 0 -31 Q 2.5 -27 5 -30" fill="none" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
			{/* Two buck teeth */}
			{mouthOpen > 0.08 || mood === 'scared' ? (
				<ellipse cx={0} cy={-25} rx={3.5} ry={2.5 + mouthOpen * 2} fill={MOCHI.mouth} />
			) : null}
			<rect x={-2.6} y={-29} width={2.4} height={4.5} fill="#FFFFFF" stroke={INK} strokeWidth={1} />
			<rect x={0.2} y={-29} width={2.4} height={4.5} fill="#FFFFFF" stroke={INK} strokeWidth={1} />
			{SIDES.map((side) => (
				<path key={`whisker-${side}`} d={`M ${side * 6} -33 L ${side * 22} -38 M ${side * 6} -31 L ${side * 22} -30`} stroke={INK} strokeWidth={1} strokeLinecap="round" />
			))}
			{/* Front paws clutching a sunflower seed */}
			<g transform="translate(0, -15)">
				<path d="M -4 -6 Q 0 -14 4 -6 L 3 6 Q 0 9 -3 6 Z" fill={MOCHI.seed} stroke={INK} strokeWidth={1.4} />
				<path d="M 0 -10 L 0 6" stroke={MOCHI.seedStripe} strokeWidth={1.4} />
				{SIDES.map((side) => (
					<ellipse key={`paw-${side}`} cx={side * 6} cy={0} rx={4} ry={3.5} fill={MOCHI.paw} stroke={INK} strokeWidth={1.4} />
				))}
			</g>
			{SIDES.map((side) => (
				<ellipse key={`foot-${side}`} cx={side * 14} cy={-2} rx={6} ry={3.5} fill={MOCHI.paw} stroke={INK} strokeWidth={1.6} />
			))}
			{mood === 'scared' ? <path d="M 30 -60 Q 35 -50 31 -46 Q 27 -50 30 -60 Z" fill={MOCHI.sweat} stroke={INK} strokeWidth={1.4} /> : null}
			{mood === 'curious' ? (
				<text x={34} y={-62} fontSize={22} fontWeight={800} fill={INK} fontFamily={fontFamily}>
					?
				</text>
			) : null}
		</g>
	);
};
