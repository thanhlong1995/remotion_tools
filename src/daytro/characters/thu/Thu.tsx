import type React from 'react';
import {Arm, ARM_REST, type ArmPose, type ArmShape, type Side, SIDES} from '../shared/Arm';
import {INK, OUTLINE} from '../../theme';
import {ThuHead, type ThuMood} from './ThuHead';
import {THU} from './palette';
import {SteppedLegs} from '../shared/SteppedLegs';

const SHOULDER = {x: 60, y: -432};
const ARM: ArmShape = {upper: 112, fore: 104, width: 24, hand: 15, sleeve: 62};
// A bigger head than the adults: she reads younger and cuter
const HEAD = {y: -440, scale: 1.38};
// Where something cupped in both hands sits, for the "holding Mochi" pose
export const THU_CUPPED = {x: 0, y: -366};
export const THU_HOLD_POSE: ArmPose = {shoulder: 14, elbow: -125};

type ThuProps = {
	readonly mood?: ThuMood;
	readonly blink?: number;
	readonly lookX?: number;
	readonly lookY?: number;
	readonly mouthOpen?: number;
	readonly headTilt?: number;
	// Named by the side of the screen they are on
	readonly armLeft?: ArmPose;
	readonly armRight?: ArmPose;
	// Drawn in her cupped hands; use with THU_HOLD_POSE on both arms
	readonly cupped?: React.ReactNode;
	// Lift of each foot (screen-left, screen-right) while walking, see frontStep
	readonly legLift?: readonly [number, number];
};

// Bé Thư, 18, a first-year student up from the countryside. Facing the viewer; origin between her feet
export const Thu: React.FC<ThuProps> = ({
	mood = 'shy',
	blink = 1,
	lookX = 0,
	lookY = 0,
	mouthOpen = 0,
	headTilt = 0,
	armLeft = ARM_REST,
	armRight = ARM_REST,
	cupped,
	legLift,
}) => {
	const arms = [
		{side: -1 as Side, pose: armLeft},
		{side: 1 as Side, pose: armRight},
	];
	return (
		<g>
			<SteppedLegs hipY={-290} lift={legLift}>
				{/* Brown strappy sandals */}
				{SIDES.map((side) => (
					<g key={`leg-${side}`}>
						<rect
							x={side * 22 - 14}
							y={-286}
							width={28}
							height={272}
							rx={12}
							fill={THU.skin}
							stroke={INK}
							strokeWidth={OUTLINE}
						/>
						<ellipse cx={side * 24} cy={-10} rx={20} ry={10} fill={THU.skin} stroke={INK} strokeWidth={OUTLINE} />
						<rect
							x={side * 24 - 24}
							y={-6}
							width={48}
							height={8}
							rx={4}
							fill={THU.sandalDark}
							stroke={INK}
							strokeWidth={2.5}
						/>
						<path
							d={`M ${side * 24 - 16} -12 L ${side * 24 + 16} -12 M ${side * 24 - 12} -22 L ${side * 24 + 12} -22`}
							stroke={THU.sandal}
							strokeWidth={5}
							strokeLinecap="round"
						/>
					</g>
				))}
				<path
					d="M -60 -352 L 60 -352 L 66 -272 Q 66 -266 60 -266 L 8 -266 Q 3 -266 3 -272 L 2 -300 L -2 -300 L -3 -272 Q -3 -266 -8 -266 L -60 -266 Q -66 -266 -66 -272 Z"
					fill={THU.shorts}
					stroke={INK}
					strokeWidth={OUTLINE}
					strokeLinejoin="round"
				/>
				{SIDES.map((side) => (
					<rect
						key={`cuff-${side}`}
						x={side === -1 ? -66 : 3}
						y={-282}
						width={63}
						height={14}
						rx={3}
						fill={THU.cuff}
						stroke={INK}
						strokeWidth={2.5}
					/>
				))}
			</SteppedLegs>
			<rect x={-12} y={-458} width={24} height={30} fill={THU.skin} stroke={INK} strokeWidth={OUTLINE} />
			{/* Oversized pastel tee with a little hamster on it */}
			<path
				d="M -22 -446 C -46 -442 -60 -436 -64 -424 L -70 -380 C -74 -360 -74 -342 -70 -326 Q -68 -318 -60 -318 L 60 -318 Q 68 -318 70 -326 C 74 -342 74 -360 70 -380 L 64 -424 C 60 -436 46 -442 22 -446 Z"
				fill={THU.tee}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			<path d="M -15 -447 Q 0 -432 15 -447 Z" fill={THU.skin} />
			<path d="M -16 -447 Q 0 -430 16 -447" fill="none" stroke={THU.teeShade} strokeWidth={4} />
			<g transform="translate(0, -386)">
				{SIDES.map((side) => (
					<circle key={side} cx={side * 14} cy={-16} r={7} fill="#E8B26A" stroke={INK} strokeWidth={2} />
				))}
				<circle cx={0} cy={0} r={20} fill="#E8B26A" stroke={INK} strokeWidth={2.2} />
				<ellipse cx={0} cy={6} rx={12} ry={9} fill="#FBF1E1" />
				{SIDES.map((side) => (
					<circle key={`dot-${side}`} cx={side * 7} cy={-4} r={2.4} fill={INK} />
				))}
				<circle cx={0} cy={3} r={1.8} fill="#F09AA2" />
			</g>
			{(['ink', 'skin', 'cloth'] as const).map((layer) =>
				arms.map((a) => (
					<Arm
						key={`${layer}-${a.side}`}
						side={a.side}
						pose={a.pose}
						layer={layer}
						shape={ARM}
						shoulder={SHOULDER}
						skin={THU.skin}
						sleeve={THU.tee}
						cuff={THU.teeShade}
					/>
				)),
			)}
			{cupped ? <g transform={`translate(${THU_CUPPED.x}, ${THU_CUPPED.y})`}>{cupped}</g> : null}
			<g transform={`translate(0, ${HEAD.y}) rotate(${headTilt}) scale(${HEAD.scale})`}>
				<ThuHead mood={mood} blink={blink} lookX={lookX} lookY={lookY} mouthOpen={mouthOpen} />
			</g>
		</g>
	);
};
