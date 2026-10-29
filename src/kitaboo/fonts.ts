import {loadFont} from '@remotion/google-fonts/Baloo2';

// Rounded, playful face with full Vietnamese diacritics support
export const {fontFamily} = loadFont('normal', {
	weights: ['500', '700', '800'],
	subsets: ['vietnamese', 'latin'],
});
