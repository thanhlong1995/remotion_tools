import type React from 'react';
import {AbsoluteFill} from 'remotion';
import {Hung, HUNG_MIC_POSE} from '../characters/hung/Hung';
import {Muop} from '../characters/muop/Muop';
import {Sau} from '../characters/sau/Sau';
import {ShipperBike} from '../characters/shipper/ShipperBike';
import {NhauTable, PlasticBag} from '../props/Props';
import {Alley, GROUND_Y} from '../sets/Alley';
import {RIDGE_Y, Roof} from '../sets/Roof';

// Quick look at the episode 1 props and sets before they go into scenes
export const PropsCheck: React.FC = () => (
	<AbsoluteFill>
		<svg width={1920} height={1080} viewBox="0 0 1920 1080">
			<Alley left={0} right={1920} gateTile={0} gateOpen={0.6} />
			<g transform={`translate(1240, ${GROUND_Y})`}>
				<NhauTable
					t={0}
					behind={
						<g>
							<g transform="translate(-110, 150) scale(0.78)">
								<Sau mood="grin" />
							</g>
							<g transform="translate(130, 150) scale(0.78)">
								<Hung mood="cool" armRight={HUNG_MIC_POSE} mic />
							</g>
						</g>
					}
				/>
			</g>
			<g transform={`translate(560, ${GROUND_Y}) scale(0.8)`}>
				<ShipperBike mouthOpen={0.6} wobble={8} />
			</g>
			<g transform="translate(950, 520) rotate(20)">
				<PlasticBag flap={0.4} />
			</g>
		</svg>
		<svg width={640} height={360} viewBox="0 0 1920 1080" style={{position: 'absolute', right: 20, top: 20, border: '4px solid #2B2628'}}>
			<Roof />
			<g transform={`translate(960, ${RIDGE_Y + 6}) scale(1.4)`}>
				<Muop mood="judge" />
			</g>
		</svg>
	</AbsoluteFill>
);
