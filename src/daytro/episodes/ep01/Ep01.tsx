import {Audio} from '@remotion/media';
import type React from 'react';
import {AbsoluteFill, Sequence, staticFile} from 'remotion';
import {BagScene} from './scenes/BagScene';
import {ChaseScene} from './scenes/ChaseScene';
import {GateScene} from './scenes/GateScene';
import {NhauScene} from './scenes/NhauScene';
import {ReturnScene} from './scenes/ReturnScene';
import {RoofScene} from './scenes/RoofScene';
import {ShipperScene} from './scenes/ShipperScene';
import {WalkTalkScene} from './scenes/WalkTalkScene';
import {audioFile, LINES, scene, SCENES} from './timeline';

const COMPONENTS: Record<string, React.FC> = {
	gate: GateScene,
	gossip: () => <WalkTalkScene sceneKey="gossip" startX={2600} />,
	reminder: () => <WalkTalkScene sceneKey="reminder" startX={6200} />,
	bag: BagScene,
	nhau: NhauScene,
	shipper: ShipperScene,
	chase: ChaseScene,
	return: ReturnScene,
	roof: RoofScene,
};

// Global frame of a scene mark, or of the start of a line
const at = (key: string, mark: string) => scene(key).from + scene(key).marks[mark];
const lineAt = (key: string, id: string) => scene(key).from + scene(key).cues[id].from;

// Every spoken line as a global [from, to) span, for ducking the music under dialogue
const SPANS = SCENES.flatMap((s) => Object.values(s.cues).map((c) => [s.from + c.from, s.from + c.to] as const));
const ducked = (base: number, offset: number) => (f: number) =>
	SPANS.some(([a, b]) => f + offset >= a - 4 && f + offset < b + 4) ? base * 0.5 : base;

type Sfx = {name: string; at: number; volume?: number};

const SFX: Sfx[] = [
	{name: 'pop', at: at('gate', 'title'), volume: 0.6},
	{name: 'wind', at: at('bag', 'wind'), volume: 0.5},
	{name: 'bag', at: at('bag', 'wind') + 12, volume: 0.45},
	{name: 'whoosh', at: at('bag', 'lunge'), volume: 0.6},
	{name: 'skid', at: at('bag', 'lunge') + 4, volume: 0.5},
	{name: 'skid', at: at('bag', 'lunge') + 26, volume: 0.45},
	{name: 'thump', at: at('bag', 'hold'), volume: 0.5},
	...[0, 9, 18, 27].map((k) => ({name: 'thump', at: lineAt('bag', 's3-03') + k, volume: 0.7})),
	{name: 'gulp', at: at('nhau', 'crave') + 14, volume: 0.7},
	{name: 'slip', at: at('nhau', 'hand') + 6, volume: 0.6},
	{name: 'horn', at: at('shipper', 'horn'), volume: 0.6},
	{name: 'engine', at: at('shipper', 'horn') + 4, volume: 0.35},
	{name: 'skid', at: at('shipper', 'arrive') + 8, volume: 0.45},
	{name: 'drop', at: at('shipper', 'arrive') + 26, volume: 0.6},
	{name: 'sting', at: at('shipper', 'eyes'), volume: 0.6},
	{name: 'whoosh', at: at('shipper', 'bolt'), volume: 0.7},
	{name: 'slip', at: at('shipper', 'bolt') + 2, volume: 0.6},
	{name: 'engine', at: at('shipper', 'bolt') + 10, volume: 0.45},
	{name: 'engine', at: scene('chase').from, volume: 0.3},
	{name: 'drop', at: lineAt('chase', 's6-01') + 12, volume: 0.5},
	{name: 'whoosh', at: at('chase', 'reach'), volume: 0.4},
	{name: 'pop', at: at('chase', 'roller'), volume: 0.6},
	{name: 'drop', at: at('chase', 'roller') + 24, volume: 0.35},
	{name: 'drop', at: at('return', 'vangBack') + 34, volume: 0.4},
];

const MUSIC_STOP = at('shipper', 'eyes');
const CHASE_FROM = at('shipper', 'bolt');
const CHASE_TO = scene('return').from + 15;

// Episode 1, "Dây chắc lắm!": the landlord couple walk Vàng, and Vàng gets away
export const Ep01: React.FC = () => (
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
						key={id}
						name={`${LINES[id].speaker} ${id}`}
						src={staticFile(file)}
						from={s.from + cue.from}
						volume={1}
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
			volume={ducked(0.32, 0)}
		/>
		<Audio
			name="Music: chase"
			src={staticFile('daytro/music/chase.wav')}
			from={CHASE_FROM}
			durationInFrames={CHASE_TO - CHASE_FROM}
			volume={ducked(0.42, CHASE_FROM)}
		/>
		<Audio
			name="Music: stroll (return)"
			src={staticFile('daytro/music/stroll.wav')}
			from={scene('return').from + 10}
			durationInFrames={scene('return').duration - 10}
			volume={ducked(0.22, scene('return').from + 10)}
		/>
		<Audio name="Music: outro" src={staticFile('daytro/music/outro.wav')} from={at('roof', 'card')} volume={0.5} />
		<Audio
			name="Ambience"
			src={staticFile('daytro/sfx/ambience.wav')}
			from={0}
			durationInFrames={CHASE_FROM}
			volume={0.25}
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
		{/* Far below the roof, the chase goes on */}
		{['s6-02', 's6-04'].map((id, k) => {
			const file = audioFile(id);
			return file ? (
				<Audio
					key={`echo-${id}`}
					name={`Distant ${id}`}
					src={staticFile(file)}
					from={scene('roof').from + 18 + k * 34}
					volume={0.18}
				/>
			) : null;
		})}
	</AbsoluteFill>
);
