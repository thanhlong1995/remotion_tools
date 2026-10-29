import type React from 'react';
import {Cheek} from './parts';
import {INK, OUTLINE} from './theme';

const SKIN = '#7ED957';
const SKIN_DARK = '#58B83A';
const BELLY = '#DDF7B0';

type ArmProps = {
	readonly side: -1 | 1;
	readonly angle: number;
};

// Raised arm cheering; side -1 is the frog's right (screen left)
const Arm: React.FC<ArmProps> = ({side, angle}) => (
	<g transform={`translate(${side * 58}, -70) rotate(${side * (55 + angle)})`}>
		<ellipse cx={0} cy={-30} rx={13} ry={34} fill={SKIN} stroke={INK} strokeWidth={OUTLINE} />
		{[-11, 0, 11].map((fx) => (
			<circle
				key={fx}
				cx={fx}
				cy={fx === 0 ? -80 : -76}
				r={8}
				fill={SKIN}
				stroke={INK}
				strokeWidth={4}
			/>
		))}
		<circle cx={0} cy={-62} r={13} fill={SKIN} stroke={INK} strokeWidth={4} />
	</g>
);

type FrogProps = {
	readonly squash: number;
	readonly armAngle: number;
	readonly cheer: number;
	readonly blink: number;
	readonly lookX: number;
	readonly lookY: number;
};

// Green frog with arms up and a big open smile; the origin is its seat on the lily pad
export const Frog: React.FC<FrogProps> = ({squash, armAngle, cheer, blink, lookX, lookY}) => (
	<g transform={`scale(${2 - squash}, ${squash})`}>
		<ellipse cx={-58} cy={-30} rx={38} ry={28} fill={SKIN} stroke={INK} strokeWidth={OUTLINE} />
		<ellipse cx={58} cy={-30} rx={38} ry={28} fill={SKIN} stroke={INK} strokeWidth={OUTLINE} />
		<ellipse cx={-92} cy={-6} rx={26} ry={10} fill={SKIN_DARK} stroke={INK} strokeWidth={OUTLINE} />
		<ellipse cx={92} cy={-6} rx={26} ry={10} fill={SKIN_DARK} stroke={INK} strokeWidth={OUTLINE} />
		<Arm side={-1} angle={armAngle + cheer} />
		<Arm side={1} angle={-armAngle + cheer} />
		<ellipse cx={0} cy={-62} rx={60} ry={52} fill={SKIN} stroke={INK} strokeWidth={OUTLINE} />
		<ellipse cx={0} cy={-52} rx={40} ry={34} fill={BELLY} />
		<ellipse cx={-30} cy={-8} rx={18} ry={9} fill={SKIN} stroke={INK} strokeWidth={OUTLINE} />
		<ellipse cx={30} cy={-8} rx={18} ry={9} fill={SKIN} stroke={INK} strokeWidth={OUTLINE} />
		<circle cx={-42} cy={-170} r={30 + OUTLINE} fill={INK} />
		<circle cx={42} cy={-170} r={30 + OUTLINE} fill={INK} />
		<ellipse cx={0} cy={-130} rx={80 + OUTLINE} ry={50 + OUTLINE} fill={INK} />
		<circle cx={-42} cy={-170} r={30} fill={SKIN} />
		<circle cx={42} cy={-170} r={30} fill={SKIN} />
		<ellipse cx={0} cy={-130} rx={80} ry={50} fill={SKIN} />
		<circle cx={-56} cy={-140} r={6} fill={SKIN_DARK} />
		<circle cx={62} cy={-136} r={5} fill={SKIN_DARK} />
		<circle cx={50} cy={-150} r={3.5} fill={SKIN_DARK} />
		{[-42, 42].map((x) => (
			<g key={x} transform={`translate(${x}, -172) scale(1, ${blink})`}>
				<circle r={21} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
				<circle cx={lookX * 8} cy={lookY * 7} r={11} fill={INK} />
				<circle cx={lookX * 8 + 4} cy={lookY * 7 - 4} r={4} fill="#FFFFFF" />
			</g>
		))}
		<circle cx={-8} cy={-146} r={2.5} fill={INK} />
		<circle cx={8} cy={-146} r={2.5} fill={INK} />
		<Cheek x={-58} y={-116} rx={12} ry={7} />
		<Cheek x={58} y={-116} rx={12} ry={7} />
		<path
			d="M -46 -126 Q 0 -110 46 -126 Q 0 -62 -46 -126 Z"
			fill="#C2416B"
			stroke={INK}
			strokeWidth={4}
			strokeLinejoin="round"
		/>
		<ellipse cx={0} cy={-102} rx={15} ry={6} fill="#FF8FAB" />
	</g>
);
