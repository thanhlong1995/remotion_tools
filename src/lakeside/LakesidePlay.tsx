import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Duckling} from './Duckling';
import {Frog} from './Frog';
import {BeachBall, Butterfly, Heart, Sparkle} from './Props';
import {Puppy} from './Puppy';
import {
	Bank,
	Cattails,
	FloatingPad,
	ForegroundGrass,
	HEIGHT,
	Lake,
	Lotus,
	Ripples,
	SceneDefs,
	Sky,
	WIDTH,
} from './Scenery';
import {blinkAt, clamp, wave} from './theme';
import voiceover from './voiceover.json';

const FPS = 30;
// Frames for one rally: the ball goes puppy -> duckling -> puppy
const RALLY = 100;

// Narration lines play one after another with a short breath in between
const VOICE_START = 12;
const VOICE_GAP = 12;
const VOICE_LINES = voiceover.lines.reduce<{id: string; audio: string; from: number; frames: number}[]>(
	(placed, line) => {
		const previous = placed[placed.length - 1];
		const from = previous ? previous.from + previous.frames + VOICE_GAP : VOICE_START;
		return [...placed, {id: line.id, audio: line.audio, from, frames: Math.ceil((line.durationMs / 1000) * FPS)}];
	},
	[],
);
const lastLine = VOICE_LINES[VOICE_LINES.length - 1];

// Long enough for the narration plus a beat, ending on a puppy or duckling hit
export const LAKESIDE_DURATION = Math.max(
	3 * RALLY,
	Math.ceil((lastLine.from + lastLine.frames + 20) / (RALLY / 2)) * (RALLY / 2),
);
const PUPPY = {x: 320, ground: 1660, headX: 78, headY: 222, headTop: 306, hop: 55};
const DUCK = {x: 750, ground: 1675, headY: 178, headTop: 262, hop: 45};
const FROG = {x: 860, y: 1180, hop: 36};
const BALL_R = 36;
const ARC = 260;

const BALL_START = {
	x: PUPPY.x + PUPPY.headX,
	y: PUPPY.ground - PUPPY.hop - PUPPY.headTop - BALL_R + 10,
};
const BALL_END = {x: DUCK.x, y: DUCK.ground - DUCK.hop - DUCK.headTop - BALL_R + 8};

const LOTUSES = [
	{x: 150, y: 955, scale: 0.38},
	{x: 430, y: 935, scale: 0.32},
	{x: 1000, y: 958, scale: 0.4},
	{x: 620, y: 1060, scale: 0.55},
	{x: 110, y: 1150, scale: 0.68},
	{x: 200, y: 1300, scale: 0.8},
	{x: 560, y: 1330, scale: 0.6},
];

const PADS = [
	{x: 300, y: 1010, scale: 0.3},
	{x: 760, y: 985, scale: 0.28},
	{x: 40, y: 1060, scale: 0.45},
	{x: 450, y: 1180, scale: 0.45},
	{x: 960, y: 1300, scale: 0.5},
];

// Hearts pop when a friend bumps the ball, sparkles when the frog jumps
const RALLIES = Array.from({length: Math.ceil(LAKESIDE_DURATION / RALLY)}, (_, i) => i * RALLY);
const HEARTS = RALLIES.map((birth) => ({birth, x: BALL_START.x, y: BALL_START.y + 30}));
const DUCK_HEARTS = RALLIES.map((r) => ({birth: r + RALLY / 2, x: BALL_END.x, y: BALL_END.y + 30}));
const FROG_CHEERS = RALLIES.flatMap((r) => [r + RALLY / 4, r + (RALLY * 3) / 4]);

// 1 at the moment of contact, easing to 0 `reach` frames either side
const hopAround = (distance: number, reach: number) =>
	distance < reach ? Math.cos(((distance / reach) * Math.PI) / 2) : 0;

// A little stretch in the air, a squash right before take-off and after landing
const squashAround = (distance: number, reach: number, hop: number) =>
	distance < reach
		? 1 + 0.06 * hop
		: interpolate(distance, [reach, reach + 3, reach + 10], [1, 0.88, 1], clamp);

const lookAt = (fromX: number, fromY: number, toX: number, toY: number) => ({
	x: Math.max(-1, Math.min(1, (toX - fromX) / 220)),
	y: Math.max(-1, Math.min(1, (toY - fromY) / 220)),
});

const Shadow: React.FC<{readonly x: number; readonly y: number; readonly rx: number; readonly lift: number}> = ({
	x,
	y,
	rx,
	lift,
}) => (
	<ellipse
		cx={x}
		cy={y}
		rx={rx * (1 - lift * 0.3)}
		ry={rx * 0.16 * (1 - lift * 0.3)}
		fill="#2E6B1F"
		opacity={0.25 - lift * 0.08}
	/>
);

export const LakesidePlay: React.FC = () => {
	const frame = useCurrentFrame();
	const t = frame % RALLY;

	// Ball flies in an arc, out to the duckling for the first half of the rally
	const progress = t < RALLY / 2 ? t / (RALLY / 2) : 1 - (t - RALLY / 2) / (RALLY / 2);
	const ballX = BALL_START.x + (BALL_END.x - BALL_START.x) * progress;
	const ballY =
		BALL_START.y + (BALL_END.y - BALL_START.y) * progress - 4 * ARC * progress * (1 - progress);
	const ballGround = PUPPY.ground + (DUCK.ground - PUPPY.ground) * progress;
	const ballLift = interpolate(ballGround - ballY, [250, 650], [0, 1], clamp);

	const puppyDistance = Math.min(t, RALLY - t);
	const puppyHop = hopAround(puppyDistance, 14);
	const puppyY = PUPPY.ground - puppyHop * PUPPY.hop;
	const puppyLook = lookAt(PUPPY.x + PUPPY.headX, puppyY - PUPPY.headY, ballX, ballY);

	const duckDistance = Math.abs(t - RALLY / 2);
	const duckHop = hopAround(duckDistance, 14);
	const duckY = DUCK.ground - duckHop * DUCK.hop;
	const duckLook = lookAt(DUCK.x, duckY - DUCK.headY, ballX, ballY);

	const frogDistance = Math.min(Math.abs(t - 25), Math.abs(t - 75));
	const frogHop = hopAround(frogDistance, 12);
	const bob = wave(frame, 50) * 5;
	const frogY = FROG.y + bob - frogHop * FROG.hop;
	const frogLook = lookAt(FROG.x, frogY - 172, ballX, ballY);

	const zoom = interpolate(frame, [0, 45], [1.12, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const flash = interpolate(frame, [0, 12], [1, 0], clamp);

	const behindFrog = LOTUSES.filter((l) => l.y < FROG.y);
	const inFrontOfFrog = LOTUSES.filter((l) => l.y >= FROG.y);

	return (
		<AbsoluteFill style={{backgroundColor: '#6EC6FF'}}>
			<svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" height="100%">
				<SceneDefs />
				<g transform={`translate(540 960) scale(${zoom}) translate(-540 -960)`}>
					<Sky frame={frame} />
					<Lake frame={frame} />
					{PADS.map((p, i) => (
						<FloatingPad key={p.x} {...p} bob={wave(frame, 75, i) * 3} />
					))}
					{behindFrog.map((l, i) => (
						<Lotus key={l.x} {...l} bob={wave(frame, 60, i * 1.3) * 4 * l.scale} />
					))}
					<Ripples frame={frame} x={FROG.x} y={FROG.y + bob + 22} />
					<FloatingPad x={FROG.x} y={FROG.y + 18} scale={0.95} bob={bob} />
					<g transform={`translate(${FROG.x}, ${frogY})`}>
						<Frog
							squash={squashAround(frogDistance, 12, frogHop)}
							armAngle={wave(frame, 20) * 12}
							cheer={frogHop * 10}
							blink={blinkAt(frame, 40, 100)}
							lookX={frogLook.x}
							lookY={frogLook.y}
						/>
					</g>
					{inFrontOfFrog.map((l, i) => (
						<Lotus key={l.x} {...l} bob={wave(frame, 60, i * 2.1 + 1) * 4 * l.scale} />
					))}
					<Cattails frame={frame} />
					<Bank frame={frame} />

					<Shadow x={PUPPY.x} y={PUPPY.ground} rx={130} lift={puppyHop} />
					<Shadow x={DUCK.x} y={DUCK.ground} rx={85} lift={duckHop} />
					<Shadow x={ballX} y={ballGround - 6} rx={34} lift={ballLift * 2} />

					<g transform={`translate(${PUPPY.x}, ${puppyY})`}>
						<Puppy
							squash={squashAround(puppyDistance, 14, puppyHop)}
							tailAngle={wave(frame, 10) * 22}
							earAngle={puppyHop * 26 + wave(frame, 30) * 4}
							headTilt={interpolate(ballX, [BALL_START.x, BALL_END.x], [-4, 10], clamp)}
							blink={blinkAt(frame, 10)}
							lookX={puppyLook.x}
							lookY={puppyLook.y}
							mouthOpen={puppyHop}
						/>
					</g>
					<g transform={`translate(${DUCK.x}, ${duckY})`}>
						<Duckling
							squash={squashAround(duckDistance, 14, duckHop)}
							wingAngle={18 + wave(frame, 12) * 8 + duckHop * 38}
							blink={blinkAt(frame, 60)}
							lookX={duckLook.x}
							lookY={duckLook.y}
							beakOpen={duckHop}
						/>
					</g>
					<BeachBall x={ballX} y={ballY} r={BALL_R} spin={frame * 9} />

					{[...HEARTS, ...DUCK_HEARTS].map(({birth, x, y}) => {
						const age = frame - birth;
						if (age < 0 || age >= 60) {
							return null;
						}
						return (
							<Heart
								key={birth}
								x={x + wave(age, 40) * 14}
								y={y - 60 - age * 2}
								scale={interpolate(age, [0, 10], [0.2, 1.1], clamp)}
								rotate={wave(age, 30) * 12}
								opacity={interpolate(age, [40, 60], [1, 0], clamp)}
							/>
						);
					})}
					{FROG_CHEERS.flatMap((birth) => {
						const age = frame - birth;
						if (age < 0 || age >= 40) {
							return [];
						}
						return [-150, -90, -30].map((angle) => {
							const radians = (angle * Math.PI) / 180;
							const distance = 110 + age * 2.2;
							return (
								<Sparkle
									key={`${birth}-${angle}`}
									x={FROG.x + Math.cos(radians) * distance}
									y={FROG.y - 130 + Math.sin(radians) * distance}
									scale={interpolate(age, [0, 8, 40], [0.2, 1, 0.6], clamp)}
									rotate={age * 6}
									opacity={interpolate(age, [25, 40], [1, 0], clamp)}
								/>
							);
						});
					})}

					<Butterfly
						x={260 + wave(frame, 150) * 150}
						y={1060 + wave(frame, 75) * 70}
						flap={0.3 + 0.7 * Math.abs(wave(frame, 10))}
						tilt={wave(frame, 150, Math.PI / 2) * 18}
						color="#FF9EC7"
					/>
					<Butterfly
						x={620 + wave(frame, 100, 2) * 120}
						y={780 + wave(frame, 50, 1) * 50}
						flap={0.3 + 0.7 * Math.abs(wave(frame, 8, 1))}
						tilt={wave(frame, 100, 2 + Math.PI / 2) * 18}
						color="#B9A4FF"
					/>
					<ForegroundGrass frame={frame} />
				</g>
				<rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="#FFFFFF" opacity={flash} />
			</svg>
			{VOICE_LINES.map((line) => (
				<Audio
					key={line.id}
					name={`Voice: ${line.id}`}
					src={staticFile(line.audio)}
					from={line.from}
					volume={0.9}
					premountFor={FPS}
				/>
			))}
		</AbsoluteFill>
	);
};
