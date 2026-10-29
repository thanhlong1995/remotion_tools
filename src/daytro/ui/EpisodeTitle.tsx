import type React from 'react';
import {fontFamily, INK} from '../theme';

// Episode number and title springing up in the middle of the opening shot
export const EpisodeTitle: React.FC<{number: number; title: string; scale: number; opacity?: number}> = ({
	number,
	title,
	scale,
	opacity = 1,
}) => (
	<div
		style={{
			position: 'absolute',
			left: 0,
			right: 0,
			top: 110,
			textAlign: 'center',
			transform: `scale(${scale})`,
			opacity,
			fontFamily,
			color: '#FFF4D6',
			WebkitTextStroke: `12px ${INK}`,
			paintOrder: 'stroke fill',
		}}
	>
		<div style={{fontSize: 56, fontWeight: 800}}>Tập {number}</div>
		<div style={{fontSize: 120, fontWeight: 800, lineHeight: 1.1}}>{title}</div>
	</div>
);
