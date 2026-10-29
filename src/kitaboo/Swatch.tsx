import type React from 'react';
import {Interactive, type InteractivitySchema} from 'remotion';
import {fontFamily} from './fonts';

type SwatchProps = {
	readonly children: string;
	readonly color: string;
	readonly style?: React.CSSProperties;
};

// A color dot with its name underneath
const SwatchInner: React.FC<SwatchProps> = ({children, color, style}) => {
	return (
		<Interactive.Div
			style={{
				position: 'absolute',
				width: 280,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 16,
				fontFamily,
				fontSize: 46,
				fontWeight: 700,
				color: '#1B2A5E',
				...style,
			}}
		>
			<div
				style={{
					width: 140,
					height: 140,
					borderRadius: '50%',
					backgroundColor: color,
					border: '10px solid #FFFFFF',
					boxShadow: '0 14px 30px rgba(27, 42, 94, 0.2)',
				}}
			/>
			{children}
		</Interactive.Div>
	);
};

const swatchSchema = {
	children: {type: 'text-content', default: '', description: 'Color name'},
	color: {type: 'color', default: '#F4C7BE', description: 'Color'},
} as const satisfies InteractivitySchema;

export const Swatch = Interactive.withSchema({
	Component: SwatchInner,
	componentName: '<Swatch>',
	schema: swatchSchema,
	wrapInSequence: true,
});
