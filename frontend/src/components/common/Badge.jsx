import React from 'react';
import { CheckCircle2, Clock, Lock, Sparkles, AlertCircle } from 'lucide-react';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon = true,
  className = ''
}) => {
  const sizeStyles = {
    sm: "text-xs px-2.5 py-0.5 font-semibold gap-1 tracking-tight",
    md: "text-xs px-3 py-1 font-bold gap-1.5 tracking-tight"
  };

  const variantStyles = {
    verified: "bg-teal-50/90 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-300/80 dark:border-teal-500/40 shadow-xs shadow-teal-500/10",
    in_progress: "bg-amber-50/90 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300/90 dark:border-amber-500/40 shadow-xs shadow-amber-500/15",
    locked: "bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200/90 dark:border-slate-700/80",
    gap: "bg-rose-50/90 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300/80 dark:border-rose-500/40 shadow-xs shadow-rose-500/10",
    covered: "bg-sky-50/90 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-300/80 dark:border-sky-500/40 shadow-xs shadow-sky-500/10",
    primary: "bg-[#1F4E5F]/12 dark:bg-teal-950/60 text-[#1F4E5F] dark:text-teal-300 border border-[#1F4E5F]/25 dark:border-teal-500/30 font-bold",
    accent: "bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-950/80 dark:to-amber-900/60 text-amber-950 dark:text-amber-300 border border-amber-400/50 dark:border-amber-500/50 shadow-xs shadow-amber-500/20 font-bold",
    neutral: "bg-slate-100/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80"
  };

  const renderIcon = () => {
    if (!icon) return null;
    switch (variant) {
      case 'verified':
        return <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />;
      case 'in_progress':
        return <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse shrink-0" />;
      case 'locked':
        return <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />;
      case 'accent':
        return <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
      case 'gap':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full transition-all duration-200 hover:scale-[1.03] cursor-default select-none whitespace-nowrap shrink-0 ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {renderIcon()}
      <span className="whitespace-nowrap">{children}</span>
    </span>
  );
};
