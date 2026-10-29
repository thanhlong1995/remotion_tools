import type React from 'react';
import {
	AbsoluteFill,
	Easing,
	Interactive,
	interpolate,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Backdrop} from '../Backdrop';
import {Chip} from '../Chip';
import {fontFamily} from '../fonts';
import {PhotoCard} from '../PhotoCard';
import {PulseRing} from '../PulseRing';

// 22-28s: feature 3, soft silicone straw
export const StrawScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{fontFamily}}>
			<Backdrop
				top="#E0F5FF"
				bottom="#A5DCF3"
				glow="rgba(255, 255, 255, 0.7)"
				sparkle="#FFFFFF"
			/>
			<Chip
				name="Feature number"
				color="#FFFFFF"
				backgroundColor="#2F8FC4"
				premountFor={fps}
				style={{
					left: 0,
					right: 0,
					top: 118,
					opacity: interpolate(frame, [14, 24], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
					translate: interpolate(frame, [14, 30], ['0px 30px', '0px 0px'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 200}),
					}),
				}}
			>
				03 · DỄ UỐNG
			</Chip>
			<Interactive.Div
				name="Feature title"
				style={{
					position: 'absolute',
					left: 60,
					right: 60,
					top: 222,
					textAlign: 'center',
					fontSize: 112,
					fontWeight: 800,
					lineHeight: 1.1,
					color: '#1B2A5E',
					scale: interpolate(frame, [16, 36], [0.6, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 12}),
						output: 'perceptual-scale',
					}),
					opacity: interpolate(frame, [16, 22], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
				}}
			>
				Ống hút
				<br />
				silicone mềm
			</Interactive.Div>
			<Interactive.Div
				name="Feature description"
				style={{
					position: 'absolute',
					left: 80,
					right: 80,
					top: 482,
					textAlign: 'center',
					fontSize: 50,
					fontWeight: 500,
					color: '#1E4E6B',
					opacity: interpolate(frame, [28, 40], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
				}}
			>
				Mềm mại, bé uống thật dễ dàng
			</Interactive.Div>
			<PhotoCard
				name="Straw photo"
				src={staticFile('kita-boo/kita-boo-3.webp')}
				cardWidth={720}
				cardHeight={960}
				zoomFrom={1}
				zoomTo={1.14}
				zoomOrigin="42% 46%"
				frameColor="#FFFFFF"
				premountFor={fps}
				style={{
					left: 180,
					top: 600,
					rotate: interpolate(frame, [18, 46], ['6deg', '2deg'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 14}),
					}),
					translate: interpolate(frame, [18, 46], ['0px 1400px', '0px 0px'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 14}),
					}),
				}}
			>
				<PulseRing
					name="Straw highlight"
					from={50}
					color="#FFFFFF"
					size={210}
					premountFor={fps}
					style={{
						left: '42%',
						top: '46%',
						scale: interpolate(frame, [50, 62], [0, 1], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.spring({damping: 10}),
							output: 'perceptual-scale',
						}),
					}}
				/>
			</PhotoCard>
			<Chip
				name="Straw callout"
				color="#1B2A5E"
				backgroundColor="#FFD66B"
				premountFor={fps}
				style={{
					left: 110,
					top: 1460,
					fontSize: 52,
					fontWeight: 800,
					rotate: '-4deg',
					scale: interpolate(frame, [62, 78], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 9}),
						output: 'perceptual-scale',
					}),
				}}
			>
				Nắp đậy giữ ống hút sạch
			</Chip>
		</AbsoluteFill>
	);
};
