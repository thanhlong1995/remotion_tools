import type React from 'react';
import {Cheek, Eye, Fluff} from './parts';
import {INK, OUTLINE} from './theme';

const FUR = '#FFFFFF';
const EAR = '#F7D9BF';

type PuppyProps = {
	readonly squash: number;
	readonly tailAngle: number;
	readonly earAngle: number;
	readonly headTilt: number;
	readonly blink: number;
	readonly lookX: number;
	readonly lookY: number;
	readonly mouthOpen: number;
};

// Fluffy white puppy facing right; the origin sits between its feet on the ground
export const Puppy: React.FC<PuppyProps> = ({
	squash,
	tailAngle,
	earAngle,
	headTilt,
	blink,
	lookX,
	lookY,
	mouthOpen,
}) => {
	const eyeX = lookX * 5;
	const eyeY = lookY * 4;
	const tongue = 52 + mouthOpen * 10;
	return (
		<g transform={`scale(${2 - squash}, ${squash})`}>
			<g transform={`translate(-100, -128) rotate(${tailAngle})`}>
				<Fluff cx={-26} cy={-18} rx={18} ry={12} puffs={6} puffR={16} fill={FUR} />
			</g>
			{[-78, -28, 38, 88].map((x) => (
				<ellipse
					key={x}
					cx={x}
					cy={-22}
					rx={24}
					ry={26}
					fill={FUR}
					stroke={INK}
					strokeWidth={OUTLINE}
				/>
			))}
			<Fluff cx={0} cy={-112} rx={92} ry={52} puffs={12} puffR={30} fill={FUR} />
			<g transform={`translate(78, -222) rotate(${headTilt})`}>
				<Fluff cx={0} cy={0} rx={64} ry={54} puffs={12} puffR={30} fill={FUR} />
				<g transform={`translate(-60, -36) rotate(${16 + earAngle})`}>
					<ellipse cx={0} cy={44} rx={24} ry={48} fill={EAR} stroke={INK} strokeWidth={OUTLINE} />
				</g>
				<g transform={`translate(66, -36) rotate(${-16 - earAngle})`}>
					<ellipse cx={0} cy={44} rx={24} ry={48} fill={EAR} stroke={INK} strokeWidth={OUTLINE} />
				</g>
				<ellipse cx={34} cy={-6} rx={24} ry={22} fill={EAR} opacity={0.7} />
				<ellipse cx={6} cy={32} rx={36} ry={25} fill="#FFF4EA" />
				<Cheek x={-44} y={26} rx={14} ry={9} />
				<Cheek x={58} y={26} rx={14} ry={9} />
				<Eye x={-24 + eyeX} y={-6 + eyeY} rx={11} ry={14} blink={blink} />
				<Eye x={34 + eyeX} y={-6 + eyeY} rx={11} ry={14} blink={blink} />
				<path
					d={`M -2 38 Q -2 ${tongue} 6 ${tongue} Q 14 ${tongue} 14 38 Z`}
					fill="#FF7FA0"
					stroke={INK}
					strokeWidth={3.5}
					strokeLinejoin="round"
				/>
				<path
					d="M 6 24 L 6 32 M -10 32 Q -2 42 6 32 Q 14 42 22 32"
					fill="none"
					stroke={INK}
					strokeWidth={4}
					strokeLinecap="round"
				/>
				<ellipse cx={6} cy={18} rx={13} ry={9} fill={INK} />
				<ellipse cx={2} cy={15} rx={4.5} ry={2.5} fill="#FFFFFF" opacity={0.8} />
			</g>
		</g>
	);
};
