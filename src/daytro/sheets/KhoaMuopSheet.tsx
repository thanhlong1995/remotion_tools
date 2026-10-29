import type React from 'react';
import {Khoa} from '../characters/khoa/Khoa';
import {KhoaHead, type KhoaMood} from '../characters/khoa/KhoaHead';
import {KHOA} from '../characters/khoa/palette';
import {Muop, MuopHead, type MuopMood} from '../characters/muop/Muop';
import {MUOP} from '../characters/muop/palette';
import {CharacterSheet} from './CharacterSheet';

const KHOA_VIEW = '-98 -188 196 196';
const MUOP_VIEW = '-64 -118 128 128';

const khoa = (mood: KhoaMood) => <KhoaHead mood={mood} blink={1} lookX={0} lookY={0} mouthOpen={0} />;
const muop = (mood: MuopMood) => <MuopHead mood={mood} blink={1} lookX={0} mouthOpen={0} />;

// Anh Khoa and his tabby Mướp (the cat is drawn larger than life here so his face reads)
export const KhoaMuopSheet: React.FC = () => (
	<CharacterSheet
		title="Anh Khoa & Mướp"
		subtitle="25 tuổi, lập trình viên · Mèo mướp giang hồ"
		traits="Cú đêm, nghiện game, cuối tháng ăn mì · Lạnh lùng, cà khịa"
		bubbles={[
			{text: 'Fix xong bug này là ngủ…', x: 30, y: 262, width: 520, tailX: 290},
			{text: 'Con người… sinh vật kỳ lạ.', x: 590, y: 340, width: 540, tailX: 270},
		]}
		columns={3}
		expressions={[
			{label: 'Khoa: thức trắng', node: khoa('zombie'), viewBox: KHOA_VIEW},
			{label: 'Khoa: chạy rồi!', node: khoa('happy'), viewBox: KHOA_VIEW},
			{label: 'Khoa: hết tiền', node: khoa('broke'), viewBox: KHOA_VIEW},
			{label: 'Mướp: phán xét', node: muop('judge'), viewBox: MUOP_VIEW},
			{label: 'Mướp: khoái chí', node: muop('smug'), viewBox: MUOP_VIEW},
			{label: 'Mướp: bực', node: muop('annoyed'), viewBox: MUOP_VIEW},
		]}
		swatches={[
			{color: KHOA.hoodie, label: 'Áo hoodie'},
			{color: KHOA.shorts, label: 'Quần đùi'},
			{color: KHOA.eyeBag, label: 'Quầng thâm'},
			{color: MUOP.fur, label: 'Lông mướp'},
			{color: MUOP.iris, label: 'Mắt mèo'},
		]}
	>
		<g transform="translate(320, 1015) scale(0.82)">
			<Khoa mood="zombie" headTilt={5} armLeft={{shoulder: 16, elbow: -100}} holdLeft />
		</g>
		<g transform="translate(860, 1015) scale(2.4)">
			<Muop mood="judge" lookX={-1} tailFlick={-6} />
		</g>
	</CharacterSheet>
);
