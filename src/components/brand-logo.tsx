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
  className = '',
}) => {
  // Exact colors derived from PRD Section 7.2 & 7.3
  const blue500 = "#2D6BCB";
  const navy700 = "#212835";
  const ice100 = "#EAF1F8";

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
          <pattern id="logo-grid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#2D6BCB" strokeWidth="0.5" strokeOpacity="0.12" />
          </pattern>
          
          {/* Diagonal 45-degree clipping paths for the two halves of the plus */}
          <clipPath id="upper-left-clip">
            <polygon points="-20,-20 120,-20 -20,120" />
          </clipPath>
          <clipPath id="lower-right-clip">
            <polygon points="120,-20 120,120 -20,120" />
          </clipPath>
        </defs>

        {/* Outer Ice Disc with subtle navy ring */}
        <circle cx="50" cy="50" r="47" fill={ice100} stroke="#2E3746" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="46" fill="url(#logo-grid)" />

        {/* The Rounded Plus Mark (Composite of horizontal and vertical capsule bars) */}
        {/* Upper-Left half in Brand Blue (#2D6BCB) */}
        <g clipPath="url(#upper-left-clip)">
          {/* Vertical Bar */}
          <rect x="41" y="22" width="18" height="56" rx="9" fill={blue500} />
          {/* Horizontal Bar */}
          <rect x="22" y="41" width="56" height="18" rx="9" fill={blue500} />
        </g>

        {/* Lower-Right half in Deep Navy (#212835) */}
        <g clipPath="url(#lower-right-clip)">
          {/* Vertical Bar */}
          <rect x="41" y="22" width="18" height="56" rx="9" fill={navy700} />
          {/* Horizontal Bar */}
          <rect x="22" y="41" width="56" height="18" rx="9" fill={navy700} />
        </g>

        {/* Subtle center junction refinement */}
        <circle cx="50" cy="50" r="2.5" fill="#FFFFFF" fillOpacity="0.25" />
      </svg>

      {/* Wordmark (Sat in Navy / white, Prep in Brand Blue) */}
      {showWordmark && (
        <span className="font-bold tracking-tight text-xl font-['DM_Sans'] leading-none">
          <span className="text-slate-900 dark:text-white">Sat</span>
          <span className="text-[#2D6BCB]">Prep</span>
        </span>
      )}
    </div>
  );
};
