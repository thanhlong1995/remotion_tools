import type React from 'react';
import {type Side, SIDES} from '../shared/Arm';
import {Eye} from '../shared/Eye';
import {INK, OUTLINE} from '../../theme';
import {THU} from './palette';

export type ThuMood = 'shy' | 'happy' | 'homesick' | 'scared';

// The one character drawn cute on purpose: big shiny eyes, rosy cheeks, soft round face
const FACES: Record<ThuMood, {lookX: number; lookY: number; pupil: number; brow: number; browTilt: number; blush: number}> = {
	shy: {lookX: -2.5, lookY: 3, pupil: 5, brow: 0, browTilt: 4, blush: 0.6},
	happy: {lookX: 0, lookY: 0, pupil: 5, brow: 4, browTilt: 0, blush: 0.55},
	homesick: {lookX: 0, lookY: -3, pupil: 5.5, brow: 4, browTilt: 14, blush: 0.4},
	scared: {lookX: 0, lookY: 0, pupil: 3, brow: 8, browTilt: 10, blush: 0.25},
};

const Mouth: React.FC<{mood: ThuMood; mouthOpen: number}> = ({mood, mouthOpen}) => {
	const open = Math.max(mouthOpen, mood === 'happy' ? 0.7 : 0);
	if (mood === 'scared' && mouthOpen < 0.08) {
		return <ellipse cx={0} cy={-31} rx={4} ry={5} fill={THU.mouth} stroke={INK} strokeWidth={2.2} />;
	}
	if (open >= 0.08) {
		const bottom = -34 + 4 + open * 10;
		return (
			<g>
				<path d={`M -10 -35 Q 0 -33 10 -35 Q 8 ${bottom} 0 ${bottom + 1} Q -8 ${bottom} -10 -35 Z`} fill={THU.mouth} />
				{open > 0.4 ? <ellipse cx={0} cy={bottom - 2.5} rx={5} ry={2.6} fill={THU.tongue} /> : null}
				<path d={`M -10 -35 Q 0 -33 10 -35 Q 8 ${bottom} 0 ${bottom + 1} Q -8 ${bottom} -10 -35 Z`} fill="none" stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
			</g>
		);
	}
	return (
		<path
			d={mood === 'homesick' ? 'M -8 -30 Q -4 -35 0 -32 Q 4 -35 8 -30' : 'M -7 -34 Q 0 -29 7 -34'}
			fill="none"
			stroke={INK}
			strokeWidth={2.4}
			strokeLinecap="round"
		/>
	);
};

type HeadProps = {
	readonly mood: ThuMood;
	readonly blink: number;
	readonly lookX: number;
	readonly lookY: number;
	readonly mouthOpen: number;
};

// Bé Thư's head; the origin is under her chin
export const ThuHead: React.FC<HeadProps> = ({mood, blink, lookX, lookY, mouthOpen}) => {
	const face = FACES[mood];
	return (
		<g>
			<path
				d="M -60 -78 C -64 -140 -30 -160 0 -160 C 30 -160 64 -140 60 -78 L 62 -14 Q 52 2 38 -4 L -38 -4 Q -52 2 -62 -14 Z"
				fill={THU.hair}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			<path
				d="M -50 -72 C -52 -118 -26 -136 0 -136 C 26 -136 52 -118 50 -72 C 50 -36 32 -2 0 2 C -32 -2 -50 -36 -50 -72 Z"
				fill={THU.skin}
				stroke={INK}
				strokeWidth={OUTLINE}
			/>
			{SIDES.map((side: Side) => (
				<path
					key={`lock-${side}`}
					d={`M ${side * 58} -92 Q ${side * 62} -40 ${side * 50} -6 L ${side * 42} -10 Q ${side * 50} -50 ${side * 46} -98 Z`}
					fill={THU.hair}
					stroke={INK}
					strokeWidth={OUTLINE}
					strokeLinejoin="round"
				/>
			))}
			{/* Blunt fringe, a strand that won't lie down, and a flower clip */}
			<path
				d="M -50 -96 C -50 -142 -24 -154 0 -154 C 24 -154 50 -142 50 -96 L 42 -102 L 32 -94 L 20 -102 L 8 -95 L -4 -102 L -16 -95 L -28 -102 L -40 -95 Z"
				fill={THU.hair}
				stroke={INK}
				strokeWidth={OUTLINE}
				strokeLinejoin="round"
			/>
			<path d="M 4 -158 Q 12 -184 26 -178 Q 16 -172 12 -158" fill={THU.hair} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
			<path d="M -32 -138 Q -16 -148 2 -146" fill="none" stroke={THU.hairLight} strokeWidth={4} strokeLinecap="round" />
			<g transform="translate(40, -120)">
				{[0, 72, 144, 216, 288].map((a) => (
					<circle
						key={a}
						cx={Math.cos((a * Math.PI) / 180) * 7}
						cy={Math.sin((a * Math.PI) / 180) * 7}
						r={6}
						fill={THU.clip}
						stroke={INK}
						strokeWidth={1.8}
					/>
				))}
				<circle cx={0} cy={0} r={4.5} fill={THU.clipCenter} stroke={INK} strokeWidth={1.8} />
			</g>
			{SIDES.map((side) => {
				const cx = side * 21;
				return (
					<g key={`face-${side}`}>
						<path
							d={`M ${cx - 9} ${-98 - face.brow} Q ${cx} ${-102 - face.brow} ${cx + 9} ${-98 - face.brow}`}
							transform={`rotate(${side * face.browTilt}, ${cx}, ${-99 - face.brow})`}
							fill="none"
							stroke={THU.hair}
							strokeWidth={3.5}
							strokeLinecap="round"
						/>
						{mood === 'happy' ? (
							<path d={`M ${cx - 11} -68 Q ${cx} -82 ${cx + 11} -68`} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
						) : (
							<g>
								<Eye
									x={cx}
									y={-70}
									rx={13}
									ry={14}
									lid={1 - blink}
									lidColor={THU.skin}
									pupilX={face.lookX + lookX * 2}
									pupilY={face.lookY + lookY * 2}
									pupilR={face.pupil}
									iris={mood === 'scared' ? undefined : THU.iris}
									irisR={9.5}
									shine={mood !== 'scared'}
								/>
								{/* Thick upper lash line and a little flick */}
								<path d={`M ${cx - 13} -72 Q ${cx} -90 ${cx + 13} -72`} fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
								<path d={`M ${cx + side * 12} -78 l ${side * 5} -4`} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
							</g>
						)}
						{/* Rosy cheeks with blush strokes */}
						<ellipse cx={side * 34} cy={-46} rx={11} ry={6.5} fill={THU.blush} opacity={face.blush} />
						{[-5, 0, 5].map((dx) => (
							<path key={dx} d={`M ${side * 34 + dx - 2} -43 l 4 -6`} stroke={THU.blush} strokeWidth={1.8} strokeLinecap="round" />
						))}
						{mood === 'homesick' ? (
							<path d={`M ${cx - 10} -60 Q ${cx} -55 ${cx + 10} -60`} fill="none" stroke={THU.tear} strokeWidth={3.5} strokeLinecap="round" />
						) : null}
					</g>
				);
			})}
			<path d="M -2 -50 Q 1 -47 4 -50" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
			<Mouth mood={mood} mouthOpen={mouthOpen} />
			{mood === 'homesick' ? (
				<path d="M 34 -60 Q 40 -48 35 -43 Q 30 -48 34 -60 Z" fill={THU.tear} stroke={INK} strokeWidth={1.8} />
			) : null}
			{mood === 'scared' ? <path d="M 50 -110 Q 56 -98 51 -93 Q 46 -98 50 -110 Z" fill={THU.sweat} stroke={INK} strokeWidth={1.8} /> : null}
		</g>
	);
};
