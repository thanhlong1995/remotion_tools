import {measureText} from '@remotion/layout-utils';
import type React from 'react';
import {fontFamily, INK} from '../theme';
import {type Box, placeCloud} from './layout';

const FONT = 34;
const LINE = 1.3;
const PAD_X = 46;
const PAD_Y = 34;
const MAX_TEXT = 560;
const BUMP = 26;

// Rectangle with scalloped edges: one outward arc every ~BUMP px all the way round
const cloudPath = (w: number, h: number) => {
	const side = (x0: number, y0: number, x1: number, y1: number) => {
		const len = Math.hypot(x1 - x0, y1 - y0);
		const n = Math.max(2, Math.round(len / BUMP));
		let d = '';
		for (let i = 1; i <= n; i++) {
			const x = x0 + ((x1 - x0) * i) / n;
			const y = y0 + ((y1 - y0) * i) / n;
			d += ` A ${len / n / 1.7} ${len / n / 1.7} 0 0 1 ${x} ${y}`;
		}
		return d;
	};
	return `M 0 0${side(0, 0, w, 0)}${side(w, 0, w, h)}${side(w, h, 0, h)}${side(0, h, 0, 0)} Z`;
};

type ThoughtBubbleProps = {
	readonly text: string;
	// Screen point of the thinker's head; the trail of dots ends here
	readonly toX: number;
	readonly toY: number;
	// Which side of the head the cloud floats to
	readonly side?: 'left' | 'right';
	// 0..1 pop-in / fade
	readonly show?: number;
	// Extra height above the head, as a starting preference
	readonly lift?: number;
	// Characters on screen: the cloud finds a spot that covers none of them
	readonly avoid?: readonly Box[];
};

// A cloud-shaped thought bubble with a trail of shrinking dots down to whoever is thinking it.
// Pets use it whenever humans are around: they think, they don't talk
export const ThoughtBubble: React.FC<ThoughtBubbleProps> = ({
	text,
	toX,
	toY,
	side = 'left',
	show = 1,
	lift = 0,
	avoid = [],
}) => {
	const {width} = measureText({text, fontFamily, fontSize: FONT, fontWeight: '700'});
	const lines = Math.ceil(width / MAX_TEXT);
	const textW = Math.min(width, MAX_TEXT) + 8;
	const w = textW + PAD_X * 2;
	const h = lines * FONT * LINE + PAD_Y * 2;
	const {x, y} = placeCloud(w, h, toX, toY, side, lift, avoid);
	const startX = Math.max(x + 40, Math.min(x + w - 40, toX + (side === 'left' ? -60 : 60)));
	const startY = y + h + 6;
	const dots = [0.3, 0.6, 0.85].map((t, i) => ({
		cx: startX + (toX - startX) * t,
		cy: startY + (toY - startY) * t,
		r: 15 - i * 4.5,
	}));
	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				opacity: Math.min(1, show * 1.5),
				transform: `scale(${0.85 + 0.15 * show})`,
				transformOrigin: `${toX}px ${toY}px`,
			}}
		>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
				<path
					d={cloudPath(w, h)}
					transform={`translate(${x}, ${y})`}
					fill="#FFFFFF"
					stroke={INK}
					strokeWidth={4}
					strokeLinejoin="round"
				/>
				{dots.map((d) => (
					<circle key={d.r} cx={d.cx} cy={d.cy} r={d.r} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
				))}
			</svg>
			<div
				style={{
					position: 'absolute',
					left: x + PAD_X - 4,
					top: y + PAD_Y,
					width: textW,
					fontFamily,
					fontSize: FONT,
					fontWeight: 700,
					fontStyle: 'italic',
					lineHeight: LINE,
					color: '#5A4B55',
					textAlign: 'center',
				}}
			>
				{text}
			</div>
		</div>
	);
};
