import type {Caption} from '@remotion/captions';
import type React from 'react';
import {AbsoluteFill, Interactive, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Backdrop} from '../Backdrop';
import {BoltIcon, MicIcon, PlayIcon} from '../Icons';
import {colors, fontFamily} from '../theme';
import {useCue} from '../timeline';
import {Kicker, pop, rise, Row} from '../ui';

type Props = {readonly captions?: Caption[]};

const Role: React.FC<{readonly children: string; readonly color: string}> = ({children, color}) => (
	<div
		style={{
			padding: '8px 20px',
			borderRadius: 999,
			backgroundColor: `${color}26`,
			color,
			fontSize: 34,
			fontWeight: 700,
			whiteSpace: 'nowrap',
		}}
	>
		{children}
	</div>
);

const Arrow: React.FC<{readonly top: number; readonly progress: number}> = ({top, progress}) => (
	<div
		style={{
			position: 'absolute',
			left: 175,
			top,
			width: 6,
			height: 70 * progress,
			borderRadius: 3,
			backgroundColor: colors.muted,
		}}
	/>
);

// "Bộ ba": the three tools, revealed as the narrator names them
export const TrioScene: React.FC<Props> = ({captions}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const cue = useCue(captions);
	const trio = cue('ba', 60);
	const superpower = cue('superpower', 90);
	const remotion = cue('remotion', 120);
	const tts = cue('vieneu', 150);
	const grow = (at: number) =>
		interpolate(frame, [at, at + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	return (
		<AbsoluteFill style={{fontFamily}}>
			<Backdrop accent={colors.purple} />
			<Kicker name="Kicker" color={colors.muted} premountFor={fps} style={{top: 170, ...rise(frame, 4)}}>
				SAU GẦN 3 THÁNG THỬ SAI
			</Kicker>
			<Interactive.Div
				name="Trio title"
				style={{
					position: 'absolute',
					left: 60,
					right: 60,
					top: 270,
					textAlign: 'center',
					color: colors.text,
					fontSize: 96,
					fontWeight: 800,
					...pop(frame, trio, 0.7),
				}}
			>
				Bộ ba tự động
			</Interactive.Div>
			<Row
				name="Tool: Superpower"
				accent={colors.purple}
				icon={<BoltIcon size={56} color={colors.purple} />}
				badge={<Role color={colors.purple}>Kịch bản</Role>}
				premountFor={fps}
				style={{top: 450, fontSize: 58, ...pop(frame, superpower, 0.7)}}
			>
				Superpower
			</Row>
			<Arrow top={612} progress={grow(remotion - 6)} />
			<Row
				name="Tool: Remotion"
				accent={colors.blue}
				icon={<PlayIcon size={56} color={colors.blue} />}
				badge={<Role color={colors.blue}>Dựng video</Role>}
				premountFor={fps}
				style={{top: 690, fontSize: 58, ...pop(frame, remotion, 0.7)}}
			>
				Remotion
			</Row>
			<Arrow top={852} progress={grow(tts - 6)} />
			<Row
				name="Tool: VieNeu-TTS"
				accent={colors.green}
				icon={<MicIcon size={56} color={colors.green} />}
				badge={<Role color={colors.green}>Giọng đọc</Role>}
				premountFor={fps}
				style={{top: 930, fontSize: 58, ...pop(frame, tts, 0.7)}}
			>
				VieNeu-TTS
			</Row>
		</AbsoluteFill>
	);
};
