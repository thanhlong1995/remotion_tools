import type React from 'react';
import {Interactive, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';

type PulseRingProps = {
	readonly color: string;
	readonly size: number;
	readonly style?: React.CSSProperties;
};

// Highlight ring that pulses once per second. `left`/`top` mark its center.
const PulseRingInner: React.FC<PulseRingProps> = ({color, size, style}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = (frame % fps) / fps;

	return (
		<Interactive.Div
			style={{
				position: 'absolute',
				width: size,
				height: size,
				marginLeft: -size / 2,
				marginTop: -size / 2,
				...style,
			}}
		>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: '50%',
					border: `9px solid ${color}`,
					boxShadow: `0 0 30px ${color}, inset 0 0 20px ${color}`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: '50%',
					border: `6px solid ${color}`,
					opacity: 1 - t,
					scale: 1 + t * 0.7,
				}}
			/>
		</Interactive.Div>
	);
};

const pulseRingSchema = {
	color: {type: 'color', default: '#FFFFFF', description: 'Ring color'},
	size: {
		type: 'number',
		default: 160,
		min: 20,
		step: 1,
		hiddenFromList: false,
		keyframable: false,
		description: 'Diameter',
	},
} as const satisfies InteractivitySchema;

export const PulseRing = Interactive.withSchema({
	Component: PulseRingInner,
	componentName: '<PulseRing>',
	schema: pulseRingSchema,
	wrapInSequence: true,
});
