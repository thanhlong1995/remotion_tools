import type React from 'react';
import {fontFamily} from '../theme';

// Burned-in subtitle for spoken lines: big white text with a dark outline, bottom centre, or at the
// top when a face is low in the frame
export const Subtitle: React.FC<{text: string; opacity?: number; top?: boolean}> = ({
	text,
	opacity = 1,
	top = false,
}) => (
	<div
		style={{
			position: 'absolute',
			left: 160,
			right: 160,
			...(top ? {top: 40} : {bottom: 46}),
			textAlign: 'center',
			fontFamily,
			fontSize: 50,
			fontWeight: 800,
			lineHeight: 1.25,
			color: '#FFFFFF',
			opacity,
			WebkitTextStroke: '10px #2B2628',
			paintOrder: 'stroke fill',
		}}
	>
		{text}
	</div>
);
