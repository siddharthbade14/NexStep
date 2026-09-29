import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export const TactileButton3D = ({
  children,
  onClick,
  variant = 'primary', // 'primary', 'secondary', 'ghost'
  size = 'md',
  iconLeft: IconLeft,
  iconRight: IconRight,
  className = "",
  ...props
}) => {
  const buttonRef = useRef(null);

  const handleClick = (e) => {
    if (variant === 'primary') {
      // Trigger 3D particle burst (confetti / electric sparks)
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const originX = (rect.left + rect.width / 2) / window.innerWidth;
        const originY = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
          particleCount: 55,
          spread: 70,
          origin: { x: originX, y: originY },
          colors: ['#2DD4BF', '#FBBF24', '#A855F7', '#38BDF8'],
          ticks: 200,
          gravity: 1.2,
          scalar: 0.9
        });
      }
    }
    if (onClick) onClick(e);
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  }[size] || 'px-6 py-3 text-sm';

  if (variant === 'primary') {
    return (
      <motion.button
        ref={buttonRef}
        onClick={handleClick}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97, y: 1 }}
        className={`relative inline-flex items-center justify-center gap-2.5 rounded-2xl font-black text-slate-950 overflow-hidden cursor-pointer shadow-[0_10px_30px_rgba(251,191,36,0.35)] hover:shadow-[0_15px_40px_rgba(45,212,191,0.5)] transition-shadow duration-300 border border-amber-300/80 ${sizeClasses} ${className}`}
        style={{
          background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #2DD4BF 100%)'
        }}
        data-cursor="pointer"
        {...props}
      >
        {/* Continuous Shimmering Highlight Sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            x: ['-120%', '150%']
          }}
          transition={{
            repeat: Infinity,
            duration: 2.8,
            ease: 'linear'
          }}
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
            transform: 'skewX(-20deg)',
            width: '60%'
          }}
        />

        {/* 1px Inner Tactile Rim */}
        <div className="absolute inset-0 rounded-2xl border-t border-white/70 pointer-events-none" />

        {IconLeft && <IconLeft className="w-4 h-4 shrink-0" />}
        <span className="relative z-10 tracking-tight">{children}</span>
        {IconRight && <IconRight className="w-4 h-4 shrink-0" />}
      </motion.button>
    );
  }

  // Secondary Glassmorphic Button
  return (
    <motion.button
      ref={buttonRef}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`relative inline-flex items-center justify-center gap-2 rounded-2xl font-bold text-slate-800 dark:text-white bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-300 dark:border-white/15 hover:border-teal-500 dark:hover:border-teal-400/80 hover:shadow-[0_4px_20px_rgba(45,212,191,0.25)] transition-all duration-300 cursor-pointer shadow-xs ${sizeClasses} ${className}`}
      data-cursor="pointer"
      {...props}
    >
      {IconLeft && <IconLeft className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />}
      <span className="tracking-tight">{children}</span>
      {IconRight && <IconRight className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />}
    </motion.button>
  );
};
