import type React from 'react';
import {fontFamily, INK} from '../theme';

// Time card in the top corner ("Hôm sau…", "Ba ngày sau…"): a strip of paper with hand lettering
export const Caption: React.FC<{text: string; opacity: number}> = ({text, opacity}) => (
	<div
		style={{
			position: 'absolute',
			left: 70,
			top: 60,
			padding: '14px 34px',
			backgroundColor: '#FFF4D6',
			border: `5px solid ${INK}`,
			borderRadius: 10,
			transform: 'rotate(-2deg)',
			fontFamily,
			fontSize: 54,
			fontWeight: 800,
			color: INK,
			opacity,
		}}
	>
		{text}
	</div>
);
