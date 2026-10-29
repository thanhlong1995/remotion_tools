import type {Caption} from '@remotion/captions';
import type React from 'react';
import {AbsoluteFill, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {Backdrop} from '../Backdrop';
import {CheckIcon, PlayIcon} from '../Icons';
import {colors, fontFamily} from '../theme';
import {useCue} from '../timeline';
import {pop, rise} from '../ui';

type Props = {readonly captions?: Caption[]};

const mono = 'Consolas, "Courier New", monospace';

const CODE = [
	{text: '<Scene>', color: colors.blue},
	{text: '  <Captions highlight="word" />', color: colors.yellow},
	{text: '  <Audio src="giong-doc.mp3" />', color: colors.green},
	{text: '</Scene>', color: colors.blue},
];

// Code on top turns into a rendered MP4 in the terminal below
export const RemotionScene: React.FC<Props> = ({captions}) => {
	const frame = useCurrentFrame();
	const cue = useCue(captions);
	const subtitles = cue('phụ', 50);
	const command = cue('dòng', 120);
	const mp4 = cue('file', 145);
	const typed = (line: number) => {
		const start = 20 + line * 18;
		return Math.floor(
			interpolate(frame, [start, start + 16], [0, CODE[line].text.length], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			}),
		);
	};
	const progress = interpolate(frame, [command + 8, Math.max(command + 20, mp4)], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{fontFamily}}>
			<Backdrop accent={colors.blue} />
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
					color: colors.blue,
					fontSize: 92,
					fontWeight: 800,
					...pop(frame, 4, 0.7),
				}}
			>
				<PlayIcon size={92} color={colors.blue} />
				Remotion
			</Interactive.Div>
			<Interactive.Div
				name="Code editor"
				style={{
					position: 'absolute',
					left: 80,
					width: 920,
					top: 330,
					padding: '36px 40px',
					borderRadius: 36,
					backgroundColor: '#0E1530',
					border: `2px solid ${colors.cardBorder}`,
					fontFamily: mono,
					fontSize: 42,
					lineHeight: 1.6,
					whiteSpace: 'pre',
					...rise(frame, 8),
				}}
			>
				{CODE.map((line, i) => (
					<div
						key={line.text}
						style={{
							color: line.color,
							borderRadius: 10,
							backgroundColor:
								i === 1 && frame >= subtitles ? 'rgba(255, 209, 102, 0.16)' : 'transparent',
						}}
					>
						{line.text.slice(0, typed(i)) || ' '}
					</div>
				))}
			</Interactive.Div>
			<Interactive.Div
				name="Terminal"
				style={{
					position: 'absolute',
					left: 80,
					width: 920,
					top: 760,
					padding: '32px 40px',
					borderRadius: 36,
					backgroundColor: '#05070F',
					border: `2px solid ${colors.cardBorder}`,
					color: colors.text,
					fontFamily: mono,
					fontSize: 42,
					...rise(frame, command),
				}}
			>
				<div>
					<span style={{color: colors.green}}>$</span> npx remotion render
				</div>
				<div
					style={{
						marginTop: 26,
						height: 22,
						borderRadius: 11,
						backgroundColor: 'rgba(255, 255, 255, 0.1)',
						overflow: 'hidden',
					}}
				>
					<div
						style={{
							width: `${progress * 100}%`,
							height: '100%',
							borderRadius: 11,
							backgroundColor: colors.blue,
						}}
					/>
				</div>
				<div
					style={{
						marginTop: 26,
						display: 'flex',
						alignItems: 'center',
						gap: 16,
						color: colors.green,
						fontFamily,
						fontWeight: 800,
						...pop(frame, mp4, 0.7),
					}}
				>
					<CheckIcon size={48} color={colors.green} />
					video.mp4 · Full HD
				</div>
			</Interactive.Div>
		</AbsoluteFill>
	);
};
