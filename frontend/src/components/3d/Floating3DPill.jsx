import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const Floating3DPill = ({
  icon: Icon,
  title,
  subtitle,
  badgeText,
  variant = 'emerald', // 'emerald', 'amber', 'teal', 'amethyst'
  className = "",
  initialY = 0,
  idleDelay = 0,
  parallaxSpeed = 1
}) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const mouseXSpring = useSpring(x, { stiffness: 350, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 350, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['14deg', '-14deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-16deg', '16deg']);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / rect.width) - 0.5;
    const yPct = (mouseY / rect.height) - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Color theme palettes for dark glassmorphism
  const variants = {
    emerald: {
      border: 'border-emerald-500/40 hover:border-emerald-400',
      glow: 'shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.45)]',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]',
      badgeBg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
      dot: 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
    },
    amber: {
      border: 'border-amber-500/40 hover:border-amber-400',
      glow: 'shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:shadow-[0_0_35px_rgba(245,158,11,0.45)]',
      iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]',
      badgeBg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
      dot: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
    },
    teal: {
      border: 'border-cyan-500/40 hover:border-cyan-400',
      glow: 'shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.45)]',
      iconBg: 'bg-gradient-to-br from-cyan-500 to-teal-600 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)]',
      badgeBg: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300',
      dot: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
    },
    amethyst: {
      border: 'border-purple-500/40 hover:border-purple-400',
      glow: 'shadow-[0_0_25px_rgba(168,85,247,0.25)] hover:shadow-[0_0_35px_rgba(168,85,247,0.45)]',
      iconBg: 'bg-gradient-to-br from-purple-500 via-indigo-600 to-violet-700 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]',
      badgeBg: 'bg-purple-500/15 border-purple-500/40 text-purple-300',
      dot: 'bg-purple-400 shadow-[0_0_8px_#c084fc]'
    }
  };

  const currentTheme = variants[variant] || variants.emerald;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        y: [0, -10 * parallaxSpeed, 0],
        rotateZ: [0, 0.8 * parallaxSpeed, -0.8 * parallaxSpeed, 0]
      }}
      transition={{
        duration: 5.5 + idleDelay * 0.8,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
        delay: idleDelay
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      className={`group select-none cursor-pointer relative z-20 ${className}`}
      data-cursor="pointer"
    >
      {/* 3D Glass Pill Container */}
      <div 
        className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/80 backdrop-blur-xl border ${currentTheme.border} ${currentTheme.glow} transition-all duration-300 overflow-hidden`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Dynamic Specular Glossy Glare Sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 120px at ${glareX} ${glareY}, rgba(255, 255, 255, 0.28), transparent 70%)`
          }}
        />

        {/* 1px Edge Specular Highlight Line */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none border border-white/10" />

        {/* 3D Icon Block */}
        <div 
          className={`w-9 h-9 rounded-xl ${currentTheme.iconBg} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}
          style={{ transform: 'translateZ(25px)' }}
        >
          {Icon && <Icon className="w-4.5 h-4.5" />}
        </div>

        {/* Content Info */}
        <div className="text-left leading-tight pr-1" style={{ transform: 'translateZ(20px)' }}>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-white text-xs tracking-tight">
              {title}
            </span>
            <span className={`w-2 h-2 rounded-full ${currentTheme.dot} animate-pulse shrink-0`} />
          </div>
          
          <div className="flex items-center gap-1 mt-1">
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${currentTheme.badgeBg} inline-block`}>
              {badgeText}
            </span>
            {subtitle && (
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                {subtitle}
              </span>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};
