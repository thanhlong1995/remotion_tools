import type {Caption} from '@remotion/captions';
import type React from 'react';
import {AbsoluteFill, Interactive, useCurrentFrame, useVideoConfig} from 'remotion';
import {Backdrop} from '../Backdrop';
import {ClockIcon} from '../Icons';
import {colors, fontFamily} from '../theme';
import {useCue} from '../timeline';
import {Kicker, pop, rise, Row, slideIn} from '../ui';

type Props = {readonly captions?: Caption[]};

const Minutes: React.FC<{readonly children: string}> = ({children}) => (
	<div
		style={{
			padding: '8px 20px',
			borderRadius: 999,
			backgroundColor: 'rgba(255, 209, 102, 0.16)',
			color: colors.yellow,
			fontSize: 38,
			fontWeight: 800,
			whiteSpace: 'nowrap',
		}}
	>
		{children}
	</div>
);

const StepNumber: React.FC<{readonly children: number}> = ({children}) => (
	<div style={{color: colors.yellow, fontSize: 52, fontWeight: 800}}>{children}</div>
);

// A day's routine, step by step, ending on the total time per clip
export const WorkflowScene: React.FC<Props> = ({captions}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const cue = useCue(captions);
	const topic = cue('chọn', 30);
	const outline = cue('khung', 60);
	const polish = cue('sửa', 90);
	const run = cue('bấm', 140);
	const total = cue('tổng', 170);

	return (
		<AbsoluteFill style={{fontFamily}}>
			<Backdrop accent={colors.yellow} />
			<Kicker name="Kicker" color={colors.yellow} premountFor={fps} style={{top: 170, ...rise(frame, 4)}}>
				MỘT BUỔI LÀM VIỆC
			</Kicker>
			<Row
				name="Step: topic"
				accent={colors.yellow}
				icon={<StepNumber>{1}</StepNumber>}
				badge={<Minutes>10–15&apos;</Minutes>}
				premountFor={fps}
				style={{top: 300, minHeight: 140, ...slideIn(frame, topic)}}
			>
				Chọn chủ đề
			</Row>
			<Row
				name="Step: outline"
				accent={colors.yellow}
				icon={<StepNumber>{2}</StepNumber>}
				badge={<Minutes>3–5&apos;</Minutes>}
				premountFor={fps}
				style={{top: 465, minHeight: 140, ...slideIn(frame, outline)}}
			>
				AI lên khung
			</Row>
			<Row
				name="Step: polish"
				accent={colors.yellow}
				icon={<StepNumber>{3}</StepNumber>}
				badge={<Minutes>5–10&apos;</Minutes>}
				premountFor={fps}
				style={{top: 630, minHeight: 140, ...slideIn(frame, polish)}}
			>
				Sửa cho tự nhiên
			</Row>
			<Row
				name="Step: run"
				accent={colors.yellow}
				icon={<StepNumber>{4}</StepNumber>}
				badge={<Minutes>2–3&apos;</Minutes>}
				premountFor={fps}
				style={{top: 795, minHeight: 140, ...slideIn(frame, run)}}
			>
				Bấm chạy
			</Row>
			<Interactive.Div
				name="Total time"
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 985,
					width: 'fit-content',
					margin: '0 auto',
					display: 'flex',
					alignItems: 'center',
					gap: 20,
					padding: '20px 44px',
					borderRadius: 999,
					backgroundColor: colors.yellow,
					color: '#0B1020',
					fontSize: 58,
					fontWeight: 800,
					...pop(frame, total),
				}}
			>
				<ClockIcon size={60} color="#0B1020" />
				20–30 phút / clip
			</Interactive.Div>
		</AbsoluteFill>
	);
};
