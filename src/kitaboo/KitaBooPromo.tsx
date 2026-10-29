import {Audio} from '@remotion/media';
import {springTiming, TransitionSeries} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import type React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ColorsScene} from './scenes/ColorsScene';
import {CtaScene} from './scenes/CtaScene';
import {DesignScene} from './scenes/DesignScene';
import {HookScene} from './scenes/HookScene';
import {OneTouchScene} from './scenes/OneTouchScene';
import {RevealScene} from './scenes/RevealScene';
import {SafetyScene} from './scenes/SafetyScene';
import {StrawScene} from './scenes/StrawScene';

// 45s vertical promo. Music is 120 BPM (one bar = 60 frames), and every
// 15-frame transition ends exactly on a downbeat: 4s, 10s, 16s ... 40s.
// Each voice line starts just after its scene's downbeat; the music sits
// underneath the voice and swells back up for the final hit at 44s.
export const KitaBooPromo: React.FC = () => {
	const {fps} = useVideoConfig();
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill style={{backgroundColor: '#1B2A5E'}}>
			<TransitionSeries>
				<TransitionSeries.Sequence name="Hook" durationInFrames={120} premountFor={fps}>
					<HookScene />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={slide({direction: 'from-bottom'})}
					timing={springTiming({config: {damping: 200}, durationInFrames: 15})}
				/>
				<TransitionSeries.Sequence name="Reveal" durationInFrames={195} premountFor={fps}>
					<RevealScene />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={slide({direction: 'from-right'})}
					timing={springTiming({config: {damping: 200}, durationInFrames: 15})}
				/>
				<TransitionSeries.Sequence name="Design" durationInFrames={195} premountFor={fps}>
					<DesignScene />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={slide({direction: 'from-right'})}
					timing={springTiming({config: {damping: 200}, durationInFrames: 15})}
				/>
				<TransitionSeries.Sequence name="One touch" durationInFrames={195} premountFor={fps}>
					<OneTouchScene />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={slide({direction: 'from-right'})}
					timing={springTiming({config: {damping: 200}, durationInFrames: 15})}
				/>
				<TransitionSeries.Sequence name="Straw" durationInFrames={195} premountFor={fps}>
					<StrawScene />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={slide({direction: 'from-right'})}
					timing={springTiming({config: {damping: 200}, durationInFrames: 15})}
				/>
				<TransitionSeries.Sequence name="Safety" durationInFrames={195} premountFor={fps}>
					<SafetyScene />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={wipe({direction: 'from-left'})}
					timing={springTiming({config: {damping: 200}, durationInFrames: 15})}
				/>
				<TransitionSeries.Sequence name="Colors" durationInFrames={195} premountFor={fps}>
					<ColorsScene />
				</TransitionSeries.Sequence>
				<TransitionSeries.Transition
					presentation={slide({direction: 'from-bottom'})}
					timing={springTiming({config: {damping: 200}, durationInFrames: 15})}
				/>
				<TransitionSeries.Sequence name="Call to action" durationInFrames={165} premountFor={fps}>
					<CtaScene />
				</TransitionSeries.Sequence>
			</TransitionSeries>
			<Audio
				name="Background music"
				src={staticFile('music/kita-boo-theme.mp3')}
				volume={interpolate(frame, [1316, 1324], [0.3, 0.85], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				})}
				premountFor={fps}
			/>
			<Audio name="Voice: Hook" src={staticFile('voiceover/kita-boo/01-hook.mp3')} from={8} volume={0.85} premountFor={fps} />
			<Audio name="Voice: Reveal" src={staticFile('voiceover/kita-boo/02-reveal.mp3')} from={128} volume={0.85} premountFor={fps} />
			<Audio name="Voice: Design" src={staticFile('voiceover/kita-boo/03-design.mp3')} from={308} volume={1} premountFor={fps} />
			<Audio name="Voice: One touch" src={staticFile('voiceover/kita-boo/04-one-touch.mp3')} from={488} volume={0.85} premountFor={fps} />
			<Audio name="Voice: Straw" src={staticFile('voiceover/kita-boo/05-straw.mp3')} from={668} volume={0.85} premountFor={fps} />
			<Audio name="Voice: Safety" src={staticFile('voiceover/kita-boo/06-safety.mp3')} from={848} volume={0.85} premountFor={fps} />
			<Audio name="Voice: Colors" src={staticFile('voiceover/kita-boo/07-colors.mp3')} from={1028} volume={0.85} premountFor={fps} />
			<Audio name="Voice: CTA" src={staticFile('voiceover/kita-boo/08-cta.mp3')} from={1208} volume={0.85} premountFor={fps} />
			<Audio name="Whoosh to Reveal" src={staticFile('sfx/whoosh.wav')} from={103} volume={0.3} premountFor={fps} />
			<Audio name="Whoosh to Design" src={staticFile('sfx/whoosh.wav')} from={283} volume={0.3} premountFor={fps} />
			<Audio name="Whoosh to One touch" src={staticFile('sfx/whoosh.wav')} from={463} volume={0.3} premountFor={fps} />
			<Audio name="Button click" src={staticFile('sfx/switch.wav')} from={510} volume={0.6} premountFor={fps} />
			<Audio name="Whoosh to Straw" src={staticFile('sfx/whoosh.wav')} from={643} volume={0.3} premountFor={fps} />
			<Audio name="Whoosh to Safety" src={staticFile('sfx/whoosh.wav')} from={823} volume={0.3} premountFor={fps} />
			<Audio name="Whoosh to Colors" src={staticFile('sfx/whoosh.wav')} from={1003} volume={0.3} premountFor={fps} />
			<Audio name="Whoosh to CTA" src={staticFile('sfx/whoosh.wav')} from={1183} volume={0.3} premountFor={fps} />
			<Audio name="CTA ding" src={staticFile('sfx/ding.wav')} from={1215} volume={0.35} premountFor={fps} />
		</AbsoluteFill>
	);
};
