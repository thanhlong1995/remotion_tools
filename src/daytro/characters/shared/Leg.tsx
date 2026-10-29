import type React from 'react';
import {INK, OUTLINE} from '../../theme';
import type {LegPose} from './walk';

type LegProps = {
	readonly x: number;
	readonly y: number;
	readonly pose: LegPose;
	readonly thigh: number;
	readonly shin: number;
	// Width at the hip and at the hem
	readonly top: number;
	readonly bottom: number;
	readonly fill: string;
	// Drawn at the ankle and kept level with the ground, toe pointing +x
	readonly foot: React.ReactNode;
};

// A trouser leg seen from the side, hanging from the hip joint at (x, y). Thigh and shin are inked
// first and filled second so the knee reads as one bend in the fabric
export const Leg: React.FC<LegProps> = ({x, y, pose, thigh, shin, top, bottom, fill, foot}) => {
	const knee = top * 0.92;
	const parts = (paint: React.SVGProps<SVGPathElement>) => (
		<g transform={`translate(${x}, ${y}) rotate(${-pose.hip})`}>
			<path
				d={`M ${-top / 2} -10 L ${top / 2} -10 L ${knee / 2} ${thigh + 6} L ${-knee / 2} ${thigh + 6} Z`}
				strokeLinejoin="round"
				{...paint}
			/>
			<circle cx={0} cy={-10} r={top / 2} {...(paint as React.SVGProps<SVGCircleElement>)} />
			<g transform={`translate(0, ${thigh}) rotate(${pose.knee})`}>
				<circle cx={0} cy={0} r={knee / 2} {...(paint as React.SVGProps<SVGCircleElement>)} />
				<path
					d={`M ${-knee / 2} 0 L ${knee / 2} 0 L ${bottom / 2} ${shin} L ${-bottom / 2} ${shin} Z`}
					strokeLinejoin="round"
					{...paint}
				/>
			</g>
		</g>
	);
	return (
		<g>
			{parts({fill: INK, stroke: INK, strokeWidth: OUTLINE * 2})}
			{parts({fill})}
			<g transform={`translate(${x}, ${y}) rotate(${-pose.hip}) translate(0, ${thigh}) rotate(${pose.knee})`}>
				<path
					d={`M ${-bottom / 2 + 3} ${shin - 7} L ${bottom / 2 - 3} ${shin - 7}`}
					stroke={INK}
					strokeWidth={1.5}
					opacity={0.35}
				/>
				<g transform={`translate(0, ${shin}) rotate(${pose.hip - pose.knee})`}>{foot}</g>
			</g>
		</g>
	);
};
