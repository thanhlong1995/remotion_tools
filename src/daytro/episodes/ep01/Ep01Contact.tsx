import type React from 'react';
import {AbsoluteFill, Freeze} from 'remotion';
import {Ep01} from './Ep01';
import {scene} from './timeline';

const mark = (key: string, name: string, plus = 0) => scene(key).from + scene(key).marks[name] + plus;
const mid = (key: string, id: string) => {
	const s = scene(key);
	return s.from + Math.round((s.cues[id].from + s.cues[id].to) / 2);
};

// Key moments of episode 1, frozen in a 4 x 4 grid, for checking the pictures without a full render
const FRAMES = [
	mid('gossip', 's1-04c'),
	mark('gate', 'title', 20),
	mid('gossip', 's1-05'),
	mid('gossip', 's1-11'),
	mark('bag', 'lunge', 6),
	mark('chase', 'roller', 10),
	mid('nhau', 's4-01'),
	mid('chase', 's6-02d'),
	mark('nhau', 'hand', 30),
	mark('shipper', 'arrive', 30),
	mark('shipper', 'eyes', 10),
	mark('shipper', 'bolt', 20),
	mark('chase', 'reach', 5),
	mid('return', 'r-01'),
	mark('return', 'vangBack', 30),
	mid('return', 'r-06'),
	mark('roof', 'card', 30),
];

export const Ep01Contact: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: '#222'}}>
		{FRAMES.map((f, i) => (
			<div key={f} style={{position: 'absolute', left: (i % 4) * 480, top: Math.floor(i / 4) * 270, width: 1920, height: 1080, transform: 'scale(0.25)', transformOrigin: '0 0', overflow: 'hidden'}}>
				<Freeze frame={f}>
					<Ep01 />
				</Freeze>
				<div style={{position: 'absolute', left: 20, top: 20, color: '#fff', fontSize: 64, fontWeight: 800, textShadow: '0 0 8px #000'}}>{f}</div>
			</div>
		))}
	</AbsoluteFill>
);
