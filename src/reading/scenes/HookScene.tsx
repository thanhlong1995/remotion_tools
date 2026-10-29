import type {Caption} from '@remotion/captions';
import type React from 'react';
import {AbsoluteFill, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {Backdrop} from '../Backdrop';
import {colors, fontFamily} from '../theme';
import {useCue} from '../timeline';
import {pop, rise} from '../ui';

type Props = {readonly captions?: Caption[]};

// "A whole evening for one 60s clip?" -> struck through -> "20 phút"
export const HookScene: React.FC<Props> = ({captions}) => {
	const frame = useCurrentFrame();
	const cue = useCue(captions);
	const evening = cue('buổi', 30);
	const strike = cue('rút', 70);
	const twenty = cue('20', 85);
	const free = cue('đồng', 130);

	return (
		<AbsoluteFill style={{fontFamily}}>
			<Backdrop accent={colors.yellow} />
			<Interactive.Div
				name="Clip length"
				style={{
					position: 'absolute',
					left: 60,
					right: 60,
					top: 250,
					textAlign: 'center',
					color: colors.text,
					fontSize: 100,
					fontWeight: 800,
					...rise(frame, 4),
				}}
			>
				1 clip 60 giây
			</Interactive.Div>
			<Interactive.Div
				name="Whole evening"
				style={{
					position: 'absolute',
					left: 60,
					right: 60,
					top: 390,
					display: 'flex',
					justifyContent: 'center',
					...rise(frame, evening),
				}}
			>
				<div
					style={{
						position: 'relative',
						color: colors.red,
						fontSize: 110,
						fontWeight: 800,
						opacity: interpolate(frame, [strike, strike + 10], [1, 0.45], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						}),
					}}
				>
					= cả buổi tối?
					<div
						style={{
							position: 'absolute',
							left: -10,
							top: '52%',
							height: 14,
							borderRadius: 7,
							backgroundColor: colors.text,
							width: `${interpolate(frame, [strike, strike + 10], [0, 104], {
								extrapolateLeft: 'clamp',
								extrapolateRight: 'clamp',
							})}%`,
						}}
					/>
				</div>
			</Interactive.Div>
			<Interactive.Div
				name="Twenty minutes"
				style={{
					position: 'absolute',
					left: 40,
					right: 40,
					top: 560,
					textAlign: 'center',
					color: colors.yellow,
					fontSize: 230,
					fontWeight: 800,
					lineHeight: 1.1,
					rotate: '-4deg',
					textShadow: '0 12px 40px rgba(255, 209, 102, 0.35)',
					...pop(frame, twenty, 1.8),
				}}
			>
				20 phút
			</Interactive.Div>
			<Interactive.Div
				name="Almost free"
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 900,
					width: 'fit-content',
					margin: '0 auto',
					padding: '16px 40px',
					borderRadius: 999,
					backgroundColor: colors.green,
					color: '#0B1020',
					fontSize: 56,
					fontWeight: 800,
					...pop(frame, free),
				}}
			>
				gần như 0 đồng
			</Interactive.Div>
		</AbsoluteFill>
	);
};
