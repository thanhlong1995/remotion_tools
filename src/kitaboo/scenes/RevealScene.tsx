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

// 4-10s: product name and hero photo
export const RevealScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{fontFamily}}>
			<Backdrop
				top="#FFE6E1"
				bottom="#F8B4AE"
				glow="rgba(255, 255, 255, 0.7)"
				sparkle="#FFFFFF"
			/>
			<Chip
				name="Kicker"
				color="#FFFFFF"
				backgroundColor="#FF7A8A"
				premountFor={fps}
				style={{
					left: 0,
					right: 0,
					top: 140,
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
				Bình nước cho bé
			</Chip>
			<Interactive.Div
				name="Product name"
				style={{
					position: 'absolute',
					left: 40,
					right: 40,
					top: 210,
					textAlign: 'center',
					fontSize: 190,
					fontWeight: 800,
					lineHeight: 1.1,
					letterSpacing: -2,
					color: '#1B2A5E',
					textShadow: '0 8px 0 rgba(255, 255, 255, 0.8)',
					opacity: interpolate(frame, [16, 22], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
					scale: interpolate(frame, [16, 38], [0.5, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 11}),
						output: 'perceptual-scale',
					}),
				}}
			>
				Kita Boo
			</Interactive.Div>
			<Interactive.Div
				name="Product subline"
				style={{
					position: 'absolute',
					left: 80,
					right: 80,
					top: 430,
					textAlign: 'center',
					fontSize: 52,
					fontWeight: 700,
					color: '#1B2A5E',
					opacity: interpolate(frame, [28, 40], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
				}}
			>
				Dung tích 480ml · Inochi
			</Interactive.Div>
			<PhotoCard
				name="Hero photo"
				src={staticFile('kita-boo/kita-boo-1.webp')}
				cardWidth={720}
				cardHeight={960}
				zoomFrom={1}
				zoomTo={1.1}
				zoomOrigin="50% 40%"
				frameColor="#FFFFFF"
				premountFor={fps}
				style={{
					left: 180,
					top: 550,
					rotate: interpolate(frame, [18, 48], ['-12deg', '-3deg'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 14}),
					}),
					translate: interpolate(frame, [18, 48], ['0px 1400px', '0px 0px'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 14}),
					}),
				}}
			/>
			<Chip
				name="Sticker"
				color="#FFFFFF"
				backgroundColor="#1B2A5E"
				premountFor={fps}
				style={{
					left: 600,
					top: 1430,
					fontSize: 56,
					fontWeight: 800,
					rotate: '8deg',
					scale: interpolate(frame, [55, 72], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 9}),
						output: 'perceptual-scale',
					}),
				}}
			>
				Siêu cute!
			</Chip>
		</AbsoluteFill>
	);
};
