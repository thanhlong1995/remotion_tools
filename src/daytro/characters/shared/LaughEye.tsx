import type React from 'react';
import {INK} from '../../theme';

// An eye squeezed shut with laughter: an arc bowed upwards, with a tear at the outer corner
export const LaughEye: React.FC<{x: number; y: number; w: number; side: -1 | 1; tear?: string}> = ({
	x,
	y,
	w,
	side,
	tear,
}) => (
	<g>
		<path
			d={`M ${x - w} ${y + 3} Q ${x} ${y - w * 0.9} ${x + w} ${y + 3}`}
			fill="none"
			stroke={INK}
			strokeWidth={4.5}
			strokeLinecap="round"
		/>
		{tear ? (
			<path
				d={`M ${x + side * (w + 3)} ${y + 4} Q ${x + side * (w + 8)} ${y + 14} ${x + side * (w + 4)} ${y + 18} Q ${x + side * w} ${y + 14} ${x + side * (w + 3)} ${y + 4} Z`}
				fill={tear}
				stroke={INK}
				strokeWidth={1.6}
			/>
		) : null}
	</g>
);
