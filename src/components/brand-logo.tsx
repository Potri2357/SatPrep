import React from 'react';

interface BrandLogoProps {
  size?: number;
  showWordmark?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 36,
  showWordmark = true,
  theme = 'light',
  className = '',
}) => {
  // Brand colors (PRD Section 7.2 & 7.3)
  const isDark = theme === 'dark';
  const blue500 = "#2563EB"; // Vibrant Royal Blue
  const navy700 = "#0F172A"; // High-contrast Deep Slate Navy
  const ice100 = "#EFF6FF";
  const iceRing = "#BFDBFE";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Icon Disc with 45-degree diagonal split rounded plus mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:scale-105 duration-200"
      >
        <defs>
          {/* Faint graph paper grid pattern inside disc */}
          <pattern id="brand-logo-grid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#2563EB" strokeWidth="0.5" strokeOpacity="0.16" />
          </pattern>
          
          {/* Diagonal 45-degree clipping paths for the two halves of the plus */}
          <clipPath id="brand-upper-left-clip">
            <polygon points="-20,-20 120,-20 -20,120" />
          </clipPath>
          <clipPath id="brand-lower-right-clip">
            <polygon points="120,-20 120,120 -20,120" />
          </clipPath>
        </defs>

        {/* Outer Ice Disc with subtle blue ring */}
        <circle
          cx="50"
          cy="50"
          r="47"
          fill={isDark ? '#1E293B' : ice100}
          stroke={isDark ? '#3B82F6' : iceRing}
          strokeWidth="1.5"
        />
        <circle cx="50" cy="50" r="46" fill="url(#brand-logo-grid)" />

        {/* The Rounded Plus Mark (Composite of horizontal and vertical capsule bars) */}
        {/* Upper-Left half in Brand Royal Blue (#2563EB) */}
        <g clipPath="url(#brand-upper-left-clip)">
          <rect x="41" y="22" width="18" height="56" rx="9" fill={blue500} />
          <rect x="22" y="41" width="56" height="18" rx="9" fill={blue500} />
        </g>

        {/* Lower-Right half in Deep Slate Navy (#0F172A) */}
        <g clipPath="url(#brand-lower-right-clip)">
          <rect x="41" y="22" width="18" height="56" rx="9" fill={isDark ? '#93C5FD' : navy700} />
          <rect x="22" y="41" width="56" height="18" rx="9" fill={isDark ? '#93C5FD' : navy700} />
        </g>

        {/* Subtle center junction dot */}
        <circle cx="50" cy="50" r="2.5" fill="#FFFFFF" fillOpacity="0.4" />
      </svg>

      {/* Wordmark (Sat in solid Deep Navy #0F172A, Prep in Royal Blue #2563EB) */}
      {showWordmark && (
        <span className="font-extrabold tracking-tight text-xl font-['DM_Sans'] leading-none">
          <span className={isDark ? 'text-white' : 'text-[#0F172A]'}>Sat</span>
          <span className={isDark ? 'text-blue-300' : 'text-[#2563EB]'}>Prep</span>
        </span>
      )}
    </div>
  );
};
