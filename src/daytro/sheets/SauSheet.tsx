import type React from 'react';
import {Minh} from '../characters/minh/Minh';
import {SAU} from '../characters/sau/palette';
import {Sau} from '../characters/sau/Sau';
import {SauHead, type SauMood} from '../characters/sau/SauHead';
import {CharacterSheet} from './CharacterSheet';

const SAU_VIEW = '-110 -214 220 220';

const sau = (mood: SauMood) => <SauHead mood={mood} blink={1} lookX={0} lookY={0} mouthOpen={0} />;

// Chú Sáu next to chú Minh: the skinny half of the boarding house's fat-and-thin double act
export const SauSheet: React.FC = () => (
	<CharacterSheet
		title="Chú Sáu “Xạo”"
		subtitle="65 tuổi · bạn nhậu, bạn câu cá của chú Minh"
		traits="Người miền Nam, góa vợ, vui tính, hay rủ rê, nổ banh nóc"
		bubbles={[
			{text: 'Con cá to cỡ này nè, thiệt đó!', x: 30, y: 246, width: 540, tailX: 300},
			{text: 'Lại xạo nữa rồi…', x: 690, y: 340, width: 360, tailX: 170},
		]}
		expressions={[
			{label: 'Cười sún răng', node: sau('grin'), viewBox: SAU_VIEW},
			{label: 'Nổ', node: sau('brag'), viewBox: SAU_VIEW},
			{label: 'Xỉn', node: sau('drunk'), viewBox: SAU_VIEW},
			{label: '“Một ly thôi mà!”', node: sau('wink'), viewBox: SAU_VIEW},
		]}
		swatches={[
			{color: SAU.hat, label: 'Nón tai bèo'},
			{color: SAU.polo, label: 'Áo polo'},
			{color: SAU.pants, label: 'Quần tây'},
			{color: SAU.sock, label: 'Tất trắng'},
			{color: SAU.skin, label: 'Da rám nắng'},
		]}
	>
		<g transform="translate(320, 1015) scale(0.8)">
			<Sau mood="brag" armRight={{shoulder: 84, elbow: 6}} armLeft={{shoulder: 22, elbow: -62}} holdFish />
		</g>
		<g transform="translate(860, 1015) scale(0.8)">
			<Minh mood="smug" headTilt={-4} />
		</g>
	</CharacterSheet>
);
