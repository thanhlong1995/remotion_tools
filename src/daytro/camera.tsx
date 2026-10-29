import type React from 'react';

export const SCREEN = {w: 1920, h: 1080};

// Every shot is framed this many screen pixels higher than the camera point, keeping a strip at the
// bottom free for subtitles so they don't cover anyone's feet
export const LIFT = 100;

// Where the camera looks (the world point at the centre of the frame) and how far it zooms in
export type Cam = {readonly x: number; readonly y: number; readonly zoom: number};

export const toScreen = (cam: Cam, wx: number, wy: number) => ({
	x: (wx - cam.x) * cam.zoom + SCREEN.w / 2,
	y: (wy - cam.y) * cam.zoom + SCREEN.h / 2 - LIFT,
});

// The visible span of world x, for sets that only draw what is on screen
export const visibleX = (cam: Cam) => ({
	left: cam.x - SCREEN.w / 2 / cam.zoom,
	right: cam.x + SCREEN.w / 2 / cam.zoom,
});

// Blend two camera framings: t = 0 gives a, 1 gives b
export const mixCam = (a: Cam, b: Cam, t: number): Cam => ({
	x: a.x + (b.x - a.x) * t,
	y: a.y + (b.y - a.y) * t,
	zoom: a.zoom + (b.zoom - a.zoom) * t,
});

// Everything inside is drawn in world coordinates and framed by the camera
export const World: React.FC<{cam: Cam; children: React.ReactNode}> = ({cam, children}) => (
	<svg width={SCREEN.w} height={SCREEN.h} viewBox={`0 0 ${SCREEN.w} ${SCREEN.h}`} style={{position: 'absolute', left: 0, top: 0}}>
		<g transform={`translate(${SCREEN.w / 2}, ${SCREEN.h / 2 - LIFT}) scale(${cam.zoom}) translate(${-cam.x}, ${-cam.y})`}>{children}</g>
	</svg>
);
