import type React from 'react';
import {SIDES} from '../shared/Arm';
import {Eye} from '../shared/Eye';
import {INK, OUTLINE} from '../../theme';
import {KHOA} from './palette';

export type KhoaMood = 'zombie' | 'focused' | 'happy' | 'broke';

type MouthKind = 'slack' | 'flat' | 'grin' | 'wobbly';

const FACES: Record<KhoaMood, {lid: number; tilt: number; brow: number; browTilt: number; mouth: MouthKind; shut?: boolean}> = {
	zombie: {lid: 0.68, tilt: 0, brow: 0, browTilt: 0, mouth: 'slack'},
	focused: {lid: 0.5, tilt: -12, brow: -3, browTilt: -12, mouth: 'flat'},
	happy: {lid: 1, tilt: 0, brow: 6, browTilt: 4, mouth: 'grin', shut: true},
	broke: {lid: 0.2, tilt: 16, brow: 6, browTilt: 16, mouth: 'wobbly'},
};

const Mouth: React.FC<{kind: MouthKind; mouthOpen: number}> = ({kind, mouthOpen}) => {
	const open = Math.max(mouthOpen, kind === 'grin' ? 0.8 : kind === 'slack' ? 0.25 : 0);
	if (open >= 0.08) {
		const w = kind === 'grin' ? 18 : 9;
		const top = -24;
		const bottom = top + 4 + open * (kind === 'grin' ? 18 : 14);
		const shape = `M ${-w} ${top} Q 0 ${top + 2} ${w} ${top} Q ${w * 0.8} ${bottom} 0 ${bottom} Q ${-w * 0.8} ${bottom} ${-w} ${top} Z`;
		return (
			<g>
				<path d={shape} fill={KHOA.mouth} />
				{kind === 'grin' ? (
					<path d={`M ${-w * 0.8} ${top + 1} Q 0 ${top + 3} ${w * 0.8} ${top + 1} L ${w * 0.7} ${top + 6} Q 0 ${top + 8} ${-w * 0.7} ${top + 6} Z`} fill="#FFFFFF" />
				) : null}
				<path d={shape} fill="none" stroke={INK} strokeWidth={OUTLINE} strokeLinejoin="round" />
			</g>
		);
	}
	return (
		<path
			d={kind === 'wobbly' ? 'M -12 -20 Q -6 -26 0 -21 Q 6 -16 12 -22' : 'M -11 -21 L 11 -22'}
			fill="none"
			stroke={INK}
			strokeWidth={OUTLINE}
			strokeLinecap="round"
		/>
	);
};

type HeadProps = {
	readonly mood: KhoaMood;
	readonly blink: number;
	readonly lookX: number;
	readonly lookY: number;
	readonly mouthOpen: number;
};

// Anh Khoa's head; the origin is under his chin
export const KhoaHead: React.FC<HeadProps> = ({mood, blink, lookX, lookY, mouthOpen}) => {
	const face = FACES[mood];
	const lid = face.shut ? 1 : face.lid + (1 - face.lid) * (1 - blink);
	return (
		<g>
			{SIDES.map((side) => (
				<ellipse key={`ear-${side}`} cx={side * 46} cy={-70} rx={8} ry={13} fill={KHOA.skin} stroke={INK} strokeWidth={OUTLINE} />
			))}
			<path
				d="M -46 -76 C -48 -118 -26 -136 0 -136 C 26 -136 48 -118 46 -76 C 46 -38 34 -6 16 2 C 8 6 -8 6 -16 2 C -34 -6 -46 -38 -46 -76 Z"
				fill={KHOA.skin}
				stroke={INK}
				strokeWidth={OUTLINE}
			/>
			{/* Stubble along the jaw */}
			{[
				[-26, -18],
				[-20, -10],
				[-12, -5],
				[-4, -3],
				[4, -3],
				[12, -5],
				[20, -10],
				[26, -18],
				[-16, -14],
				[16, -14],
				[-8, -9],
				[8, -9],
			].map(([x, y]) => (
				<circle key={`${x}${y}`} cx={x} cy={y} r={1.4} fill={KHOA.stubble} />
			))}
			{/* Hair that has not met a comb this week, with a cowlick */}
			<path
				d="M -52 -78 C -60 -110 -50 -150 -16 -154 L -20 -170 L 2 -156 L 10 -176 L 22 -154 L 42 -164 L 38 -142 C 56 -134 58 -104 52 -78 L 44 -100 L 36 -86 L 30 -110 L 18 -96 L 10 -114 L 0 -98 L -10 -116 L -20 -98 L -30 -114 L -38 -92 L -44 -104 Z"
				fill={KHOA.hair}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			<path d="M -28 -142 Q -10 -150 8 -146" fill="none" stroke={KHOA.hairLight} strokeWidth={3.5} strokeLinecap="round" />
			{SIDES.map((side) => {
				const cx = side * 20;
				return (
					<g key={`face-${side}`}>
						<path
							d={`M ${cx - 11} ${-98 - face.brow} L ${cx + 11} ${-99 - face.brow}`}
							transform={`rotate(${side * face.browTilt}, ${cx}, ${-98 - face.brow})`}
							stroke={KHOA.hair}
							strokeWidth={5}
							strokeLinecap="round"
						/>
						{/* Dark circles from too many all-nighters */}
						<path d={`M ${cx - 11} -68 Q ${cx} -60 ${cx + 11} -68`} fill="none" stroke={KHOA.eyeBag} strokeWidth={4.5} strokeLinecap="round" />
						<Eye
							x={cx}
							y={-80}
							rx={9}
							ry={7.5}
							lid={lid}
							lidColor={KHOA.skin}
							tilt={side * face.tilt}
							pupilX={lookX * 2}
							pupilY={lookY * 2 + 1}
							pupilR={mood === 'broke' ? 2.2 : 2.8}
						/>
						{/* Thick black frames */}
						<rect x={cx - 17} y={-92} width={34} height={25} rx={5} fill="none" stroke={KHOA.glasses} strokeWidth={4.5} />
						<path d={`M ${side * 37} -86 L ${side * 46} -82`} stroke={KHOA.glasses} strokeWidth={3.5} strokeLinecap="round" />
					</g>
				);
			})}
			<path d="M -3 -84 Q 0 -88 3 -84" fill="none" stroke={KHOA.glasses} strokeWidth={4} />
			<path d="M -2 -60 Q -6 -46 0 -44 Q 4 -44 6 -47" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
			<Mouth kind={face.mouth} mouthOpen={mouthOpen} />
			{mood === 'broke'
				? [-1, 1].map((s) => (
						<path key={s} d={`M ${s * 26} -66 Q ${s * 32} -52 ${s * 27} -46 Q ${s * 22} -52 ${s * 26} -66 Z`} fill={KHOA.tear} stroke={INK} strokeWidth={1.8} />
					))
				: null}
			{mood === 'focused' ? <path d="M 40 -118 Q 47 -106 42 -100 Q 37 -106 40 -118 Z" fill={KHOA.sweat} stroke={INK} strokeWidth={1.8} /> : null}
		</g>
	);
};
