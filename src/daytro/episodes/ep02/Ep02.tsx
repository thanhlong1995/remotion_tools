import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, Sequence, staticFile} from 'remotion';
import {BlackoutScene, DuskScene, LadderScene, OutroScene, PetsScene, ThanksScene, ZapScene} from './scenes/Scenes';
import {audioFile, LINES, scene, SCENES} from './timeline';

const COMPONENTS: Record<string, React.FC> = {
	dusk: DuskScene,
	ladder: LadderScene,
	zap: ZapScene,
	pets: PetsScene,
	blackout: BlackoutScene,
	thanks: ThanksScene,
	outro: OutroScene,
};

const at = (key: string, mark: string) => scene(key).from + scene(key).marks[mark];

const SPANS = SCENES.flatMap((s) => Object.values(s.cues).map((c) => [s.from + c.from, s.from + c.to] as const));
const ducked = (base: number, offset: number) => (f: number) =>
	SPANS.some(([a, b]) => f + offset >= a - 4 && f + offset < b + 4) ? base * 0.5 : base;

type Sfx = {name: string; at: number; volume?: number};

const SFX: Sfx[] = [
	{name: 'drop', at: at('ladder', 'climb') + 4, volume: 0.4},
	{name: 'zap', at: at('zap', 'zap'), volume: 0.7},
	{name: 'sting', at: at('zap', 'zap'), volume: 0.35},
	{name: 'skid', at: at('zap', 'zap'), volume: 0.5},
	{name: 'skid', at: at('zap', 'zap') + 10, volume: 0.4},
	{name: 'pop', at: at('zap', 'zap') + 30, volume: 0.5},
	{name: 'whoosh', at: at('zap', 'leave'), volume: 0.4},
	{name: 'thump', at: at('blackout', 'switch') - 4, volume: 0.8},
	{name: 'pop', at: at('blackout', 'switch') + 2, volume: 0.6},
	{name: 'pop', at: scene('thanks').from, volume: 0.6},
];

const MUSIC_STOP = at('blackout', 'switch');

// Episode 2, "Thợ điện ba mươi năm": Minh fixes the gate lamp, the hard way
export const Ep02: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: '#000000'}}>
		{SCENES.map((s) => {
			const Component = COMPONENTS[s.key];
			return (
				<Sequence key={s.key} name={s.key} from={s.from} durationInFrames={s.duration}>
					<Component />
				</Sequence>
			);
		})}
		{SCENES.flatMap((s) =>
			Object.entries(s.cues).map(([id, cue]) => {
				const file = audioFile(id);
				return file ? (
					<Audio
						key={`${s.key}-${id}`}
						name={`${LINES[id].speaker} ${id}`}
						src={staticFile(file)}
						from={s.from + cue.from}
						premountFor={30}
					/>
				) : null;
			}),
		)}
		<Audio
			name="Music: stroll"
			src={staticFile('daytro/music/stroll.wav')}
			from={0}
			durationInFrames={MUSIC_STOP}
			volume={ducked(0.26, 0)}
		/>
		<Audio
			name="Music: stroll (thanks)"
			src={staticFile('daytro/music/stroll.wav')}
			from={scene('thanks').from}
			durationInFrames={scene('thanks').duration}
			volume={ducked(0.24, scene('thanks').from)}
		/>
		<Audio name="Music: outro" src={staticFile('daytro/music/outro.wav')} from={at('outro', 'card')} volume={0.5} />
		<Audio
			name="Ambience"
			src={staticFile('daytro/sfx/ambience.wav')}
			from={0}
			durationInFrames={scene('outro').from}
			volume={0.2}
			loop
		/>
		{SFX.map((s) => (
			<Audio
				key={`${s.name}-${s.at}`}
				name={`SFX ${s.name}`}
				src={staticFile(`daytro/sfx/${s.name}.wav`)}
				from={s.at}
				volume={s.volume ?? 0.6}
				premountFor={30}
			/>
		))}
	</AbsoluteFill>
);
