import type React from 'react';
import {Minh} from '../characters/minh/Minh';
import {MinhHead, type Mood} from '../characters/minh/MinhHead';
import {BaTu} from '../characters/tu/BaTu';
import {BaTuHead, type TuMood} from '../characters/tu/BaTuHead';
import {TU} from '../characters/tu/palette';
import {CharacterSheet} from './CharacterSheet';

// Her hair needs a wider view than his bald head
const TU_VIEW = '-126 -212 252 252';
const MINH_VIEW = '-96 -170 192 192';

const tu = (mood: TuMood) => <BaTuHead mood={mood} blink={1} lookX={0} lookY={0} mouthOpen={0} />;
const minh = (mood: Mood) => <MinhHead mood={mood} blink={1} lookX={0} lookY={0} mouthOpen={0} />;

// The landlord couple: Bà Tư with her calculator and ledger, Chú Minh beside her
export const ChuTroSheet: React.FC = () => (
	<CharacterSheet
		title="Vợ chồng chủ trọ"
		subtitle="Bà Tư, 58 · Chú Minh, 63"
		traits="Bà: khó tính, keo kiệt, thương ngầm · Ông: hiền, sợ vợ"
		bubbles={[{text: 'Tháng này điện nước lên giá nha mấy đứa!', x: 90, y: 252, width: 470, tailX: 240}]}
		columns={3}
		expressions={[
			{label: 'Bà: tính tiền', node: tu('counting'), viewBox: TU_VIEW},
			{label: 'Bà: nhận tiền', node: tu('happy'), viewBox: TU_VIEW},
			{label: 'Bà: gắt', node: tu('yell'), viewBox: TU_VIEW},
			{label: 'Ông: cười hề hề', node: minh('happy'), viewBox: MINH_VIEW},
			{label: 'Ông: giật mình', node: minh('shock'), viewBox: MINH_VIEW},
			{label: 'Ông: sợ vợ', node: minh('scared'), viewBox: MINH_VIEW},
		]}
		swatches={[
			{color: TU.outfit, label: 'Đồ bộ hoa'},
			{color: TU.roller, label: 'Lô cuốn tóc'},
			{color: TU.lips, label: 'Son đỏ'},
			{color: TU.gold, label: 'Vàng đeo'},
			{color: TU.notebook, label: 'Sổ điện nước'},
		]}
	>
		<g transform="translate(330, 1015) scale(0.82)">
			<BaTu
				mood="suspicious"
				armLeft={{shoulder: 10, elbow: -6}}
				armRight={{shoulder: 18, elbow: -135}}
				holdLeft="notebook"
				holdRight="calculator"
			/>
		</g>
		<g transform="translate(790, 1015) scale(0.82)">
			<Minh mood="smug" headTilt={3} />
		</g>
	</CharacterSheet>
);
