import type React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Muop, type MuopMood} from '../../characters/muop/Muop';
import {VangHead} from '../../characters/vang/VangHead';
import {RIDGE_Y, Roof} from '../../sets/Roof';
import {fontFamily} from '../../theme';
import {type Anchor, blinkAt, clamp, ramp} from './kit';
import type {Scene} from './timeline';

const MUOP = {x: 960, y: RIDGE_Y + 6, scale: 2.2};
const MUOP_HEAD = {x: MUOP.x, y: MUOP.y - 150 * MUOP.scale};

type OutroProps = {
	readonly scene: Scene;
	readonly overlay: React.FC<{scene: Scene; frame: number; anchors: Record<string, Anchor>}>;
	readonly night?: boolean;
	readonly muopMood?: MuopMood;
	// Something in front of Mướp's paws, e.g. a stolen chicken foot
	readonly loot?: React.ReactNode;
	// Small line under "Còn tiếp…", e.g. next episode's title
	readonly teaser?: string;
};

// Every episode ends the same way: Mướp on the tin roof passes judgement, iris out, then Vàng pops
// up on the end card. The scene needs marks "iris" and "card"
export const Outro: React.FC<OutroProps> = ({
	scene: S,
	overlay: LineOverlay,
	night = false,
	muopMood = 'judge',
	loot,
	teaser,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const iris = ramp(frame, S.marks.iris, 30);
	const radius = interpolate(iris, [0, 1], [1300, 0]);
	const card = frame >= S.marks.card - 2;
	const peek = spring({frame: frame - S.marks.card, fps, config: {damping: 14}});
	const vangHead = {x: 360, y: 1080 + 40 - 360 * peek};
	return (
		<AbsoluteFill style={{backgroundColor: '#000000'}}>
			{card ? (
				<>
					<div
						style={{
							position: 'absolute',
							right: 140,
							top: 400,
							textAlign: 'right',
							fontFamily,
							color: '#FFF4D6',
							opacity: interpolate(frame, [S.marks.card, S.marks.card + 12], [0, 1], clamp),
						}}
					>
						<div style={{fontSize: 110, fontWeight: 800}}>Còn tiếp…</div>
						{teaser ? <div style={{fontSize: 44, fontWeight: 700, marginTop: 10}}>{teaser}</div> : null}
					</div>
					<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
						<g transform={`translate(${vangHead.x}, ${vangHead.y + 230}) scale(2.2)`}>
							<VangHead mood="gossip" blink={blinkAt(frame, 4, 50)} lookX={1} lookY={-1} mouthOpen={0} />
						</g>
					</svg>
					<LineOverlay
						scene={S}
						frame={frame}
						anchors={{vang: {x: vangHead.x + 60, y: vangHead.y - 40, side: 'right'}}}
					/>
				</>
			) : (
				<>
					<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
						<defs>
							<mask id="iris">
								<rect width={1920} height={1080} fill="#FFFFFF" />
								<circle cx={MUOP_HEAD.x} cy={MUOP_HEAD.y} r={radius} fill="#000000" />
							</mask>
						</defs>
						<Roof night={night} />
						<g transform={`translate(${MUOP.x}, ${MUOP.y}) scale(${MUOP.scale})`}>
							<Muop mood={muopMood} blink={blinkAt(frame, 22, 80)} lookX={-1} tailFlick={6 * Math.sin(frame / 14)} />
							{loot}
						</g>
						<rect width={1920} height={1080} fill="#000000" mask="url(#iris)" opacity={iris > 0 ? 1 : 0} />
					</svg>
					<LineOverlay scene={S} frame={frame} anchors={{muop: {x: MUOP_HEAD.x, y: MUOP_HEAD.y - 30, side: 'left'}}} />
				</>
			)}
		</AbsoluteFill>
	);
};
