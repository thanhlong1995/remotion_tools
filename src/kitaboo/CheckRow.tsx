import type React from 'react';
import {Interactive, type InteractivitySchema} from 'remotion';
import {fontFamily} from './fonts';

type CheckRowProps = {
	readonly children: string;
	readonly checkColor: string;
	readonly style?: React.CSSProperties;
};

const CheckRowInner: React.FC<CheckRowProps> = ({children, checkColor, style}) => {
	return (
		<Interactive.Div
			style={{
				position: 'absolute',
				left: 90,
				width: 900,
				height: 124,
				display: 'flex',
				alignItems: 'center',
				gap: 28,
				padding: '0 36px',
				borderRadius: 36,
				backgroundColor: '#FFFFFF',
				boxShadow: '0 14px 30px rgba(27, 42, 94, 0.14)',
				fontFamily,
				fontSize: 54,
				fontWeight: 700,
				color: '#1B2A5E',
				...style,
			}}
		>
			<svg width={72} height={72} viewBox="0 0 72 72" style={{flexShrink: 0}}>
				<circle cx={36} cy={36} r={36} fill={checkColor} />
				<path
					d="M20 37 L31 48 L53 25"
					fill="none"
					stroke="#FFFFFF"
					strokeWidth={8}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
			{children}
		</Interactive.Div>
	);
};

const checkRowSchema = {
	children: {type: 'text-content', default: '', description: 'Text'},
	checkColor: {type: 'color', default: '#5DBB7A', description: 'Check color'},
} as const satisfies InteractivitySchema;

export const CheckRow = Interactive.withSchema({
	Component: CheckRowInner,
	componentName: '<CheckRow>',
	schema: checkRowSchema,
	wrapInSequence: true,
});
