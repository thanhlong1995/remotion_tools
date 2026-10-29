import type React from 'react';
import {AbsoluteFill} from 'remotion';
import {CREAM, fontFamily, INK} from '../theme';

const BROWN = '#7A5A48';

const text = (size: number, weight: number, color = INK): React.CSSProperties => ({
	fontFamily,
	fontSize: size,
	fontWeight: weight,
	color,
	lineHeight: 1.25,
});

export type Expression = {readonly label: string; readonly node: React.ReactNode; readonly viewBox: string};
export type Swatch = {readonly color: string; readonly label: string};
export type Bubble = {
	readonly text: string;
	readonly x: number;
	readonly y: number;
	readonly width: number;
	// Where the tail points down from, measured from the bubble's left edge
	readonly tailX: number;
};

export const SpeechBubble: React.FC<Bubble> = ({text: line, x, y, width, tailX}) => (
	<div style={{position: 'absolute', left: x, top: y, width}}>
		<div
			style={{
				...text(32, 800),
				backgroundColor: '#FFFFFF',
				border: `5px solid ${INK}`,
				borderRadius: 44,
				padding: '16px 26px',
				textAlign: 'center',
			}}
		>
			{line}
		</div>
		{/* A square turned 45°: its white top hides the bubble border, its two inked sides form the tail */}
		<div
			style={{
				position: 'absolute',
				left: tailX - 14,
				bottom: -16,
				width: 28,
				height: 28,
				backgroundColor: '#FFFFFF',
				borderRight: `5px solid ${INK}`,
				borderBottom: `5px solid ${INK}`,
				transform: 'rotate(45deg)',
			}}
		/>
	</div>
);

type SheetProps = {
	readonly title: string;
	readonly subtitle: string;
	readonly traits: string;
	// Full-body figures, drawn in the 1150 x 1080 area left of the expression panel
	readonly children: React.ReactNode;
	readonly bubbles?: readonly Bubble[];
	readonly expressions: readonly Expression[];
	readonly swatches: readonly Swatch[];
	// 2 columns of large heads, or 3 of smaller ones when showing two characters
	readonly columns?: 2 | 3;
};

// Review sheet for one character design: poses on the left, expressions and palette on the right
export const CharacterSheet: React.FC<SheetProps> = ({
	title,
	subtitle,
	traits,
	children,
	bubbles = [],
	expressions,
	swatches,
	columns = 2,
}) => (
	<AbsoluteFill style={{backgroundColor: CREAM}}>
		<svg width={1150} height={1080} viewBox="0 0 1150 1080" style={{position: 'absolute', left: 0, top: 0}}>
			{children}
		</svg>
		<div style={{position: 'absolute', left: 70, top: 46}}>
			<div style={text(84, 800)}>{title}</div>
			<div style={text(34, 700, BROWN)}>{subtitle}</div>
			<div style={{...text(28, 500, BROWN), marginTop: 8}}>{traits}</div>
		</div>
		{bubbles.map((b) => (
			<SpeechBubble key={b.text} {...b} />
		))}
		<div
			style={{
				position: 'absolute',
				left: 1170,
				top: 110,
				width: 710,
				height: 940,
				borderRadius: 36,
				backgroundColor: 'rgba(255, 255, 255, 0.7)',
				padding: '24px 40px',
				boxSizing: 'border-box',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<div style={text(36, 800)}>Biểu cảm</div>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: columns === 3 ? '1fr 1fr 1fr' : '1fr 1fr',
					rowGap: columns === 3 ? 24 : 0,
					marginTop: columns === 3 ? 30 : 0,
					flex: 1,
					alignContent: 'start',
				}}
			>
				{expressions.map((e) => (
					<div key={e.label} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
						<svg width={columns === 3 ? 200 : 290} height={columns === 3 ? 200 : 290} viewBox={e.viewBox}>
							{e.node}
						</svg>
						<div style={text(columns === 3 ? 24 : 28, 700, BROWN)}>{e.label}</div>
					</div>
				))}
			</div>
			<div style={{display: 'flex', justifyContent: 'space-between'}}>
				{swatches.map((s) => (
					<div key={s.label} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 120}}>
						<div
							style={{
								width: 60,
								height: 60,
								borderRadius: 30,
								backgroundColor: s.color,
								border: `4px solid ${INK}`,
								boxSizing: 'border-box',
							}}
						/>
						<div style={{...text(20, 700, BROWN), textAlign: 'center', marginTop: 6}}>{s.label}</div>
					</div>
				))}
			</div>
		</div>
	</AbsoluteFill>
);
