import type React from 'react';
import {Vang} from '../characters/vang/Vang';
import {VangHead, type VangMood} from '../characters/vang/VangHead';
import {VANG} from '../characters/vang/palette';
import {CharacterSheet} from './CharacterSheet';

const HEAD_VIEW = '-125 -228 250 250';

const head = (mood: VangMood) => <VangHead mood={mood} blink={1} lookX={0} lookY={0} mouthOpen={0} />;

export const VangSheet: React.FC = () => (
	<CharacterSheet
		title="Vàng"
		subtitle="Chó ta · bảo vệ (tự phong) của dãy trọ"
		traits="Ham ăn · hóng hớt · trung thành"
		bubbles={[{text: 'Chuyện gì ở dãy này mà qua mặt được tao!', x: 600, y: 232, width: 520, tailX: 240}]}
		expressions={[
			{label: 'Vui', node: head('happy'), viewBox: HEAD_VIEW},
			{label: 'Sủa', node: head('bark'), viewBox: HEAD_VIEW},
			{label: 'Thèm ăn', node: head('hungry'), viewBox: HEAD_VIEW},
			{label: 'Sợ', node: head('scared'), viewBox: HEAD_VIEW},
		]}
		swatches={[
			{color: VANG.fur, label: 'Lông vàng'},
			{color: VANG.cream, label: 'Lông kem'},
			{color: VANG.innerEar, label: 'Trong tai'},
			{color: VANG.collar, label: 'Vòng cổ'},
			{color: VANG.tag, label: 'Thẻ tên'},
		]}
	>
		<g transform="translate(320, 1010) scale(1.2)">
			<Vang mood="neutral" />
		</g>
		<g transform="translate(840, 1010) scale(1.2)">
			<Vang mood="gossip" headTilt={-8} tailWag={-10} />
		</g>
	</CharacterSheet>
);
