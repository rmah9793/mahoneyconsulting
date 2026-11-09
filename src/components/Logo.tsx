import { useId } from "react";

type LogoProps = {
  className?: string;
  showWordmark?: boolean;
};

const MARK =
  "M9 13 H39 L78 64 L102 22 Q110 13 123 13 H142 V19 H130 V98 H143 V104 H96 V98 H108 V31 L78 83 L38 31 V98 H51 V104 H9 V98 H23 V19 H9 Z";

export function Logo({ className = "", showWordmark = true }: LogoProps) {
  const gid = useId();

  return (
    <svg
      viewBox={showWordmark ? "0 0 750 180" : "0 0 160 115"}
      className={className}
      role="img"
      aria-label="Mahoney Consulting"
    >
      <defs>
        <linearGradient id={gid} gradientUnits="userSpaceOnUse" x1="9" y1="0" x2="143" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.49" stopColor="#edfffe" />
          <stop offset="0.54" stopColor="#00827c" />
          <stop offset="1" stopColor="#cbfffc" />
        </linearGradient>
      </defs>
      {showWordmark ? (
        <>
          <g transform="translate(16 22) scale(1.23)">
            <path fill={`url(#${gid})`} d={MARK} />
          </g>
          <path d="M230 37 V145" stroke="rgba(237,255,254,0.28)" strokeWidth="1" />
          <text
            x="260"
            y="95"
            fill="#ffffff"
            fontFamily="Satoshi, Inter, sans-serif"
            fontWeight="500"
            fontSize="72"
            letterSpacing="-2"
          >
            Mahoney
          </text>
          <text
            x="265"
            y="133"
            fill="#bbc7c6"
            fontFamily="Satoshi, Inter, sans-serif"
            fontWeight="400"
            fontSize="16"
            letterSpacing="12"
          >
            CONSULTING
          </text>
        </>
      ) : (
        <g transform="translate(8 1)">
          <path fill={`url(#${gid})`} d={MARK} />
        </g>
      )}
    </svg>
  );
}
