import type React from 'react';
import {Mochi, type MochiMood} from '../characters/mochi/Mochi';
import {MOCHI} from '../characters/mochi/palette';
import {THU} from '../characters/thu/palette';
import {Thu, THU_HOLD_POSE} from '../characters/thu/Thu';
import {ThuHead, type ThuMood} from '../characters/thu/ThuHead';
import {CharacterSheet} from './CharacterSheet';

const THU_VIEW = '-96 -190 192 192';
const MOCHI_VIEW = '-48 -86 96 96';

const thu = (mood: ThuMood) => <ThuHead mood={mood} blink={1} lookX={0} lookY={0} mouthOpen={0} />;
const mochi = (mood: MochiMood) => <Mochi mood={mood} />;

// Bé Thư and her hamster Mochi: the cute pair of the boarding house
export const ThuMochiSheet: React.FC = () => (
	<CharacterSheet
		title="Bé Thư & Mochi"
		subtitle="18 tuổi, tân sinh viên · Chuột hamster"
		traits="Rụt rè, hay nhớ nhà · Ngây thơ, ham ăn, sợ Mướp"
		bubbles={[
			{text: 'Dạ… em chào anh chị ạ!', x: 40, y: 262, width: 500, tailX: 250},
			{text: 'Con người làm vậy để làm gì ạ?', x: 560, y: 530, width: 600, tailX: 300},
		]}
		columns={3}
		expressions={[
			{label: 'Thư: ngại ngùng', node: thu('shy'), viewBox: THU_VIEW},
			{label: 'Thư: vui', node: thu('happy'), viewBox: THU_VIEW},
			{label: 'Thư: nhớ nhà', node: thu('homesick'), viewBox: THU_VIEW},
			{label: 'Mochi: má phồng', node: mochi('stuffed'), viewBox: MOCHI_VIEW},
			{label: 'Mochi: sợ Mướp', node: mochi('scared'), viewBox: MOCHI_VIEW},
			{label: 'Mochi: tò mò', node: mochi('curious'), viewBox: MOCHI_VIEW},
		]}
		swatches={[
			{color: THU.tee, label: 'Áo thun'},
			{color: THU.shorts, label: 'Quần jean'},
			{color: THU.clip, label: 'Kẹp hoa'},
			{color: THU.blush, label: 'Má hồng'},
			{color: MOCHI.fur, label: 'Lông Mochi'},
		]}
	>
		<g transform="translate(290, 1015) scale(0.9)">
			<Thu mood="shy" headTilt={-5} armLeft={THU_HOLD_POSE} armRight={THU_HOLD_POSE} cupped={<Mochi mood="neutral" />} />
		</g>
		<g transform="translate(860, 1015) scale(4.2)">
			<Mochi mood="neutral" />
		</g>
	</CharacterSheet>
);
