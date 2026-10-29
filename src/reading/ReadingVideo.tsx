import {Audio} from '@remotion/media';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import type React from 'react';
import {
	AbsoluteFill,
	Interactive,
	interpolate,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
	type CalculateMetadataFunction,
} from 'remotion';
import {CtaScene} from './scenes/CtaScene';
import {HookScene} from './scenes/HookScene';
import {LessonsScene} from './scenes/LessonsScene';
import {ProblemScene} from './scenes/ProblemScene';
import {RemotionScene} from './scenes/RemotionScene';
import {SuperpowerScene} from './scenes/SuperpowerScene';
import {TrioScene} from './scenes/TrioScene';
import {TtsScene} from './scenes/TtsScene';
import {WorkflowScene} from './scenes/WorkflowScene';
import {colors} from './theme';
import {
	AUDIO_DELAY,
	END_HOLD,
	getScene,
	sceneFrames,
	totalFrames,
	TRANSITION,
} from './timeline';
import {WordHighlightCaptions} from './word-highlight-captions';

// Scene lengths come from the generated voiceover (src/reading/voiceover.json)
export const calculateReadingMetadata: CalculateMetadataFunction<Record<string, unknown>> = () => ({
	durationInFrames: totalFrames(),
});

// Standalone scene previews get their real captions so cues line up
export const sceneMetadata =
	(id: string): CalculateMetadataFunction<Record<string, unknown>> =>
	() => ({
		durationInFrames: sceneFrames(id),
		props: {captions: getScene(id).captions},
	});

// The narration and its word-highlighted captions for one scene
const Voice: React.FC<{readonly id: string}> = ({id}) => {
	const {fps} = useVideoConfig();
	const scene = getScene(id);

	return (
		<>
			{scene.audio ? (
				<Audio name="Voice" src={staticFile(scene.audio)} from={AUDIO_DELAY} volume={0.9} premountFor={fps} />
			) : null}
			<WordHighlightCaptions
				name="Captions"
				from={AUDIO_DELAY}
				premountFor={fps}
				captions={scene.captions}
				width={940}
				style={{position: 'absolute', left: 70, top: 1170, height: 260}}
			/>
		</>
	);
};

export const ReadingVideo: React.FC = () => {
	const {fps, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();
	const transition = (
		<TransitionSeries.Transition
			presentation={fade()}
			timing={linearTiming({durationInFrames: TRANSITION})}
		/>
	);

	return (
		<AbsoluteFill style={{backgroundColor: '#0B1020'}}>
			<TransitionSeries>
				<TransitionSeries.Sequence name="Hook" durationInFrames={sceneFrames('01-hook')} premountFor={fps}>
					<HookScene captions={getScene('01-hook').captions} />
					<Voice id="01-hook" />
				</TransitionSeries.Sequence>
				{transition}
				<TransitionSeries.Sequence name="Problem" durationInFrames={sceneFrames('02-problem')} premountFor={fps}>
					<ProblemScene captions={getScene('02-problem').captions} />
					<Voice id="02-problem" />
				</TransitionSeries.Sequence>
				{transition}
				<TransitionSeries.Sequence name="Trio" durationInFrames={sceneFrames('03-trio')} premountFor={fps}>
					<TrioScene captions={getScene('03-trio').captions} />
					<Voice id="03-trio" />
				</TransitionSeries.Sequence>
				{transition}
				<TransitionSeries.Sequence name="Superpower" durationInFrames={sceneFrames('04-superpower')} premountFor={fps}>
					<SuperpowerScene captions={getScene('04-superpower').captions} />
					<Voice id="04-superpower" />
				</TransitionSeries.Sequence>
				{transition}
				<TransitionSeries.Sequence name="VieNeu-TTS" durationInFrames={sceneFrames('05-tts')} premountFor={fps}>
					<TtsScene captions={getScene('05-tts').captions} />
					<Voice id="05-tts" />
				</TransitionSeries.Sequence>
				{transition}
				<TransitionSeries.Sequence name="Remotion" durationInFrames={sceneFrames('06-remotion')} premountFor={fps}>
					<RemotionScene captions={getScene('06-remotion').captions} />
					<Voice id="06-remotion" />
				</TransitionSeries.Sequence>
				{transition}
				<TransitionSeries.Sequence name="Workflow" durationInFrames={sceneFrames('07-workflow')} premountFor={fps}>
					<WorkflowScene captions={getScene('07-workflow').captions} />
					<Voice id="07-workflow" />
				</TransitionSeries.Sequence>
				{transition}
				<TransitionSeries.Sequence name="Lessons" durationInFrames={sceneFrames('08-lessons')} premountFor={fps}>
					<LessonsScene captions={getScene('08-lessons').captions} />
					<Voice id="08-lessons" />
				</TransitionSeries.Sequence>
				{transition}
				<TransitionSeries.Sequence
					name="Call to action"
					durationInFrames={sceneFrames('09-cta') + END_HOLD}
					premountFor={fps}
				>
					<CtaScene captions={getScene('09-cta').captions} />
					<Voice id="09-cta" />
				</TransitionSeries.Sequence>
			</TransitionSeries>
			<Audio
				name="Lo-fi music"
				src={staticFile('music/lofi-reading.mp3')}
				volume={interpolate(frame, [0, fps, durationInFrames - 45, durationInFrames], [0, 0.2, 0.2, 0], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				})}
				premountFor={fps}
			/>
			<Interactive.Div
				name="Progress bar"
				style={{
					position: 'absolute',
					left: 80,
					right: 80,
					top: 80,
					height: 10,
					borderRadius: 5,
					overflow: 'hidden',
					backgroundColor: 'rgba(255, 255, 255, 0.12)',
				}}
			>
				<div
					style={{
						width: `${(frame / durationInFrames) * 100}%`,
						height: '100%',
						backgroundColor: colors.yellow,
					}}
				/>
			</Interactive.Div>
		</AbsoluteFill>
	);
};
