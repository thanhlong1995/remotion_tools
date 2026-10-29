import type {Caption} from '@remotion/captions';
import type React from 'react';
import {AbsoluteFill, Interactive, useCurrentFrame, useVideoConfig} from 'remotion';
import {Backdrop} from '../Backdrop';
import {CheckIcon, MicIcon} from '../Icons';
import {colors, fontFamily} from '../theme';
import {useCue} from '../timeline';
import {pop, Row, slideIn} from '../ui';

type Props = {readonly captions?: Caption[]};

const BARS = 36;

// VieNeu-TTS: an always-moving waveform plus its three selling points
export const TtsScene: React.FC<Props> = ({captions}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const cue = useCue(captions);
	const offline = cue('offline', 70);
	const free = cue('miễn', 95);
	const clone = cue('clone', 120);

	return (
		<AbsoluteFill style={{fontFamily}}>
			<Backdrop accent={colors.green} />
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
					color: colors.green,
					fontSize: 92,
					fontWeight: 800,
					...pop(frame, 4, 0.7),
				}}
			>
				<MicIcon size={92} color={colors.green} />
				VieNeu-TTS
			</Interactive.Div>
			<Interactive.Div
				name="Waveform"
				style={{
					position: 'absolute',
					left: 80,
					width: 920,
					top: 330,
					height: 260,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 10,
					borderRadius: 40,
					backgroundColor: colors.card,
					border: `2px solid ${colors.cardBorder}`,
					...pop(frame, 10, 0.8),
				}}
			>
				{Array.from({length: BARS}, (_, i) => {
					const wave =
						0.5 +
						0.3 * Math.sin(frame * 0.35 + i * 0.7) +
						0.2 * Math.sin(frame * 0.17 + i * 1.9);
					return (
						<div
							key={i}
							style={{
								width: 14,
								height: 30 + wave * 160,
								borderRadius: 7,
								backgroundColor: colors.green,
								opacity: 0.55 + wave * 0.45,
							}}
						/>
					);
				})}
			</Interactive.Div>
			<Row
				name="Point: offline"
				accent={colors.green}
				icon={<CheckIcon size={56} color={colors.green} />}
				premountFor={fps}
				style={{top: 650, ...slideIn(frame, offline)}}
			>
				Chạy offline ngay trên máy
			</Row>
			<Row
				name="Point: free"
				accent={colors.green}
				icon={<CheckIcon size={56} color={colors.green} />}
				premountFor={fps}
				style={{top: 830, ...slideIn(frame, free)}}
			>
				Miễn phí, không giới hạn
			</Row>
			<Row
				name="Point: cloning"
				accent={colors.green}
				icon={<CheckIcon size={56} color={colors.green} />}
				premountFor={fps}
				style={{top: 1010, minHeight: 130, ...slideIn(frame, clone)}}
			>
				Clone giọng từ 10–20s mẫu
			</Row>
		</AbsoluteFill>
	);
};
