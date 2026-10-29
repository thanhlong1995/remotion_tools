import type React from 'react';
import {INK, OUTLINE} from '../../theme';

export type Side = -1 | 1;
export const SIDES: readonly Side[] = [-1, 1];

// Degrees. shoulder 0 = hanging straight down, positive swings the arm away from the body;
// elbow positive bends the forearm up and outward, negative folds it back towards the body
export type ArmPose = {readonly shoulder: number; readonly elbow: number};

export const ARM_REST: ArmPose = {shoulder: 7, elbow: -4};

// Lengths are shoulder to elbow and elbow to the centre of the hand
export type ArmShape = {
	readonly upper: number;
	readonly fore: number;
	readonly width: number;
	readonly hand: number;
	readonly sleeve: number;
};

// Paint the 'ink' pass for both arms, then 'skin', then 'cloth', so upper arm, forearm and
// hand read as one outlined shape with the sleeve and held props on top
export type ArmLayer = 'ink' | 'skin' | 'cloth';

type ArmProps = {
	readonly side: Side;
	readonly pose: ArmPose;
	readonly layer: ArmLayer;
	readonly shape: ArmShape;
	readonly shoulder: {readonly x: number; readonly y: number};
	readonly skin: string;
	// Any SVG paint, including url(#pattern)
	readonly sleeve: string;
	readonly cuff: string;
	// Drawn upright in the fist, centred on the hand
	readonly held?: React.ReactNode;
	// For long sleeves: `skin` paints the sleeved arm and this paints the bare hand
	readonly handSkin?: string;
};

// A short-sleeved arm hanging from the shoulder at (side * shoulder.x, shoulder.y)
export const Arm: React.FC<ArmProps> = ({side, pose, layer, shape, shoulder, skin, sleeve, cuff, held, handSkin}) => {
	const {upper, fore, width: w, hand, sleeve: sleeveLength} = shape;
	const paint = layer === 'ink' ? {fill: INK, stroke: INK, strokeWidth: OUTLINE * 2} : {fill: skin};
	const handPaint = layer === 'ink' ? paint : {fill: handSkin ?? skin};
	const upright = side * (pose.shoulder + pose.elbow);
	return (
		<g transform={`translate(${side * shoulder.x}, ${shoulder.y}) rotate(${-side * pose.shoulder})`}>
			{layer === 'cloth' ? (
				// Drawn for a 40-wide, 76-long sleeve and stretched to fit. Mirrored so +x points away
				// from the body; the cap overlaps the torso unstroked, so it grows out of the shoulder seam
				<g transform={`scale(${(side * w) / 40}, ${sleeveLength / 76})`}>
					<path
						d="M -12 -27 Q 30 -30 40 -6 Q 48 36 36 76 Q 0 86 -34 76 Q -38 30 -36 -14 Q -26 -26 -12 -27 Z"
						fill={sleeve}
					/>
					<path
						d="M -12 -27 Q 30 -30 40 -6 Q 48 36 36 76 Q 0 86 -34 76 Q -37 50 -38 30"
						fill="none"
						stroke={INK}
						strokeWidth={OUTLINE}
						strokeLinecap="round"
						strokeLinejoin="round"
						vectorEffect="non-scaling-stroke"
					/>
					<path
						d="M -34 64 Q 0 73 37 64"
						fill="none"
						stroke={cuff}
						strokeWidth={2.5}
						vectorEffect="non-scaling-stroke"
					/>
				</g>
			) : (
				<rect x={-w / 2} y={sleeveLength - 40} width={w} height={upper - sleeveLength + 52} rx={w / 2} {...paint} />
			)}
			<g transform={`translate(0, ${upper}) rotate(${-side * pose.elbow})`}>
				{layer === 'cloth' ? (
					held ? (
						<g>
							<g transform={`translate(0, ${fore}) rotate(${upright})`}>{held}</g>
							<ellipse
								cx={-side * hand * 0.45}
								cy={fore - hand * 0.3}
								rx={hand * 0.4}
								ry={hand * 0.6}
								fill={handSkin ?? skin}
								stroke={INK}
								strokeWidth={OUTLINE}
							/>
						</g>
					) : (
						// Thumb crease on the inner side of the fist
						<path
							d={`M ${-side * hand * 0.55} ${fore - hand * 0.65} Q ${-side * hand * 0.1} ${fore - hand * 0.2} ${-side * hand * 0.4} ${fore + hand * 0.4}`}
							fill="none"
							stroke={INK}
							strokeWidth={OUTLINE * 0.8}
							strokeLinecap="round"
						/>
					)
				) : (
					<g>
						<rect x={-w * 0.47} y={-w * 0.45} width={w * 0.94} height={fore} rx={w * 0.47} {...paint} />
						<circle cx={0} cy={fore} r={hand} {...handPaint} />
						{handSkin && layer === 'skin' ? (
							<path
								d={`M ${-w * 0.47} ${fore - hand - 2} L ${w * 0.47} ${fore - hand - 2}`}
								stroke={INK}
								strokeWidth={OUTLINE}
								strokeLinecap="round"
							/>
						) : null}
					</g>
				)}
			</g>
		</g>
	);
};

// Where the centre of the hand ends up, in the same coordinates as `shoulder`
export const handPosition = (side: Side, pose: ArmPose, shape: ArmShape, shoulder: {x: number; y: number}) => {
	const rad = (deg: number) => (deg * Math.PI) / 180;
	const a1 = rad(-side * pose.shoulder);
	const a2 = a1 + rad(-side * pose.elbow);
	return {
		x: side * shoulder.x - shape.upper * Math.sin(a1) - shape.fore * Math.sin(a2),
		y: shoulder.y + shape.upper * Math.cos(a1) + shape.fore * Math.cos(a2),
	};
};
