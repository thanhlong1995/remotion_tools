import type React from 'react';
import {type Side, SIDES} from '../shared/Arm';
import {Eye} from '../shared/Eye';
import {INK, OUTLINE} from '../../theme';
import {NGAN} from './palette';

export type NganMood = 'neutral' | 'selfie' | 'excited' | 'cry' | 'angry';

type MouthKind = 'closed' | 'duck' | 'open' | 'wail' | 'yell';

const FACES: Record<NganMood, {lid: number; tilt: number; lookY: number; brow: number; mouth: MouthKind; shut?: boolean}> = {
	neutral: {lid: 0.45, tilt: 0, lookY: 0, brow: 0, mouth: 'closed'},
	selfie: {lid: 0.12, tilt: 0, lookY: -1, brow: 4, mouth: 'duck'},
	excited: {lid: 0, tilt: 0, lookY: 0, brow: 8, mouth: 'open'},
	cry: {lid: 1, tilt: 14, lookY: 0, brow: 6, mouth: 'wail', shut: true},
	angry: {lid: 0.35, tilt: -16, lookY: 0, brow: -4, mouth: 'yell'},
};

// Long hair falling behind the shoulders. Drawn before the body, in the same frame as the head
export const NganHairBack: React.FC = () => (
	<path
		d="M -58 -96 C -64 -152 -30 -172 0 -172 C 30 -172 64 -152 58 -96 L 70 30 Q 74 84 58 104 L -58 104 Q -74 84 -70 30 Z"
		fill={NGAN.hair}
		stroke={INK}
		strokeWidth={OUTLINE}
		strokeLinejoin="round"
	/>
);

const Mouth: React.FC<{kind: MouthKind; mouthOpen: number}> = ({kind, mouthOpen}) => {
	const open = Math.max(mouthOpen, kind === 'open' ? 0.7 : kind === 'wail' || kind === 'yell' ? 1 : 0);
	if (kind === 'duck' && mouthOpen < 0.08) {
		// Pouting at the camera
		return (
			<g>
				<path d="M -12 -30 Q -4 -40 0 -33 Q 4 -40 12 -30 Q 6 -18 0 -18 Q -6 -18 -12 -30 Z" fill={NGAN.lips} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
				<path d="M -10 -29 Q 0 -26 10 -29" fill="none" stroke={NGAN.lipsDark} strokeWidth={2} />
				<ellipse cx={-4} cy={-23} rx={3} ry={1.6} fill="#FFFFFF" opacity={0.7} />
			</g>
		);
	}
	if (open >= 0.08) {
		const w = kind === 'wail' ? 16 : kind === 'yell' ? 15 : 14;
		const top = -32;
		const bottom = top + 5 + open * (kind === 'wail' ? 20 : 16);
		const shape =
			kind === 'wail'
				? `M ${-w} ${top + 4} Q 0 ${top - 4} ${w} ${top + 4} Q ${w * 0.8} ${bottom} 0 ${bottom} Q ${-w * 0.8} ${bottom} ${-w} ${top + 4} Z`
				: `M ${-w} ${top} Q 0 ${top + 3} ${w} ${top} Q ${w * 0.8} ${bottom} 0 ${bottom} Q ${-w * 0.8} ${bottom} ${-w} ${top} Z`;
		return (
			<g>
				<path d={shape} fill={NGAN.mouth} />
				{open > 0.3 ? (
					<path d={`M ${-w * 0.75} ${top + 1} Q 0 ${top + 4} ${w * 0.75} ${top + 1} L ${w * 0.66} ${top + 5} Q 0 ${top + 8} ${-w * 0.66} ${top + 5} Z`} fill="#FFFFFF" />
				) : null}
				{open > 0.5 ? <ellipse cx={0} cy={bottom - 4} rx={w * 0.45} ry={3.5} fill={NGAN.tongue} /> : null}
				<path d={shape} fill="none" stroke={NGAN.lips} strokeWidth={4} strokeLinejoin="round" />
				<path d={shape} fill="none" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
			</g>
		);
	}
	return (
		<g>
			<path d="M -12 -29 Q -6 -34 0 -31 Q 6 -34 12 -29 Q 6 -21 0 -21 Q -6 -21 -12 -29 Z" fill={NGAN.lips} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
			<path d="M -11 -29 Q 0 -26 11 -29" fill="none" stroke={NGAN.lipsDark} strokeWidth={2} />
		</g>
	);
};

type HeadProps = {
	readonly mood: NganMood;
	readonly blink: number;
	readonly lookX: number;
	readonly lookY: number;
	readonly mouthOpen: number;
};

// Chị Ngân's face, fringe and the hair framing it; the origin is under her chin.
// Pair it with NganHairBack drawn behind the body
export const NganHead: React.FC<HeadProps> = ({mood, blink, lookX, lookY, mouthOpen}) => {
	const face = FACES[mood];
	const lid = face.shut ? 1 : face.lid + (1 - face.lid) * (1 - blink);
	return (
		<g>
			{SIDES.map((side) => (
				<g key={`ear-${side}`}>
					<ellipse cx={side * 49} cy={-76} rx={8} ry={13} fill={NGAN.skin} stroke={INK} strokeWidth={OUTLINE} />
					<circle cx={side * 50} cy={-60} r={6} fill="none" stroke={NGAN.gold} strokeWidth={2.5} />
				</g>
			))}
			{/* V-line face: a chin filtered to a point */}
			<path
				d="M -50 -84 C -52 -124 -28 -140 0 -140 C 28 -140 52 -124 50 -84 C 50 -50 40 -20 22 -4 C 12 4 6 8 0 8 C -6 8 -12 4 -22 -4 C -40 -20 -50 -50 -50 -84 Z"
				fill={NGAN.skin}
				stroke={INK}
				strokeWidth={OUTLINE}
			/>
			{/* Crown with a centre parting, side locks framing the face, wispy fringe */}
			<path
				d="M -56 -88 C -60 -150 -28 -170 0 -170 C 28 -170 60 -150 56 -88 C 50 -114 34 -126 12 -126 L 0 -148 L -12 -126 C -34 -126 -50 -114 -56 -88 Z"
				fill={NGAN.hair}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			{SIDES.map((side: Side) => (
				<path
					key={`lock-${side}`}
					d={`M ${side * 56} -90 Q ${side * 62} -40 ${side * 50} 14 L ${side * 40} 10 Q ${side * 48} -40 ${side * 44} -104 Z`}
					fill={NGAN.hair}
					stroke={INK}
					strokeWidth={OUTLINE}
					strokeLinejoin="round"
				/>
			))}
			{['M -34 -128 Q -36 -114 -30 -104', 'M -18 -130 Q -20 -114 -14 -106', 'M 20 -130 Q 18 -114 24 -106', 'M 36 -128 Q 34 -114 40 -104'].map((d) => (
				<path key={d} d={d} fill="none" stroke={NGAN.hairDark} strokeWidth={3} strokeLinecap="round" />
			))}
			<path d="M -30 -150 Q -10 -162 12 -158" fill="none" stroke={NGAN.hairLight} strokeWidth={4} strokeLinecap="round" />
			{SIDES.map((side) => {
				const cx = side * 22;
				return (
					<g key={`face-${side}`}>
						{/* Straight, thick, Korean-style brows */}
						<path
							d={`M ${cx - 13} ${-100 - face.brow} L ${cx + 13} ${-101 - face.brow}`}
							transform={`rotate(${side * (face.tilt * 0.6)}, ${cx}, ${-100 - face.brow})`}
							stroke={NGAN.brow}
							strokeWidth={6}
							strokeLinecap="round"
						/>
						<Eye
							x={cx}
							y={-82}
							rx={11}
							ry={8.5}
							lid={lid}
							lidColor={NGAN.skin}
							tilt={side * face.tilt}
							pupilX={lookX * 2}
							pupilY={face.lookY + lookY * 2 + 0.5}
							pupilR={3}
							iris={NGAN.lens}
							irisR={6}
						/>
						{/* Lash extensions, a touch too long */}
						<path
							d={`M ${cx + side * 10} -84 l ${side * 9} -6 M ${cx + side * 7} -88 l ${side * 7} -9 M ${cx + side * 2} -90 l ${side * 3} -9`}
							stroke={INK}
							strokeWidth={2.5}
							strokeLinecap="round"
						/>
						<ellipse cx={side * 34} cy={-50} rx={11} ry={6} fill={NGAN.blush} opacity={0.45} transform={`rotate(${side * -20}, ${side * 34}, -50)`} />
						{mood === 'cry' ? (
							// Mascara giving up
							<path
								d={`M ${cx - 4} -76 Q ${cx - 8} -60 ${cx - 2} -46 Q ${cx + 4} -32 ${cx - 2} -18`}
								fill="none"
								stroke={NGAN.mascara}
								strokeWidth={3.5}
								strokeLinecap="round"
							/>
						) : null}
					</g>
				);
			})}
			<path d="M -3 -64 Q -6 -52 0 -50 Q 4 -50 5 -53" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
			<Mouth kind={face.mouth} mouthOpen={mouthOpen} />
			{mood === 'cry'
				? [-1, 1].map((s) => (
						<path key={s} d={`M ${s * 40} -70 Q ${s * 48} -56 ${s * 42} -50 Q ${s * 36} -56 ${s * 40} -70 Z`} fill={NGAN.tear} stroke={INK} strokeWidth={1.8} />
					))
				: null}
		</g>
	);
};
