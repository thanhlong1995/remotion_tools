import type React from 'react';
import {Easing, Interactive, interpolate, type InteractivitySchema} from 'remotion';
import {colors, fontFamily} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Entrance animations keyed to a cue frame. Cues come from the voiceover
// timings, so they are computed rather than hardcoded keyframes.
export const rise = (frame: number, at: number, distance = 50): React.CSSProperties => ({
	opacity: interpolate(frame, [at, at + 8], [0, 1], clamp),
	translate: `0px ${interpolate(frame, [at, at + 16], [distance, 0], {
		...clamp,
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	})}px`,
});

export const slideIn = (frame: number, at: number): React.CSSProperties => ({
	opacity: interpolate(frame, [at, at + 6], [0, 1], clamp),
	translate: `${interpolate(frame, [at, at + 16], [260, 0], {
		...clamp,
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	})}px 0px`,
});

export const pop = (frame: number, at: number, from = 0.4): React.CSSProperties => ({
	opacity: interpolate(frame, [at, at + 5], [0, 1], clamp),
	scale: interpolate(frame, [at, at + 18], [from, 1], {
		...clamp,
		easing: Easing.spring({damping: 10}),
		output: 'perceptual-scale',
	}),
});

type KickerProps = {
	readonly children: string;
	readonly color: string;
	readonly style?: React.CSSProperties;
};

// Small uppercase label at the top of a scene
const KickerInner: React.FC<KickerProps> = ({children, color, style}) => (
	<Interactive.Div
		style={{
			position: 'absolute',
			left: 0,
			right: 0,
			width: 'fit-content',
			margin: '0 auto',
			padding: '12px 30px 10px',
			borderRadius: 999,
			border: `3px solid ${color}`,
			color,
			fontFamily,
			fontSize: 40,
			fontWeight: 800,
			letterSpacing: 3,
			whiteSpace: 'nowrap',
			...style,
		}}
	>
		{children}
	</Interactive.Div>
);

const kickerSchema = {
	children: {type: 'text-content', default: '', description: 'Text'},
	color: {type: 'color', default: colors.yellow, description: 'Color'},
} as const satisfies InteractivitySchema;

export const Kicker = Interactive.withSchema({
	Component: KickerInner,
	componentName: '<Kicker>',
	schema: kickerSchema,
	wrapInSequence: true,
});

type RowProps = {
	readonly children: string;
	readonly accent: string;
	readonly icon: React.ReactNode;
	readonly badge?: React.ReactNode;
	readonly style?: React.CSSProperties;
};

// Glassy card with an icon bubble, a label and an optional badge on the right
const RowInner: React.FC<RowProps> = ({children, accent, icon, badge, style}) => (
	<Interactive.Div
		style={{
			position: 'absolute',
			left: 80,
			width: 920,
			minHeight: 150,
			display: 'flex',
			alignItems: 'center',
			gap: 32,
			padding: '24px 32px',
			borderRadius: 36,
			backgroundColor: colors.card,
			border: `2px solid ${colors.cardBorder}`,
			boxShadow: `inset 6px 0 0 ${accent}`,
			color: colors.text,
			fontFamily,
			fontSize: 50,
			fontWeight: 700,
			lineHeight: 1.25,
			...style,
		}}
	>
		<div
			style={{
				width: 96,
				height: 96,
				borderRadius: 28,
				flexShrink: 0,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: `${accent}26`,
			}}
		>
			{icon}
		</div>
		<div style={{flex: 1}}>{children}</div>
		{badge}
	</Interactive.Div>
);

const rowSchema = {
	children: {type: 'text-content', default: '', description: 'Text'},
	accent: {type: 'color', default: colors.yellow, description: 'Accent'},
} as const satisfies InteractivitySchema;

export const Row = Interactive.withSchema({
	Component: RowInner,
	componentName: '<Row>',
	schema: rowSchema,
	wrapInSequence: true,
});
