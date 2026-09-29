import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle = ({ 
  className = "", 
  showLabel = false,
  variant = "pill" // "pill", "icon", "compact"
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  if (variant === "compact" || variant === "icon") {
    return (
      <motion.button
        type="button"
        onClick={toggleTheme}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className={`relative p-2 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center ${
          isDark
            ? 'bg-slate-900/90 text-amber-300 hover:text-amber-200 border border-amber-500/30 hover:border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
            : 'bg-white/90 text-indigo-600 hover:text-indigo-700 border border-slate-200 shadow-sm hover:border-indigo-300'
        } ${className}`}
        aria-label={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
        title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
        data-cursor="pointer"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={theme}
            initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {isDark ? (
              <Sun className="w-4 h-4 fill-amber-300/20" />
            ) : (
              <Moon className="w-4 h-4 fill-indigo-600/20" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    );
  }

  // Pill variant with smooth toggle track and optional label
  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all duration-300 cursor-pointer select-none ${
        isDark
          ? 'bg-slate-900/80 hover:bg-slate-900 text-slate-200 border border-white/10 hover:border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
          : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 hover:border-indigo-400/60 shadow-xs'
      } ${className}`}
      aria-label={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      data-cursor="pointer"
    >
      {/* Sliding indicator track */}
      <div className={`relative w-9 h-5 rounded-full p-0.5 transition-colors duration-300 flex items-center ${
        isDark ? 'bg-amber-500/20 border border-amber-400/40' : 'bg-indigo-100 border border-indigo-300'
      }`}>
        <motion.div
          animate={{ x: isDark ? 16 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`w-4 h-4 rounded-full flex items-center justify-center shadow-sm ${
            isDark 
              ? 'bg-gradient-to-tr from-amber-400 to-[#FBBF24] text-slate-950 shadow-[0_0_8px_#fbbf24]' 
              : 'bg-indigo-600 text-white shadow-[0_0_8px_rgba(79,70,229,0.5)]'
          }`}
        >
          {isDark ? (
            <Sun className="w-2.5 h-2.5" />
          ) : (
            <Moon className="w-2.5 h-2.5" />
          )}
        </motion.div>
      </div>

      {showLabel && (
        <span className="text-xs font-bold font-mono tracking-tight">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </motion.button>
  );
};
