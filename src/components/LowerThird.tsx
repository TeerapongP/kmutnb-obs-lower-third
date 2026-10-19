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
const D = '#242528';
const visiblePart = { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' };

function partAnimation(
  parts: LowerThirdPartControls | undefined,
  part: keyof LowerThirdPartControls,
  staggerParts: boolean,
) {
  return staggerParts && parts ? parts[part] : visiblePart;
}

function Identity({
  x,
  y,
  dark = false,
  logoSrc,
  logoSize = 89,
}: {
  x: number;
  y: number;
  dark?: boolean;
  logoSrc?: string;
  logoSize?: number;
}) {
  return (
    <g>
      <circle
        cx={x + logoSize / 2}
        cy={y + logoSize / 2}
        r={logoSize / 2 + 2}
        fill="white"
      />
      {logoSrc ? (
        <image
          href={logoSrc}
          x={x}
          y={y}
          width={logoSize}
          height={logoSize}
          preserveAspectRatio="xMidYMid meet"
        />
      ) : (
        <g>
          <circle
            cx={x + logoSize / 2}
            cy={y + logoSize / 2}
            r={logoSize / 2 - 5}
            fill="none"
            stroke={O}
            strokeWidth="2"
          />
          <text
            x={x + logoSize / 2}
            y={y + logoSize / 2 + 4}
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            fill={O}
          >
            KMUTNB
          </text>
        </g>
      )}
      <text
        x={x + logoSize + 19}
        y={y + 43}
        fill={dark ? O : 'white'}
        fontFamily="Arial,sans-serif"
        fontWeight="900"
        fontSize="35"
      >
        KMUTNB
      </text>
      <text
        x={x + logoSize + 20}
        y={y + 62}
        fill={dark ? '#333' : 'white'}
        fontFamily="Arial,sans-serif"
        fontWeight="700"
        fontSize="8.7"
      >
        KING MONGKUT&apos;S UNIVERSITY
      </text>
      <text
        x={x + logoSize + 20}
        y={y + 74}
        fill={dark ? '#333' : 'white'}
        fontFamily="Arial,sans-serif"
        fontWeight="700"
        fontSize="8.7"
      >
        OF TECHNOLOGY NORTH BANGKOK
      </text>
    </g>
  );
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
              fontSize: 34,
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
              fontSize: 19,
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
      viewBox={variant === 'classic' ? `0 0 ${classicArtwork.width} ${classicArtwork.height}` : '0 0 1200 140'}
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
        {variant === 'classic' ? (
          <mask
            id={shape}
            x="0"
            y="0"
            width={classicArtwork.width}
            height={classicArtwork.height}
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
            style={{ maskType: 'alpha' }}
          >
            <image
              href="/assets/Classic_1.svg"
              width={classicArtwork.width}
              height={classicArtwork.height}
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
            subtitleColor="white"
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
            <path
              d="M15 34Q13 27 23 27H132L97 117H39Z"
              fill={O}
            />
            <path
              d="M1042 28H1132Q1141 28 1138 37L1101 117H1005Z"
              fill={O}
            />
            <path
              d="M394 70H1036L1005 117H418Z"
              fill={D}
            />
            <path
              d="M338 15H1101L1078 70H386Z"
              fill={`url(#${white})`}
            />
            <path
              d="M88 15H347L418 117H82Q55 117 49 95L34 44Q27 15 88 15Z"
              fill={`url(#${white})`}
            />
          </motion.g>
          <motion.g
            initial={false}
            animate={decorationAnimation}
          >
            <path
              d="M1069 15H1081L1036 117H1023Z"
              fill="#fff"
            />
            <path
              d="M1084 15H1099L1053 117H1038Z"
              fill={O}
            />
            <path
              d="M1102 15H1110L1064 117H1056Z"
              fill="#fff"
            />
          </motion.g>
          <motion.g
            initial={false}
            animate={logoAnimation}
          >
            <Identity
              x={65}
              y={22}
              logoSrc={logoSrc}
              logoSize={86}
              dark
            />
          </motion.g>
          <TextContent
            name={name}
            subtitle={subtitle}
            x={466}
            width={550}
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
            <rect
              x="12"
              y="10"
              width="1164"
              height="120"
              rx="61"
              fill={O}
            />
            <path
              d="M381 10H1065Q1128 10 1128 69Q1128 123 1065 123H434Q415 112 403 87L365 27Q358 15 381 10Z"
              fill={`url(#${white})`}
            />
            <path
              d="M422 76H1057Q1086 76 1086 96Q1086 114 1060 114H444Z"
              fill={O}
            />
          </motion.g>
          <motion.path
            initial={false}
            animate={decorationAnimation}
            d="M378 10Q397 22 407 47Q422 90 444 123"
            stroke="#fff"
            strokeWidth="5"
            fill="none"
            opacity=".9"
          />
          <motion.g
            initial={false}
            animate={logoAnimation}
          >
            <Identity
              x={24}
              y={20}
              logoSrc={logoSrc}
              logoSize={89}
            />
          </motion.g>
          <TextContent
            name={name}
            subtitle={subtitle}
            x={450}
            width={605}
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
          clipPath={`url(#${shape})`}
          transform="skewX(-18)"
          style={{ mixBlendMode: 'screen' }}
        />
      )}
    </svg>
  );
}

export default LowerThird;
