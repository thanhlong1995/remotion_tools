import type React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {MinhSide} from '../../../characters/minh/MinhSide';
import {SHIPPER_SCALE, ShipperBike, shipperBox} from '../../../characters/shipper/ShipperBike';
import {BaTuSide} from '../../../characters/tu/BaTuSide';
import {vangCollarRing, VangSide} from '../../../characters/vang/VangSide';
import {type Cam, toScreen, visibleX, World} from '../../../camera';
import {Muop} from '../../../characters/muop/Muop';
import {Parcel} from '../../../props/Props';
import {ActionText, MotionStreaks, PuffTrail, shakeAt, SpeedLines, SweatFlicks} from '../../../props/Effects';
import {Alley, GROUND_Y, TILE, windowOf} from '../../../sets/Alley';
import {biped, blinkAt, clamp, dog, Leash, LineOverlay, ramp, RUN, SCALE, swingArm, TU_BACK, TU_SCALE} from '../kit';
import {mouthOf, scene, speaking} from '../timeline';
import {drinkerBoxes, Drinkers} from '../../shared/Drinkers';
import {boxAt} from '../../../ui/layout';

const S = scene('chase');
const START_X = 30000;
const BIKE_SCALE = SHIPPER_SCALE;
// Screen x of each runner while the camera keeps pace
const LANE = {shipper: 1600, vang: 1230, tu: 900, minh: 380};

// Everyone tears down the alley after the shipper; Minh is nearly waylaid by the drinking table
export const ChaseScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const camX = START_X + RUN.speed * t;
	// A hand-held, slightly tilted camera running alongside them
	const shake = shakeAt(frame, 1);
	const cam: Cam = {x: camX + shake.dx, y: 560 + shake.dy, zoom: 1};
	const world = (screenX: number) => camX - 960 + screenX;
	const worldAt = (f: number, screenX: number) => START_X + (RUN.speed * f) / fps - 960 + screenX;
	// The table slides past; it reaches Minh as Sáu holds out a glass
	const reach = S.marks.reach;
	// ... landing between Minh and Bà Tư
	const tableX = START_X + RUN.speed * (reach / fps) - 960 + LANE.minh + 250;
	// Minh drops back towards the glass, then Bà Tư's yell sends him running again
	const yell = S.cues['s6-04'];
	const lag = interpolate(frame, [S.marks.table, reach + 6, yell.to, yell.to + 30], [0, 190, 190, 0], clamp);
	const tempted = frame >= S.marks.table && frame < yell.to;
	const minh = biped(t, RUN.minh, 0, tempted ? 0.45 : 1);
	const tu = biped(t, RUN.tu, 0.3);
	const vang = dog(t, RUN.vang);
	const vangX = world(LANE.vang);
	const ring = vangCollarRing({bob: vang.bob, headBob: vang.headBob, lean: 6});
	const ringW = {x: vangX + SCALE * ring.x, y: GROUND_Y + SCALE * ring.y};
	const vHead = toScreen(cam, vangX + 100 * SCALE, GROUND_Y - 200 * SCALE);
	// One of Bà Tư's rollers flies off her head and bounces away behind her
	const fly = ramp(frame, S.marks.roller, 26);
	const tuHead = {x: world(LANE.tu) + 10, y: GROUND_Y - TU_SCALE * 690};
	const roller = {
		x: tuHead.x - 380 * fly,
		y: tuHead.y - 160 * Math.sin(Math.PI * Math.min(1, fly * 1.1)) + (GROUND_Y - 20 - tuHead.y) * fly * fly,
		r: 720 * fly,
	};
	// The bike pops little wheelies as he guns it; a parcel bounces off the rack
	const bikeX = world(LANE.shipper);
	const wheelie = -12 * Math.max(0, Math.sin(frame / 7)) ** 3;
	const parcelOff = S.cues['s6-01'].from + 10;
	const parcelFly = ramp(frame, parcelOff, 24);
	const parcel = {
		x: worldAt(parcelOff, LANE.shipper) - 150 * BIKE_SCALE - 420 * parcelFly,
		y:
			GROUND_Y -
			300 * BIKE_SCALE -
			180 * Math.sin(Math.PI * Math.min(1, parcelFly * 1.2)) +
			300 * BIKE_SCALE * parcelFly ** 2,
	};
	// Mướp, napping on a window sill, gets the fright of his life as the chase thunders past
	const muopFrame = S.marks.roller - 10;
	const muopX = windowOf(Math.round((worldAt(muopFrame, 1100) - 770) / TILE)).x;
	const muopScreen = toScreen(cam, muopX, 0).x;
	const startled = muopScreen < 1650;
	const muopHop = startled ? Math.max(0, Math.sin(Math.min(Math.PI, (1650 - muopScreen) / 90))) * 70 : 0;
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{transform: `rotate(${-2 + shake.roll}deg) scale(1.06)`}}>
				<World cam={cam}>
					<Alley {...visibleX(cam)} />
					<g transform={`translate(${muopX}, ${656 - muopHop}) scale(0.8)`}>
						<Muop
							mood={startled ? 'shock' : 'judge'}
							blink={startled ? 1 : 0.3}
							lookX={startled ? 1 : 0}
							mouthOpen={startled ? 0.8 : 0}
							tailFlick={startled ? 30 : 6 * Math.sin(frame / 14)}
						/>
					</g>
					<Drinkers
						x={tableX}
						frame={frame}
						sauStand={1}
						sauArm={tempted ? 60 : 40}
						sauMood={speaking(S, frame, 's6-03') ? 'wink' : 'grin'}
						sauMouth={mouthOf(S, 'sau', frame)}
						hungMouth={mouthOf(S, 'hung', frame)}
						hungMood="cool"
					/>
					{/* Dust and exhaust behind everyone */}
					<PuffTrail
						frame={frame}
						from={0}
						at={(f) => ({x: worldAt(f, LANE.shipper) - 128 * BIKE_SCALE, y: GROUND_Y - 8})}
						every={2}
						drift={{x: -110, y: -50}}
						size={20}
					/>
					<PuffTrail
						frame={frame}
						from={0}
						at={(f) => ({x: worldAt(f, LANE.shipper) - 175 * BIKE_SCALE, y: GROUND_Y - 70 * BIKE_SCALE})}
						every={3}
						life={14}
						drift={{x: -140, y: -40}}
						size={13}
						color="#A7A3A6"
					/>
					<PuffTrail
						frame={frame}
						from={0}
						at={(f) => ({x: worldAt(f, LANE.vang) - 50 * SCALE, y: GROUND_Y - 6})}
						every={3}
						drift={{x: -80, y: -40}}
						size={15}
					/>
					<PuffTrail
						frame={frame}
						from={0}
						at={(f) => ({x: worldAt(f, LANE.tu) - 30, y: GROUND_Y - 6})}
						every={4}
						drift={{x: -70, y: -30}}
						size={13}
					/>
					<PuffTrail
						frame={frame}
						from={0}
						at={(f) => (f >= S.marks.table && f < yell.to ? null : {x: worldAt(f, LANE.minh) - 30, y: GROUND_Y - 6})}
						every={4}
						drift={{x: -70, y: -30}}
						size={13}
					/>
					<MotionStreaks
						frame={frame}
						x={bikeX - 200 * BIKE_SCALE}
						y={GROUND_Y}
						length={160}
						rows={[-300, -200, -100]}
					/>
					<MotionStreaks frame={frame} x={vangX - 70 * SCALE} y={GROUND_Y} length={110} rows={[-150, -90]} />
					{frame >= parcelOff && parcelFly < 1 ? (
						<g transform={`translate(${parcel.x}, ${parcel.y}) rotate(${-540 * parcelFly})`}>
							<Parcel w={66 * BIKE_SCALE} h={38 * BIKE_SCALE} />
						</g>
					) : null}
					<g
						transform={`translate(${bikeX}, ${GROUND_Y}) rotate(${wheelie}, ${-128 * BIKE_SCALE}, 0) scale(${BIKE_SCALE})`}
					>
						<ShipperBike
							mood="panic"
							blink={1}
							mouthOpen={Math.max(0.5, mouthOf(S, 'shipper', frame))}
							spin={frame * 48}
							lean={12}
							parcels={frame > S.cues['s6-01'].from + 10 ? 1 : 2}
							wobble={10 * Math.sin(frame / 1.5)}
						/>
					</g>
					<SweatFlicks frame={frame} x={bikeX + 10 * BIKE_SCALE} y={GROUND_Y - 360 * BIKE_SCALE} scale={1.8} />
					{/* The leash whips along behind him */}
					<Leash
						x1={ringW.x - 280}
						y1={GROUND_Y - 4 - 30 * Math.abs(Math.sin(frame / 3))}
						x2={ringW.x}
						y2={ringW.y}
						sag={16}
					/>
					<g transform={`translate(${vangX}, ${GROUND_Y}) scale(${SCALE})`}>
						<VangSide blink={1} {...vang} lean={8} tailWag={-24} fierce={1} />
					</g>
					<g transform={`translate(${world(LANE.tu)}, ${GROUND_Y - TU_BACK}) scale(${TU_SCALE})`}>
						<BaTuSide
							mood={speaking(S, frame, 's6-04', 's6-02c') ? 'yell' : 'neutral'}
							blink={blinkAt(frame, 30, 70)}
							mouthOpen={mouthOf(S, 'tu', frame)}
							headTilt={speaking(S, frame, 's6-04') ? -14 : 0}
							nearLeg={tu.nearLeg}
							farLeg={tu.farLeg}
							nearArm={{shoulder: 160, elbow: 70}}
							farArm={swingArm(tu, 1, true, true)}
							bob={tu.bob}
							lean={10}
						/>
					</g>
					{frame >= S.marks.roller ? (
						<g transform={`translate(${roller.x}, ${roller.y}) rotate(${roller.r})`}>
							<rect x={-18} y={-11} width={36} height={22} rx={11} fill="#F0A6C0" stroke="#2B2628" strokeWidth={3.5} />
							<path d="M -7 -9 L -7 9 M 1 -9 L 1 9 M 9 -9 L 9 9" stroke="#D9839F" strokeWidth={2.5} />
						</g>
					) : null}
					<g transform={`translate(${world(LANE.minh) - lag}, ${GROUND_Y}) scale(${SCALE})`}>
						<MinhSide
							mood={tempted ? 'crave' : 'shock'}
							blink={blinkAt(frame, 0, 84)}
							mouthOpen={mouthOf(S, 'minh', frame)}
							nearLeg={minh.nearLeg}
							farLeg={minh.farLeg}
							nearArm={tempted ? {shoulder: 80, elbow: 10} : swingArm(minh, 1, false, true)}
							farArm={swingArm(minh, 1, true, true)}
							bob={minh.bob}
							lean={tempted ? 0 : 12}
						/>
					</g>
					<SweatFlicks frame={frame + 4} x={world(LANE.minh) - lag + 30} y={GROUND_Y - 640 * SCALE} scale={1.8} />
					<SweatFlicks frame={frame + 9} x={tuHead.x} y={tuHead.y - 20} scale={1.8} />
				</World>
				<SpeedLines frame={frame} dir={1} opacity={0.8} />
			</AbsoluteFill>
			<ActionText text="VÈÈÈO!" x={1450} y={330} frame={frame} from={2} life={34} rotate={-10} />
			<ActionText
				text="BRỪM BRỪM!"
				x={1500}
				y={300}
				frame={frame}
				from={S.cues['s6-02b'].from}
				life={30}
				rotate={6}
				color="#FF8A3D"
				size={64}
			/>
			<LineOverlay
				scene={S}
				frame={frame}
				anchors={{vang: {x: vHead.x, y: vHead.y, side: 'left'}}}
				avoid={[
					shipperBox(cam, bikeX, GROUND_Y),
					boxAt(cam, vangX + 40 * SCALE, GROUND_Y, 440 * SCALE, 380 * SCALE, 0.6),
					boxAt(cam, world(LANE.tu), GROUND_Y - TU_BACK, 250 * TU_SCALE, 730 * TU_SCALE, 0.36),
					boxAt(cam, world(LANE.minh) - lag, GROUND_Y, 230 * SCALE, 760 * SCALE, 0.36),
					...drinkerBoxes(cam, tableX, 1),
				]}
			/>
		</AbsoluteFill>
	);
};
