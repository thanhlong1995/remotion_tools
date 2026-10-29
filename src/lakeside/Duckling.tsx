import type React from 'react';
import {Cheek, Eye, Fluff} from './parts';
import {INK, OUTLINE} from './theme';

const DOWN = '#FFD93D';
const WING = '#FFC21A';
const BEAK = '#FF9F1C';
const BEAK_DARK = '#F07800';

type DucklingProps = {
	readonly squash: number;
	readonly wingAngle: number;
	readonly blink: number;
	readonly lookX: number;
	readonly lookY: number;
	readonly beakOpen: number;
};

// Yellow duckling facing the viewer; the origin sits between its feet on the ground
export const Duckling: React.FC<DucklingProps> = ({
	squash,
	wingAngle,
	blink,
	lookX,
	lookY,
	beakOpen,
}) => {
	const eyeX = lookX * 3;
	const eyeY = lookY * 3;
	return (
		<g transform={`scale(${2 - squash}, ${squash})`}>
			<path
				d="M 48 -96 Q 96 -128 94 -84 Q 84 -64 52 -70 Z"
				fill={DOWN}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			<ellipse cx={-26} cy={-2} rx={24} ry={10} fill={BEAK} stroke={INK} strokeWidth={OUTLINE} />
			<ellipse cx={26} cy={-2} rx={24} ry={10} fill={BEAK} stroke={INK} strokeWidth={OUTLINE} />
			<Fluff cx={0} cy={-80} rx={58} ry={44} puffs={10} puffR={26} fill={DOWN} />
			<g transform={`translate(-56, -102) rotate(${wingAngle})`}>
				<ellipse cx={-8} cy={24} rx={18} ry={30} fill={WING} stroke={INK} strokeWidth={OUTLINE} />
			</g>
			<g transform={`translate(56, -102) rotate(${-wingAngle})`}>
				<ellipse cx={8} cy={24} rx={18} ry={30} fill={WING} stroke={INK} strokeWidth={OUTLINE} />
			</g>
			<Fluff cx={0} cy={-178} rx={40} ry={36} puffs={10} puffR={22} fill={DOWN} />
			<path
				d="M -4 -232 Q -16 -258 2 -266 M 4 -232 Q 10 -256 26 -250"
				fill="none"
				stroke={INK}
				strokeWidth={14}
				strokeLinecap="round"
			/>
			<path
				d="M -4 -232 Q -16 -258 2 -266 M 4 -232 Q 10 -256 26 -250"
				fill="none"
				stroke={DOWN}
				strokeWidth={5}
				strokeLinecap="round"
			/>
			<Cheek x={-34} y={-162} rx={10} ry={6} />
			<Cheek x={34} y={-162} rx={10} ry={6} />
			<Eye x={-20 + eyeX} y={-186 + eyeY} rx={9} ry={11} blink={blink} />
			<Eye x={20 + eyeX} y={-186 + eyeY} rx={9} ry={11} blink={blink} />
			<ellipse
				cx={0}
				cy={-158 + beakOpen * 5}
				rx={14}
				ry={6 + beakOpen * 5}
				fill={BEAK_DARK}
				stroke={INK}
				strokeWidth={4}
			/>
			<ellipse cx={0} cy={-165} rx={22} ry={9} fill={BEAK} stroke={INK} strokeWidth={4} />
		</g>
	);
};
