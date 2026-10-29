import type React from 'react';
import {Arm, ARM_REST, type ArmPose, type ArmShape, type Side, SIDES} from '../shared/Arm';
import {fontFamily, INK, OUTLINE} from '../../theme';
import {BaTuHead, type TuMood} from './BaTuHead';
import {TU} from './palette';
import {SteppedLegs} from '../shared/SteppedLegs';

const FLORAL = 'tu-floral';
const SHOULDER = {x: 78, y: -440};
const ARM: ArmShape = {upper: 128, fore: 118, width: 30, hand: 19, sleeve: 56};
const HEAD_SCALE = 1.15;

export type TuProp = 'calculator' | 'notebook';

// Pocket calculator, drawn upright and centred a little above the fist holding it
export const Calculator: React.FC = () => (
	<g transform="translate(0, -28) scale(0.75)">
		<rect x={-26} y={-38} width={52} height={74} rx={8} fill={TU.calculator} stroke={INK} strokeWidth={4} />
		<rect x={-18} y={-30} width={36} height={16} rx={3} fill={TU.screen} stroke={INK} strokeWidth={2} />
		{[-6, 6, 18].map((y) => [-12, 0, 12].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r={3.6} fill="#D9DCE2" />))}
	</g>
);

// "Sổ điện nước": the electricity and water ledger
export const Notebook: React.FC = () => (
	<g transform="translate(0, -22) rotate(-8) scale(0.75)">
		<rect x={-34} y={-46} width={68} height={88} rx={6} fill={TU.notebook} stroke={INK} strokeWidth={4} />
		<rect x={-26} y={-34} width={52} height={32} rx={3} fill={TU.paper} />
		<text x={0} y={-21} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={11} fill={INK}>
			SỔ ĐIỆN
		</text>
		<text x={0} y={-8} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={11} fill={INK}>
			NƯỚC
		</text>
	</g>
);

const HELD: Record<TuProp, React.ReactNode> = {
	calculator: <Calculator />,
	notebook: <Notebook />,
};

type BaTuProps = {
	readonly mood?: TuMood;
	readonly blink?: number;
	readonly lookX?: number;
	readonly lookY?: number;
	readonly mouthOpen?: number;
	readonly headTilt?: number;
	// Named by the side of the screen they are on
	readonly armLeft?: ArmPose;
	readonly armRight?: ArmPose;
	readonly holdLeft?: TuProp;
	readonly holdRight?: TuProp;
	// Lift of each foot (screen-left, screen-right) while walking, see frontStep
	readonly legLift?: readonly [number, number];
};

// Bà Tư, 58, the landlady: short and stout in a floral pyjama-style set.
// Facing the viewer; the origin sits between her feet
export const BaTu: React.FC<BaTuProps> = ({
	mood = 'neutral',
	blink = 1,
	lookX = 0,
	lookY = 0,
	mouthOpen = 0,
	headTilt = 0,
	armLeft = ARM_REST,
	armRight = ARM_REST,
	holdLeft,
	holdRight,
	legLift,
}) => {
	const arms = [
		{side: -1 as Side, pose: armLeft, held: holdLeft ? HELD[holdLeft] : undefined},
		{side: 1 as Side, pose: armRight, held: holdRight ? HELD[holdRight] : undefined},
	];
	const armStyle = {shape: ARM, shoulder: SHOULDER, skin: TU.skin, sleeve: `url(#${FLORAL})`, cuff: TU.outfitDark};
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
							<ellipse
								cx={cx + 7}
								cy={cy - 6}
								rx={4}
								ry={2}
								fill={TU.leaf}
								transform={`rotate(-30, ${cx + 7}, ${cy - 6})`}
							/>
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
			<SteppedLegs hipY={-205} lift={legLift}>
				{/* Pink plastic slippers */}
				{SIDES.map((side) => (
					<g key={`foot-${side}`}>
						<ellipse cx={side * 46} cy={-5} rx={32} ry={8} fill={TU.slipper} stroke={INK} strokeWidth={OUTLINE} />
						<ellipse cx={side * 46} cy={-12} rx={23} ry={11} fill={TU.skin} stroke={INK} strokeWidth={OUTLINE} />
						<rect
							x={side * 46 - 25}
							y={-20}
							width={50}
							height={11}
							rx={5}
							fill={TU.slipper}
							stroke={INK}
							strokeWidth={OUTLINE}
						/>
					</g>
				))}
				{/* Wide-legged trousers of the same floral set */}
				<path
					d="M -90 -290 L 90 -290 L 98 -34 Q 98 -24 88 -24 L 14 -24 Q 6 -24 6 -32 L 3 -200 L -3 -200 L -6 -32 Q -6 -24 -14 -24 L -88 -24 Q -98 -24 -98 -34 Z"
					fill={`url(#${FLORAL})`}
					stroke={INK}
					strokeWidth={OUTLINE}
					strokeLinejoin="round"
				/>
			</SteppedLegs>
			<rect x={-16} y={-500} width={32} height={50} fill={TU.skin} stroke={INK} strokeWidth={OUTLINE} />
			<path
				d="M -28 -482 C -54 -478 -70 -470 -76 -454 L -84 -410 C -100 -370 -110 -320 -104 -282 C -102 -272 -96 -266 -88 -264 L 88 -264 C 96 -266 102 -272 104 -282 C 110 -320 100 -370 84 -410 L 76 -454 C 70 -470 54 -478 28 -482 Z"
				fill={`url(#${FLORAL})`}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			<path d="M -24 -483 Q 0 -452 24 -483 Z" fill={TU.skin} />
			<path d="M -25 -483 Q 0 -450 25 -483" fill="none" stroke={TU.outfitDark} strokeWidth={4.5} />
			<path d="M -18 -478 Q 0 -460 18 -478" fill="none" stroke={TU.gold} strokeWidth={2.5} />
			<circle cx={0} cy={-466} r={4} fill={TU.gold} stroke={INK} strokeWidth={1.8} />
			{[-432, -392, -352, -312].map((y) => (
				<circle key={y} cx={0} cy={y} r={4.2} fill={TU.flower} stroke={INK} strokeWidth={1.8} />
			))}
			{/* Hip pockets; a 500k note peeks out of one */}
			<g transform="translate(58, -318) rotate(-12)">
				<rect x={-14} y={-18} width={28} height={24} rx={2} fill={TU.money} stroke={INK} strokeWidth={2.5} />
				<rect x={-9} y={-13} width={8} height={11} rx={2} fill={TU.moneyLight} />
			</g>
			{SIDES.map((side) => (
				<path
					key={`pocket-${side}`}
					d={`M ${side * 36} -314 L ${side * 80} -314 L ${side * 79} -284 L ${side * 38} -284 Z`}
					fill={`url(#${FLORAL})`}
					stroke={INK}
					strokeWidth={2.5}
					strokeLinejoin="round"
				/>
			))}
			{/* Ring of room keys clipped at her hip */}
			<g transform="translate(102, -276)">
				<circle cx={0} cy={0} r={9} fill="none" stroke={TU.gold} strokeWidth={3.5} />
				{[-26, 0, 26].map((a) => (
					<g key={a} transform={`rotate(${a}) translate(0, 10)`}>
						<rect x={-3.5} y={0} width={7} height={20} rx={2} fill="#BFC4CC" stroke={INK} strokeWidth={2} />
						<circle cx={0} cy={4} r={5} fill="#BFC4CC" stroke={INK} strokeWidth={2} />
					</g>
				))}
			</g>
			{(['ink', 'skin', 'cloth'] as const).map((layer) =>
				arms.map((a) => (
					<Arm key={`${layer}-${a.side}`} side={a.side} pose={a.pose} layer={layer} held={a.held} {...armStyle} />
				)),
			)}
			<g transform={`translate(0, -490) rotate(${headTilt}) scale(${HEAD_SCALE})`}>
				<BaTuHead mood={mood} blink={blink} lookX={lookX} lookY={lookY} mouthOpen={mouthOpen} />
			</g>
		</g>
	);
};
