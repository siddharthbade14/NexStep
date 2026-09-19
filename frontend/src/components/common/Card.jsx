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
    default: "bg-white border border-slate-200/90 shadow-xs",
    elevated: "bg-white border border-slate-200/80 shadow-brand",
    glass: "glass-card shadow-xs",
    panel: "glass-panel",
    gradient: "bg-brand-gradient text-white shadow-brand border border-white/15",
    accent: "bg-gradient-to-br from-amber-50/80 to-orange-50/80 border border-amber-200/90 shadow-xs",
    dark: "bg-brand-dark-gradient text-white shadow-xl border border-slate-800/80"
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
