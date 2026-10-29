import type React from 'react';
import {useId} from 'react';

const FAR = 4000;

// Front-view stepping. Everything below the hip line is drawn twice, one copy per half of the
// body (screen-left, screen-right), each squashed up towards the hip by its own lift so that
// foot comes off the ground; everything above the hip is drawn once, as is. The origin is on
// the ground between the feet, so the leg length is -hipY
export const SteppedLegs: React.FC<{
	hipY: number;
	lift?: readonly [number, number];
	children: React.ReactNode;
}> = ({hipY, lift, children}) => {
	const id = useId().replace(/:/g, '');
	if (!lift || (lift[0] < 0.5 && lift[1] < 0.5)) {
		return <>{children}</>;
	}
	const squash = (l: number) => Math.max(0.2, (-hipY - l) / -hipY);
	return (
		<g>
			<defs>
				<clipPath id={`${id}-top`}>
					<rect x={-FAR} y={-FAR} width={2 * FAR} height={FAR + hipY + 0.5} />
				</clipPath>
				<clipPath id={`${id}-left`}>
					<rect x={-FAR} y={hipY} width={FAR} height={FAR} />
				</clipPath>
				<clipPath id={`${id}-right`}>
					<rect x={0} y={hipY} width={FAR} height={FAR} />
				</clipPath>
			</defs>
			<g clipPath={`url(#${id}-top)`}>{children}</g>
			{(['left', 'right'] as const).map((half, i) => (
				<g key={half} clipPath={`url(#${id}-${half})`}>
					<g transform={`translate(0, ${hipY}) scale(1, ${squash(lift[i])}) translate(0, ${-hipY})`}>{children}</g>
				</g>
			))}
		</g>
	);
};

// Foot lifts and body bob for a front-view walk at `phase` (cycles); `stride` is the foot lift in px
export const frontStep = (phase: number, stride = 34) => {
	const s = Math.sin(phase * 2 * Math.PI);
	return {
		lift: [Math.max(0, s) * stride, Math.max(0, -s) * stride] as const,
		bob: Math.abs(s) * stride * 0.25,
		sway: 2.5 * s,
	};
};
