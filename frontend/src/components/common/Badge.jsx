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
    verified: "bg-teal-50/90 text-teal-800 border border-teal-300/80 shadow-xs shadow-teal-500/10",
    in_progress: "bg-amber-50/90 text-amber-900 border border-amber-300/90 shadow-xs shadow-amber-500/15",
    locked: "bg-slate-100 text-slate-500 border border-slate-200/90",
    gap: "bg-rose-50/90 text-rose-800 border border-rose-300/80 shadow-xs shadow-rose-500/10",
    covered: "bg-sky-50/90 text-sky-800 border border-sky-300/80 shadow-xs shadow-sky-500/10",
    primary: "bg-[#1F4E5F]/12 text-[#1F4E5F] border border-[#1F4E5F]/25 font-bold",
    accent: "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-950 border border-amber-400/50 shadow-xs shadow-amber-500/20 font-bold",
    neutral: "bg-slate-100/90 text-slate-700 border border-slate-200"
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
