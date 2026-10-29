import type React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Mood} from '../../../characters/minh/MinhHead';
import {type Cam, toScreen, visibleX, World} from '../../../camera';
import {Alley, GROUND_Y} from '../../../sets/Alley';
import {drinkerBoxes, Drinkers} from '../../shared/Drinkers';
import {DEFAULT_LEASH_ARM, Group, groupBoxes, minhHandWorld, vangHead} from '../Group';
import {biped, blinkAt, LineOverlay, ramp, SCALE, WALK} from '../kit';
import {mouthOf, scene, speaking, thinking} from '../timeline';

const S = scene('nhau');
const START_X = 15000;
export const TABLE_AHEAD = 760;

// Distance walked and walking time by this frame, with the stride easing out at the stop
const walked = (frame: number) => {
	let d = 0;
	for (let f = 0; f < frame; f++) {
		d += 1 - ramp(f, S.marks.stop - 10, 12);
	}
	return d;
};

// Where the couple come to a stop, and the table ahead of them; the next scenes pick up here
export const nhauStopX = () => START_X + (WALK.speed * walked(S.marks.stop + 4)) / 30;

// Minh's face per line; between lines he just stares at the table
const MINH_FACE: Record<string, Mood> = {'s4-03': 'crave', 's4-04': 'crave', 's4-05': 'scared', 's4-07': 'scared'};

// Passing the street drinking corner: Sáu and Hùng call Minh over, he stares, the leash goes slack
export const NhauScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const m = S.marks;
	const dist = walked(frame);
	const amount = 1 - ramp(frame, m.stop - 10, 12);
	const t = dist / fps;
	const x = START_X + (WALK.speed * dist) / fps;
	const stopX = nhauStopX();
	const tableX = stopX + TABLE_AHEAD;
	const wide: Cam = {x: Math.min(x + 150, stopX + 380), y: 560, zoom: 1};
	const bob = biped(t, WALK.minh, 0, amount).bob;
	const hand = minhHandWorld(x, bob, 0, DEFAULT_LEASH_ARM(0, 0));
	const vHead = vangHead(x);
	// One camera per beat: wide, Minh's face, his slipping hand, Vàng
	const shot = (() => {
		if (frame >= m.crave && frame < m.wide) {
			return {x: x + 130, y: GROUND_Y - 420, zoom: 2.3};
		}
		if (frame >= m.hand && frame < m.vang) {
			return {x: hand.x + 40, y: hand.y + 10, zoom: 2.8};
		}
		if (frame >= m.vang && frame < m.wide2) {
			return {x: vHead.x - 40, y: vHead.y + 60, zoom: 1.9};
		}
		return wide;
	})();
	const sauCue = S.cues['s4-01'];
	const sauStand = ramp(frame, sauCue.from - 4, 10);
	const staring = frame >= m.stop + 10;
	const faceLine = Object.keys(MINH_FACE).find((id) => speaking(S, frame, id));
	const minhMood: Mood = faceLine ? MINH_FACE[faceLine] : staring ? 'crave' : 'neutral';
	const slip = 0.6 * ramp(frame, m.hand + 6, 36);
	const head = toScreen(shot, vHead.x, vHead.y);
	// Smell of grilled chicken drifting from the table to Minh's nose
	const nose = {x: x + SCALE * 92, y: GROUND_Y - SCALE * 548};
	const plate = {x: tableX + 26, y: GROUND_Y - 290};
	const smell = `M ${plate.x} ${plate.y} C ${plate.x - 140} ${plate.y - 120 + 20 * Math.sin(frame / 6)} ${nose.x + 220} ${nose.y + 80} ${nose.x + 10} ${nose.y}`;
	return (
		<AbsoluteFill>
			<World cam={shot}>
				<Alley {...visibleX(shot)} />
				<Drinkers
					x={tableX}
					frame={frame}
					sauStand={sauStand}
					sauArm={120 * sauStand * (speaking(S, frame, 's4-01') ? 1 : 0.6)}
					sauMood={speaking(S, frame, 's4-07') ? 'wink' : speaking(S, frame, 's4-01') ? 'brag' : 'grin'}
					sauMouth={mouthOf(S, 'sau', frame)}
					hungMouth={mouthOf(S, 'hung', frame)}
				/>
				<Group
					x={x}
					t={t}
					amount={amount}
					frame={frame}
					minh={{
						mood: minhMood,
						mouthOpen: mouthOf(S, 'minh', frame),
						headTilt: speaking(S, frame, 's4-05') ? -10 : 0,
						blink: blinkAt(frame, 0, 84),
					}}
					tu={{
						mood: frame >= m.crave ? 'suspicious' : 'neutral',
						mouthOpen: mouthOf(S, 'tu', frame),
						headTilt: speaking(S, frame, 's4-04') ? -6 : 0,
						blink: blinkAt(frame, 30, 70),
					}}
					vang={{
						blink: blinkAt(frame, 12, 60),
						panting: thinking(S, 'vang', frame) ? 0 : 0.6 + 0.3 * Math.sin(frame * 0.9),
					}}
					slip={slip}
				/>
				{staring && frame < m.wide ? (
					<path
						d={smell}
						fill="none"
						stroke="#FFFFFF"
						strokeWidth={6}
						strokeLinecap="round"
						strokeDasharray="18 14"
						opacity={0.85}
					/>
				) : null}
			</World>
			<LineOverlay
				scene={S}
				frame={frame}
				anchors={{vang: {x: head.x, y: head.y, side: 'left'}}}
				avoid={[...groupBoxes(shot, x), ...drinkerBoxes(shot, tableX, sauStand)]}
			/>
		</AbsoluteFill>
	);
};
