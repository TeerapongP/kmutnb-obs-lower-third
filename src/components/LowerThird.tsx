import { useId, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import { classicArtwork, classicSweep } from '../animations/classicSweep';
import type { LowerThirdPartControls } from '../hooks/useLowerThirdAnimation';

export type LowerThirdVariant = 'classic' | 'angular' | 'overlay' | 'rounded';

export type LowerThirdProps = {
  variant: LowerThirdVariant;
  name: string;
  subtitle: string;
  logoSrc?: string;
  className?: string;
  style?: CSSProperties;
  parts?: LowerThirdPartControls;
  staggerParts?: boolean;
};

const O = '#F4511E';
const visiblePart = { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' };
const tiltedArtwork = '/assets/lower-third-2-tilted.svg';
const roundedArtwork = '/assets/lower-third-4-rounded.svg';

function partAnimation(
  parts: LowerThirdPartControls | undefined,
  part: keyof LowerThirdPartControls,
  staggerParts: boolean,
) {
  return staggerParts && parts ? parts[part] : visiblePart;
}

function TextContent({
  name,
  subtitle,
  x,
  color = '#111',
  subtitleColor = 'white',
  width = 655,
  nameY = 20,
  subtitleY = 79,
  nameFontSize = 34,
  subtitleFontSize = 14,
  parts,
  staggerParts,
}: {
  name: string;
  subtitle: string;
  x: number;
  color?: string;
  subtitleColor?: string;
  width?: number;
  nameY?: number;
  subtitleY?: number;
  nameFontSize?: number;
  subtitleFontSize?: number;
  parts?: LowerThirdPartControls;
  staggerParts: boolean;
}) {
  return (
    <g fontFamily="'Noto Sans Thai','Sarabun','Prompt',sans-serif">
      <motion.g
        initial={false}
        animate={partAnimation(parts, 'name', staggerParts)}
      >
        <foreignObject
          x={x}
          y={nameY}
          width={width}
          height="51"
        >
          <div
            style={{
              color,
              fontFamily: "'Noto Sans Thai','Sarabun','Prompt',sans-serif",
              fontWeight: 800,
              fontSize: nameFontSize,
              lineHeight: '48px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {name}
          </div>
        </foreignObject>
      </motion.g>
      <motion.g
        initial={false}
        animate={partAnimation(parts, 'subtitle', staggerParts)}
      >
        <foreignObject
          x={x}
          y={subtitleY}
          width={width}
          height="36"
        >
          <div
            style={{
              color: subtitleColor,
              fontFamily: "'Noto Sans Thai','Sarabun','Prompt',sans-serif",
              fontWeight: 700,
              fontSize: subtitleFontSize,
              lineHeight: '31px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {subtitle}
          </div>
        </foreignObject>
      </motion.g>
    </g>
  );
}

function ShapeClip({ variant }: { variant: LowerThirdVariant }) {
  if (variant === 'angular') {
    return (
      <>
        <path d="M15 34H132L97 117H39Z" />
        <path d="M1042 28H1138L1101 117H1005Z" />
        <path d="M34 15H1110L1064 117H39Z" />
      </>
    );
  }
  if (variant === 'overlay') {
    return (
      <rect
        x="10"
        y="12"
        width="1009"
        height="117"
        rx="29"
      />
    );
  }
  return (
    <rect
      x="12"
      y="10"
      width="1164"
      height="120"
      rx="61"
    />
  );
}

export function LowerThird({
  variant,
  name,
  subtitle,
  logoSrc,
  className,
  style,
  parts,
  staggerParts = false,
}: LowerThirdProps) {
  const id = useId().replace(/:/g, '');
  const white = `${id}-white`;
  const glass = `${id}-glass`;
  const sweep = `${id}-sweep`;
  const shape = `${id}-shape`;
  const panelAnimation = partAnimation(parts, 'panel', staggerParts);
  const decorationAnimation = partAnimation(parts, 'decoration', staggerParts);
  const logoAnimation = partAnimation(parts, 'logo', staggerParts);
  const artwork =
    variant === 'classic'
      ? {
          src: '/assets/Classic_1.svg',
          width: classicArtwork.width,
          height: classicArtwork.height,
        }
      : variant === 'angular'
        ? { src: tiltedArtwork, width: 1270, height: 130 }
        : variant === 'rounded'
          ? { src: roundedArtwork, width: 1270, height: 130 }
          : null;

  return (
    <svg
      className={className}
      style={{
        width: '100%',
        height: 'auto',
        display: 'block',
        overflow: 'visible',
        ...style,
      }}
      viewBox={artwork ? `0 0 ${artwork.width} ${artwork.height}` : '0 0 1200 140'}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`${name} — ${subtitle}`}
    >
      <defs>
        <linearGradient
          id={white}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0"
            stopColor="#fff"
          />
          <stop
            offset="1"
            stopColor="#eceef0"
          />
        </linearGradient>
        <linearGradient
          id={glass}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop
            offset="0"
            stopColor="#0d1015"
            stopOpacity=".87"
          />
          <stop
            offset=".62"
            stopColor="#111216"
            stopOpacity=".85"
          />
          <stop
            offset="1"
            stopColor="#bb4b17"
            stopOpacity=".66"
          />
        </linearGradient>
        <linearGradient
          id={sweep}
          x1="0"
          x2="1"
        >
          <stop
            stopColor="#fff"
            stopOpacity="0"
          />
          <stop
            offset=".5"
            stopColor="#fff"
            stopOpacity=".9"
          />
          <stop
            offset="1"
            stopColor="#fff"
            stopOpacity="0"
          />
        </linearGradient>
        {artwork ? (
          <mask
            id={shape}
            x="0"
            y="0"
            width={artwork.width}
            height={artwork.height}
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
            style={{ maskType: 'alpha' }}
          >
            <image
              href={artwork.src}
              width={artwork.width}
              height={artwork.height}
            />
          </mask>
        ) : (
          <clipPath id={shape}>
            <ShapeClip variant={variant} />
          </clipPath>
        )}
      </defs>

      {variant === 'classic' && (
        <g>
          <motion.g
            initial={false}
            animate={panelAnimation}
          >
            <use href="/assets/Classic_1.svg#classic-panel-base" />
          </motion.g>
          <motion.g
            initial={false}
            animate={logoAnimation}
          >
            <use href="/assets/Classic_1.svg#classic-logo" />
          </motion.g>
          <motion.g
            initial={false}
            animate={panelAnimation}
          >
            <use href="/assets/Classic_1.svg#classic-panel-body" />
          </motion.g>
          <motion.g
            initial={false}
            animate={decorationAnimation}
          >
            <use href="/assets/Classic_1.svg#classic-decoration" />
          </motion.g>
          <TextContent
            name={name}
            subtitle={subtitle}
            x={525}
            width={775}
            nameY={40}
            subtitleY={112}
            nameFontSize={42}
            subtitleColor="white"
            subtitleFontSize={17}
            parts={parts}
            staggerParts={staggerParts}
          />
        </g>
      )}

      {variant === 'angular' && (
        <g>
          <motion.g
            initial={false}
            animate={panelAnimation}
          >
            <image
              href={tiltedArtwork}
              width="1270"
              height="130"
              preserveAspectRatio="xMidYMid meet"
            />
          </motion.g>
          <TextContent
            name={name}
            subtitle={subtitle}
            x={510}
            width={660}
            nameY={18}
            subtitleY={68}
            parts={parts}
            staggerParts={staggerParts}
          />
        </g>
      )}

      {variant === 'overlay' && (
        <g>
          <motion.g
            initial={false}
            animate={panelAnimation}
          >
            <rect
              x="10"
              y="12"
              width="1009"
              height="117"
              rx="29"
              fill={`url(#${glass})`}
              stroke="#a7a19e"
              strokeOpacity=".62"
              strokeWidth="1.4"
            />
            <path
              d="M45 12H128L190 129H39Q10 129 10 102V40Q10 12 45 12Z"
              fill={O}
              fillOpacity=".91"
            />
            <path
              d="M825 12H964L1019 105Q1019 129 997 129H892Z"
              fill="#e36429"
              opacity=".23"
            />
          </motion.g>
          <motion.g
            initial={false}
            animate={logoAnimation}
          >
            <circle
              cx="94"
              cy="70"
              r="51"
              fill="white"
            />
            {logoSrc ? (
              <image
                href={logoSrc}
                x="48"
                y="24"
                width="92"
                height="92"
                preserveAspectRatio="xMidYMid meet"
              />
            ) : (
              <g>
                <circle
                  cx="94"
                  cy="70"
                  r="43"
                  fill="none"
                  stroke={O}
                  strokeWidth="2"
                />
                <text
                  x="94"
                  y="74"
                  fontSize="12"
                  textAnchor="middle"
                  fill={O}
                >
                  KMUTNB
                </text>
              </g>
            )}
          </motion.g>
          <motion.g
            initial={false}
            animate={decorationAnimation}
          >
            <path
              d="M205 76H911"
              stroke={O}
              strokeWidth="2"
            />
            <path
              d="M1028 19H1050L1108 129H1086Z"
              fill={O}
            />
            <path
              d="M1059 19H1074L1132 129H1117Z"
              fill="#f66832"
            />
            <path
              d="M1085 19H1105L1164 129H1144Z"
              fill="#78341b"
            />
          </motion.g>
          <TextContent
            name={name}
            subtitle={subtitle}
            x={205}
            color="white"
            width={690}
            parts={parts}
            staggerParts={staggerParts}
          />
        </g>
      )}

      {variant === 'rounded' && (
        <g>
          <motion.g
            initial={false}
            animate={panelAnimation}
          >
            <image
              href={roundedArtwork}
              width="1270"
              height="130"
              preserveAspectRatio="xMidYMid meet"
            />
          </motion.g>
          <TextContent
            name={name}
            subtitle={subtitle}
            x={505}
            width={605}
            nameY={16}
            subtitleY={70}
            parts={parts}
            staggerParts={staggerParts}
          />
        </g>
      )}

      {parts && variant === 'classic' && (
        <g mask={`url(#${shape})`}>
          <g transform={`skewX(${classicSweep.skewDegrees})`}>
            <motion.rect
              initial={false}
              animate={parts.sweep}
              x={classicSweep.x}
              y={classicSweep.y}
              width={classicSweep.width}
              height={classicSweep.height}
              fill={`url(#${sweep})`}
              style={{ mixBlendMode: 'screen' }}
            />
          </g>
        </g>
      )}

      {parts && variant !== 'classic' && (
        <motion.rect
          initial={false}
          animate={parts.sweep}
          x="-420"
          y="0"
          width="220"
          height="140"
          fill={`url(#${sweep})`}
          mask={artwork ? `url(#${shape})` : undefined}
          clipPath={artwork ? undefined : `url(#${shape})`}
          transform="skewX(-18)"
          style={{ mixBlendMode: 'screen' }}
        />
      )}
    </svg>
  );
}

export default LowerThird;
