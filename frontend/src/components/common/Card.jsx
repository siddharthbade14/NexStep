import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = false,
  interactive = false,
  variant = 'default',
  onClick,
  ...props
}) => {
  const isHoverable = hover || interactive;
  const baseStyles = "relative rounded-2xl transition-all duration-300 ease-[var(--spring-smooth)]";

  const variantStyles = {
    default: "bg-white border-sharp",
    elevated: "bg-white border border-slate-200/90 shadow-brand ring-1 ring-slate-900/5",
    glass: "glass-card-premium",
    panel: "glass-panel",
    gradient: "bg-brand-gradient text-white shadow-brand border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]",
    accent: "bg-gradient-to-br from-amber-50/90 to-orange-50/70 border border-amber-300/80 shadow-xs",
    dark: "bg-brand-dark-gradient text-white shadow-xl border border-slate-700/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]",
    sheenTeal: "bg-white border-sharp card-sheen-teal shadow-brand",
    sheenAmber: "bg-white border-sharp card-sheen-amber shadow-xs"
  };

  const hoverStyles = isHoverable
    ? "hover:-translate-y-1.5 hover:shadow-xl hover:shadow-teal-950/10 hover:border-teal-500/45 cursor-pointer active:scale-[0.99] transition-transform"
    : "";

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
