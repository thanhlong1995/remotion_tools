import type React from 'react';
import {Contact} from '../shared/Contact';
import {Ep03} from './Ep03';
import {scene} from './timeline';

const mark = (key: string, name: string, plus = 0) => scene(key).from + scene(key).marks[name] + plus;
const mid = (key: string, id: string) =>
	scene(key).from + Math.round((scene(key).cues[id].from + scene(key).cues[id].to) / 2);

export const Ep03Contact: React.FC = () => (
	<Contact
		episode={Ep03}
		frames={[
			mark('bet', 'title', 20),
			mid('bet', 'a5'),
			mid('bet', 'a9'),
			mid('train', 'b2'),
			mark('train', 'lick', 10),
			mid('contest', 'd17'),
			mark('train', 'scratch', 15),
			mid('pets', 'c2'),
			mid('contest', 'd4'),
			mark('contest', 'shake', 10),
			mark('contest', 'tricks', 45),
			mid('contest', 'd9'),
			mid('contest', 'd11'),
			mark('contest', 'leave', 20),
			mark('twist', 'snatch', 12),
			mid('twist', 'e7'),
		]}
	/>
);
