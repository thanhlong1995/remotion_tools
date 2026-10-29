import type {Caption} from '@remotion/captions';
import type React from 'react';
import {AbsoluteFill, Interactive, useCurrentFrame, useVideoConfig} from 'remotion';
import {Backdrop} from '../Backdrop';
import {colors, fontFamily} from '../theme';
import {useCue} from '../timeline';
import {Kicker, pop, rise} from '../ui';

type Props = {readonly captions?: Caption[]};

// Two lessons, each as a big card whose detail line follows the narration
export const LessonsScene: React.FC<Props> = ({captions}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const cue = useCue(captions);
	const dontRely = cue('đừng', 10);
	const polish = cue('gọt', 90);
	const start = cue('bắt', 160);
	const later = cue('đẹp', 200);

	return (
		<AbsoluteFill style={{fontFamily}}>
			<Backdrop accent={colors.purple} />
			<Kicker name="Kicker" color={colors.purple} premountFor={fps} style={{top: 170, ...rise(frame, 4)}}>
				BÀI HỌC RÚT RA
			</Kicker>
			<Interactive.Div
				name="Lesson: human touch"
				style={{
					position: 'absolute',
					left: 80,
					width: 920,
					top: 310,
					padding: '48px 52px',
					borderRadius: 44,
					backgroundColor: colors.card,
					border: `2px solid ${colors.cardBorder}`,
					boxShadow: `inset 8px 0 0 ${colors.purple}`,
					...pop(frame, dontRely, 0.8),
				}}
			>
				<div style={{color: colors.text, fontSize: 70, fontWeight: 800, lineHeight: 1.2}}>
					Đừng phó mặc 100% cho AI
				</div>
				<div
					style={{
						marginTop: 20,
						color: colors.muted,
						fontSize: 46,
						fontWeight: 500,
						...rise(frame, polish, 20),
					}}
				>
					Tự tay gọt giũa để video có hồn
				</div>
			</Interactive.Div>
			<Interactive.Div
				name="Lesson: start simple"
				style={{
					position: 'absolute',
					left: 80,
					width: 920,
					top: 690,
					padding: '48px 52px',
					borderRadius: 44,
					backgroundColor: colors.card,
					border: `2px solid ${colors.cardBorder}`,
					boxShadow: `inset 8px 0 0 ${colors.yellow}`,
					...pop(frame, start, 0.8),
				}}
			>
				<div style={{color: colors.text, fontSize: 70, fontWeight: 800, lineHeight: 1.2}}>
					Bắt đầu từ cái đơn giản nhất
				</div>
				<div
					style={{
						marginTop: 20,
						color: colors.muted,
						fontSize: 46,
						fontWeight: 500,
						...rise(frame, later, 20),
					}}
				>
					Đẹp dần sau, đừng chờ hoàn hảo
				</div>
			</Interactive.Div>
		</AbsoluteFill>
	);
};
