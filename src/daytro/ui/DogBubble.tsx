import {measureText} from '@remotion/layout-utils';
import type React from 'react';
import {VANG} from '../characters/vang/palette';
import {fontFamily, INK} from '../theme';
import {type Box, placeCloud} from './layout';

const FONT = 34;
const LINE = 1.3;
const PAD_X = 58;
const PAD_Y = 36;
const MAX_TEXT = 540;
const FILL = '#FFF6E5';

// A paw print, centred on (x, y)
const Paw: React.FC<{x: number; y: number; r: number; rotate: number}> = ({x, y, r, rotate}) => (
	<g transform={`translate(${x}, ${y}) rotate(${rotate})`}>
		<ellipse cx={0} cy={r * 0.35} rx={r * 0.8} ry={r * 0.65} fill={FILL} stroke={INK} strokeWidth={3} />
		{[-0.75, -0.25, 0.25, 0.75].map((k) => (
			<circle
				key={k}
				cx={k * r * 0.95}
				cy={-r * (0.55 + 0.25 * (1 - Math.abs(k)))}
				r={r * 0.3}
				fill={FILL}
				stroke={INK}
				strokeWidth={2.5}
			/>
		))}
	</g>
);

type DogBubbleProps = {
	readonly text: string;
	// Screen point of Vàng's head (thought) or mouth (speech)
	readonly toX: number;
	readonly toY: number;
	readonly side?: 'left' | 'right';
	readonly show?: number;
	readonly lift?: number;
	readonly avoid?: readonly Box[];
	// thought: a trail of paw prints; speech: a little pointer to his mouth
	readonly mode: 'thought' | 'speech';
};

// Vàng's own caption bubble: a chubby, rounded cream blob with his two ears (one up, one floppy)
// and a curly tail, for his thoughts and, among the pets, his words
export const DogBubble: React.FC<DogBubbleProps> = ({
	text,
	toX,
	toY,
	side = 'left',
	show = 1,
	lift = 0,
	avoid = [],
	mode,
}) => {
	const {width} = measureText({text, fontFamily, fontSize: FONT, fontWeight: '700'});
	const lines = Math.ceil(width / MAX_TEXT);
	const textW = Math.min(width, MAX_TEXT) + 8;
	const w = textW + PAD_X * 2;
	const h = lines * FONT * LINE + PAD_Y * 2;
	// Room above for the ears and to the side for the tail
	const {x, y} = placeCloud(w + 40, h + 50, toX, toY, side, lift, avoid);
	const bx = x + 10;
	const by = y + 44;
	const r = Math.min(h / 2, 90);
	const startX = Math.max(bx + r, Math.min(bx + w - r, toX));
	const startY = by + h;
	const trail = [0.32, 0.6, 0.84].map((t, i) => ({
		x: startX + (toX - startX) * t,
		y: startY + 10 + (toY - startY - 10) * t,
		r: 19 - i * 4.5,
		rotate: (toX < startX ? -1 : 1) * (20 + i * 15),
	}));
	const pointer = `M ${startX - 26} ${startY - 4} Q ${(startX + toX) / 2} ${(startY + toY) / 2} ${toX} ${toY} Q ${startX + 4} ${startY + 22} ${startX + 26} ${startY - 4} Z`;
	const tailX = bx + w - 6;
	const tailY = by + h * 0.55;
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
				{mode === 'speech' ? (
					<path d={pointer} fill={FILL} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
				) : null}
				{/* Curly tail */}
				<path
					d={`M ${tailX} ${tailY} C ${tailX + 44} ${tailY - 6} ${tailX + 54} ${tailY - 56} ${tailX + 24} ${tailY - 62} C ${tailX + 4} ${tailY - 64} ${tailX + 8} ${tailY - 40} ${tailX + 24} ${tailY - 42}`}
					fill="none"
					stroke={INK}
					strokeWidth={22}
					strokeLinecap="round"
				/>
				<path
					d={`M ${tailX} ${tailY} C ${tailX + 44} ${tailY - 6} ${tailX + 54} ${tailY - 56} ${tailX + 24} ${tailY - 62} C ${tailX + 4} ${tailY - 64} ${tailX + 8} ${tailY - 40} ${tailX + 24} ${tailY - 42}`}
					fill="none"
					stroke={VANG.fur}
					strokeWidth={14}
					strokeLinecap="round"
				/>
				{/* Ears: the left one stands up, the right one flops over, like Vàng's */}
				<g transform={`translate(${bx + w * 0.28}, ${by + 14}) scale(1.35)`}>
					<path
						d="M -34 6 Q -30 -58 4 -66 Q 30 -40 34 6 Z"
						fill={VANG.fur}
						stroke={INK}
						strokeWidth={4}
						strokeLinejoin="round"
					/>
					<path d="M -18 2 Q -14 -40 4 -46 Q 18 -28 20 2 Z" fill={VANG.innerEar} />
				</g>
				<g transform={`translate(${bx + w * 0.72}, ${by + 14}) scale(1.35)`}>
					<path
						d="M -32 6 Q -30 -40 0 -46 Q 34 -50 52 -14 Q 30 -18 26 6 Z"
						fill={VANG.furShade}
						stroke={INK}
						strokeWidth={4}
						strokeLinejoin="round"
					/>
				</g>
				{/* The chubby body */}
				<rect x={bx} y={by} width={w} height={h} rx={r} ry={r} fill={FILL} stroke={INK} strokeWidth={4.5} />
				{mode === 'speech' ? (
					<path d={`M ${startX - 22} ${startY - 2} L ${startX + 22} ${startY - 2}`} stroke={FILL} strokeWidth={7} />
				) : null}
				{/* Rosy cheeks */}
				{[bx + 26, bx + w - 26].map((cx) => (
					<ellipse key={cx} cx={cx} cy={by + h * 0.62} rx={11} ry={7} fill="#F2B8A8" opacity={0.7} />
				))}
				{mode === 'thought' ? trail.map((p) => <Paw key={p.r} x={p.x} y={p.y} r={p.r} rotate={p.rotate} />) : null}
			</svg>
			<div
				style={{
					position: 'absolute',
					left: bx + PAD_X - 4,
					top: by + PAD_Y,
					width: textW,
					fontFamily,
					fontSize: FONT,
					fontWeight: 700,
					fontStyle: mode === 'thought' ? 'italic' : 'normal',
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
