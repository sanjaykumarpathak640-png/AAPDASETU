import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showTagline = false }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* AAPDASETU Emblem: Shield + Location Pin + Water Wave + Emergency Beacon */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-cyan-600 to-indigo-700 p-2 text-white shadow-lg shadow-cyan-950/40 border border-cyan-400/30 group-hover:border-cyan-300 transition-all ${iconSizes[size]}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          {/* Shield Outline */}
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="text-cyan-200" fill="currentColor" fillOpacity="0.15" />
          {/* Location Pin */}
          <circle cx="12" cy="10" r="2.5" className="text-white" fill="white" />
          {/* Water Wave Curve at base */}
          <path d="M7 16c2.5 1.5 7.5 1.5 10 0" stroke="white" strokeWidth="2.2" />
        </svg>
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
      </div>

      <div className="flex flex-col">
        <div className={`font-black tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-blue-200 ${textSizes[size]}`}>
          AAPDA<span className="text-cyan-400">SETU</span>
        </div>
        {showTagline && (
          <span className="text-[10px] tracking-wide text-cyan-200/70 font-medium -mt-1 hidden sm:inline">
            Warn Early. Navigate Safely. Survive Smarter.
          </span>
        )}
      </div>
    </Link>
  );
};

export default Logo;

