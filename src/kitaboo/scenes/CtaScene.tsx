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
import {BearFace} from '../BearFace';
import {fontFamily} from '../fonts';
import {PhotoCard} from '../PhotoCard';

// 40-45s: call to action
export const CtaScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{fontFamily}}>
			<Backdrop
				top="#FFD9DF"
				bottom="#FF9DAF"
				glow="rgba(255, 255, 255, 0.75)"
				sparkle="#FFFFFF"
			/>
			<Interactive.Div
				name="CTA title"
				style={{
					position: 'absolute',
					left: 50,
					right: 50,
					top: 130,
					textAlign: 'center',
					fontSize: 112,
					fontWeight: 800,
					lineHeight: 1.1,
					color: '#1B2A5E',
					textShadow: '0 8px 0 rgba(255, 255, 255, 0.75)',
					scale: interpolate(frame, [16, 36], [0.5, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 10}),
						output: 'perceptual-scale',
					}),
				}}
			>
				Rinh Kita Boo
				<br />
				về nhà ngay!
			</Interactive.Div>
			<PhotoCard
				name="CTA photo"
				src={staticFile('kita-boo/kita-boo-1.webp')}
				cardWidth={540}
				cardHeight={720}
				zoomFrom={1}
				zoomTo={1.08}
				zoomOrigin="50% 45%"
				frameColor="#FFFFFF"
				premountFor={fps}
				style={{
					left: 270,
					top: 430,
					rotate: interpolate(frame, [18, 44], ['8deg', '-3deg'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 12}),
					}),
					scale: interpolate(frame, [18, 44], [0.4, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 12}),
						output: 'perceptual-scale',
					}),
				}}
			/>
			<BearFace
				name="Mascot sticker"
				size={230}
				cheekColor="#FFB3C1"
				premountFor={fps}
				style={{
					left: 700,
					top: 380,
					rotate: '14deg',
					scale: interpolate(frame, [40, 56], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 9}),
						output: 'perceptual-scale',
					}),
				}}
			/>
			<Interactive.Div
				name="Buy button"
				style={{
					position: 'absolute',
					left: 90,
					width: 900,
					top: 1205,
					height: 140,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 24,
					borderRadius: 999,
					backgroundColor: '#1B2A5E',
					color: '#FFFFFF',
					fontSize: 60,
					fontWeight: 800,
					boxShadow: '0 18px 0 #0F1A40, 0 30px 60px rgba(27, 42, 94, 0.35)',
					scale: interpolate(
						frame,
						[30, 46, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160],
						[0, 1, 1, 1.06, 1, 1.06, 1, 1.06, 1, 1.06, 1, 1.06],
						{
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.bezier(0.45, 0, 0.55, 1),
							output: 'perceptual-scale',
						},
					),
				}}
			>
				<svg width={78} height={78} viewBox="0 0 24 24" fill="none">
					<path
						d="M3 4h2.2l2.1 10.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.1L20.5 8H6.2"
						stroke="#FFD66B"
						strokeWidth={2.2}
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<circle cx={9.5} cy={19.5} r={1.6} fill="#FFD66B" />
					<circle cx={17} cy={19.5} r={1.6} fill="#FFD66B" />
				</svg>
				MUA NGAY Ở GIỎ HÀNG
			</Interactive.Div>
			<Interactive.Svg
				name="Down arrows"
				viewBox="0 0 80 80"
				width={96}
				height={96}
				style={{
					position: 'absolute',
					left: 492,
					top: 1380,
					opacity: interpolate(frame, [50, 60], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
					translate: interpolate(
						frame,
						[60, 75, 90, 105, 120, 135, 150, 165],
						['0px 0px', '0px 22px', '0px 0px', '0px 22px', '0px 0px', '0px 22px', '0px 0px', '0px 22px'],
						{
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
							easing: Easing.bezier(0.45, 0, 0.55, 1),
						},
					),
				}}
			>
				<path
					d="M16 14 L40 36 L64 14"
					fill="none"
					stroke="#1B2A5E"
					strokeWidth={9}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M16 42 L40 64 L64 42"
					fill="none"
					stroke="#1B2A5E"
					strokeWidth={9}
					strokeLinecap="round"
					strokeLinejoin="round"
					opacity={0.55}
				/>
			</Interactive.Svg>
			<Interactive.Div
				name="CTA product line"
				style={{
					position: 'absolute',
					left: 80,
					right: 80,
					top: 1500,
					textAlign: 'center',
					fontSize: 48,
					fontWeight: 700,
					color: '#1B2A5E',
					opacity: interpolate(frame, [56, 68], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
				}}
			>
				Bình nước Kita Boo 480ml · Inochi
			</Interactive.Div>
		</AbsoluteFill>
	);
};
