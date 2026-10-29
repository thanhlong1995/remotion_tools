import type React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {KhoaHead} from '../../../characters/khoa/KhoaHead';
import {Mochi} from '../../../characters/mochi/Mochi';
import {frontStep} from '../../../characters/shared/SteppedLegs';
import {Thu, THU_HOLD_POSE} from '../../../characters/thu/Thu';
import {ThuHead} from '../../../characters/thu/ThuHead';
import {type Cam, toScreen, visibleX, World} from '../../../camera';
import {ActionText, DizzyStars, PuffTrail, shakeAt, SweatFlicks} from '../../../props/Effects';
import {Sparks} from '../../../props/Props';
import {Alley, NightVeil, WindowBars, windowOf} from '../../../sets/Alley';
import {Outro} from '../../shared/Outro';
import {boxAt} from '../../../ui/layout';
import {clamp, ladderClimb, laughShake, LineOverlay, ramp, RUN} from '../kit';
import {mouthOf, scene, speaking} from '../timeline';
import {ARMS_UP, BELLY_HUNG, SPOT, Stage, vangHeadAt} from '../../shared/Stage';

// Pulled back a little so Minh up the ladder keeps his headroom
const WIDE: Cam = {x: 700, y: 540, zoom: 0.88};
const HANDS_ON_HIPS = {shoulder: 38, elbow: -95};
const POINT_UP = {shoulder: 150, elbow: 10};
const GESTURE = {shoulder: 50, elbow: 40};
// Where Vàng lounges before Minh calls him over to hold the ladder
const VANG_LOUNGE = 960;

// The broken gate lamp: dead, with the odd hopeful flicker
const brokenLamp = (frame: number) => (frame % 53 < 2 || frame % 97 === 40 ? 0.7 : 0);

const anchorOf = (cam: Cam, x: number, y: number, side: 'left' | 'right' = 'right', lift = 0) => {
	const head = vangHeadAt(x, y);
	const p = toScreen(cam, head.x, head.y);
	return {x: p.x, y: p.y, side, lift};
};

export const DuskScene: React.FC = () => {
	const frame = useCurrentFrame();
	const S = scene('dusk');
	const cam: Cam = {x: 600, y: 600, zoom: 1};
	return (
		<AbsoluteFill>
			<Stage
				frame={frame}
				cam={cam}
				night={0.25}
				lit
				lamp={brokenLamp(frame)}
				minh={{
					...SPOT.minhGround,
					mood: speaking(S, frame, 'a4') ? 'smug' : 'neutral',
					mouth: mouthOf(S, 'minh', frame),
					tilt: speaking(S, frame, 'a4') ? -5 : 0,
					armLeft: speaking(S, frame, 'a4') ? {shoulder: 12, elbow: -140} : undefined,
				}}
				tu={{
					...SPOT.tu,
					mood: speaking(S, frame, 'a5') ? 'suspicious' : 'neutral',
					mouth: mouthOf(S, 'tu', frame),
					armLeft: HANDS_ON_HIPS,
					armRight: speaking(S, frame, 'a2', 'a3') ? POINT_UP : HANDS_ON_HIPS,
				}}
				vang={{...SPOT.vang, mood: speaking(S, frame, 'a6') ? 'gossip' : 'neutral', lookX: -1}}
				overlay={(avoid) => (
					<LineOverlay
						scene={S}
						frame={frame}
						anchors={{vang: anchorOf(cam, SPOT.vang.x, SPOT.vang.y, 'right', 120)}}
						avoid={avoid}
					/>
				)}
			/>
		</AbsoluteFill>
	);
};

export const LadderScene: React.FC = () => {
	const frame = useCurrentFrame();
	const S = scene('ladder');
	const {climb, friends} = S.marks;
	// Minh steps across to the ladder, then climbs it rung by rung
	const walkIn = ramp(frame, climb, 16);
	const walkingIn = walkIn > 0 && walkIn < 1;
	const up = ladderClimb(frame, climb + 16, 5, 9, SPOT.minhGround.y, SPOT.minhLadder.y);
	const minhX = interpolate(walkIn, [0, 1], [SPOT.minhGround.x, SPOT.minhLadder.x]);
	const boasting = speaking(S, frame, 'b4', 'b6');
	// "Vàng! Lại đây giữ thang": Vàng trots over from where he was lounging and holds the ladder
	const comeFrom = S.cues.b1.to - 6;
	const come = ramp(frame, comeFrom, 36);
	const trotting = come > 0 && come < 1;
	const vang = {x: interpolate(come, [0, 1], [VANG_LOUNGE, SPOT.vang.x]), y: SPOT.vang.y};
	const holding = come >= 1;
	// Sáu and Hùng stroll in from the right
	const arrive = ramp(frame, friends, 40);
	const strolling = arrive > 0 && arrive < 1;
	return (
		<AbsoluteFill>
			<Stage
				frame={frame}
				cam={WIDE}
				night={0.35}
				lit
				lamp={brokenLamp(frame)}
				ladder
				minh={{
					x: minhX,
					y: up.y,
					walk: walkingIn ? frame / 8 : undefined,
					legLift: up.started && !up.done ? up.legLift : undefined,
					mood: boasting ? 'smug' : 'neutral',
					mouth: mouthOf(S, 'minh', frame),
					armLeft: up.done ? ARMS_UP : up.started ? up.armLeft : undefined,
					armRight: up.done ? (boasting ? GESTURE : ARMS_UP) : up.started ? up.armRight : undefined,
					tilt: speaking(S, frame, 'b1') ? 10 : boasting ? 8 : 0,
				}}
				tu={null}
				vang={{
					...vang,
					side: trotting ? {facing: -1, t: (frame - comeFrom) / 30} : undefined,
					pose: holding ? 'paw' : 'sit',
					flip: holding,
					mood: speaking(S, frame, 'b2', 'b8') ? 'gossip' : 'neutral',
					lookX: holding ? 0 : -1,
					tilt: holding ? 0 : -6,
				}}
				sau={
					arrive > 0
						? {
								x: SPOT.sau.x + 300 * (1 - arrive),
								y: SPOT.sau.y,
								walk: strolling ? (frame - friends) / 9 : undefined,
								mood: speaking(S, frame, 'b3') ? 'wink' : 'grin',
								mouth: mouthOf(S, 'sau', frame),
							}
						: null
				}
				hung={
					arrive > 0
						? {
								x: SPOT.hung.x + 300 * (1 - arrive),
								y: SPOT.hung.y,
								walk: strolling ? (frame - friends) / 8 + 0.5 : undefined,
								mood: 'cool',
								mouth: mouthOf(S, 'hung', frame),
							}
						: null
				}
				overlay={(avoid) => (
					<LineOverlay
						scene={S}
						frame={frame}
						anchors={{vang: anchorOf(WIDE, vang.x, vang.y, 'right', 60)}}
						avoid={avoid}
					/>
				)}
			/>
		</AbsoluteFill>
	);
};

export const ZapScene: React.FC = () => {
	const frame = useCurrentFrame();
	const S = scene('zap');
	const {zap, leave} = S.marks;
	// The zap lasts until his scream is over
	const zapEnd = Math.max(zap + 50, S.cues.c4.to);
	const zapping = frame >= zap && frame < zapEnd;
	const zapped = frame >= zap;
	const flash =
		(frame >= zap && frame < zap + 3) ||
		(frame >= zap + 7 && frame < zap + 9) ||
		(frame >= zap + 20 && frame < zap + 22);
	const shake = zapping ? 12 * Math.sin(frame * 3.1) : 0;
	const jolt = shakeAt(frame, zapping ? 1.6 : 0);
	const closeUp = speaking(S, frame, 'c4', 'c6');
	// Everyone near the ladder jumps out of their skin when the sparks fly
	const startle = frame >= zap && frame < zap + 14 ? 40 * Math.sin((Math.PI * (frame - zap)) / 14) : 0;
	// Sáu's jab about Bà Tư, then Minh's hair standing on end, crack both friends up
	const laughing = speaking(S, frame, 'c2e', 'c7b');
	const laughMouth = (offset: number) =>
		Math.max(mouthOf(S, 'sau', frame + offset), mouthOf(S, 'hung', frame + offset));
	// Smoke curling off his singed head, stars circling while he's dazed
	const dazed = frame >= zapEnd && frame < S.cues.c9.from;
	const giggle = laughShake(frame);
	const giggleB = laughShake(frame + 3);
	const cam: Cam = closeUp ? {x: SPOT.minhLadder.x, y: 270, zoom: 2.0} : {...WIDE, x: WIDE.x + shake};
	// Bà Tư comes running in for c5; at c9 Minh climbs down and she hurries him off at a run
	const tuFrom = S.cues.c5.from - 20;
	const tuIn = interpolate(frame, [tuFrom, tuFrom + 24], [0, 1], clamp);
	const tuRunning = tuIn > 0 && tuIn < 1;
	const down = ladderClimb(frame, S.cues.c9.from + 4, 5, 6, SPOT.minhLadder.y, SPOT.minhGround.y);
	const climbingDown = down.started && !down.done;
	const exiting = frame >= leave;
	const offT = (frame - leave) / 30;
	const off = exiting ? RUN.speed * offT : 0;
	const minhX = SPOT.minhLadder.x - off + (zapping ? shake : 0);
	const minhY = down.y;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{transform: zapping ? `rotate(${jolt.roll * 2}deg) scale(1.04)` : undefined}}>
				<Stage
					frame={frame}
					cam={cam}
					night={0.45}
					lit
					lamp={zapping ? (frame % 4 < 2 ? 1 : 0.3) : 0}
					ladder
					minh={{
						x: minhX,
						y: minhY,
						mood: zapped
							? 'zapped'
							: laughing
								? 'scared'
								: speaking(S, frame, 'c1', 'c2', 'c2b', 'c2d')
									? 'smug'
									: 'neutral',
						mouth: mouthOf(S, 'minh', frame),
						side: exiting ? {facing: -1, t: offT, run: true} : undefined,
						legLift: climbingDown ? down.legLift : undefined,
						armLeft: climbingDown ? down.armLeft : zapped && !zapping ? {shoulder: 20, elbow: -10} : ARMS_UP,
						armRight: climbingDown
							? down.armRight
							: zapping
								? ARMS_UP
								: speaking(S, frame, 'c1', 'c2', 'c2b', 'c2d')
									? GESTURE
									: zapped
										? {shoulder: 20, elbow: -10}
										: ARMS_UP,
						tilt: speaking(S, frame, 'c1', 'c2', 'c2b', 'c2d') ? 10 : zapped ? -6 * Math.sin(frame / 9) : 0,
					}}
					tu={
						tuIn > 0
							? {
									x: interpolate(tuIn, [0, 1], [-200, SPOT.tu.x + 80]) - off * 1.05,
									y: SPOT.tu.y,
									side: tuRunning
										? {facing: 1, t: (frame - tuFrom) / 30, run: true}
										: exiting
											? {facing: -1, t: offT, run: true}
											: undefined,
									mood: speaking(S, frame, 'c9') ? 'yell' : 'suspicious',
									mouth: mouthOf(S, 'tu', frame),
									armRight: speaking(S, frame, 'c9') ? POINT_UP : undefined,
								}
							: null
					}
					vang={{
						...SPOT.vang,
						y: SPOT.vang.y - startle,
						mood: zapping ? 'scared' : speaking(S, frame, 'c3', 'c8') ? 'gossip' : 'neutral',
						lookX: -1,
						tilt: -6,
					}}
					sau={{
						...SPOT.sau,
						x: SPOT.sau.x + 0.8 * startle,
						y: SPOT.sau.y - 0.6 * startle,
						mood: laughing
							? 'laugh'
							: speaking(S, frame, 'c2c')
								? 'wink'
								: speaking(S, frame, 'c7')
									? 'grin'
									: zapped
										? 'brag'
										: 'grin',
						mouth: laughing ? laughMouth(0) : mouthOf(S, 'sau', frame),
						...(laughing ? {coverMouth: true, squash: giggle.squash, tilt: giggle.tilt} : {}),
					}}
					hung={{
						...SPOT.hung,
						x: SPOT.hung.x + startle,
						y: SPOT.hung.y - 0.5 * startle,
						mood: laughing ? 'laugh' : zapped ? 'hurt' : 'cool',
						mouth: laughing ? laughMouth(3) : 0,
						...(laughing ? {armLeft: BELLY_HUNG, squash: giggleB.squash, tilt: -giggleB.tilt} : {}),
					}}
					fx={
						<g>
							{zapping ? (
								<g>
									<g transform={`translate(${SPOT.lamp.x}, ${SPOT.lamp.y + 20})`}>
										<Sparks seed={frame} size={190} />
									</g>
									<g transform={`translate(${minhX}, ${SPOT.minhLadder.y - 300})`}>
										<Sparks seed={frame + 50} size={150} />
									</g>
									<g transform={`translate(${minhX - 120}, ${SPOT.minhLadder.y - 120})`}>
										<Sparks seed={frame + 90} size={110} />
									</g>
								</g>
							) : null}
							{zapping ? (
								<g>
									<SweatFlicks frame={frame} x={SPOT.vang.x} y={SPOT.vang.y - 300 - startle} scale={1.6} dir={1} />
									<SweatFlicks frame={frame + 5} x={SPOT.sau.x} y={SPOT.sau.y - 640} scale={1.6} dir={1} />
									<SweatFlicks frame={frame + 9} x={SPOT.hung.x} y={SPOT.hung.y - 470} scale={1.6} dir={1} />
								</g>
							) : null}
							{zapped && frame < S.cues.c9.from ? (
								<PuffTrail
									frame={frame}
									from={zapEnd - 10}
									at={() => ({x: minhX + 10, y: minhY - 540})}
									every={6}
									life={28}
									drift={{x: 30, y: -160}}
									size={16}
									color="#8C878A"
								/>
							) : null}
							{dazed ? <DizzyStars frame={frame} x={minhX} y={minhY - 560} r={90} /> : null}
						</g>
					}
					overlay={(avoid) => (
						<LineOverlay
							scene={S}
							frame={frame}
							anchors={{vang: anchorOf(cam, SPOT.vang.x, SPOT.vang.y, 'left', 60)}}
							avoid={avoid}
						/>
					)}
				/>
			</AbsoluteFill>
			{flash ? <AbsoluteFill style={{backgroundColor: '#FFFFFF', opacity: 0.85}} /> : null}
			<ActionText
				text="XẸT XẸT XẸT!"
				x={1250}
				y={230}
				frame={frame}
				from={zap + 2}
				life={44}
				rotate={-6}
				color="#7FE3FF"
				size={84}
			/>
		</AbsoluteFill>
	);
};

export const PetsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const S = scene('pets');
	const cam: Cam = {x: 690, y: 820, zoom: 1.7};
	return (
		<AbsoluteFill>
			<Stage
				frame={frame}
				cam={cam}
				night={0.55}
				lit
				lamp={0}
				ladder
				minh={null}
				tu={null}
				vang={{
					// Shifted right so Mướp on the toolbox stays in view
					x: SPOT.vang.x + 80,
					y: SPOT.vang.y,
					mood: speaking(S, frame, 'd4') ? 'bark' : speaking(S, frame, 'd6') ? 'happy' : 'neutral',
					mouth: mouthOf(S, 'vang', frame),
					lookX: -1,
					tilt: 8,
				}}
				muop={{
					...SPOT.muopToolbox,
					s: 0.9,
					mood: speaking(S, frame, 'd5') ? 'smug' : 'judge',
					mouth: mouthOf(S, 'muop', frame),
				}}
				overlay={(avoid) => (
					<LineOverlay
						scene={S}
						frame={frame}
						anchors={{vang: anchorOf(cam, SPOT.vang.x + 80, SPOT.vang.y, 'right', 0)}}
						avoid={avoid}
					/>
				)}
			/>
		</AbsoluteFill>
	);
};

// A face at a dark window, lit by a phone held up to it
const AtWindow: React.FC<{tile: number; children: React.ReactNode}> = ({tile, children}) => {
	const w = windowOf(tile);
	return (
		<g>
			<ellipse cx={w.x} cy={w.y + 30} rx={150} ry={160} fill="#BFD9FF" opacity={0.35} />
			<g transform={`translate(${w.x}, ${w.y + 130}) scale(1.05)`}>{children}</g>
			<WindowBars tile={tile} />
		</g>
	);
};

export const BlackoutScene: React.FC = () => {
	const frame = useCurrentFrame();
	const S = scene('blackout');
	const {switch: flip, khoa, thu, gate} = S.marks;
	const on = frame >= flip;
	// The lamp stutters to life; everything else dies
	const lamp = on ? (frame - flip < 8 ? (frame % 3 === 0 ? 1 : 0.2) : 1) : 0;
	const lever = ramp(frame, flip - 6, 6);
	const atWindow = frame >= khoa && frame < gate;
	const windowTile = frame >= thu ? 2 : 3;
	const winCam: Cam = {x: windowOf(windowTile).x, y: windowOf(windowTile).y, zoom: 1.7};
	if (atWindow) {
		const span = visibleX(winCam);
		return (
			<AbsoluteFill>
				<World cam={winCam}>
					<Alley {...span} gateTile={0} night={0.92} lit={false} />
					<AtWindow tile={windowTile}>
						{windowTile === 3 ? (
							<KhoaHead mood="zombie" blink={1} lookX={0} lookY={0} mouthOpen={mouthOf(S, 'khoa', frame)} />
						) : (
							<ThuHead mood="scared" blink={1} lookX={0} lookY={0} mouthOpen={mouthOf(S, 'thu', frame)} />
						)}
					</AtWindow>
					<NightVeil {...span} night={0.5} />
				</World>
				<LineOverlay scene={S} frame={frame} anchors={{}} />
			</AbsoluteFill>
		);
	}
	const proud = speaking(S, frame, 'e8');
	return (
		<AbsoluteFill>
			<Stage
				frame={frame}
				cam={WIDE}
				night={on ? 0.92 : 0.6}
				lit={!on}
				lamp={lamp}
				ladder
				breaker={lever}
				minh={{
					...SPOT.minhLadder,
					mood: proud
						? 'smug'
						: speaking(S, frame, 'e10')
							? 'happy'
							: speaking(S, frame, 'e3', 'e9')
								? 'scared'
								: 'neutral',
					mouth: mouthOf(S, 'minh', frame),
					armLeft: ARMS_UP,
					armRight: proud ? POINT_UP : speaking(S, frame, 'e10') ? GESTURE : ARMS_UP,
					tilt: speaking(S, frame, 'e2') ? 12 : 0,
				}}
				tu={{
					...SPOT.tuBreaker,
					mood: speaking(S, frame, 'e9') ? 'yell' : on ? 'suspicious' : 'neutral',
					mouth: mouthOf(S, 'tu', frame),
					armRight: frame < flip + 20 ? {shoulder: 120, elbow: -20} : HANDS_ON_HIPS,
					armLeft: HANDS_ON_HIPS,
				}}
				vang={{
					...SPOT.vang,
					y: SPOT.vang.y - (frame >= flip && frame < flip + 12 ? 36 * Math.sin((Math.PI * (frame - flip)) / 12) : 0),
					mood: speaking(S, frame, 'e11') ? 'happy' : on ? 'scared' : 'neutral',
					lookX: -1,
					tilt: -6,
				}}
				sau={{
					x: 1190,
					y: SPOT.sau.y,
					mood: speaking(S, frame, 'e4b') ? 'brag' : 'grin',
					mouth: mouthOf(S, 'sau', frame),
				}}
				hung={{
					x: SPOT.hung.x + 290,
					y: SPOT.hung.y,
					mood: speaking(S, frame, 'e4') ? 'angry' : 'cool',
					mouth: mouthOf(S, 'hung', frame),
					speakerOn: !on,
				}}
				overlay={(avoid) => (
					<LineOverlay
						scene={S}
						frame={frame}
						anchors={{vang: anchorOf(WIDE, SPOT.vang.x, SPOT.vang.y, 'left', 60)}}
						avoid={avoid}
					/>
				)}
			/>
			{frame >= flip && frame < flip + 2 ? (
				<AbsoluteFill
					style={{backgroundColor: '#000000', opacity: interpolate(frame, [flip, flip + 2], [0.8, 0], clamp)}}
				/>
			) : null}
			<ActionText
				text="PHỤT!"
				x={1180}
				y={260}
				frame={frame}
				from={flip + 2}
				life={30}
				rotate={8}
				color="#FFFFFF"
				size={110}
			/>
		</AbsoluteFill>
	);
};

// The power is back: bé Thư comes out with Mochi to say thank you, Hùng picks up the mic again
export const ThanksScene: React.FC = () => {
	const frame = useCurrentFrame();
	const S = scene('thanks');
	// Bé Thư walks in from the right along the wall, holding Mochi, and stops by Vàng
	const walkIn = interpolate(frame, [S.marks.thu, S.marks.thu + 72], [0, 1], clamp);
	const step = walkIn < 1 ? frontStep(frame / 7, 26) : null;
	const thu = {x: interpolate(walkIn, [0, 1], [1750, 880]), y: 1012, s: 0.66};
	return (
		<AbsoluteFill>
			<Stage
				frame={frame}
				cam={WIDE}
				night={0.6}
				lit
				lamp={1}
				ladder
				behind={
					<g
						transform={`translate(${thu.x}, ${thu.y - (step ? step.bob : 0)}) rotate(${step ? step.sway : 0}) scale(${thu.s})`}
					>
						<Thu
							legLift={step ? step.lift : undefined}
							mood={speaking(S, frame, 'g1') ? 'happy' : 'shy'}
							blink={1}
							mouthOpen={mouthOf(S, 'thu', frame)}
							armLeft={THU_HOLD_POSE}
							armRight={THU_HOLD_POSE}
							cupped={<Mochi mood="neutral" />}
						/>
					</g>
				}
				minh={{
					...SPOT.minhGround,
					mood: speaking(S, frame, 'g2') ? 'smug' : speaking(S, frame, 'g4') ? 'scared' : 'happy',
					mouth: mouthOf(S, 'minh', frame),
					armLeft: speaking(S, frame, 'g2') ? {shoulder: 12, elbow: -140} : undefined,
					tilt: speaking(S, frame, 'g2') ? -5 : 0,
				}}
				tu={{
					...SPOT.tu,
					mood: speaking(S, frame, 'g7') ? 'yell' : speaking(S, frame, 'g3') ? 'suspicious' : 'neutral',
					mouth: mouthOf(S, 'tu', frame),
					armLeft: HANDS_ON_HIPS,
					armRight: HANDS_ON_HIPS,
				}}
				vang={{...SPOT.vang, mood: speaking(S, frame, 'g5') ? 'gossip' : 'happy', lookX: -1}}
				sau={{x: 1040, y: SPOT.sau.y, mood: 'grin'}}
				hung={{
					x: SPOT.hung.x + 120,
					y: SPOT.hung.y,
					mood: speaking(S, frame, 'g6') ? 'sing' : 'cool',
					mouth: mouthOf(S, 'hung', frame),
					speakerOn: true,
				}}
				overlay={(avoid) => (
					<LineOverlay
						scene={S}
						frame={frame}
						anchors={{vang: anchorOf(WIDE, SPOT.vang.x, SPOT.vang.y, 'left', 60)}}
						avoid={avoid}
					/>
				)}
				extraAvoid={[boxAt(WIDE, thu.x, thu.y, 200 * thu.s, 640 * thu.s, 0.4)]}
			/>
		</AbsoluteFill>
	);
};

export const OutroScene: React.FC = () => (
	<Outro scene={scene('outro')} overlay={LineOverlay} night muopMood="smug" teaser="Tập sau: Chó khôn của xóm" />
);
