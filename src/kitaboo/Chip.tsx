import type React from 'react';
import {Interactive, type InteractivitySchema} from 'remotion';
import {fontFamily} from './fonts';

type ChipProps = {
	readonly children: string;
	readonly color: string;
	readonly backgroundColor: string;
	readonly style?: React.CSSProperties;
};

// Rounded label pill. Give it `left: 0, right: 0` to center it horizontally.
const ChipInner: React.FC<ChipProps> = ({children, color, backgroundColor, style}) => {
	return (
		<Interactive.Div
			style={{
				position: 'absolute',
				width: 'fit-content',
				margin: '0 auto',
				padding: '12px 36px 10px',
				borderRadius: 999,
				fontFamily,
				fontWeight: 700,
				fontSize: 44,
				lineHeight: 1.25,
				letterSpacing: 1,
				whiteSpace: 'nowrap',
				color,
				backgroundColor,
				boxShadow: '0 12px 28px rgba(27, 42, 94, 0.18)',
				...style,
			}}
		>
			{children}
		</Interactive.Div>
	);
};

const chipSchema = {
	children: {type: 'text-content', default: '', description: 'Text'},
	color: {type: 'color', default: '#1B2A5E', description: 'Text color'},
	backgroundColor: {type: 'color', default: '#FFFFFF', description: 'Background'},
} as const satisfies InteractivitySchema;

export const Chip = Interactive.withSchema({
	Component: ChipInner,
	componentName: '<Chip>',
	schema: chipSchema,
	wrapInSequence: true,
});
