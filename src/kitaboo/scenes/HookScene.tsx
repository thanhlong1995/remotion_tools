import type React from 'react';
import {
	AbsoluteFill,
	Easing,
	Interactive,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Backdrop} from '../Backdrop';
import {BearFace} from '../BearFace';
import {Chip} from '../Chip';
import {fontFamily} from '../fonts';

// 0-4s: the hook question, answered by the Boo mascot
export const HookScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{fontFamily}}>
			<Backdrop
				top="#1B2A5E"
				bottom="#4A4FA8"
				glow="rgba(142, 155, 239, 0.55)"
				sparkle="#FFD66B"
			/>
			<Interactive.Svg
				name="Pink planet"
				viewBox="0 0 240 240"
				width={240}
				height={240}
				style={{
					position: 'absolute',
					left: 780,
					top: 190,
					rotate: '-18deg',
					translate: interpolate(frame, [0, 120], ['0px 0px', '-24px 30px'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
				}}
			>
				<circle cx={120} cy={120} r={70} fill="#FF9FB0" />
				<circle cx={95} cy={98} r={14} fill="#FFC2CC" />
				<circle cx={140} cy={140} r={9} fill="#FFC2CC" />
				<ellipse cx={120} cy={124} rx={116} ry={26} fill="none" stroke="#FFD66B" strokeWidth={10} />
			</Interactive.Svg>
			<Interactive.Svg
				name="Mint planet"
				viewBox="0 0 120 120"
				width={130}
				height={130}
				style={{
					position: 'absolute',
					left: 90,
					top: 1640,
					translate: interpolate(frame, [0, 120], ['0px 0px', '20px -26px'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
				}}
			>
				<circle cx={60} cy={60} r={44} fill="#8EE3C8" />
				<circle cx={46} cy={48} r={9} fill="#C2F2E2" />
			</Interactive.Svg>
			<Interactive.Div
				name="Hook kicker"
				style={{
					position: 'absolute',
					left: 80,
					right: 80,
					top: 470,
					textAlign: 'center',
					fontSize: 76,
					fontWeight: 700,
					color: '#FFD66B',
					opacity: interpolate(frame, [0, 10], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
					translate: interpolate(frame, [0, 16], ['0px 40px', '0px 0px'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 200}),
					}),
				}}
			>
				Bé nhà bạn
			</Interactive.Div>
			<Interactive.Div
				name="Hook title"
				style={{
					position: 'absolute',
					left: 40,
					right: 40,
					top: 570,
					textAlign: 'center',
					fontSize: 156,
					fontWeight: 800,
					lineHeight: 1.12,
					color: '#FFFFFF',
					textShadow: '0 10px 0 rgba(10, 16, 48, 0.35)',
					scale: interpolate(frame, [2, 22], [0.3, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 10}),
						output: 'perceptual-scale',
					}),
					rotate: interpolate(frame, [2, 22], ['-8deg', '0deg'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 10}),
					}),
				}}
			>
				LƯỜI UỐNG
				<br />
				NƯỚC?
			</Interactive.Div>
			<BearFace
				name="Mascot"
				size={320}
				cheekColor="#FFB3C1"
				premountFor={fps}
				style={{
					left: 380,
					top: 1000,
					scale: interpolate(frame, [44, 62], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 9}),
						output: 'perceptual-scale',
					}),
					rotate: interpolate(frame, [62, 74, 86, 98], ['0deg', '-8deg', '8deg', '0deg'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
				}}
			/>
			<Chip
				name="Hook answer"
				color="#1B2A5E"
				backgroundColor="#FFD66B"
				premountFor={fps}
				style={{
					left: 0,
					right: 0,
					top: 1390,
					fontSize: 64,
					fontWeight: 800,
					opacity: interpolate(frame, [58, 66], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					}),
					scale: interpolate(frame, [58, 76], [0.5, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 10}),
						output: 'perceptual-scale',
					}),
				}}
			>
				Có Kita Boo lo rồi!
			</Chip>
		</AbsoluteFill>
	);
};
