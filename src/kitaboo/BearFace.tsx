import type React from 'react';
import {Interactive, type InteractivitySchema} from 'remotion';

type BearFaceProps = {
	readonly size: number;
	readonly cheekColor: string;
	readonly style?: React.CSSProperties;
};

// The Kita Boo mascot: a little polar bear in an astronaut helmet
const BearFaceInner: React.FC<BearFaceProps> = ({size, cheekColor, style}) => {
	return (
		<Interactive.Svg
			viewBox="0 0 200 200"
			width={size}
			height={size}
			style={{position: 'absolute', overflow: 'visible', ...style}}
		>
			<circle cx={100} cy={106} r={97} fill="rgba(255,255,255,0.18)" />
			<circle cx={52} cy={60} r={28} fill="#FFFFFF" stroke="#1B2A5E" strokeWidth={6} />
			<circle cx={52} cy={60} r={13} fill={cheekColor} />
			<circle cx={148} cy={60} r={28} fill="#FFFFFF" stroke="#1B2A5E" strokeWidth={6} />
			<circle cx={148} cy={60} r={13} fill={cheekColor} />
			<ellipse cx={100} cy={114} rx={76} ry={66} fill="#FFFFFF" stroke="#1B2A5E" strokeWidth={6} />
			<ellipse cx={56} cy={130} rx={13} ry={8} fill={cheekColor} />
			<ellipse cx={144} cy={130} rx={13} ry={8} fill={cheekColor} />
			<circle cx={70} cy={106} r={8.5} fill="#1B2A5E" />
			<circle cx={130} cy={106} r={8.5} fill="#1B2A5E" />
			<circle cx={73} cy={103} r={2.8} fill="#FFFFFF" />
			<circle cx={133} cy={103} r={2.8} fill="#FFFFFF" />
			<ellipse cx={100} cy={132} rx={25} ry={17} fill="#FFF1EC" />
			<ellipse cx={100} cy={124} rx={9} ry={6.5} fill="#1B2A5E" />
			<path
				d="M88 137 Q100 149 112 137"
				fill="none"
				stroke="#1B2A5E"
				strokeWidth={5}
				strokeLinecap="round"
			/>
			<circle
				cx={100}
				cy={106}
				r={97}
				fill="none"
				stroke="rgba(255,255,255,0.9)"
				strokeWidth={5}
			/>
			<path
				d="M34 66 Q52 26 100 16"
				fill="none"
				stroke="#FFFFFF"
				strokeWidth={9}
				strokeLinecap="round"
				opacity={0.85}
			/>
		</Interactive.Svg>
	);
};

const bearFaceSchema = {
	size: {
		type: 'number',
		default: 300,
		min: 20,
		step: 1,
		hiddenFromList: false,
		keyframable: false,
		description: 'Size',
	},
	cheekColor: {type: 'color', default: '#FFB3C1', description: 'Cheek color'},
} as const satisfies InteractivitySchema;

export const BearFace = Interactive.withSchema({
	Component: BearFaceInner,
	componentName: '<BearFace>',
	schema: bearFaceSchema,
	wrapInSequence: true,
});
