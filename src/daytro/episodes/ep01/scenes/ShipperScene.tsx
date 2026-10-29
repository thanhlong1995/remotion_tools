import type React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {SHIPPER_SCALE, ShipperBike, shipperBox} from '../../../characters/shipper/ShipperBike';
import {vangCollarRing, VangSide} from '../../../characters/vang/VangSide';
import {type Cam, toScreen, visibleX, World} from '../../../camera';
import {ActionText, MotionStreaks, PuffTrail, shakeAt, SpeedLines, SweatFlicks} from '../../../props/Effects';
import {Parcel} from '../../../props/Props';
import {Alley, GROUND_Y} from '../../../sets/Alley';
import {Group, groupBoxes, VANG_OFFSET, vangHead} from '../Group';
import {blinkAt, clamp, dog, Leash, LineOverlay, ramp, RUN, SCALE} from '../kit';
import {mouthOf, scene, speaking} from '../timeline';
import {drinkerBoxes, Drinkers} from '../../shared/Drinkers';
import {nhauStopX, TABLE_AHEAD} from './NhauScene';
import {boxAt} from '../../../ui/layout';

const S = scene('shipper');
const BIKE_SCALE = SHIPPER_SCALE;

// The delivery guy screeches up, Vàng spots his sworn enemy and tears the leash out of Minh's hand
export const ShipperScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const m = S.marks;
	const x = nhauStopX();
	const tableX = x + TABLE_AHEAD;
	const bolted = frame >= m.bolt;
	// Once Vàng bolts the camera goes hand-held
	const shake = shakeAt(frame, bolted ? 1.2 : 0);
	const wide: Cam = {x: x + 520 + shake.dx, y: 560 + shake.dy, zoom: 1};
	const run = (frame - m.bolt) / fps;
	// Bike: brakes hard into frame facing left, then flees to the right once the dog comes
	const parked = tableX + 500;
	const arriving = interpolate(frame, [0, m.arrive + 22], [tableX + 1800, parked], {
		...clamp,
		easing: Easing.out(Easing.cubic),
	});
	const flee = bolted ? Math.max(0, run - 0.25) ** 2 * 900 : 0;
	const bikeX = bolted ? parked + flee : arriving;
	const facingRight = bolted && run > 0.25;
	const braking = interpolate(frame, [m.arrive + 6, m.arrive + 22, m.arrive + 34], [0, 1, 0], clamp);
	// The top parcel slides off as he brakes: he's always in too much of a hurry
	const drop = ramp(frame, m.arrive + 16, 12);
	const parcel = {x: parked - 20 + 70 * drop, y: GROUND_Y - BIKE_SCALE * 272 * (1 - drop * drop), r: 120 * drop};
	// Vàng tears off after him, trailing his leash
	const vangX = x + VANG_OFFSET + (bolted ? RUN.speed * run * 1.15 : 0);
	const gait = dog(run, RUN.vang, bolted ? 1 : 0);
	const ring = vangCollarRing({bob: gait.bob, headBob: gait.headBob, lean: bolted ? 6 : 0});
	const ringW = {x: vangX + SCALE * ring.x, y: GROUND_Y + SCALE * ring.y};
	const vHead = vangHead(x);
	const closeUp = frame >= m.eyes && frame < m.bolt;
	const cam: Cam = closeUp ? {x: vHead.x + 10 + 6 * Math.sin(frame * 2.1), y: vHead.y + 30, zoom: 3.2} : wide;
	const head = toScreen(cam, vHead.x, vHead.y);
	return (
		<AbsoluteFill>
			<World cam={cam}>
				<Alley {...visibleX(cam)} />
				<Drinkers
					x={tableX}
					frame={frame}
					sauStand={1}
					sauArm={40}
					sauMood={bolted ? 'brag' : 'grin'}
					sauMouth={0}
					hungMouth={0}
				/>
				{braking > 0 ? (
					<path
						d={`M ${parked + 90} ${GROUND_Y - 2} L ${parked + 90 + 260 * braking} ${GROUND_Y - 2}`}
						stroke="#2B2628"
						strokeWidth={6}
						opacity={0.35}
						strokeLinecap="round"
					/>
				) : null}
				{drop > 0 ? (
					<g transform={`translate(${parcel.x}, ${parcel.y}) rotate(${parcel.r})`}>
						<Parcel w={66 * BIKE_SCALE} h={38 * BIKE_SCALE} />
					</g>
				) : null}
				<Group
					x={x}
					t={0}
					amount={0}
					frame={frame}
					minh={{
						mood: bolted ? 'shock' : 'neutral',
						mouthOpen: mouthOf(S, 'minh', frame),
						leashArm: bolted ? {shoulder: 75, elbow: 5} : undefined,
						lean: bolted ? 8 : 0,
						blink: blinkAt(frame, 0, 84),
					}}
					tu={{
						mood: speaking(S, frame, 's5-04') ? 'yell' : 'suspicious',
						mouthOpen: mouthOf(S, 'tu', frame),
						blink: blinkAt(frame, 30, 70),
					}}
					vang={{blink: 1, panting: 0, fierce: closeUp ? 1 : 0}}
					showVang={!bolted}
				/>
				{bolted ? (
					<g>
						<PuffTrail
							frame={frame}
							from={m.bolt}
							at={(f) => ({x: x + VANG_OFFSET + RUN.speed * ((f - m.bolt) / fps) * 1.15 - 50 * SCALE, y: GROUND_Y - 6})}
							every={3}
							drift={{x: -80, y: -40}}
							size={16}
						/>
						<MotionStreaks frame={frame} x={vangX - 70 * SCALE} y={GROUND_Y} length={120} rows={[-150, -90]} />
						<Leash
							x1={ringW.x - 260}
							y1={GROUND_Y - 4 - 30 * Math.abs(Math.sin(frame / 3))}
							x2={ringW.x}
							y2={ringW.y}
							sag={20}
						/>
						<g transform={`translate(${vangX}, ${GROUND_Y}) scale(${SCALE})`}>
							<VangSide blink={1} {...gait} lean={8} tailWag={-20} fierce={1} />
						</g>
					</g>
				) : null}
				{facingRight ? (
					<PuffTrail
						frame={frame}
						from={m.bolt + 8}
						at={(f) => ({
							x: parked + Math.max(0, (f - m.bolt) / fps - 0.25) ** 2 * 900 - 128 * BIKE_SCALE,
							y: GROUND_Y - 8,
						})}
						every={2}
						drift={{x: -110, y: -50}}
						size={20}
					/>
				) : null}
				{bolted ? (
					<SweatFlicks
						frame={frame}
						x={bikeX + (facingRight ? 10 : -10) * BIKE_SCALE}
						y={GROUND_Y - 360 * BIKE_SCALE}
						dir={facingRight ? -1 : 1}
						scale={1.8}
					/>
				) : null}
				<g
					transform={`translate(${bikeX}, ${GROUND_Y}) scale(${facingRight ? BIKE_SCALE : -BIKE_SCALE}, ${BIKE_SCALE})`}
				>
					<ShipperBike
						mood={bolted && run > 0.1 ? 'panic' : 'rush'}
						blink={blinkAt(frame, 5, 50)}
						mouthOpen={bolted ? Math.max(0.6, mouthOf(S, 'shipper', frame)) : mouthOf(S, 'shipper', frame)}
						spin={bolted ? run * 1400 : (tableX + 1800 - arriving) * 0.9}
						lean={-10 * braking + (facingRight ? 12 : 0)}
						parcels={drop > 0 ? 2 : 3}
						wobble={6 * Math.sin(frame / 2)}
					/>
				</g>
			</World>
			{bolted ? <SpeedLines frame={frame} dir={1} opacity={0.7} /> : null}
			<ActionText text="VÈO!" x={1500} y={360} frame={frame} from={m.bolt + 4} life={28} rotate={-8} />
			{closeUp ? (
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 30%, rgba(200,30,30,0.45) 100%)',
					}}
				/>
			) : null}
			<LineOverlay
				scene={S}
				frame={frame}
				anchors={{vang: {x: head.x, y: head.y, side: 'left'}}}
				avoid={[
					...groupBoxes(cam, x, {vang: !bolted}),
					...drinkerBoxes(cam, tableX, 1),
					shipperBox(cam, bikeX, GROUND_Y),
					...(bolted ? [boxAt(cam, vangX + 40 * SCALE, GROUND_Y, 440 * SCALE, 380 * SCALE, 0.6)] : []),
				]}
			/>
		</AbsoluteFill>
	);
};
