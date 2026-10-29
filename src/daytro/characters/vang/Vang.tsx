import type React from 'react';
import {SIDES} from '../shared/Arm';
import {INK, OUTLINE} from '../../theme';
import {VangHead, type VangMood} from './VangHead';
import {VANG} from './palette';

type VangProps = {
	readonly mood?: VangMood;
	readonly blink?: number;
	readonly lookX?: number;
	readonly lookY?: number;
	readonly mouthOpen?: number;
	readonly headTilt?: number;
	// Degrees the curly tail swings about its root
	readonly tailWag?: number;
	// sit: the usual; paw: right front paw up to shake; lie: flat on his belly; belly: rolled over
	readonly pose?: VangPose;
};

export type VangPose = 'sit' | 'paw' | 'lie' | 'belly';

const TAIL_ROOT = {x: 96, y: -92};
const TAIL = 'M 96 -92 C 160 -100 192 -190 152 -222 C 122 -244 98 -208 122 -192';
// Head and body in near-natural proportion; the comedy is in the face, not chibi cuteness
const HEAD_SCALE = 1.15;

// Vàng, the boarding house's self-appointed guard dog, sitting and facing the viewer.
// The origin sits on the ground under his chest
export const Vang: React.FC<VangProps> = ({
	mood = 'neutral',
	blink = 1,
	lookX = 0,
	lookY = 0,
	mouthOpen = 0,
	headTilt = 0,
	tailWag = 0,
	pose = 'sit',
}) => {
	const head = <VangHead mood={mood} blink={blink} lookX={lookX} lookY={lookY} mouthOpen={mouthOpen} />;
	if (pose === 'lie') {
		// Flat on his belly, chin on his paws, rear end and tail up behind
		return (
			<g>
				<g transform={`rotate(${tailWag}, 70, -60)`}>
					<path
						d="M 70 -60 C 130 -70 150 -130 116 -150 C 90 -164 76 -136 96 -124"
						fill="none"
						stroke={INK}
						strokeWidth={30 + OUTLINE * 2}
						strokeLinecap="round"
					/>
					<path
						d="M 70 -60 C 130 -70 150 -130 116 -150 C 90 -164 76 -136 96 -124"
						fill="none"
						stroke={VANG.fur}
						strokeWidth={30}
						strokeLinecap="round"
					/>
				</g>
				<ellipse cx={0} cy={-58} rx={128} ry={58} fill={VANG.fur} stroke={INK} strokeWidth={OUTLINE} />
				{SIDES.map((side) => (
					<ellipse
						key={side}
						cx={side * 52}
						cy={-12}
						rx={34}
						ry={16}
						fill={VANG.cream}
						stroke={INK}
						strokeWidth={OUTLINE}
					/>
				))}
				<g transform={`translate(0, -40) rotate(${headTilt}) scale(${HEAD_SCALE})`}>{head}</g>
			</g>
		);
	}
	if (pose === 'belly') {
		// Rolled onto his back, paws in the air, head upside down at the side
		return (
			<g>
				{[-70, -30, 30, 70].map((x, i) => (
					<g key={x} transform={`rotate(${(i % 2 ? 1 : -1) * 10 + 4 * Math.sin(tailWag / 6 + i)}, ${x}, -90)`}>
						<rect
							x={x - 17}
							y={-170}
							width={34}
							height={86}
							rx={17}
							fill={VANG.fur}
							stroke={INK}
							strokeWidth={OUTLINE}
						/>
						<ellipse cx={x} cy={-170} rx={22} ry={14} fill={VANG.cream} stroke={INK} strokeWidth={OUTLINE} />
					</g>
				))}
				<ellipse cx={0} cy={-62} rx={132} ry={62} fill={VANG.fur} stroke={INK} strokeWidth={OUTLINE} />
				<ellipse cx={8} cy={-74} rx={92} ry={40} fill={VANG.cream} />
				<g transform={`translate(-150, -40) rotate(${100 + headTilt}) scale(${HEAD_SCALE * 0.9})`}>{head}</g>
			</g>
		);
	}
	return (
		<g>
			<g transform={`rotate(${tailWag}, ${TAIL_ROOT.x}, ${TAIL_ROOT.y})`}>
				<path d={TAIL} fill="none" stroke={INK} strokeWidth={30 + OUTLINE * 2} strokeLinecap="round" />
				<path d={TAIL} fill="none" stroke={VANG.fur} strokeWidth={30} strokeLinecap="round" />
			</g>
			{SIDES.map((side) => (
				<g key={`haunch-${side}`}>
					<ellipse cx={side * 78} cy={-50} rx={58} ry={50} fill={VANG.fur} stroke={INK} strokeWidth={OUTLINE} />
					<ellipse cx={side * 100} cy={-12} rx={36} ry={15} fill={VANG.cream} stroke={INK} strokeWidth={OUTLINE} />
					<path
						d={`M ${side * 92} -18 L ${side * 92} -6 M ${side * 108} -18 L ${side * 108} -6`}
						stroke={INK}
						strokeWidth={3}
						strokeLinecap="round"
					/>
				</g>
			))}
			{/* A well-fed, pear-shaped body */}
			<path
				d="M -58 -205 C -112 -180 -130 -80 -114 -34 C -100 -6 -58 0 0 0 C 58 0 100 -6 114 -34 C 130 -80 112 -180 58 -205 Z"
				fill={VANG.fur}
				stroke={INK}
				strokeWidth={OUTLINE}
			/>
			<ellipse cx={0} cy={-90} rx={64} ry={84} fill={VANG.cream} />
			{SIDES.map((side) => (
				<g key={`leg-${side}`} transform={pose === 'paw' && side === 1 ? 'rotate(-110, 32, -124)' : undefined}>
					<rect
						x={side * 32 - 20}
						y={-124}
						width={38}
						height={112}
						rx={20}
						fill={VANG.fur}
						stroke={INK}
						strokeWidth={OUTLINE}
					/>
					<ellipse cx={side * 34} cy={-12} rx={30} ry={16} fill={VANG.cream} stroke={INK} strokeWidth={OUTLINE} />
					<path
						d={`M ${side * 26} -18 L ${side * 26} -6 M ${side * 42} -18 L ${side * 42} -6`}
						stroke={INK}
						strokeWidth={3}
						strokeLinecap="round"
					/>
				</g>
			))}
			<path
				d="M -62 -226 Q 0 -196 62 -226 L 58 -206 Q 0 -176 -58 -206 Z"
				fill={VANG.collar}
				stroke={INK}
				strokeWidth={4}
				strokeLinejoin="round"
			/>
			<circle cx={0} cy={-182} r={14} fill={VANG.tag} stroke={INK} strokeWidth={4} />
			<path
				d="M -5 -188 L 0 -176 L 5 -188"
				fill="none"
				stroke={INK}
				strokeWidth={3}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<g transform={`translate(0, -206) rotate(${headTilt}) scale(${HEAD_SCALE})`}>{head}</g>
		</g>
	);
};
