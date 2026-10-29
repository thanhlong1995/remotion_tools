import {loadFont} from '@remotion/google-fonts/BeVietnamPro';

export const {fontFamily} = loadFont('normal', {
	weights: ['500', '700', '800'],
	subsets: ['vietnamese', 'latin'],
});

export const colors = {
	text: '#F4F6FF',
	muted: '#A9B1D6',
	card: 'rgba(255, 255, 255, 0.06)',
	cardBorder: 'rgba(255, 255, 255, 0.12)',
	yellow: '#FFD166',
	purple: '#8B7CFF',
	blue: '#4DA3FF',
	green: '#3DDC97',
	red: '#FF6B6B',
};
