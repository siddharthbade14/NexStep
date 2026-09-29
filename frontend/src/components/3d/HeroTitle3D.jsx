import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export const HeroTitle3D = () => {
  const { isDark } = useTheme();

  // Words in the first sentence
  const line1Words = ["College", "syllabus", "is", "only"];
  const line2Words = ["of", "the", "job."];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1
      }
    }
  };

  const letterVariants = {
    hidden: {
      opacity: 0,
      rotateX: -85,
      y: 25,
      z: -40
    },
    visible: {
      opacity: 1,
      rotateX: 0,
      y: 0,
      z: 0,
      transition: {
        type: 'spring',
        damping: 14,
        stiffness: 150
      }
    }
  };

  const textGradientClass = isDark
    ? "bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]"
    : "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-700 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]";

  return (
    <div className="relative select-none perspective-1000">
      <motion.h1 
        className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Line 1: College syllabus is only 30% of the job. */}
        <span className="inline-block mr-2">
          {line1Words.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block whitespace-nowrap mr-3.5">
              {word.split('').map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  variants={letterVariants}
                  className={`inline-block ${textGradientClass}`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </span>

        {/* The 30% with Animated Glowing Red Strikethrough */}
        <span className="relative inline-block mx-1.5 mr-3">
          <motion.span 
            variants={letterVariants}
            className="inline-block text-slate-400 dark:text-slate-400 font-extrabold"
          >
            30%
          </motion.span>

          {/* Glowing Red Strikethrough Path that draws itself on load */}
          <svg 
            className="absolute top-1/2 left-0 -translate-y-1/2 w-[115%] -ml-[7.5%] h-5 pointer-events-none overflow-visible"
            viewBox="0 0 100 20"
            fill="none"
          >
            <motion.path
              d="M 2 13 C 30 5, 70 17, 98 8"
              stroke="#F43F5E"
              strokeWidth="5.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                delay: 0.85,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1]
              }}
              style={{
                filter: 'drop-shadow(0 0 8px #f43f5e) drop-shadow(0 0 16px rgba(244, 63, 94, 0.8))'
              }}
            />
          </svg>
        </span>

        <span className="inline-block mr-2">
          {line2Words.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block whitespace-nowrap mr-3">
              {word.split('').map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  variants={letterVariants}
                  className={`inline-block ${textGradientClass}`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </span>

        {/* Line 2: NexStep verifies the other 70%. */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
          className={`block mt-2 bg-clip-text text-transparent ${
            isDark 
              ? 'bg-gradient-to-r from-[#2DD4BF] via-[#38BDF8] to-[#FBBF24] drop-shadow-[0_0_30px_rgba(45,212,191,0.45)]' 
              : 'bg-gradient-to-r from-[#0D9488] via-[#0284C7] to-[#D97706] drop-shadow-[0_2px_12px_rgba(13,148,136,0.25)]'
          }`}
        >
          NexStep verifies the other 70%.
        </motion.span>
      </motion.h1>
    </div>
  );
};
