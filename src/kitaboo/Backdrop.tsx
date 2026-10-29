import type React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

type BackdropProps = {
	readonly top: string;
	readonly bottom: string;
	readonly glow: string;
	readonly sparkle: string;
};

const SPARKLES = [
	{x: 70, y: 180, size: 46, phase: 0},
	{x: 950, y: 120, size: 34, phase: 20},
	{x: 1000, y: 560, size: 28, phase: 40},
	{x: 30, y: 760, size: 30, phase: 60},
	{x: 990, y: 1180, size: 42, phase: 10},
	{x: 40, y: 1420, size: 36, phase: 30},
	{x: 930, y: 1760, size: 30, phase: 50},
	{x: 170, y: 1830, size: 24, phase: 70},
	{x: 520, y: 70, size: 22, phase: 15},
	{x: 780, y: 1860, size: 20, phase: 45},
];

const BUBBLES = [
	{x: 110, size: 38, speed: 2.2, offset: 0},
	{x: 300, size: 22, speed: 3.1, offset: 600},
	{x: 520, size: 30, speed: 2.6, offset: 1200},
	{x: 770, size: 44, speed: 1.9, offset: 300},
	{x: 940, size: 26, speed: 2.9, offset: 900},
	{x: 650, size: 18, speed: 3.4, offset: 1500},
	{x: 210, size: 28, speed: 2.4, offset: 1800},
];

export const SPARKLE_PATH =
	'M50 0 C54 34 66 46 100 50 C66 54 54 66 50 100 C46 66 34 54 0 50 C34 46 46 34 50 0 Z';

// Soft pastel gradient with twinkling sparkles and rising water bubbles.
// Purely decorative, so the sparkles and bubbles share one template.
export const Backdrop: React.FC<BackdropProps> = ({top, bottom, glow, sparkle}) => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill
			style={{
				background: `linear-gradient(180deg, ${top} 0%, ${bottom} 100%)`,
				overflow: 'hidden',
			}}
		>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at 18% 12%, ${glow} 0%, transparent 42%), radial-gradient(circle at 88% 82%, ${glow} 0%, transparent 38%)`,
				}}
			/>
			{BUBBLES.map((b) => {
				const travel = (frame * b.speed + b.offset) % 2300;
				return (
					<div
						key={b.offset}
						style={{
							position: 'absolute',
							left: b.x + Math.sin((frame + b.offset) * 0.05) * 14,
							top: 2020 - travel,
							width: b.size,
							height: b.size,
							borderRadius: '50%',
							border: '2px solid rgba(255,255,255,0.65)',
							background:
								'radial-gradient(circle at 32% 30%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.06) 70%)',
						}}
					/>
				);
			})}
			{SPARKLES.map((s) => {
				const twinkle = 0.5 + 0.5 * Math.sin((frame + s.phase) * 0.14);
				return (
					<svg
						key={s.phase}
						viewBox="0 0 100 100"
						width={s.size}
						height={s.size}
						style={{
							position: 'absolute',
							left: s.x - s.size / 2,
							top: s.y - s.size / 2,
							opacity: 0.35 + 0.65 * twinkle,
							scale: 0.6 + 0.4 * twinkle,
							rotate: `${(frame + s.phase) * 0.6}deg`,
						}}
					>
						<path d={SPARKLE_PATH} fill={sparkle} />
					</svg>
				);
			})}
		</AbsoluteFill>
	);
};
