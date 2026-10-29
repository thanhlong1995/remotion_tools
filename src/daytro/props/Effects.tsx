import type React from 'react';
import {fontFamily, INK} from '../theme';

// Cartoon action effects for chases and other intense beats. World-space ones are drawn inside
// <World>; SpeedLines, ActionText and the shake are screen-space.

type Point = {x: number; y: number};

// Puffs of dust (or exhaust) left behind a moving emitter. `at(f)` is where the emitter was on
// frame f (null when it wasn't emitting); a puff is born every `every` frames and drifts by
// `drift` world px over its `life`, growing and fading
export const PuffTrail: React.FC<{
	frame: number;
	from: number;
	at: (f: number) => Point | null;
	every?: number;
	life?: number;
	drift?: Point;
	size?: number;
	color?: string;
}> = ({frame, from, at, every = 3, life = 16, drift = {x: -60, y: -40}, size = 18, color = '#EFE7D6'}) => {
	const first = Math.max(from, frame - life);
	const born: number[] = [];
	for (let f = Math.ceil(first / every) * every; f <= frame; f += every) {
		if (f >= from) {
			born.push(f);
		}
	}
	return (
		<g>
			{born.map((b) => {
				const p = at(b);
				if (!p) {
					return null;
				}
				const age = (frame - b) / life;
				// Each puff is a little cloud of three blobs, wobbling a little differently
				const jitter = Math.sin(b * 12.9898) * 10;
				const cx = p.x + drift.x * age + jitter;
				const cy = p.y + drift.y * age;
				const r = size * (0.7 + 1.5 * age);
				return (
					<g key={b} opacity={0.9 * (1 - age) ** 0.8}>
						{[
							{dx: -0.7, dy: 0.15, k: 0.75},
							{dx: 0.65, dy: 0.2, k: 0.7},
							{dx: 0, dy: -0.3, k: 1},
						].map((blob) => (
							<circle
								key={blob.dx}
								cx={cx + blob.dx * r}
								cy={cy + blob.dy * r}
								r={r * blob.k}
								fill={color}
								stroke={INK}
								strokeWidth={3}
							/>
						))}
					</g>
				);
			})}
		</g>
	);
};

// Sweat flicking off a panicking head, `dir` -1 throws it back to the left
export const SweatFlicks: React.FC<{frame: number; x: number; y: number; dir?: -1 | 1; scale?: number}> = ({
	frame,
	x,
	y,
	dir = -1,
	scale = 1,
}) => (
	<g>
		{[0, 1, 2].map((k) => {
			const age = ((frame + k * 5) % 15) / 15;
			const a = ((-40 - k * 30) * Math.PI) / 180;
			const d = 30 + 70 * age;
			const px = x + dir * Math.cos(a) * d * scale * -1;
			const py = y + Math.sin(a) * d * scale + 60 * age * age * scale;
			return (
				<path
					key={k}
					d={`M ${px} ${py - 9 * scale} Q ${px + 6 * scale} ${py + 2 * scale} ${px} ${py + 6 * scale} Q ${px - 6 * scale} ${py + 2 * scale} ${px} ${py - 9 * scale} Z`}
					fill="#9ED3F0"
					stroke={INK}
					strokeWidth={1.8}
					opacity={1 - age}
				/>
			);
		})}
	</g>
);

// Short motion streaks trailing behind someone running (world space)
export const MotionStreaks: React.FC<{
	frame: number;
	x: number;
	y: number;
	dir?: -1 | 1;
	length?: number;
	rows?: number[];
}> = ({frame, x, y, dir = 1, length = 120, rows = [-140, -80, -20]}) => (
	<g>
		{rows.map((dy, i) => {
			const wobble = 20 * Math.sin(frame / 2 + i);
			const x0 = x - dir * (40 + wobble);
			return (
				<path
					key={dy}
					d={`M ${x0} ${y + dy} L ${x0 - dir * length} ${y + dy}`}
					stroke={INK}
					strokeWidth={5}
					strokeLinecap="round"
					opacity={0.35}
				/>
			);
		})}
	</g>
);

// Speed lines streaming across the frame (screen space), for a camera tracking a chase
export const SpeedLines: React.FC<{frame: number; dir?: -1 | 1; opacity?: number}> = ({
	frame,
	dir = 1,
	opacity = 1,
}) => (
	<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity}}>
		{Array.from({length: 14}, (_, i) => {
			const y = 120 + ((i * 397) % 820);
			const len = 160 + ((i * 131) % 260);
			const speed = 70 + ((i * 53) % 50);
			const x = ((((i * 613 - dir * frame * speed) % 2600) + 2600) % 2600) - 340;
			return (
				<path
					key={i}
					d={`M ${x} ${y} l ${len} 0`}
					stroke={i % 3 === 0 ? INK : '#FFFFFF'}
					strokeWidth={i % 3 === 0 ? 3 : 5}
					strokeLinecap="round"
					opacity={i % 3 === 0 ? 0.25 : 0.7}
				/>
			);
		})}
	</svg>
);

// Comic sound word that pops in and shakes (screen space), e.g. "VÈÈÈO!", "BRỪM BRỪM!"
export const ActionText: React.FC<{
	text: string;
	x: number;
	y: number;
	frame: number;
	from: number;
	life?: number;
	rotate?: number;
	color?: string;
	size?: number;
}> = ({text, x, y, frame, from, life = 30, rotate = -8, color = '#FFD23F', size = 76}) => {
	const t = frame - from;
	if (t < 0 || t > life) {
		return null;
	}
	const pop = Math.min(1, t / 5);
	const fade = t > life - 6 ? (life - t) / 6 : 1;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `translate(-50%, -50%) rotate(${rotate + 3 * Math.sin(t)}deg) scale(${0.4 + 0.6 * pop}) skewX(-12deg)`,
				fontFamily,
				fontSize: size,
				fontWeight: 900,
				fontStyle: 'italic',
				color,
				WebkitTextStroke: `10px ${INK}`,
				paintOrder: 'stroke fill',
				opacity: fade,
				whiteSpace: 'nowrap',
			}}
		>
			{text}
		</div>
	);
};

// Hand-held camera jitter for intense beats: offsets in world px and a little roll in degrees
export const shakeAt = (frame: number, amount = 1) => ({
	dx: amount * (7 * Math.sin(frame * 1.7) + 4 * Math.sin(frame * 3.1)),
	dy: amount * (5 * Math.sin(frame * 2.3 + 1) + 3 * Math.sin(frame * 4.7)),
	roll: amount * 0.6 * Math.sin(frame * 0.9),
});

// Little stars circling a dazed head (world space), e.g. after a zap or a fall
export const DizzyStars: React.FC<{frame: number; x: number; y: number; r?: number; count?: number}> = ({
	frame,
	x,
	y,
	r = 70,
	count = 4,
}) => (
	<g>
		{Array.from({length: count}, (_, i) => {
			const a = frame / 6 + (i * 2 * Math.PI) / count;
			const sx = x + r * Math.cos(a);
			const sy = y + r * 0.3 * Math.sin(a);
			const front = Math.sin(a) > 0;
			const s = front ? 1 : 0.75;
			const star = Array.from({length: 10}, (__, k) => {
				const rr = (k % 2 ? 8 : 21) * s;
				const t = (k * Math.PI) / 5 - Math.PI / 2;
				return `${sx + rr * Math.cos(t)},${sy + rr * Math.sin(t)}`;
			}).join(' ');
			return <polygon key={i} points={star} fill="#FFD23F" stroke={INK} strokeWidth={2.5} opacity={front ? 1 : 0.7} />;
		})}
	</g>
);
