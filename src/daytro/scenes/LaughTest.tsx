import type React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {Cam} from '../camera';
import {laughShake} from '../episodes/shared/kit';
import {SPOT, Stage} from '../episodes/shared/Stage';

const CAM: Cam = {x: 820, y: 640, zoom: 1.15};
// Hands clutching the belly
const BELLY_HUNG = {shoulder: 23, elbow: -110};
const BELLY_MINH = {shoulder: 40, elbow: -135};

// Laugh poses for checking: Hùng holds his belly, Sáu snickers behind his hand, Minh roars
export const LaughTest: React.FC = () => {
	const frame = useCurrentFrame();
	const shake = laughShake(frame);
	const off = laughShake(frame + 3);
	const mouth = 0.5 + 0.5 * Math.abs(Math.sin(frame / 2.2));
	return (
		<AbsoluteFill>
			<Stage
				frame={frame}
				cam={CAM}
				night={0}
				lit={false}
				lamp={0}
				minh={{
					...SPOT.minhGround,
					x: 480,
					mood: 'happy',
					mouth,
					tilt: off.tilt,
					squash: off.squash,
					armLeft: BELLY_MINH,
					armRight: BELLY_MINH,
				}}
				tu={null}
				vang={{...SPOT.vang, x: 700, mood: 'neutral', lookX: 1}}
				sau={{x: 960, y: SPOT.sau.y, mood: 'laugh', mouth, tilt: shake.tilt, squash: shake.squash, coverMouth: true}}
				hung={{
					x: 1200,
					y: SPOT.hung.y,
					mood: 'laugh',
					mouth,
					tilt: -shake.tilt,
					squash: off.squash,
					armLeft: BELLY_HUNG,
					speakerOn: false,
				}}
			/>
		</AbsoluteFill>
	);
};
