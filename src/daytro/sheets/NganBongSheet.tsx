import type React from 'react';
import {Bong, BongHead, type BongMood} from '../characters/bong/Bong';
import {BONG} from '../characters/bong/palette';
import {Ngan} from '../characters/ngan/Ngan';
import {NganHead, type NganMood} from '../characters/ngan/NganHead';
import {NGAN} from '../characters/ngan/palette';
import {CharacterSheet} from './CharacterSheet';

const NGAN_VIEW = '-100 -192 200 200';
const BONG_VIEW = '-62 -104 124 124';

const ngan = (mood: NganMood) => <NganHead mood={mood} blink={1} lookX={0} lookY={0} mouthOpen={0} />;
const bong = (mood: BongMood) => <BongHead mood={mood} blink={1} mouthOpen={0} />;

// Chị Ngân and her Pomeranian Bông (the dog is drawn larger than life here so her face reads)
export const NganBongSheet: React.FC = () => (
	<CharacterSheet
		title="Chị Ngân & Bông"
		subtitle="27 tuổi, dân văn phòng · Phốc sóc tiểu thư"
		traits="Nghiện mua online, sống ảo · Điệu, chảnh, nhát gan"
		bubbles={[
			{text: 'Đợi chị chụp tấm hình đã!', x: 30, y: 262, width: 480, tailX: 300},
			{text: 'Hứ, chó ta quê mùa!', x: 650, y: 560, width: 420, tailX: 210},
		]}
		columns={3}
		expressions={[
			{label: 'Ngân: sống ảo', node: ngan('selfie'), viewBox: NGAN_VIEW},
			{label: 'Ngân: hàng về!', node: ngan('excited'), viewBox: NGAN_VIEW},
			{label: 'Ngân: khóc', node: ngan('cry'), viewBox: NGAN_VIEW},
			{label: 'Bông: chảnh', node: bong('snob'), viewBox: BONG_VIEW},
			{label: 'Bông: sủa', node: bong('yap'), viewBox: BONG_VIEW},
			{label: 'Bông: sợ run', node: bong('scared'), viewBox: BONG_VIEW},
		]}
		swatches={[
			{color: NGAN.blouse, label: 'Áo blouse'},
			{color: NGAN.hair, label: 'Tóc caramel'},
			{color: NGAN.lens, label: 'Lens xám xanh'},
			{color: NGAN.lips, label: 'Son ombre'},
			{color: BONG.fur, label: 'Lông Bông'},
		]}
	>
		<g transform="translate(300, 1015) scale(0.86)">
			<Ngan
				mood="selfie"
				headTilt={-6}
				armRight={{shoulder: 60, elbow: 80}}
				armLeft={{shoulder: 20, elbow: -90}}
				holdRight="phone"
				holdLeft="parcels"
			/>
		</g>
		<g transform="translate(860, 1015) scale(2.2)">
			<Bong mood="snob" tailWag={6} />
		</g>
	</CharacterSheet>
);
