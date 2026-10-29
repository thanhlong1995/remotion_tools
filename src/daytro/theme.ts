import {loadFont} from '@remotion/google-fonts/BeVietnamPro';

// Wide, open letterforms with proper Vietnamese diacritics
export const {fontFamily} = loadFont('normal', {
	weights: ['500', '700', '800'],
	subsets: ['vietnamese', 'latin'],
});

// Thin, near-black lines and flat, true-to-life colours: the deadpan comedy look
export const INK = '#2B2628';
export const OUTLINE = 3.5;
export const CREAM = '#FBF3E4';
