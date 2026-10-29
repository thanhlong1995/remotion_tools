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

// 16-22s: feature 2, push-button lid
export const OneTouchScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{fontFamily}}>
			<Backdrop
				top="#E2E8FF"
				bottom="#AEBBF5"
				glow="rgba(255, 255, 255, 0.7)"
				sparkle="#FFFFFF"
			/>
			<Chip
				name="Feature number"
				color="#FFFFFF"
				backgroundColor="#4C5FD5"
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
				02 · TIỆN LỢI
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
				Mở nắp
				<br />
				chỉ 1 chạm
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
					color: '#26336B',
					opacity: interpolate(frame, [28, 40], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
				}}
			>
				Bấm nút là nắp bật mở ngay
			</Interactive.Div>
			<PhotoCard
				name="Button photo"
				src={staticFile('kita-boo/kita-boo-4.webp')}
				cardWidth={720}
				cardHeight={960}
				zoomFrom={1}
				zoomTo={1.14}
				zoomOrigin="79% 64%"
				frameColor="#FFFFFF"
				premountFor={fps}
				style={{
					left: 180,
					top: 600,
					rotate: interpolate(frame, [18, 46], ['-6deg', '-2deg'], {
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
					name="Button highlight"
					from={45}
					color="#FFFFFF"
					size={230}
					premountFor={fps}
					style={{
						left: '79%',
						top: '64.5%',
						scale: interpolate(frame, [45, 57], [0, 1], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.spring({damping: 10}),
							output: 'perceptual-scale',
						}),
					}}
				/>
			</PhotoCard>
			<Chip
				name="Button callout"
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
				Bé tự mở thật dễ
			</Chip>
		</AbsoluteFill>
	);
};
