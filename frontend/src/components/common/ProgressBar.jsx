import React from 'react';

export const ProgressBar = ({
  value = 0,
  max = 100,
  size = 'md',
  showLabel = true,
  label,
  variant = 'primary',
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heightStyles = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  const fillStyles = {
    primary: "bg-brand-gradient",
    accent: "bg-accent-gradient",
    teal: "bg-teal-600",
    emerald: "bg-emerald-500"
  };

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-medium text-slate-600">
          <span>{label || 'Progress'}</span>
          <span className="font-semibold text-slate-900">{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50 ${heightStyles[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${fillStyles[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const CircularProgress = ({
  percentage = 0,
  size = 90,
  strokeWidth = 8,
  title,
  subtitle,
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const isHigh = percentage >= 70;
  const isMed = percentage >= 35 && percentage < 70;

  const gradId = `circleGrad-${size}-${Math.round(percentage)}`;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Soft background ambient glow */}
        <div 
          className={`absolute inset-2 rounded-full blur-md opacity-30 ${
            isHigh ? 'bg-emerald-400' : isMed ? 'bg-teal-400' : 'bg-amber-400'
          }`} 
        />

        <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox={`0 0 ${size} ${size}`}>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="opacity-70"
          />
          {/* Gradient Definition */}
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              {isHigh ? (
                <>
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#0D9488" />
                </>
              ) : isMed ? (
                <>
                  <stop offset="0%" stopColor="#1F4E5F" />
                  <stop offset="50%" stopColor="#2C6E8F" />
                  <stop offset="100%" stopColor="#0D9488" />
                </>
              ) : (
                <>
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#F4B942" />
                </>
              )}
            </linearGradient>
            <filter id={`glow-${gradId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor={isHigh ? "#10B981" : isMed ? "#2C6E8F" : "#F59E0B"} floodOpacity="0.45" />
            </filter>
          </defs>
          {/* Indicator */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradId})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            filter={`url(#glow-${gradId})`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center z-20">
          <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
            {percentage}%
          </span>
          <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
            Index
          </span>
        </div>
      </div>
      {(title || subtitle) && (
        <div className="mt-3 text-center">
          {title && <div className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">{title}</div>}
          {subtitle && <div className="text-[11px] text-slate-500 mt-0.5">{subtitle}</div>}
        </div>
      )}
    </div>
  );
};
