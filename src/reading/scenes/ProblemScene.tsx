import type {Caption} from '@remotion/captions';
import type React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Backdrop} from '../Backdrop';
import {CameraOffIcon, CardIcon, CrossIcon, ScissorsIcon} from '../Icons';
import {colors, fontFamily} from '../theme';
import {useCue} from '../timeline';
import {Kicker, pop, rise, Row, slideIn} from '../ui';

type Props = {readonly captions?: Caption[]};

const CrossBadge: React.FC<{readonly style: React.CSSProperties}> = ({style}) => (
	<div
		style={{
			width: 64,
			height: 64,
			borderRadius: '50%',
			flexShrink: 0,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: colors.red,
			...style,
		}}
	>
		<CrossIcon size={38} color="#FFFFFF" />
	</div>
);

// The three pains of starting a channel, each landing as it is spoken
export const ProblemScene: React.FC<Props> = ({captions}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const cue = useCue(captions);
	const camera = cue('ngại', 40);
	const capcut = cue('capcut', 90);
	const credit = cue('credit', 230);

	return (
		<AbsoluteFill style={{fontFamily}}>
			<Backdrop accent={colors.red} />
			<Kicker name="Kicker" color={colors.red} premountFor={fps} style={{top: 190, ...rise(frame, 4)}}>
				VÒNG LUẨN QUẨN
			</Kicker>
			<Row
				name="Pain: camera"
				accent={colors.red}
				icon={<CameraOffIcon size={56} color={colors.red} />}
				badge={<CrossBadge style={pop(frame, camera + 10)} />}
				premountFor={fps}
				style={{top: 340, ...slideIn(frame, camera)}}
			>
				Ngại đứng trước ống kính
			</Row>
			<Row
				name="Pain: editing"
				accent={colors.red}
				icon={<ScissorsIcon size={56} color={colors.red} />}
				badge={<CrossBadge style={pop(frame, capcut + 10)} />}
				premountFor={fps}
				style={{top: 540, ...slideIn(frame, capcut)}}
			>
				Cả tối ngồi CapCut, gõ phụ đề
			</Row>
			<Row
				name="Pain: credits"
				accent={colors.red}
				icon={<CardIcon size={56} color={colors.red} />}
				badge={<CrossBadge style={pop(frame, credit + 10)} />}
				premountFor={fps}
				style={{top: 740, ...slideIn(frame, credit)}}
			>
				Tool AI hết credit, gói tháng chát
			</Row>
		</AbsoluteFill>
	);
};
