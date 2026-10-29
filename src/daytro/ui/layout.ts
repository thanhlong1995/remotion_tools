import {type Cam, SCREEN, toScreen} from '../camera';

// Screen-space rectangles, for keeping captions off the characters
export type Rect = {readonly x0: number; readonly y0: number; readonly x1: number; readonly y1: number};

// Where a character is on screen: the whole body, and the face (which must never be covered)
export type Box = {readonly body: Rect; readonly face: Rect};

// Screen box of a character standing at world (x, footY), `w` wide and `h` tall in world units.
// The face is the top `faceShare` of the height
export const boxAt = (cam: Cam, x: number, footY: number, w: number, h: number, faceShare = 0.3): Box => {
	const top = toScreen(cam, x - w / 2, footY - h);
	const bottom = toScreen(cam, x + w / 2, footY);
	const faceBottom = top.y + (bottom.y - top.y) * faceShare;
	return {
		body: {x0: top.x, y0: top.y, x1: bottom.x, y1: bottom.y},
		face: {x0: top.x, y0: top.y, x1: bottom.x, y1: faceBottom},
	};
};

export const area = (a: Rect, b: Rect) =>
	Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));

// The strip where subtitles go, at the bottom of the frame
export const SUBTITLE_BAND: Rect = {x0: 160, y0: SCREEN.h - 190, x1: SCREEN.w - 160, y1: SCREEN.h};

const MARGIN = 30;

// Best spot for a w x h thought cloud belonging to a head at (toX, toY): as close as possible to the
// head, on the preferred side, without covering any face, then any body, then the subtitle strip.
// Faces cost the most; a cloud that has to touch someone covers their body rather than their face
export const placeCloud = (
	w: number,
	h: number,
	toX: number,
	toY: number,
	side: 'left' | 'right',
	lift: number,
	avoid: readonly Box[],
) => {
	const prefX = side === 'left' ? toX - w - 40 : toX + 40;
	const prefY = toY - h - 120 - lift;
	const clampX = (x: number) => Math.max(MARGIN, Math.min(SCREEN.w - MARGIN - w, x));
	const clampY = (y: number) => Math.max(MARGIN, Math.min(SCREEN.h - MARGIN - h, y));
	let best = {x: clampX(prefX), y: clampY(prefY), cost: Infinity};
	for (let dx = -900; dx <= 900; dx += 60) {
		for (let dy = -700; dy <= 200; dy += 40) {
			const x = clampX(prefX + dx);
			const y = clampY(prefY + dy);
			const r = {x0: x - 12, y0: y - 12, x1: x + w + 12, y1: y + h + 12};
			const covered =
				avoid.reduce((sum, b) => sum + 30 * area(r, b.face) + 3 * area(r, b.body), 0) + 2 * area(r, SUBTITLE_BAND);
			// Prefer staying near the thinker, and above rather than beside or below the head
			const cost = covered + Math.abs(x - prefX) * 6 + Math.abs(y - prefY) * 4 + (y + h > toY - 20 ? 8000 : 0);
			if (cost < best.cost) {
				best = {x, y, cost};
			}
		}
	}
	return best;
};

// Subtitles move to the top of the frame when a face is down in the subtitle strip (close-ups)
export const subtitleAtTop = (avoid: readonly Box[]) => avoid.some((b) => area(b.face, SUBTITLE_BAND) > 0);
