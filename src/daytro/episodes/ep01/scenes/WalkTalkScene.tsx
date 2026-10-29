import type React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Mood} from '../../../characters/minh/MinhHead';
import type {TuMood} from '../../../characters/tu/BaTuHead';
import {type Cam, toScreen, visibleX, World} from '../../../camera';
import {Alley} from '../../../sets/Alley';
import {Group, groupBoxes, vangHead} from '../Group';
import {blinkAt, LineOverlay, WALK} from '../kit';
import {mouthOf, scene, speaking, thinking} from '../timeline';

// Faces per line; anything not listed stays neutral
const FACES: Record<string, {minh?: Mood; tu?: TuMood; minhTilt?: number; tuTilt?: number}> = {
	's1-01': {tu: 'suspicious'},
	's1-03': {tu: 'suspicious'},
	's1-05': {tu: 'suspicious', tuTilt: 4},
	's1-06': {minh: 'happy'},
	's1-07': {tu: 'yell'},
	's1-08': {minh: 'scared', minhTilt: 6},
	's1-09': {tu: 'suspicious', tuTilt: -8, minh: 'scared'},
	's1-10': {minh: 'happy', tu: 'suspicious'},
	's2-02': {minh: 'smug', minhTilt: -6},
};

// The couple walk Vàng down the alley and talk; used for the gossip and the reminder scenes
export const WalkTalkScene: React.FC<{sceneKey: string; startX: number}> = ({sceneKey, startX}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = scene(sceneKey);
	const t = frame / fps;
	const x = startX + WALK.speed * t;
	const cam: Cam = {x: x + 150, y: 560, zoom: 1};
	const current = Object.keys(FACES).find((id) => speaking(s, frame, id));
	const face = current ? FACES[current] : {};
	const head = toScreen(cam, vangHead(x).x, vangHead(x).y);
	return (
		<AbsoluteFill>
			<World cam={cam}>
				<Alley {...visibleX(cam)} />
				<Group
					x={x}
					t={t}
					amount={1}
					frame={frame}
					minh={{
						mood: face.minh ?? 'neutral',
						mouthOpen: mouthOf(s, 'minh', frame),
						headTilt: face.minhTilt,
						blink: blinkAt(frame, 0, 84),
					}}
					tu={{
						mood: face.tu ?? 'neutral',
						mouthOpen: mouthOf(s, 'tu', frame),
						headTilt: face.tuTilt,
						blink: blinkAt(frame, 30, 70),
					}}
					vang={{
						blink: blinkAt(frame, 12, 60),
						panting: thinking(s, 'vang', frame) ? 0 : 0.6 + 0.3 * Math.sin(frame * 0.9),
					}}
				/>
			</World>
			<LineOverlay
				scene={s}
				frame={frame}
				anchors={{vang: {x: head.x, y: head.y, side: 'right'}}}
				avoid={groupBoxes(cam, x)}
			/>
		</AbsoluteFill>
	);
};
