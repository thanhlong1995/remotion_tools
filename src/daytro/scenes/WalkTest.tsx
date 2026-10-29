import type React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {MINH_LEG_LENGTH, MINH_SIDE_ARM, MINH_SIDE_SHOULDER, MinhSide} from '../characters/minh/MinhSide';
import {handPosition, type ArmPose} from '../characters/shared/Arm';
import {armSwing, groundSpeed, legSwing, strideCycle, walkBob} from '../characters/shared/walk';
import {BaTuSide, TU_LEG_LENGTH} from '../characters/tu/BaTuSide';
import {VANG_COLLAR_RING, VANG_LEG_LENGTH, VangSide} from '../characters/vang/VangSide';
import {SpeechBubble} from '../sheets/CharacterSheet';
import {Alley, GROUND_Y} from '../sets/Alley';
import {INK} from '../theme';

export const WALK_TEST_DURATION = 150;

const SCALE = 0.78;
const TU_SCALE = 0.75;
const MINH_X = 900;
const TU_X = 780;
const TU_GROUND = GROUND_Y - 12;
const VANG_X = 1330;

// Everyone covers ground at Minh's pace; shorter legs just step faster
const MINH = {period: 1.1, stride: 20};
const SPEED = groundSpeed(MINH_LEG_LENGTH, MINH.stride, MINH.period);
const periodFor = (legLength: number, stride: number) => (4 * legLength * Math.sin((stride * Math.PI) / 180)) / SPEED;
const TU = {period: periodFor(TU_LEG_LENGTH, 20), stride: 20};
const VANG = {period: periodFor(VANG_LEG_LENGTH, 26), stride: 26};

const LINES = [
	{who: 'tu', from: 12, to: 92, talkUntil: 80, text: 'Cầm chắc dây vào ông, nó lại đuổi shipper bây giờ!', x: 400, y: 250, width: 560, tailX: 410},
	{who: 'minh', from: 98, to: 150, talkUntil: 128, text: 'Rồi rồi, bà yên tâm…', x: 880, y: 300, width: 440, tailX: 80},
] as const;

// Lid closes for a few frames once per period
const blinkAt = (frame: number, offset: number, period: number) =>
	interpolate((frame + offset) % period, [0, 2, 4], [1, 0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// Irregular jaw flapping while a line is spoken
const flap = (frame: number) =>
	Math.max(0, Math.min(1, (0.55 + 0.45 * Math.sin(frame * 1.9)) * (0.6 + 0.4 * Math.sin(frame * 0.57))));

const Shadow: React.FC<{x: number; y: number; rx: number}> = ({x, y, rx}) => (
	<ellipse cx={x} cy={y} rx={rx} ry={rx * 0.12} fill="#000000" opacity={0.12} />
);

// 5-second animation test: the landlord couple walking Vàng down the alley
export const WalkTest: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const offset = (SPEED * SCALE * frame) / fps;

	const pm = strideCycle(frame, fps, MINH.period);
	const pt = strideCycle(frame, fps, TU.period, 0.3);
	const pv = strideCycle(frame, fps, VANG.period, 0.1);

	const talking = (who: 'tu' | 'minh') => LINES.some((l) => l.who === who && frame >= l.from && frame < l.talkUntil);
	const minhScared = frame >= 96;

	// Minh holds the leash out in front; the hand drifts a little with each step
	const minhBob = walkBob(pm, 5);
	const leashArm: ArmPose = {shoulder: 30 + 3 * Math.sin(pm * Math.PI * 2), elbow: 22};
	const hand = handPosition(1, leashArm, MINH_SIDE_ARM, MINH_SIDE_SHOULDER);
	const handX = MINH_X + SCALE * hand.x;
	const handY = GROUND_Y + SCALE * (hand.y + minhBob);

	const vangBob = walkBob(pv, 4);
	const headBob = walkBob(pv + 0.15, 3);
	const ringX = VANG_X + SCALE * VANG_COLLAR_RING.x;
	const ringY = GROUND_Y + SCALE * (VANG_COLLAR_RING.y + vangBob + headBob * 0.3);
	const sag = 46 + 10 * Math.sin(pv * Math.PI * 2);
	const leash = `M ${handX} ${handY} Q ${(handX + ringX) / 2} ${Math.max(handY, ringY) + sag} ${ringX} ${ringY}`;

	return (
		<AbsoluteFill style={{backgroundColor: '#D3E7F1'}}>
			<svg width={1920} height={1080} viewBox="0 0 1920 1080">
				<g transform={`translate(${-offset}, 0)`}>
					<Alley left={offset} right={offset + 1920} />
				</g>
				<Shadow x={TU_X} y={TU_GROUND} rx={70} />
				<Shadow x={MINH_X + 10} y={GROUND_Y} rx={78} />
				<Shadow x={VANG_X} y={GROUND_Y} rx={80} />
				<g transform={`translate(${TU_X}, ${TU_GROUND}) scale(${TU_SCALE})`}>
					<BaTuSide
						mood={talking('tu') ? 'neutral' : 'suspicious'}
						blink={blinkAt(frame, 30, 70)}
						mouthOpen={talking('tu') ? flap(frame) : 0}
						headTilt={talking('tu') ? 3 * Math.sin(frame * 0.4) : 0}
						nearLeg={legSwing(pt, TU.stride, 40)}
						farLeg={legSwing(pt + 0.5, TU.stride, 40)}
						nearArm={{shoulder: armSwing(pt, 18), elbow: 16}}
						farArm={{shoulder: armSwing(pt + 0.5, 18), elbow: 16}}
						bob={walkBob(pt, 6)}
					/>
				</g>
				<g transform={`translate(${MINH_X}, ${GROUND_Y}) scale(${SCALE})`}>
					<MinhSide
						mood={minhScared ? 'scared' : 'neutral'}
						blink={blinkAt(frame, 0, 84)}
						mouthOpen={talking('minh') ? flap(frame + 7) * 0.8 : 0}
						headTilt={minhScared ? -6 : 0}
						nearLeg={legSwing(pm, MINH.stride, 40)}
						farLeg={legSwing(pm + 0.5, MINH.stride, 40)}
						nearArm={leashArm}
						farArm={{shoulder: armSwing(pm + 0.5, 16), elbow: 12}}
						bob={minhBob}
					/>
				</g>
				<g transform={`translate(${VANG_X}, ${GROUND_Y}) scale(${SCALE})`}>
					<VangSide
						blink={blinkAt(frame, 12, 60)}
						frontNear={legSwing(pv, VANG.stride, 34)}
						backFar={legSwing(pv, VANG.stride, 34)}
						frontFar={legSwing(pv + 0.5, VANG.stride, 34)}
						backNear={legSwing(pv + 0.5, VANG.stride, 34)}
						bob={vangBob}
						headBob={headBob}
						tailWag={14 * Math.sin((frame / fps) * Math.PI * 2 * 3)}
						earBounce={12 * Math.sin(pv * Math.PI * 4)}
						panting={0.6 + 0.3 * Math.sin(frame * 0.9)}
					/>
				</g>
				<path d={leash} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
				<path d={leash} fill="none" stroke="#C0392B" strokeWidth={3.5} strokeLinecap="round" />
			</svg>
			{LINES.filter((l) => frame >= l.from && frame < l.to).map((l) => {
				const pop = spring({frame: frame - l.from, fps, config: {damping: 12, stiffness: 180}});
				const fade = interpolate(frame, [l.to - 6, l.to], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
				return (
					<div
						key={l.text}
						style={{
							position: 'absolute',
							inset: 0,
							opacity: fade,
							transform: `scale(${0.6 + 0.4 * pop})`,
							transformOrigin: `${l.x + l.tailX}px ${l.y + 120}px`,
						}}
					>
						<SpeechBubble text={l.text} x={l.x} y={l.y} width={l.width} tailX={l.tailX} />
					</div>
				);
			})}
		</AbsoluteFill>
	);
};
