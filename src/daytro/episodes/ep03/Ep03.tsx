import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, Sequence, staticFile} from 'remotion';
import {BetScene, ContestScene, OutroScene, PetsScene, TrainScene, TwistScene} from './scenes/Scenes';
import {audioFile, LINES, scene, SCENES} from './timeline';

const COMPONENTS: Record<string, React.FC> = {
	bet: BetScene,
	train: TrainScene,
	pets: PetsScene,
	contest: ContestScene,
	twist: TwistScene,
	outro: OutroScene,
};

const at = (key: string, mark: string) => scene(key).from + scene(key).marks[mark];
const lineAt = (key: string, id: string) => scene(key).from + scene(key).cues[id].from;

const SPANS = SCENES.flatMap((s) => Object.values(s.cues).map((c) => [s.from + c.from, s.from + c.to] as const));
const ducked = (base: number, offset: number) => (f: number) =>
	SPANS.some(([a, b]) => f + offset >= a - 4 && f + offset < b + 4) ? base * 0.5 : base;

type Sfx = {name: string; at: number; volume?: number};

const SFX: Sfx[] = [
	{name: 'pop', at: at('bet', 'title'), volume: 0.6},
	{name: 'gulp', at: lineAt('bet', 'a3') + 50, volume: 0.6},
	{name: 'thump', at: at('train', 'lie'), volume: 0.5},
	{name: 'slip', at: at('train', 'lick'), volume: 0.5},
	{name: 'slip', at: at('train', 'lick') + 12, volume: 0.45},
	{name: 'thump', at: at('train', 'belly'), volume: 0.5},
	{name: 'sting', at: lineAt('contest', 'd4'), volume: 0.4},
	{name: 'pop', at: at('contest', 'shake'), volume: 0.6},
	...[0, 18, 36, 54].map((k) => ({name: 'pop', at: at('contest', 'tricks') + k, volume: 0.5})),
	{name: 'horn', at: at('contest', 'horn'), volume: 0.6},
	{name: 'engine', at: at('contest', 'horn') + 4, volume: 0.35},
	{name: 'skid', at: at('contest', 'arrive') + 6, volume: 0.55},
	{name: 'skid', at: at('contest', 'leave') + 6, volume: 0.4},
	{name: 'sting', at: at('contest', 'treat'), volume: 0.35},
	{name: 'thump', at: at('contest', 'sit'), volume: 0.4},
	{name: 'engine', at: at('contest', 'leave'), volume: 0.4},
	{name: 'drop', at: at('contest', 'leave') + 22, volume: 0.6},
	{name: 'sting', at: at('twist', 'enter'), volume: 0.5},
	{name: 'whoosh', at: at('twist', 'snatch'), volume: 0.6},
	{name: 'thump', at: at('twist', 'enter') + 4, volume: 0.4},
	{name: 'thump', at: at('twist', 'enter') + 12, volume: 0.4},
	{name: 'whoosh', at: at('twist', 'snatch') + 12, volume: 0.5},
];

const SHIPPER_FROM = at('contest', 'horn');
const SHIPPER_TO = at('contest', 'sit');

// Episode 3, "Chó khôn của xóm": Minh bets a month of drinks that Vàng can shake hands
export const Ep03: React.FC = () => (
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
			durationInFrames={scene('pets').from}
			volume={ducked(0.28, 0)}
		/>
		<Audio
			name="Music: stroll (contest)"
			src={staticFile('daytro/music/stroll.wav')}
			from={scene('contest').from}
			durationInFrames={SHIPPER_FROM - scene('contest').from}
			volume={ducked(0.26, scene('contest').from)}
		/>
		<Audio
			name="Music: chase (shipper)"
			src={staticFile('daytro/music/chase.wav')}
			from={SHIPPER_FROM}
			durationInFrames={SHIPPER_TO - SHIPPER_FROM}
			volume={ducked(0.3, SHIPPER_FROM)}
		/>
		<Audio
			name="Music: stroll (twist)"
			src={staticFile('daytro/music/stroll.wav')}
			from={SHIPPER_TO + 20}
			durationInFrames={scene('outro').from - SHIPPER_TO - 20}
			volume={ducked(0.24, SHIPPER_TO + 20)}
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
