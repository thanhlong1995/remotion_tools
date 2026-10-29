import type React from 'react';
import {AbsoluteFill} from 'remotion';
import {MinhSide} from '../characters/minh/MinhSide';
import {legSwing} from '../characters/shared/walk';
import {BaTuSide} from '../characters/tu/BaTuSide';
import {VangSide} from '../characters/vang/VangSide';
import {CREAM} from '../theme';

const PHASE = 0.18;

// Side views mid-stride, for checking the profiles before they walk
export const SideViewSheet: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: CREAM}}>
		<svg width={1920} height={1080} viewBox="0 0 1920 1080">
			<line x1={0} y1={980} x2={1920} y2={980} stroke="#D8CDB6" strokeWidth={4} />
			<g transform="translate(380, 980) scale(1.05)">
				<BaTuSide
					nearLeg={legSwing(PHASE, 22, 40)}
					farLeg={legSwing(PHASE + 0.5, 22, 40)}
					nearArm={{shoulder: -18, elbow: 18}}
					farArm={{shoulder: 18, elbow: 18}}
					mood="neutral"
				/>
			</g>
			<g transform="translate(900, 980) scale(1.05)">
				<MinhSide
					nearLeg={legSwing(PHASE, 20, 40)}
					farLeg={legSwing(PHASE + 0.5, 20, 40)}
					nearArm={{shoulder: 40, elbow: 24}}
					farArm={{shoulder: -14, elbow: 14}}
				/>
			</g>
			<g transform="translate(1470, 980) scale(1.6)">
				<VangSide
					frontNear={legSwing(PHASE, 28, 30)}
					backFar={legSwing(PHASE, 28, 30)}
					frontFar={legSwing(PHASE + 0.5, 28, 30)}
					backNear={legSwing(PHASE + 0.5, 28, 30)}
					panting={0.8}
					tailWag={8}
				/>
			</g>
		</svg>
	</AbsoluteFill>
);
