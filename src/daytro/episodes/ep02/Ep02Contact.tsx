import type React from 'react';
import {Contact} from '../shared/Contact';
import {Ep02} from './Ep02';
import {scene} from './timeline';

const mark = (key: string, name: string, plus = 0) => scene(key).from + scene(key).marks[name] + plus;
const mid = (key: string, id: string) =>
	scene(key).from + Math.round((scene(key).cues[id].from + scene(key).cues[id].to) / 2);

export const Ep02Contact: React.FC = () => (
	<Contact
		episode={Ep02}
		frames={[
			mid('dusk', 'a2'),
			mid('ladder', 'b8'),
			mark('ladder', 'climb', 40),
			mid('ladder', 'b2'),
			mid('zap', 'c7b'),
			mark('zap', 'zap', 4),
			mid('zap', 'c6'),
			mid('zap', 'c9'),
			mid('pets', 'd2'),
			mid('pets', 'd2'),
			mid('blackout', 'e1'),
			mark('blackout', 'switch', 15),
			mid('blackout', 'e6'),
			mid('thanks', 'g1'),
			mid('thanks', 'g6'),
			mark('outro', 'card', 30),
		]}
	/>
);
