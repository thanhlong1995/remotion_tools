import type React from 'react';
import {fontFamily, INK} from '../theme';

// Spiky comic-book burst for a real, audible bark
export const BarkBurst: React.FC<{x: number; y: number; text: string; progress: number; rotate?: number}> = ({
	x,
	y,
	text,
	progress,
	rotate = -8,
}) => {
	const pop = Math.min(1, progress * 5);
	const spikes = 14;
	const points = Array.from({length: spikes * 2}, (_, i) => {
		const a = (i / (spikes * 2)) * Math.PI * 2;
		const r = i % 2 === 0 ? 120 : 82;
		return `${Math.cos(a) * r * 1.5},${Math.sin(a) * r * 0.75}`;
	}).join(' ');
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${0.4 + 0.6 * pop}) rotate(${rotate}deg)`}}>
			<svg width={380} height={200} viewBox="-190 -100 380 200" style={{position: 'absolute', left: -190, top: -100}}>
				<polygon points={points} fill="#FFE45C" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
			</svg>
			<div
				style={{
					position: 'absolute',
					left: -190,
					top: -36,
					width: 380,
					textAlign: 'center',
					fontFamily,
					fontSize: 52,
					fontWeight: 800,
					color: '#D9473C',
					WebkitTextStroke: `3px ${INK}`,
					paintOrder: 'stroke fill',
				}}
			>
				{text}
			</div>
		</div>
	);
};
