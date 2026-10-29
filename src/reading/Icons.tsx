import type React from 'react';

type IconProps = {
	readonly size?: number;
	readonly color?: string;
};

const Svg: React.FC<IconProps & {readonly children: React.ReactNode}> = ({
	size = 64,
	color = '#FFFFFF',
	children,
}) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		strokeWidth={2}
		strokeLinecap="round"
		strokeLinejoin="round"
		style={{flexShrink: 0}}
	>
		{children}
	</svg>
);

export const BoltIcon: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
	</Svg>
);

export const PlayIcon: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<rect x="2" y="4" width="20" height="16" rx="4" />
		<path d="m10 9 5 3-5 3z" />
	</Svg>
);

export const MicIcon: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<rect x="9" y="2" width="6" height="12" rx="3" />
		<path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8" />
	</Svg>
);

export const CameraOffIcon: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<path d="M2 2l20 20M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12M10 5h4l2 2h4a2 2 0 0 1 2 2v8" />
	</Svg>
);

export const ScissorsIcon: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<circle cx="6" cy="6" r="3" />
		<circle cx="6" cy="18" r="3" />
		<path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12" />
	</Svg>
);

export const CardIcon: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<rect x="2" y="5" width="20" height="14" rx="3" />
		<path d="M2 10h20M6 15h4" />
	</Svg>
);

export const CheckIcon: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<path d="m5 12 5 5L20 7" />
	</Svg>
);

export const CrossIcon: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<path d="M6 6l12 12M18 6 6 18" />
	</Svg>
);

export const ClockIcon: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<circle cx="12" cy="12" r="10" />
		<path d="M12 6v6l4 2" />
	</Svg>
);

export const PlusIcon: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<path d="M12 5v14M5 12h14" />
	</Svg>
);

export const TerminalIcon: React.FC<IconProps> = (p) => (
	<Svg {...p}>
		<path d="m4 17 6-5-6-5M12 19h8" />
	</Svg>
);
