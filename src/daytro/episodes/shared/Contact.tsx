import type React from 'react';
import {AbsoluteFill, Freeze} from 'remotion';

// Key moments of an episode frozen in a 4 x 4 grid, for checking pictures without a full render.
// Register it as a Composition as long as the episode: Freeze clamps to the composition length
export const Contact: React.FC<{episode: React.FC; frames: number[]}> = ({episode: Episode, frames}) => (
	<AbsoluteFill style={{backgroundColor: '#222'}}>
		{frames.slice(0, 16).map((f, i) => (
			<div
				key={`${f}-${i}`}
				style={{
					position: 'absolute',
					left: (i % 4) * 480,
					top: Math.floor(i / 4) * 270,
					width: 1920,
					height: 1080,
					transform: 'scale(0.25)',
					transformOrigin: '0 0',
					overflow: 'hidden',
				}}
			>
				<Freeze frame={f}>
					<Episode />
				</Freeze>
				<div
					style={{
						position: 'absolute',
						left: 20,
						top: 20,
						color: '#fff',
						fontSize: 64,
						fontWeight: 800,
						textShadow: '0 0 8px #000',
					}}
				>
					{f}
				</div>
			</div>
		))}
	</AbsoluteFill>
);
