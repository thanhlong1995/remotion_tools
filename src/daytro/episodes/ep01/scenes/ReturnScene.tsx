import type React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Parcel} from '../../../props/Props';
import {type Cam, toScreen} from '../../../camera';
import {SPOT, Stage, vangHeadAt} from '../../shared/Stage';
import {clamp, LineOverlay, ramp} from '../kit';
import {mouthOf, scene, speaking} from '../timeline';

const S = scene('return');
const CAM: Cam = {x: 600, y: 600, zoom: 1};
const HANDS_ON_KNEES = {shoulder: 30, elbow: -20};
const HANDS_ON_HIPS = {shoulder: 38, elbow: -95};

// Back at the gate, out of breath; Vàng trots home with a parcel in his mouth
export const ReturnScene: React.FC = () => {
	const frame = useCurrentFrame();
	const panting = Math.sin(frame / 3) * 6;
	const back = ramp(frame, S.marks.vangBack, 34);
	const vang = {
		x: interpolate(back, [0, 1], [1500, SPOT.vang.x]),
		y: SPOT.vang.y - (back > 0 && back < 1 ? Math.abs(Math.sin(frame / 2.5)) * 18 : 0),
	};
	const minhMood = speaking(S, frame, 'r-01')
		? 'smug'
		: speaking(S, frame, 'r-05')
			? 'happy'
			: frame < S.marks.vangBack
				? 'scared'
				: 'shock';
	const head = toScreen(CAM, vangHeadAt(vang.x, vang.y).x, vangHeadAt(vang.x, vang.y).y);
	return (
		<AbsoluteFill>
			<Stage
				frame={frame}
				cam={CAM}
				night={0}
				lit={false}
				lamp={0}
				minh={{
					x: SPOT.minhGround.x,
					y: SPOT.minhGround.y + panting * (frame < S.cues['r-02'].to ? 1 : 0),
					mood: minhMood,
					mouth: mouthOf(S, 'minh', frame),
					armLeft: frame < S.cues['r-01'].to ? HANDS_ON_KNEES : undefined,
					armRight: frame < S.cues['r-01'].to ? HANDS_ON_KNEES : undefined,
					tilt: speaking(S, frame, 'r-01') ? -5 : 0,
				}}
				tu={{
					...SPOT.tu,
					mood: speaking(S, frame, 'r-04') ? 'yell' : 'suspicious',
					mouth: mouthOf(S, 'tu', frame),
					armLeft: HANDS_ON_HIPS,
					armRight: HANDS_ON_HIPS,
					tilt: speaking(S, frame, 'r-02') ? 6 : 0,
				}}
				vang={back > 0 ? {x: vang.x, y: vang.y, mood: 'gossip', lookX: 0, tilt: -4} : null}
				fx={
					back > 0 ? (
						<g transform={`translate(${vang.x}, ${vang.y - 150}) rotate(-6) scale(0.85)`}>
							<Parcel w={74} h={46} />
						</g>
					) : null
				}
				overlay={(avoid) => (
					<LineOverlay
						scene={S}
						frame={frame}
						anchors={{vang: {x: head.x, y: head.y, side: 'right', lift: 40}}}
						avoid={avoid}
					/>
				)}
			/>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					opacity: interpolate(frame, [0, 8], [1, 0], clamp),
					backgroundColor: '#000',
				}}
			/>
		</AbsoluteFill>
	);
};
