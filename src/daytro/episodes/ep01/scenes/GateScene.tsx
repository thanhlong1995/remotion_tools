import type React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Minh, minhHand} from '../../../characters/minh/Minh';
import {BaTu} from '../../../characters/tu/BaTu';
import {Vang} from '../../../characters/vang/Vang';
import {type Cam, toScreen, visibleX, World} from '../../../camera';
import {Alley} from '../../../sets/Alley';
import {fontFamily, INK} from '../../../theme';
import {blinkAt, clamp, Leash, LineOverlay, ramp, SCALE} from '../kit';
import {scene, speaking} from '../timeline';
import {boxAt} from '../../../ui/layout';

const S = scene('gate');
const CAM: Cam = {x: 520, y: 600, zoom: 1};
const VANG = {x: 520, y: 1030};
const MINH_POSE = {shoulder: 16, elbow: -10};

// Vàng introduces himself in front of the gate; the gate opens and his "servants" come out
export const GateScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const open = ramp(frame, S.marks.gateOpen, 22);
	// The couple walk out of the courtyard towards us
	const out = ramp(frame, S.marks.gateOpen + 8, 30);
	const step = Math.abs(Math.sin(frame / 4)) * 6 * (out > 0 && out < 1 ? 1 : 0);
	const people = {y: interpolate(out, [0, 1], [950, 1015]), scale: interpolate(out, [0, 1], [0.58, 0.74])};
	const minhX = 760;
	const hand = minhHand(-1, MINH_POSE);
	const handW = {x: minhX + hand.x * people.scale, y: people.y - step + hand.y * people.scale};
	const tag = {x: VANG.x, y: VANG.y - 182 * 0.95 * SCALE};
	const vangHead = toScreen(CAM, VANG.x, VANG.y - 330 * SCALE);
	// "Đến giờ rồi… đi thôi": walk time, and he can't wait
	const eager = speaking(S, frame, 's0-02');
	const title = spring({frame: frame - S.marks.title, fps, config: {damping: 12, stiffness: 120}});
	return (
		<AbsoluteFill>
			<World cam={CAM}>
				<Alley {...visibleX(CAM)} gateTile={0} gateOpen={open} />
				{out > 0 ? (
					<g opacity={interpolate(out, [0, 0.15], [0, 1], clamp)}>
						<g transform={`translate(330, ${people.y - step}) scale(${people.scale})`}>
							<BaTu mood="neutral" blink={blinkAt(frame, 20, 70)} lookX={1} />
						</g>
						<g transform={`translate(${minhX}, ${people.y - step}) scale(${people.scale})`}>
							<Minh mood="smug" blink={blinkAt(frame, 0, 84)} armLeft={MINH_POSE} />
						</g>
						<Leash x1={handW.x} y1={handW.y} x2={tag.x} y2={tag.y} sag={40} />
					</g>
				) : null}
				<ellipse cx={VANG.x} cy={VANG.y} rx={150} ry={14} fill="#000000" opacity={0.12} />
				<g transform={`translate(${VANG.x}, ${VANG.y}) scale(${0.95 * SCALE})`}>
					<Vang
						mood={eager ? 'happy' : 'neutral'}
						blink={blinkAt(frame, 10, 64)}
						tailWag={10 * Math.sin(frame / 4)}
						headTilt={eager ? 6 : 0}
						lookX={eager ? -1 : 0}
					/>
				</g>
			</World>
			<LineOverlay
				scene={S}
				frame={frame}
				anchors={{vang: {x: vangHead.x, y: vangHead.y, side: 'right', lift: 220}}}
				avoid={[
					boxAt(CAM, VANG.x + 20, VANG.y, 300 * 0.95 * SCALE, 420 * 0.95 * SCALE, 0.55),
					...(out > 0
						? [
								boxAt(CAM, 330, people.y, 300 * people.scale, 730 * people.scale, 0.36),
								boxAt(CAM, minhX, people.y, 300 * people.scale, 750 * people.scale, 0.36),
							]
						: []),
				]}
			/>
			{frame >= S.marks.title ? (
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: 110,
						textAlign: 'center',
						transform: `scale(${title})`,
						fontFamily,
						color: '#FFF4D6',
						WebkitTextStroke: `12px ${INK}`,
						paintOrder: 'stroke fill',
					}}
				>
					<div style={{fontSize: 56, fontWeight: 800}}>Tập 1</div>
					<div style={{fontSize: 120, fontWeight: 800, lineHeight: 1.1}}>Dây chắc lắm!</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};
