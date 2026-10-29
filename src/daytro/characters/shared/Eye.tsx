import type React from 'react';
import {INK} from '../../theme';

type EyeProps = {
	readonly x: number;
	readonly y: number;
	readonly rx: number;
	readonly ry: number;
	// 0 = wide open, 1 = shut. Around 0.4 gives the deadpan, unimpressed stare
	readonly lid: number;
	// Colour of the eyelid: skin for people, fur for animals
	readonly lidColor: string;
	// Degrees; rotates the whole eye so the lid slants (angry, worried, sly)
	readonly tilt?: number;
	readonly pupilX?: number;
	readonly pupilY?: number;
	readonly pupilR?: number;
	// Vertical radius of the pupil when it differs from pupilR: a cat's slit
	readonly pupilRy?: number;
	// Coloured ring around the pupil (cat eyes, contact lenses, big cute eyes)
	readonly iris?: string;
	readonly irisR?: number;
	// Two white glints: the sparkle that makes an eye read as cute
	readonly shine?: boolean;
	readonly stroke?: number;
};

// A white eyeball with a small pupil and a heavy upper lid: the deadpan comedy eye
export const Eye: React.FC<EyeProps> = ({
	x,
	y,
	rx,
	ry,
	lid,
	lidColor,
	tilt = 0,
	pupilX = 0,
	pupilY = 0,
	pupilR = rx * 0.32,
	pupilRy,
	iris,
	irisR = rx * 0.6,
	shine = false,
	stroke = 3,
}) => {
	const shut = lid >= 0.97;
	// The lid covers the part of the eyeball above the chord at y = lidY
	const lidY = -ry + Math.min(lid, 0.97) * 2 * ry;
	const half = rx * Math.sqrt(Math.max(0, 1 - (lidY / ry) ** 2));
	const large = lidY > 0 ? 1 : 0;
	const glint = iris ? irisR : pupilR;
	return (
		<g transform={`translate(${x}, ${y}) rotate(${tilt})`}>
			{shut ? (
				<g>
					<ellipse rx={rx} ry={ry} fill={lidColor} stroke={INK} strokeWidth={stroke} />
					<path
						d={`M ${-rx * 0.9} ${ry * 0.15} Q 0 ${ry * 0.55} ${rx * 0.9} ${ry * 0.15}`}
						fill="none"
						stroke={INK}
						strokeWidth={stroke}
						strokeLinecap="round"
					/>
				</g>
			) : (
				<g>
					<ellipse rx={rx} ry={ry} fill="#FFFFFF" />
					{iris ? <circle cx={pupilX} cy={pupilY} r={irisR} fill={iris} /> : null}
					<ellipse cx={pupilX} cy={pupilY} rx={pupilR} ry={pupilRy ?? pupilR} fill={INK} />
					{shine ? (
						<g fill="#FFFFFF">
							<circle cx={pupilX + glint * 0.38} cy={pupilY - glint * 0.42} r={glint * 0.36} />
							<circle cx={pupilX - glint * 0.4} cy={pupilY + glint * 0.38} r={glint * 0.16} />
						</g>
					) : null}
					{lid > 0.02 ? (
						<g>
							<path d={`M ${-half} ${lidY} A ${rx} ${ry} 0 ${large} 1 ${half} ${lidY} Z`} fill={lidColor} />
							<path d={`M ${-half} ${lidY} L ${half} ${lidY}`} stroke={INK} strokeWidth={stroke} strokeLinecap="round" />
						</g>
					) : null}
					<ellipse rx={rx} ry={ry} fill="none" stroke={INK} strokeWidth={stroke} />
				</g>
			)}
		</g>
	);
};
