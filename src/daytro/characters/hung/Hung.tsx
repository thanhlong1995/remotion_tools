import type React from 'react';
import {Arm, ARM_REST, type ArmPose, type ArmShape, type Side, SIDES} from '../shared/Arm';
import {INK, OUTLINE} from '../../theme';
import {HungHead, type HungMood} from './HungHead';
import {HUNG, LED} from './palette';
import {SteppedLegs} from '../shared/SteppedLegs';

const LEOPARD = 'hung-leopard';
const SHOULDER = {x: 84, y: -370};
const ARM: ArmShape = {upper: 112, fore: 104, width: 32, hand: 18, sleeve: 58};
const HEAD = {y: -402, scale: 1.3};
// Elbow out, mic to the lips: the karaoke stance
export const HUNG_MIC_POSE: ArmPose = {shoulder: 90, elbow: 152};

// Wireless microphone, angled up towards his mouth from the fist
export const Microphone: React.FC = () => (
	<g transform="rotate(-58)">
		<rect x={-6} y={-34} width={12} height={50} rx={5} fill={HUNG.mic} stroke={INK} strokeWidth={OUTLINE} />
		<circle cx={0} cy={-46} r={13} fill={HUNG.micGrille} stroke={INK} strokeWidth={OUTLINE} />
		<path d="M -9 -50 L 9 -50 M -11 -44 L 11 -44 M -8 -38 L 8 -38" stroke={INK} strokeWidth={1.2} opacity={0.5} />
		<rect x={-7} y={-34} width={14} height={6} fill={HUNG.gold} />
	</g>
);

// Karaoke trolley speaker with LED strips, almost as tall as its owner. Origin on the ground.
// on = false when the power is cut: the LEDs go dark
export const KaraokeSpeaker: React.FC<{on?: boolean}> = ({on = true}) => (
	<g>
		<path
			d="M -50 -420 L -50 -500 L 50 -500 L 50 -420"
			fill="none"
			stroke={INK}
			strokeWidth={10}
			strokeLinejoin="round"
		/>
		<path
			d="M -50 -420 L -50 -500 L 50 -500 L 50 -420"
			fill="none"
			stroke={HUNG.micGrille}
			strokeWidth={5}
			strokeLinejoin="round"
		/>
		<rect x={-85} y={-420} width={170} height={392} rx={14} fill={HUNG.speaker} stroke={INK} strokeWidth={OUTLINE} />
		{LED.map((c, i) => (
			<rect key={c} x={-75 + i * 25} y={-410} width={22} height={10} rx={3} fill={on ? c : '#4A4F59'} />
		))}
		<circle cx={0} cy={-300} r={34} fill={HUNG.speakerDark} stroke={INK} strokeWidth={OUTLINE} />
		<circle cx={0} cy={-300} r={14} fill={HUNG.cone} />
		{Array.from({length: 12}, (_, i) => i).map((i) => {
			const a = (i / 12) * Math.PI * 2;
			return (
				<circle
					key={i}
					cx={Math.cos(a) * 70}
					cy={-148 + Math.sin(a) * 70}
					r={5}
					fill={on ? LED[i % LED.length] : '#4A4F59'}
				/>
			);
		})}
		<circle cx={0} cy={-148} r={62} fill={HUNG.speakerDark} stroke={INK} strokeWidth={OUTLINE} />
		<circle cx={0} cy={-148} r={36} fill={HUNG.cone} stroke={INK} strokeWidth={2} />
		<circle cx={0} cy={-148} r={12} fill={HUNG.speakerDark} />
		{[-40, -10, 20].map((x) => (
			<circle key={x} cx={x + 10} cy={-240} r={6} fill={HUNG.micGrille} stroke={INK} strokeWidth={1.5} />
		))}
		{SIDES.map((side) => (
			<circle key={side} cx={side * 58} cy={-18} r={16} fill={HUNG.speakerDark} stroke={INK} strokeWidth={OUTLINE} />
		))}
	</g>
);

type HungProps = {
	readonly mood?: HungMood;
	readonly blink?: number;
	readonly lookX?: number;
	readonly lookY?: number;
	readonly mouthOpen?: number;
	readonly headTilt?: number;
	// Named by the side of the screen they are on
	readonly armLeft?: ArmPose;
	readonly armRight?: ArmPose;
	// Puts the microphone in the screen-right hand; pair with HUNG_MIC_POSE
	readonly mic?: boolean;
	// Lift of each foot (screen-left, screen-right) while walking, see frontStep
	readonly legLift?: readonly [number, number];
};

// Chú Hùng "Loa", chú Minh's neighbour: short and square, made taller by his hair.
// Facing the viewer; the origin sits between his feet
export const Hung: React.FC<HungProps> = ({
	mood = 'cool',
	blink = 1,
	lookX = 0,
	lookY = 0,
	mouthOpen = 0,
	headTilt = 0,
	armLeft = ARM_REST,
	armRight = ARM_REST,
	mic = false,
	legLift,
}) => {
	const arms = [
		{side: -1 as Side, pose: armLeft, held: undefined},
		{side: 1 as Side, pose: armRight, held: mic ? <Microphone /> : undefined},
	];
	return (
		<g>
			<defs>
				<pattern id={LEOPARD} width={42} height={42} patternUnits="userSpaceOnUse">
					<rect width={42} height={42} fill={HUNG.leopard} />
					{[
						[9, 10, 20],
						[30, 24, -30],
						[14, 34, 60],
					].map(([x, y, a]) => (
						<g key={`${x}${y}`} transform={`rotate(${a}, ${x}, ${y})`}>
							<ellipse cx={x} cy={y} rx={7} ry={5} fill={HUNG.spot} />
							<ellipse cx={x} cy={y} rx={3.5} ry={2.4} fill={HUNG.spotInner} />
						</g>
					))}
					<circle cx={36} cy={6} r={2.2} fill={HUNG.spot} />
					<circle cx={24} cy={40} r={2} fill={HUNG.spot} />
				</pattern>
			</defs>
			<SteppedLegs hipY={-155} lift={legLift}>
				{/* White loafers */}
				{SIDES.map((side) => (
					<g key={`foot-${side}`}>
						<rect
							x={side * 40 - 32}
							y={-12}
							width={64}
							height={12}
							rx={5}
							fill={HUNG.loaferShade}
							stroke={INK}
							strokeWidth={OUTLINE}
						/>
						<path
							d={`M ${side * 40 - 29} -11 Q ${side * 40} -40 ${side * 40 + 29} -11 Z`}
							fill={HUNG.loafer}
							stroke={INK}
							strokeWidth={OUTLINE}
							strokeLinejoin="round"
						/>
						<path
							d={`M ${side * 40 - 10} -26 L ${side * 40 + 10} -26`}
							stroke={HUNG.gold}
							strokeWidth={3}
							strokeLinecap="round"
						/>
					</g>
				))}
				<path
					d="M -82 -244 L 82 -244 L 78 -30 Q 78 -22 70 -22 L 10 -22 Q 4 -22 4 -30 L 2 -150 L -2 -150 L -4 -30 Q -4 -22 -10 -22 L -70 -22 Q -78 -22 -78 -30 Z"
					fill={HUNG.trousers}
					stroke={INK}
					strokeWidth={OUTLINE}
					strokeLinejoin="round"
				/>
				{SIDES.map((side) => (
					<path
						key={`crease-${side}`}
						d={`M ${side * 42} -230 L ${side * 42} -40`}
						stroke={HUNG.trousersShade}
						strokeWidth={2.5}
						strokeLinecap="round"
					/>
				))}
			</SteppedLegs>
			<rect x={-16} y={-432} width={32} height={40} fill={HUNG.skin} stroke={INK} strokeWidth={OUTLINE} />
			{/* Leopard-print shirt, three buttons open */}
			<path
				d="M -26 -402 C -60 -398 -80 -392 -86 -376 L -88 -320 C -90 -290 -86 -260 -80 -242 L 80 -242 C 86 -260 90 -290 88 -320 L 86 -376 C 80 -392 60 -398 26 -402 Z"
				fill={`url(#${LEOPARD})`}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			<path
				d="M -24 -403 L 0 -330 L 24 -403 Z"
				fill={HUNG.skin}
				stroke={INK}
				strokeWidth={2.5}
				strokeLinejoin="round"
			/>
			{['M -8 -372 q 3 -4 6 0', 'M 4 -364 q 3 -4 6 0', 'M -6 -354 q 3 -4 6 0', 'M 2 -346 q 3 -4 5 0'].map((d) => (
				<path key={d} d={d} fill="none" stroke={HUNG.chestHair} strokeWidth={1.8} strokeLinecap="round" />
			))}
			<path d="M -18 -398 Q 0 -360 18 -398" fill="none" stroke={HUNG.gold} strokeWidth={3} />
			<rect x={-5} y={-370} width={10} height={14} rx={2} fill={HUNG.gold} stroke={INK} strokeWidth={1.5} />
			{/* Big pointed seventies collar */}
			{SIDES.map((side) => (
				<path
					key={`collar-${side}`}
					d={`M ${side * 24} -404 L ${side * 64} -394 L ${side * 26} -360 Z`}
					fill={`url(#${LEOPARD})`}
					stroke={INK}
					strokeWidth={2.5}
					strokeLinejoin="round"
				/>
			))}
			{[-318, -284].map((y) => (
				<circle key={y} cx={0} cy={y} r={4} fill={HUNG.gold} stroke={INK} strokeWidth={1.5} />
			))}
			<rect x={-82} y={-250} width={164} height={13} fill={HUNG.belt} stroke={INK} strokeWidth={2.5} />
			<rect x={-14} y={-254} width={28} height={21} rx={3} fill={HUNG.gold} stroke={INK} strokeWidth={2.5} />
			{(['ink', 'skin', 'cloth'] as const).map((layer) =>
				arms.map((a) => (
					<Arm
						key={`${layer}-${a.side}`}
						side={a.side}
						pose={a.pose}
						layer={layer}
						held={a.held}
						shape={ARM}
						shoulder={SHOULDER}
						skin={HUNG.skin}
						sleeve={`url(#${LEOPARD})`}
						cuff={HUNG.spot}
					/>
				)),
			)}
			<g transform={`translate(0, ${HEAD.y}) rotate(${headTilt}) scale(${HEAD.scale})`}>
				<HungHead mood={mood} blink={blink} lookX={lookX} lookY={lookY} mouthOpen={mouthOpen} />
			</g>
		</g>
	);
};
