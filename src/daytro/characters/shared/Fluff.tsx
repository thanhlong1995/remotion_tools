import type React from 'react';
import {INK, OUTLINE} from '../../theme';

type FluffProps = {
	readonly cx: number;
	readonly cy: number;
	readonly rx: number;
	readonly ry: number;
	readonly puffs: number;
	readonly puffR: number;
	readonly fill: string;
	// Turns the ring of puffs so neighbouring fluffs don't line up
	readonly phase?: number;
	readonly outline?: boolean;
};

// A cloud-like blob: an ellipse ringed by puffs, outlined as one shape. For fluffy fur
export const Fluff: React.FC<FluffProps> = ({cx, cy, rx, ry, puffs, puffR, fill, phase = 0, outline = true}) => {
	const points = Array.from({length: puffs}, (_, i) => {
		const angle = (i / puffs) * Math.PI * 2 + phase;
		return {id: i, x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry};
	});
	return (
		<g>
			{outline ? (
				<g fill={INK}>
					<ellipse cx={cx} cy={cy} rx={rx + OUTLINE} ry={ry + OUTLINE} />
					{points.map((p) => (
						<circle key={`ink-${p.id}`} cx={p.x} cy={p.y} r={puffR + OUTLINE} />
					))}
				</g>
			) : null}
			<g fill={fill}>
				<ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
				{points.map((p) => (
					<circle key={`fill-${p.id}`} cx={p.x} cy={p.y} r={puffR} />
				))}
			</g>
		</g>
	);
};
