import type React from 'react';
import {
	CanvasImage,
	Interactive,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
	type InteractivitySchema,
} from 'remotion';

type PhotoCardProps = {
	readonly src: string;
	readonly cardWidth: number;
	readonly cardHeight: number;
	readonly zoomFrom: number;
	readonly zoomTo: number;
	readonly zoomOrigin: string;
	readonly frameColor: string;
	readonly children?: React.ReactNode;
	readonly style?: React.CSSProperties;
};

const BORDER = 14;

// Rounded product photo with a white frame and a slow Ken Burns push-in.
// Children are placed inside the zoomed layer, so markers stay on the product.
const PhotoCardInner: React.FC<PhotoCardProps> = ({
	src,
	cardWidth,
	cardHeight,
	zoomFrom,
	zoomTo,
	zoomOrigin,
	frameColor,
	children,
	style,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const innerWidth = cardWidth - BORDER * 2;
	const innerHeight = cardHeight - BORDER * 2;

	return (
		<Interactive.Div
			style={{
				position: 'absolute',
				width: cardWidth,
				height: cardHeight,
				padding: BORDER,
				borderRadius: 56,
				backgroundColor: frameColor,
				boxShadow: '0 40px 80px rgba(27, 42, 94, 0.32)',
				...style,
			}}
		>
			<div
				style={{
					position: 'relative',
					width: innerWidth,
					height: innerHeight,
					borderRadius: 44,
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						transformOrigin: zoomOrigin,
						scale: interpolate(frame, [0, 7 * fps], [zoomFrom, zoomTo], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						}),
					}}
				>
					<CanvasImage
						src={src}
						premountFor={fps}
						fit="cover"
						width={Math.round(innerWidth * 1.5)}
						height={Math.round(innerHeight * 1.5)}
						style={{width: '100%', height: '100%'}}
					/>
					{children}
				</div>
			</div>
		</Interactive.Div>
	);
};

const photoCardSchema = {
	src: {type: 'asset', assetType: 'image', default: undefined, description: 'Photo'},
	cardWidth: {
		type: 'number',
		default: 720,
		min: 100,
		step: 1,
		hiddenFromList: false,
		keyframable: false,
		description: 'Card width',
	},
	cardHeight: {
		type: 'number',
		default: 960,
		min: 100,
		step: 1,
		hiddenFromList: false,
		keyframable: false,
		description: 'Card height',
	},
	zoomFrom: {
		type: 'number',
		default: 1,
		min: 1,
		step: 0.01,
		hiddenFromList: false,
		keyframable: false,
		description: 'Zoom start',
	},
	zoomTo: {
		type: 'number',
		default: 1.1,
		min: 1,
		step: 0.01,
		hiddenFromList: false,
		keyframable: false,
		description: 'Zoom end',
	},
	zoomOrigin: {type: 'transform-origin', default: '50% 50%', description: 'Zoom focus'},
	frameColor: {type: 'color', default: '#FFFFFF', description: 'Frame color'},
} as const satisfies InteractivitySchema;

export const PhotoCard = Interactive.withSchema({
	Component: PhotoCardInner,
	componentName: '<PhotoCard>',
	schema: photoCardSchema,
	wrapInSequence: true,
});
