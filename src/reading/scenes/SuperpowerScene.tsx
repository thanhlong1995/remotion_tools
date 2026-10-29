import type {Caption} from '@remotion/captions';
import type React from 'react';
import {AbsoluteFill, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {Backdrop} from '../Backdrop';
import {BoltIcon} from '../Icons';
import {colors, fontFamily} from '../theme';
import {useCue} from '../timeline';
import {pop, rise, slideIn} from '../ui';

type Props = {readonly captions?: Caption[]};

const Step: React.FC<{
	readonly index: number;
	readonly children: string;
	readonly active: boolean;
	readonly style: React.CSSProperties;
}> = ({index, children, active, style}) => (
	<div
		style={{
			position: 'absolute',
			left: 200,
			width: 760,
			height: 110,
			display: 'flex',
			alignItems: 'center',
			gap: 28,
			padding: '0 32px',
			borderRadius: 30,
			backgroundColor: active ? `${colors.purple}33` : colors.card,
			border: `2px solid ${active ? colors.purple : colors.cardBorder}`,
			color: colors.text,
			fontSize: 50,
			fontWeight: 700,
			...style,
		}}
	>
		<div
			style={{
				width: 64,
				height: 64,
				borderRadius: '50%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: colors.purple,
				color: '#0B1020',
				fontSize: 36,
				fontWeight: 800,
			}}
		>
			{index}
		</div>
		{children}
	</div>
);

// The script skeleton Superpower enforces, one beat per spoken step
export const SuperpowerScene: React.FC<Props> = ({captions}) => {
	const frame = useCurrentFrame();
	const cue = useCue(captions);
	const steps = [
		{label: 'Hook 3 giây', at: cue('hook', 60)},
		{label: 'Đặt vấn đề', at: cue('đặt', 85)},
		{label: 'Giải thích', at: cue('giải', 110)},
		{label: 'Giải pháp', at: cue('giải', 130, 1)},
		{label: 'Kêu gọi hành động', at: cue('kêu', 160)},
	];
	const lineEnd = steps[steps.length - 1].at;

	return (
		<AbsoluteFill style={{fontFamily}}>
			<Backdrop accent={colors.purple} />
			<Interactive.Div
				name="Tool header"
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 170,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					gap: 24,
					color: colors.purple,
					fontSize: 92,
					fontWeight: 800,
					...pop(frame, 4, 0.7),
				}}
			>
				<BoltIcon size={92} color={colors.purple} />
				Superpower
			</Interactive.Div>
			<Interactive.Div
				name="Tool role"
				style={{
					position: 'absolute',
					left: 60,
					right: 60,
					top: 300,
					textAlign: 'center',
					color: colors.muted,
					fontSize: 50,
					fontWeight: 500,
					...rise(frame, 14),
				}}
			>
				AI viết kịch bản đúng khung
			</Interactive.Div>
			<div
				style={{
					position: 'absolute',
					left: 147,
					top: 455,
					width: 6,
					borderRadius: 3,
					backgroundColor: `${colors.purple}66`,
					height: interpolate(frame, [steps[0].at, lineEnd + 10], [0, 540], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
				}}
			/>
			{steps.map((step, i) => {
				const next = steps[i + 1]?.at ?? Infinity;
				return (
					<Step
						key={step.label}
						index={i + 1}
						active={frame >= step.at && frame < next}
						style={{top: 400 + i * 135, ...slideIn(frame, step.at)}}
					>
						{step.label}
					</Step>
				);
			})}
		</AbsoluteFill>
	);
};
