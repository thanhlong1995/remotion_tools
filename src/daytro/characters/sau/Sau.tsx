import type React from 'react';
import {Arm, ARM_REST, type ArmPose, type ArmShape, type Side, SIDES} from '../shared/Arm';
import {INK, OUTLINE} from '../../theme';
import {SauHead, type SauMood} from './SauHead';
import {SAU} from './palette';
import {SteppedLegs} from '../shared/SteppedLegs';

const SHOULDER = {x: 58, y: -616};
// Long, skinny arms to match the rest of him
const ARM: ArmShape = {upper: 160, fore: 148, width: 22, hand: 16, sleeve: 50};
const HEAD = {y: -688, scale: 1.25};
// Elbow cocked high, hand clapped over his mouth: snickering
export const SAU_COVER_POSE: ArmPose = {shoulder: 146, elbow: 138};
// The torso was drawn for even longer legs; sitting it lower keeps him lanky without being a giant
const TORSO_DROP = 70;

// "The one that got away": a knotted plastic bag of water with one tiny fish, hanging from the fist
export const FishBag: React.FC = () => (
	<g>
		<path d="M -4 6 Q 0 14 4 6" fill="none" stroke={INK} strokeWidth={2.5} />
		<path
			d="M -6 10 Q -30 30 -28 58 Q -26 80 0 82 Q 26 80 28 58 Q 30 30 6 10 Z"
			fill={SAU.bag}
			stroke={INK}
			strokeWidth={2.5}
			strokeLinejoin="round"
			opacity={0.95}
		/>
		<path d="M -27 50 Q 0 44 27 50 Q 26 80 0 82 Q -26 80 -27 50 Z" fill={SAU.water} />
		<g transform="translate(2, 64)">
			<ellipse cx={0} cy={0} rx={6} ry={3.5} fill={SAU.fish} stroke={INK} strokeWidth={1.2} />
			<path d="M -5 0 L -10 -3 L -10 3 Z" fill={SAU.fish} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
			<circle cx={3} cy={-1} r={0.9} fill={INK} />
		</g>
		<path
			d="M -6 10 Q -30 30 -28 58 Q -26 80 0 82 Q 26 80 28 58 Q 30 30 6 10"
			fill="none"
			stroke={INK}
			strokeWidth={2.5}
		/>
	</g>
);

type SauProps = {
	readonly mood?: SauMood;
	readonly blink?: number;
	readonly lookX?: number;
	readonly lookY?: number;
	readonly mouthOpen?: number;
	readonly headTilt?: number;
	// Named by the side of the screen they are on
	readonly armLeft?: ArmPose;
	readonly armRight?: ArmPose;
	readonly holdFish?: boolean;
	// Screen-right hand over his mouth, drawn in front of the face
	readonly coverMouth?: boolean;
	// Anything else in the screen-right fist, drawn upright
	readonly held?: React.ReactNode;
	// Lift of each foot (screen-left, screen-right) while walking, see frontStep
	readonly legLift?: readonly [number, number];
};

// Chú Sáu, 65, chú Minh's drinking and fishing buddy: tall as a lamp post and thin as a rake,
// slacks hitched up to his ribs yet still too short. Facing the viewer; origin between his feet
export const Sau: React.FC<SauProps> = ({
	mood = 'grin',
	blink = 1,
	lookX = 0,
	lookY = 0,
	mouthOpen = 0,
	headTilt = 0,
	armLeft = ARM_REST,
	armRight = ARM_REST,
	holdFish = false,
	coverMouth = false,
	held,
	legLift,
}) => {
	const left = {side: -1 as Side, pose: armLeft, held: holdFish ? <FishBag /> : undefined};
	const right = {side: 1 as Side, pose: coverMouth ? SAU_COVER_POSE : armRight, held: coverMouth ? undefined : held};
	const arms = coverMouth ? [left] : [left, right];
	const drawArms = (list: typeof arms) =>
		(['ink', 'skin', 'cloth'] as const).map((layer) =>
			list.map((a) => (
				<Arm
					key={`${layer}-${a.side}`}
					side={a.side}
					pose={a.pose}
					layer={layer}
					held={a.held}
					shape={ARM}
					shoulder={SHOULDER}
					skin={SAU.skin}
					sleeve={SAU.polo}
					cuff={SAU.poloDark}
				/>
			)),
		);
	return (
		<g>
			<SteppedLegs hipY={-275} lift={legLift}>
				{/* White socks pulled high, worn with sandals */}
				{SIDES.map((side) => (
					<g key={`leg-${side}`}>
						<rect
							x={side * 22 - 15}
							y={-176}
							width={30}
							height={160}
							rx={12}
							fill={SAU.sock}
							stroke={INK}
							strokeWidth={OUTLINE}
						/>
						<path
							d={`M ${side * 22 - 13} -150 L ${side * 22 + 13} -150 M ${side * 22 - 13} -143 L ${side * 22 + 13} -143`}
							stroke={SAU.sockShade}
							strokeWidth={2.5}
						/>
						<ellipse cx={side * 24} cy={-12} rx={24} ry={11} fill={SAU.sock} stroke={INK} strokeWidth={OUTLINE} />
						<rect
							x={side * 24 - 26}
							y={-6}
							width={52}
							height={8}
							rx={4}
							fill={SAU.sandal}
							stroke={INK}
							strokeWidth={2.5}
						/>
						<path
							d={`M ${side * 24 - 18} -14 L ${side * 24 + 18} -14`}
							stroke={SAU.sandal}
							strokeWidth={6}
							strokeLinecap="round"
						/>
						<path d={`M ${side * 24 - 18} -14 L ${side * 24 + 18} -14`} stroke={INK} strokeWidth={1.2} opacity={0.5} />
					</g>
				))}
				{/* Grey slacks belted up near his chest, ending well above the ankle */}
				<path
					d="M -50 -382 L 50 -382 L 46 -160 Q 46 -152 38 -152 L 10 -152 Q 4 -152 4 -160 L 2 -270 L -2 -270 L -4 -160 Q -4 -152 -10 -152 L -38 -152 Q -46 -152 -46 -160 Z"
					fill={SAU.pants}
					stroke={INK}
					strokeWidth={OUTLINE}
					strokeLinejoin="round"
				/>
				{SIDES.map((side) => (
					<path
						key={`crease-${side}`}
						d={`M ${side * 24} -260 L ${side * 24} -170`}
						stroke={SAU.pantsShade}
						strokeWidth={2.5}
						strokeLinecap="round"
					/>
				))}
			</SteppedLegs>
			<g transform={`translate(0, ${TORSO_DROP})`}>
				{/* Long neck with an Adam's apple */}
				<rect x={-12} y={-696} width={24} height={66} fill={SAU.skin} stroke={INK} strokeWidth={OUTLINE} />
				<path d="M -6 -660 Q 0 -668 6 -660" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
				{/* Faded polo, tucked in, collar popped */}
				<path
					d="M -20 -636 C -40 -632 -54 -626 -60 -612 L -58 -560 C -54 -520 -48 -480 -46 -446 L 46 -446 C 48 -480 54 -520 58 -560 L 60 -612 C 54 -626 40 -632 20 -636 Z"
					fill={SAU.polo}
					stroke={INK}
					strokeWidth={OUTLINE}
					strokeLinejoin="round"
				/>
				<path d="M -8 -634 L 0 -596 L 8 -634 Z" fill={SAU.skin} />
				<path d="M 0 -596 L 0 -568" stroke={SAU.poloDark} strokeWidth={3} />
				{[-610, -588].map((y) => (
					<circle key={y} cx={0} cy={y} r={3} fill="#F4F2EC" stroke={INK} strokeWidth={1.5} />
				))}
				{SIDES.map((side) => (
					<path
						key={`collar-${side}`}
						d={`M ${side * 10} -636 L ${side * 26} -662 L ${side * 30} -630 L ${side * 12} -620 Z`}
						fill={SAU.polo}
						stroke={INK}
						strokeWidth={2.5}
						strokeLinejoin="round"
					/>
				))}
				<rect x={-50} y={-456} width={100} height={12} fill={SAU.belt} stroke={INK} strokeWidth={2.5} />
				<rect x={-7} y={-458} width={14} height={16} rx={2} fill={SAU.buckle} stroke={INK} strokeWidth={2} />
				{/* Sweat towel slung over one shoulder */}
				<path
					d="M -30 -640 Q -44 -634 -50 -620 L -46 -540 Q -38 -536 -30 -540 L -32 -612 Q -22 -628 -6 -636 Z"
					fill={SAU.towel}
					stroke={INK}
					strokeWidth={2.5}
					strokeLinejoin="round"
				/>
				<path d="M -48 -556 L -31 -556 M -48 -548 L -31 -548" stroke={SAU.towelStripe} strokeWidth={3} />
				{drawArms(arms)}
				<g transform={`translate(0, ${HEAD.y}) rotate(${headTilt}) scale(${HEAD.scale})`}>
					<SauHead mood={mood} blink={blink} lookX={lookX} lookY={lookY} mouthOpen={mouthOpen} />
				</g>
				{coverMouth ? drawArms([right]) : null}
			</g>
		</g>
	);
};
