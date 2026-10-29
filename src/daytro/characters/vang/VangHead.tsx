import type React from 'react';
import {type Side, SIDES} from '../shared/Arm';
import {Eye} from '../shared/Eye';
import {INK, OUTLINE} from '../../theme';
import {VANG} from './palette';

export type VangMood = 'neutral' | 'happy' | 'gossip' | 'bark' | 'hungry' | 'scared';

type MouthKind = 'snaggle' | 'grin' | 'smirk' | 'bark' | 'drool' | 'wavy';
type EarKind = 'normal' | 'perk' | 'flat';

// lid 0 = wide open, 1 = shut; tilt > 0 slants the lids down to the nose (worried), < 0 (cross)
const FACES: Record<
	VangMood,
	{
		lid: number;
		tilt: number;
		size: number;
		pupil: number;
		lookX: number;
		brows: [{raise: number; tilt: number}, {raise: number; tilt: number}];
		mouth: MouthKind;
		ears: EarKind;
	}
> = {
	neutral: {lid: 0.42, tilt: 0, size: 1, pupil: 4.5, lookX: 0, brows: [{raise: 0, tilt: 0}, {raise: 0, tilt: 0}], mouth: 'snaggle', ears: 'normal'},
	happy: {lid: 0.2, tilt: 0, size: 1, pupil: 4.5, lookX: 0, brows: [{raise: 7, tilt: 0}, {raise: 7, tilt: 0}], mouth: 'grin', ears: 'normal'},
	gossip: {lid: 0.58, tilt: 0, size: 1, pupil: 4.5, lookX: 4, brows: [{raise: 9, tilt: -6}, {raise: -3, tilt: -10}], mouth: 'smirk', ears: 'perk'},
	bark: {lid: 0.35, tilt: -18, size: 1, pupil: 4, lookX: 0, brows: [{raise: -3, tilt: -18}, {raise: -3, tilt: -18}], mouth: 'bark', ears: 'perk'},
	hungry: {lid: 0, tilt: 0, size: 1.15, pupil: 7.5, lookX: 0, brows: [{raise: 9, tilt: 8}, {raise: 9, tilt: 8}], mouth: 'drool', ears: 'normal'},
	scared: {lid: 0, tilt: 0, size: 1.2, pupil: 2.6, lookX: 0, brows: [{raise: 12, tilt: 16}, {raise: 12, tilt: 16}], mouth: 'wavy', ears: 'flat'},
};

const EAR_ANGLE: Record<EarKind, number> = {normal: 14, perk: 4, flat: 72};

// One ear in a frame where +x points away from the face. The screen-right ear has a floppy tip
const Ear: React.FC<{side: Side; kind: EarKind}> = ({side, kind}) => (
	<g transform={`translate(${side * 48}, -128) scale(${side * 0.82}, 0.82) rotate(${EAR_ANGLE[kind]})`}>
		{side === -1 ? (
			<g>
				<path
					d="M -34 0 Q -26 -70 2 -102 Q 12 -106 16 -94 Q 36 -50 38 0 Z"
					fill={VANG.fur}
					stroke={INK}
					strokeWidth={OUTLINE / 0.82}
					strokeLinejoin="round"
				/>
				<path d="M -18 -6 Q -12 -56 4 -80 Q 20 -44 22 -6 Z" fill={VANG.innerEar} />
			</g>
		) : (
			<g>
				<path
					d="M -34 0 Q -28 -46 -8 -62 L 24 -62 Q 36 -30 38 0 Z"
					fill={VANG.fur}
					stroke={INK}
					strokeWidth={OUTLINE / 0.82}
					strokeLinejoin="round"
				/>
				<path d="M -18 -6 Q -12 -40 0 -52 L 18 -52 Q 22 -26 22 -6 Z" fill={VANG.innerEar} />
				<path
					d="M -10 -62 Q 8 -74 26 -62 Q 56 -50 62 -14 Q 42 -24 30 -36 Q 10 -46 -10 -62 Z"
					fill={VANG.furShade}
					stroke={INK}
					strokeWidth={OUTLINE / 0.82}
					strokeLinejoin="round"
				/>
			</g>
		)}
	</g>
);

const Mouth: React.FC<{kind: MouthKind; mouthOpen: number}> = ({kind, mouthOpen}) => {
	const line = (d: string) => (
		<path d={d} fill="none" stroke={INK} strokeWidth={OUTLINE} strokeLinecap="round" strokeLinejoin="round" />
	);
	// Crooked lower tooth poking up over his lip: his trademark
	const snaggle = (
		<path d="M -15 -31 L -12 -41 L -8 -31 Z" fill="#FFFDF5" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
	);
	const minOpen = kind === 'grin' ? 0.6 : kind === 'bark' ? 1 : 0;
	const open = Math.max(mouthOpen, minOpen);
	if ((kind === 'snaggle' || kind === 'grin' || kind === 'bark' || kind === 'smirk') && open >= 0.08) {
		const w = kind === 'bark' ? 26 : 22;
		const bottom = -30 + 6 + open * (kind === 'bark' ? 30 : 22);
		const shape = `M ${-w} -30 Q ${-w / 2} -24 0 -33 Q ${w / 2} -24 ${w} -30 Q ${w * 0.85} ${bottom} 0 ${bottom} Q ${-w * 0.85} ${bottom} ${-w} -30 Z`;
		return (
			<g>
				<path d="M 0 -44 L 0 -33" stroke={INK} strokeWidth={OUTLINE} strokeLinecap="round" />
				<path d={shape} fill={VANG.mouth} />
				<ellipse cx={0} cy={bottom - 6} rx={w * 0.5} ry={6.5} fill={VANG.tongue} />
				{kind === 'bark'
					? [-1, 1].map((s) => (
							<path
								key={s}
								d={`M ${s * 19} -28 L ${s * 14} -17 L ${s * 10} -27 Z`}
								fill="#FFFDF5"
								stroke={INK}
								strokeWidth={1.8}
								strokeLinejoin="round"
							/>
						))
					: null}
				<path d={shape} fill="none" stroke={INK} strokeWidth={OUTLINE} strokeLinejoin="round" />
			</g>
		);
	}
	if (kind === 'drool') {
		return (
			<g>
				<path d="M 0 -44 L 0 -33" stroke={INK} strokeWidth={OUTLINE} strokeLinecap="round" />
				<path d="M 2 -31 Q 4 -4 13 -1 Q 22 -3 21 -28 Z" fill={VANG.tongue} stroke={INK} strokeWidth={OUTLINE} strokeLinejoin="round" />
				<path d="M 11 -27 L 12 -10" stroke={INK} strokeWidth={2} opacity={0.4} strokeLinecap="round" />
				{line('M -22 -32 Q -10 -24 0 -33 Q 10 -24 23 -32')}
				{snaggle}
				<path d="M 26 0 Q 31 11 26 17 Q 21 11 26 0 Z" fill={VANG.drool} stroke={INK} strokeWidth={2} />
			</g>
		);
	}
	if (kind === 'wavy') {
		return (
			<g>
				<path d="M 0 -44 L 0 -33" stroke={INK} strokeWidth={OUTLINE} strokeLinecap="round" />
				{line('M -20 -27 Q -10 -35 0 -28 Q 10 -21 20 -29')}
			</g>
		);
	}
	return (
		<g>
			<path d="M 0 -44 L 0 -33" stroke={INK} strokeWidth={OUTLINE} strokeLinecap="round" />
			{line(kind === 'smirk' ? 'M -20 -31 Q -8 -24 0 -33 Q 12 -28 24 -42' : 'M -22 -32 Q -10 -24 0 -33 Q 10 -24 22 -32')}
			{snaggle}
		</g>
	);
};

type HeadProps = {
	readonly mood: VangMood;
	readonly blink: number;
	readonly lookX: number;
	readonly lookY: number;
	readonly mouthOpen: number;
};

// Vàng's head; the origin is under his chin
export const VangHead: React.FC<HeadProps> = ({mood, blink, lookX, lookY, mouthOpen}) => {
	const face = FACES[mood];
	const lid = face.lid + (1 - face.lid) * (1 - blink);
	return (
		<g>
			{SIDES.map((side) => (
				<Ear key={`ear-${side}`} side={side} kind={face.ears} />
			))}
			{SIDES.map((side) => (
				<path
					key={`tuft-${side}`}
					d={`M ${side * 70} -66 Q ${side * 92} -58 ${side * 84} -44 Q ${side * 94} -32 ${side * 66} -22 Z`}
					fill={VANG.fur}
					stroke={INK}
					strokeWidth={OUTLINE}
					strokeLinejoin="round"
				/>
			))}
			<path
				d="M -76 -72 C -80 -128 -44 -150 0 -150 C 44 -150 80 -128 76 -72 C 74 -30 50 -2 0 0 C -50 -2 -74 -30 -76 -72 Z"
				fill={VANG.fur}
				stroke={INK}
				strokeWidth={OUTLINE}
			/>
			{/* A few hairs that never lie flat */}
			{['M -6 -149 Q -10 -164 -18 -168', 'M 0 -150 Q 2 -168 -2 -176', 'M 6 -149 Q 12 -162 20 -164'].map((d) => (
				<path key={d} d={d} fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
			))}
			{/* Snout: a broad cream muzzle */}
			<path d="M -42 -58 C -46 -24 -26 -6 0 -6 C 26 -6 46 -24 42 -58 C 30 -70 -30 -70 -42 -58 Z" fill={VANG.cream} />
			{SIDES.map((side, i) => {
				const b = face.brows[i];
				const cx = side * 26;
				const cy = -112 - b.raise;
				return (
					<ellipse
						key={`brow-${side}`}
						cx={cx}
						cy={cy}
						rx={10}
						ry={5.5}
						fill={VANG.cream}
						transform={`rotate(${side * b.tilt}, ${cx}, ${cy})`}
					/>
				);
			})}
			{SIDES.map((side) => (
				<Eye
					key={`eye-${side}`}
					x={side * 26}
					y={-90}
					rx={13 * face.size}
					ry={11 * face.size}
					lid={lid}
					lidColor={VANG.fur}
					tilt={side * face.tilt}
					pupilX={face.lookX + lookX * 2}
					pupilY={lookY * 2 + 1}
					pupilR={face.pupil}
				/>
			))}
			{/* Battle scar: a plaster from his last fight with the delivery guy */}
			<g transform="translate(44, -128) rotate(32)">
				<rect x={-16} y={-6} width={32} height={12} rx={5} fill={VANG.plaster} stroke={INK} strokeWidth={2.2} />
				<rect x={-5} y={-6} width={10} height={12} fill={VANG.plasterPad} />
				{[-11, 8].map((x) => (
					<circle key={x} cx={x} cy={0} r={1} fill={INK} opacity={0.5} />
				))}
			</g>
			<path d="M -17 -62 Q 0 -70 17 -62 Q 15 -48 0 -44 Q -15 -48 -17 -62 Z" fill={VANG.nose} stroke={INK} strokeWidth={2} />
			<ellipse cx={-5} cy={-62} rx={5} ry={2.4} fill="#FFFFFF" opacity={0.55} />
			<Mouth kind={face.mouth} mouthOpen={mouthOpen} />
			{mood === 'scared' ? (
				<path d="M 70 -112 Q 80 -94 73 -86 Q 63 -90 70 -112 Z" fill={VANG.sweat} stroke={INK} strokeWidth={2.2} />
			) : null}
		</g>
	);
};
