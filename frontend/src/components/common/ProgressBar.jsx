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

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1F4E5F" />
              <stop offset="100%" stopColor="#2C6E8F" />
            </linearGradient>
          </defs>
          {/* Indicator */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#circleGrad)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold text-slate-900 leading-none">
            {percentage}%
          </span>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 uppercase tracking-wider">
            Ready
          </span>
        </div>
      </div>
      {(title || subtitle) && (
        <div className="mt-2 text-center">
          {title && <div className="text-sm font-semibold text-slate-800">{title}</div>}
          {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
        </div>
      )}
    </div>
  );
};
