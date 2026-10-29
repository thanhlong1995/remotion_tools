import type {Caption} from '@remotion/captions';
import type React from 'react';
import {AbsoluteFill, Interactive, useCurrentFrame} from 'remotion';
import {Backdrop} from '../Backdrop';
import {PlusIcon} from '../Icons';
import {colors, fontFamily} from '../theme';
import {useCue} from '../timeline';
import {pop, rise} from '../ui';

type Props = {readonly captions?: Caption[]};

// Closing question and a pulsing follow button
export const CtaScene: React.FC<Props> = ({captions}) => {
	const frame = useCurrentFrame();
	const cue = useCue(captions);
	const shy = cue('ngại', 40);
	const tryIt = cue('thử', 75);
	const follow = cue('theo', 110);
	const pulse = frame > follow + 18 ? 1 + 0.05 * Math.sin((frame - follow) / 4) : 1;

	return (
		<AbsoluteFill style={{fontFamily}}>
			<Backdrop accent={colors.yellow} />
			<Interactive.Div
				name="Question"
				style={{
					position: 'absolute',
					left: 60,
					right: 60,
					top: 260,
					textAlign: 'center',
					color: colors.text,
					fontSize: 92,
					fontWeight: 800,
					lineHeight: 1.2,
					...rise(frame, 4),
				}}
			>
				Làm nội dung
				<br />
				một mình?
			</Interactive.Div>
			<Interactive.Div
				name="Shy"
				style={{
					position: 'absolute',
					left: 60,
					right: 60,
					top: 520,
					textAlign: 'center',
					color: colors.muted,
					fontSize: 76,
					fontWeight: 700,
					...rise(frame, shy),
				}}
			>
				Ngại lộ mặt?
			</Interactive.Div>
			<Interactive.Div
				name="Try it"
				style={{
					position: 'absolute',
					left: 60,
					right: 60,
					top: 680,
					textAlign: 'center',
					color: colors.yellow,
					fontSize: 130,
					fontWeight: 800,
					rotate: '-3deg',
					...pop(frame, tryIt, 1.6),
				}}
			>
				Thử ngay nhé!
			</Interactive.Div>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 930,
					display: 'flex',
					justifyContent: 'center',
					...pop(frame, follow),
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 20,
						padding: '26px 56px',
						borderRadius: 999,
						backgroundColor: colors.red,
						color: '#FFFFFF',
						fontSize: 60,
						fontWeight: 800,
						boxShadow: '0 20px 50px rgba(255, 107, 107, 0.45)',
						scale: pulse,
					}}
				>
					<PlusIcon size={64} color="#FFFFFF" />
					Theo dõi kênh
				</div>
			</div>
		</AbsoluteFill>
	);
};
