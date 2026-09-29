import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring physics for fluid movement
  const springConfig = { damping: 24, stiffness: 260, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Secondary delayed trail
  const trailConfig = { damping: 30, stiffness: 180, mass: 0.8 };
  const trailX = useSpring(mouseX, trailConfig);
  const trailY = useSpring(mouseY, trailConfig);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check if hovering over clickable element
      const target = e.target;
      const clickable = target.closest('button, a, select, input, [role="button"], [data-cursor="pointer"], .cursor-pointer');
      setIsPointer(!!clickable);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Fading Glow Trail */}
      <motion.div
        className="absolute -top-6 -left-6 w-12 h-12 rounded-full pointer-events-none"
        style={{
          x: trailX,
          y: trailY,
          background: isPointer
            ? 'radial-gradient(circle, rgba(45, 212, 191, 0.4) 0%, rgba(168, 85, 247, 0.2) 60%, transparent 80%)'
            : 'radial-gradient(circle, rgba(45, 212, 191, 0.25) 0%, rgba(251, 191, 36, 0.15) 50%, transparent 75%)',
          filter: 'blur(6px)',
          scale: isClicking ? 0.7 : isPointer ? 1.8 : 1.2,
          transition: 'scale 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />

      {/* Main Responsive Cursor Ring / Orb */}
      <motion.div
        className="absolute -top-3 -left-3 rounded-full pointer-events-none flex items-center justify-center"
        style={{
          x: smoothX,
          y: smoothY,
          width: isPointer ? 32 : 14,
          height: isPointer ? 32 : 14,
          backgroundColor: isPointer ? 'transparent' : 'rgba(45, 212, 191, 0.95)',
          border: isPointer ? '2px solid rgba(45, 212, 191, 0.85)' : 'none',
          boxShadow: isPointer
            ? '0 0 16px rgba(45, 212, 191, 0.8), inset 0 0 10px rgba(168, 85, 247, 0.5)'
            : '0 0 12px rgba(45, 212, 191, 0.9)',
          scale: isClicking ? 0.8 : 1,
          transition: 'width 0.2s ease, height 0.2s ease, background-color 0.2s ease, border 0.2s ease, box-shadow 0.2s ease'
        }}
      >
        {isPointer && (
          <div className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-ping" />
        )}
      </motion.div>
    </div>
  );
};
