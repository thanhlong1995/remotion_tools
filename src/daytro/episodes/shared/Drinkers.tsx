import type React from 'react';
import {Hung, HUNG_MIC_POSE} from '../../characters/hung/Hung';
import {Sau} from '../../characters/sau/Sau';
import {BeerGlass, NhauTable} from '../../props/Props';
import type {Cam} from '../../camera';
import {GROUND_Y} from '../../sets/Alley';
import {type Box, boxAt} from '../../ui/layout';
import {blinkAt, SCALE} from './kit';

// Sitting is faked: the drinkers stand lower behind the table, legs clipped at the ground
export const SAU_SEATED = 110;
export const HUNG_SEATED = 20;

// Screen boxes of the two drinkers behind the table at x, so captions stay off them
export const drinkerBoxes = (cam: Cam, x: number, sauStand = 0): Box[] => [
	boxAt(cam, x - 110, GROUND_Y + SAU_SEATED * (1 - sauStand), 230 * SCALE, 940 * SCALE, 0.3),
	boxAt(cam, x + 130, GROUND_Y + HUNG_SEATED, 250 * SCALE, 700 * SCALE, 0.4),
];

// The street drinking table with Sáu and Hùng behind it; shared with the shipper and chase scenes
export const Drinkers: React.FC<{
	x: number;
	frame: number;
	sauStand: number;
	sauArm: number;
	sauMood: 'grin' | 'brag' | 'wink';
	sauMouth: number;
	hungMouth: number;
	hungMood?: 'cool' | 'sing';
}> = ({x, frame, sauStand, sauArm, sauMood, sauMouth, hungMouth, hungMood = 'cool'}) => (
	<g transform={`translate(${x}, ${GROUND_Y})`}>
		<defs>
			<clipPath id="nhau-seat">
				<rect x={-600} y={-1400} width={1200} height={1398} />
			</clipPath>
		</defs>
		<NhauTable
			t={frame / 30}
			behind={
				<g clipPath="url(#nhau-seat)">
					<g transform={`translate(-110, ${SAU_SEATED * (1 - sauStand)}) scale(${SCALE})`}>
						<Sau
							mood={sauMood}
							blink={blinkAt(frame, 40, 76)}
							mouthOpen={sauMouth}
							armRight={{shoulder: 20 + sauArm, elbow: 18}}
							held={<BeerGlass />}
						/>
					</g>
					<g transform={`translate(130, ${HUNG_SEATED}) scale(${SCALE})`}>
						<Hung mood={hungMood} blink={blinkAt(frame, 8, 90)} mouthOpen={hungMouth} armRight={HUNG_MIC_POSE} mic />
					</g>
				</g>
			}
		/>
	</g>
);
