import type React from 'react';
import {Hung, HUNG_MIC_POSE, KaraokeSpeaker} from '../characters/hung/Hung';
import {HungHead, type HungMood} from '../characters/hung/HungHead';
import {HUNG} from '../characters/hung/palette';
import {Minh} from '../characters/minh/Minh';
import {CharacterSheet} from './CharacterSheet';

const HUNG_VIEW = '-116 -224 232 232';

const hung = (mood: HungMood) => <HungHead mood={mood} blink={1} lookX={0} lookY={0} mouthOpen={0} />;

// Chú Hùng "Loa" with his karaoke trolley, chú Minh alongside for scale
export const HungSheet: React.FC = () => (
	<CharacterSheet
		title="Chú Hùng “Loa”"
		subtitle="64 tuổi · hàng xóm đầu hẻm, bạn của chú Minh"
		traits="Dân chơi về hưu, mê karaoke bolero, hát dở mà tự tin"
		bubbles={[
			{text: 'Đêm nay anh hát tặng cả xóm!', x: 60, y: 252, width: 580, tailX: 320},
			{text: 'Mười một giờ rồi ông ơi…', x: 650, y: 318, width: 480, tailX: 230},
		]}
		expressions={[
			{label: 'Hát say sưa', node: hung('sing'), viewBox: HUNG_VIEW},
			{label: 'Sĩ', node: hung('cool'), viewBox: HUNG_VIEW},
			{label: 'Bị chê hát dở', node: hung('hurt'), viewBox: HUNG_VIEW},
			{label: '“Ai rút loa?!”', node: hung('angry'), viewBox: HUNG_VIEW},
		]}
		swatches={[
			{color: HUNG.leopard, label: 'Áo da báo'},
			{color: HUNG.trousers, label: 'Quần trắng'},
			{color: HUNG.hair, label: 'Tóc nhuộm'},
			{color: HUNG.gold, label: 'Đồ vàng'},
			{color: HUNG.speaker, label: 'Loa kẹo kéo'},
		]}
	>
		<g transform="translate(170, 1015) scale(0.86)">
			<KaraokeSpeaker />
		</g>
		<g transform="translate(400, 1015) scale(0.86)">
			<Hung mood="sing" headTilt={-8} armRight={HUNG_MIC_POSE} armLeft={{shoulder: 62, elbow: 36}} mic />
		</g>
		<g transform="translate(880, 1015) scale(0.86)">
			<Minh mood="scared" headTilt={6} />
		</g>
	</CharacterSheet>
);
