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
  theme = 'auto',
  className = '',
}) => {
  const blue500 = "#005CE6"; // Deep Cobalt Royal Blue
  const navy700 = "#0F172A"; // High-contrast Deep Slate Navy

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

          {/* Highlight ring gradient */}
          <linearGradient id="brand-ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#005CE6" />
            <stop offset="100%" stopColor="#0096D6" />
          </linearGradient>
        </defs>

        {/* Outer Ice Disc with highlighted gradient ring */}
        <circle
          cx="50"
          cy="50"
          r="47"
          fill={theme === 'dark' ? '#1E293B' : '#F0FAFF'}
          stroke={theme === 'dark' ? '#3B82F6' : 'url(#brand-ring-grad)'}
          strokeWidth="2.5"
        />
        <circle cx="50" cy="50" r="46" fill="url(#brand-logo-grid)" />

        {/* The Rounded Plus Mark (Composite of horizontal and vertical capsule bars) */}
        {/* Upper-Left half in Brand Royal Blue (#005CE6) */}
        <g clipPath="url(#brand-upper-left-clip)">
          <rect x="41" y="22" width="18" height="56" rx="9" fill={blue500} />
          <rect x="22" y="41" width="56" height="18" rx="9" fill={blue500} />
        </g>

        {/* Lower-Right half in Deep Slate Navy in light mode, Sky Blue in dark mode */}
        <g clipPath="url(#brand-lower-right-clip)">
          <rect
            x="41"
            y="22"
            width="18"
            height="56"
            rx="9"
            fill={theme === 'dark' ? '#93C5FD' : navy700}
          />
          <rect
            x="22"
            y="41"
            width="56"
            height="18"
            rx="9"
            fill={theme === 'dark' ? '#93C5FD' : navy700}
          />
        </g>

        {/* Subtle center junction dot */}
        <circle cx="50" cy="50" r="2.5" fill="#FFFFFF" fillOpacity="0.5" />
      </svg>

      {/* Wordmark (Sw in solid Deep Navy #0F172A / white in dark, S in Gradient Royal Blue #005CE6) */}
      {showWordmark && (
        <span className="font-extrabold tracking-tight text-xl font-['DM_Sans'] leading-none">
          <span className={theme === 'dark' ? 'text-white' : theme === 'light' ? 'text-[#0F172A]' : 'text-[#0F172A] dark:text-white'}>Sw</span>
          <span className={theme === 'dark' ? 'text-blue-400' : theme === 'light' ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#005CE6] via-[#006DE6] to-[#0096D6]' : 'text-transparent bg-clip-text bg-gradient-to-r from-[#005CE6] via-[#006DE6] to-[#0096D6] dark:text-blue-400'}>S</span>
        </span>
      )}
    </div>
  );
};
