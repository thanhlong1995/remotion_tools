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
import {CheckRow} from '../CheckRow';
import {Chip} from '../Chip';
import {fontFamily} from '../fonts';
import {PhotoCard} from '../PhotoCard';

// 28-34s: feature 4, materials and safety checklist
export const SafetyScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{fontFamily}}>
			<Backdrop
				top="#F0EAFF"
				bottom="#CBBEF7"
				glow="rgba(255, 255, 255, 0.7)"
				sparkle="#FFFFFF"
			/>
			<Chip
				name="Feature number"
				color="#FFFFFF"
				backgroundColor="#7A5FD0"
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
				04 · CHẤT LIỆU
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
				An toàn
				<br />
				cho bé yêu
			</Interactive.Div>
			<CheckRow
				name="Check Tritan"
				checkColor="#7A5FD0"
				premountFor={fps}
				style={{
					top: 500,
					translate: interpolate(frame, [22, 42], ['-1100px 0px', '0px 0px'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 14}),
					}),
				}}
			>
				Nhựa Tritan cao cấp
			</CheckRow>
			<CheckRow
				name="Check BPA"
				checkColor="#7A5FD0"
				premountFor={fps}
				style={{
					top: 650,
					translate: interpolate(frame, [32, 52], ['-1100px 0px', '0px 0px'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 14}),
					}),
				}}
			>
				Không chứa BPA
			</CheckRow>
			<CheckRow
				name="Check markings"
				checkColor="#7A5FD0"
				premountFor={fps}
				style={{
					top: 800,
					translate: interpolate(frame, [42, 62], ['-1100px 0px', '0px 0px'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 14}),
					}),
				}}
			>
				Vạch chia ml rõ ràng
			</CheckRow>
			<PhotoCard
				name="Label photo"
				src={staticFile('kita-boo/kita-boo-1.webp')}
				cardWidth={600}
				cardHeight={600}
				zoomFrom={1.05}
				zoomTo={1.18}
				zoomOrigin="50% 92%"
				frameColor="#FFFFFF"
				premountFor={fps}
				style={{
					left: 240,
					top: 985,
					rotate: interpolate(frame, [50, 76], ['-10deg', '3deg'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 12}),
					}),
					translate: interpolate(frame, [50, 76], ['0px 1100px', '0px 0px'], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
						easing: Easing.spring({damping: 14}),
					}),
				}}
			/>
		</AbsoluteFill>
	);
};
