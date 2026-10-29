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
import {Swatch} from '../Swatch';

// 34-40s: the three colorways
export const ColorsScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{fontFamily}}>
			<Backdrop
				top="#FFF7EE"
				bottom="#FFDDBF"
				glow="rgba(255, 255, 255, 0.8)"
				sparkle="#FFB86B"
			/>
			<Chip
				name="Feature number"
				color="#FFFFFF"
				backgroundColor="#F08A4B"
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
				05 · MÀU SẮC
			</Chip>
			<Interactive.Div
				name="Colors title"
				style={{
					position: 'absolute',
					left: 60,
					right: 60,
					top: 222,
					textAlign: 'center',
					fontSize: 120,
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
				3 màu xinh xắn
			</Interactive.Div>
			<PhotoCard
				name="Pink bottle photo"
				src={staticFile('kita-boo/kita-boo-1.webp')}
				cardWidth={480}
				cardHeight={640}
				zoomFrom={1}
				zoomTo={1.08}
				zoomOrigin="50% 40%"
				frameColor="#FFFFFF"
				premountFor={fps}
				style={{
					left: 60,
					top: 420,
					rotate: '-6deg',
					translate: interpolate(frame, [18, 42], ['-700px 0px', '0px 0px'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 14}),
					}),
				}}
			/>
			<PhotoCard
				name="Green and navy photo"
				src={staticFile('kita-boo/kita-boo-2.webp')}
				cardWidth={480}
				cardHeight={640}
				zoomFrom={1}
				zoomTo={1.08}
				zoomOrigin="50% 40%"
				frameColor="#FFFFFF"
				premountFor={fps}
				style={{
					left: 540,
					top: 470,
					rotate: '6deg',
					translate: interpolate(frame, [24, 48], ['700px 0px', '0px 0px'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 14}),
					}),
				}}
			/>
			<Swatch
				name="Pink swatch"
				color="#F4C2B8"
				premountFor={fps}
				style={{
					left: 60,
					top: 1210,
					scale: interpolate(frame, [48, 62], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 9}),
						output: 'perceptual-scale',
					}),
				}}
			>
				Hồng pastel
			</Swatch>
			<Swatch
				name="Green swatch"
				color="#B5D3A3"
				premountFor={fps}
				style={{
					left: 400,
					top: 1210,
					scale: interpolate(frame, [56, 70], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 9}),
						output: 'perceptual-scale',
					}),
				}}
			>
				Xanh lá
			</Swatch>
			<Swatch
				name="Navy swatch"
				color="#24346E"
				premountFor={fps}
				style={{
					left: 740,
					top: 1210,
					scale: interpolate(frame, [64, 78], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 9}),
						output: 'perceptual-scale',
					}),
				}}
			>
				Xanh navy
			</Swatch>
			<Interactive.Div
				name="Colors description"
				style={{
					position: 'absolute',
					left: 80,
					right: 80,
					top: 1480,
					textAlign: 'center',
					fontSize: 52,
					fontWeight: 700,
					color: '#1B2A5E',
					opacity: interpolate(frame, [80, 92], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
					translate: interpolate(frame, [80, 96], ['0px 30px', '0px 0px'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 200}),
					}),
				}}
			>
				Bé thích màu nào cũng có!
			</Interactive.Div>
		</AbsoluteFill>
	);
};
