import type React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

type BackdropProps = {
	readonly accent: string;
};

// Dark dotted canvas with a slowly drifting glow in the scene's accent color
export const Backdrop: React.FC<BackdropProps> = ({accent}) => {
	const frame = useCurrentFrame();
	const drift = Math.sin(frame / 50) * 60;

	return (
		<AbsoluteFill style={{background: 'linear-gradient(180deg, #0B1020 0%, #121A33 100%)'}}>
			<AbsoluteFill
				style={{
					backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 2px, transparent 2px)',
					backgroundSize: '44px 44px',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					width: 900,
					height: 900,
					left: -260 + drift,
					top: 120,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${accent}40 0%, transparent 65%)`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					width: 700,
					height: 700,
					right: -240 - drift,
					top: 900,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${accent}26 0%, transparent 65%)`,
				}}
			/>
		</AbsoluteFill>
	);
};
