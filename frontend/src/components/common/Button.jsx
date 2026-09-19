import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  iconLeft: IconLeft,
  iconRight: IconRight,
  ...props
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.97] hover:-translate-y-0.5 active:translate-y-0";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 min-h-[36px] gap-1.5 shadow-2xs",
    md: "text-sm px-5 py-2.5 min-h-[44px] gap-2 shadow-xs",
    lg: "text-base px-6 py-3 min-h-[50px] gap-2.5 font-semibold shadow-md"
  };

  const variantStyles = {
    primary: "bg-brand-gradient text-white shadow-brand hover:shadow-lg hover:shadow-teal-900/25 hover:brightness-105 focus:ring-[#1F4E5F] border border-teal-500/30",
    accent: "bg-accent-gradient text-slate-950 shadow-accent hover:shadow-xl hover:shadow-amber-500/25 hover:brightness-105 focus:ring-[#F4B942] font-semibold border border-amber-300/60",
    secondary: "bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm focus:ring-slate-400",
    outline: "bg-transparent text-[#1F4E5F] border-2 border-[#1F4E5F]/90 hover:bg-[#1F4E5F]/8 hover:border-[#1F4E5F] focus:ring-[#1F4E5F]",
    ghost: "bg-transparent text-slate-600 hover:text-slate-950 hover:bg-slate-100/90 focus:ring-slate-300",
    danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm hover:shadow-rose-600/30"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {IconLeft && <IconLeft className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} shrink-0 transition-transform group-hover:-translate-x-0.5`} />}
          <span>{children}</span>
          {IconRight && <IconRight className={`${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} shrink-0 transition-transform group-hover:translate-x-0.5`} />}
        </>
      )}
    </button>
  );
};
