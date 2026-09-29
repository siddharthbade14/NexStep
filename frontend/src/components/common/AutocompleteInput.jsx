import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Check, X, ChevronDown } from 'lucide-react';

/**
 * Highlights the matching query substring inside a text string.
 */
export const HighlightText = ({ text = '', query = '' }) => {
  if (!query.trim() || !text) return <span>{text}</span>;

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span
            key={i}
            className="font-black text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-0.5 rounded underline decoration-teal-400 decoration-2"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export const AutocompleteInput = ({
  label,
  value = '',
  onChange,
  onSelect,
  options = [],
  placeholder = 'Start typing to search...',
  icon: Icon = Search,
  filterKey = 'name',
  subTextKey = null,
  badgeKey = null,
  className = '',
  helperText = '',
  allowCustom = true,
  maxSuggestions = 8
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on typed value
  const query = (value || '').toLowerCase().trim();
  const filteredOptions = query
    ? options
        .filter((item) => {
          const itemText = typeof item === 'string' ? item : item[filterKey] || '';
          const subText = typeof item === 'object' && subTextKey ? item[subTextKey] || '' : '';
          return (
            itemText.toLowerCase().includes(query) ||
            subText.toLowerCase().includes(query)
          );
        })
        .slice(0, maxSuggestions)
    : options.slice(0, maxSuggestions);

  const handleSelectOption = (item) => {
    const itemValue = typeof item === 'string' ? item : item[filterKey];
    if (onChange) onChange(itemValue);
    if (onSelect) onSelect(item);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        handleSelectOption(filteredOptions[highlightedIndex]);
      } else if (allowCustom && query) {
        if (onChange) onChange(value);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>{label}</span>
          {isOpen && (
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono font-medium lowercase">
              {filteredOptions.length} suggestions
            </span>
          )}
        </label>
      )}

      {/* Input container */}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            if (onChange) onChange(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full ${
            Icon ? 'pl-10' : 'pl-4'
          } pr-10 py-3 rounded-2xl border text-sm transition-all duration-200 outline-none ${
            isOpen
              ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
              : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50/70 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100'
          }`}
          data-cursor="pointer"
        />

        {/* Clear or Dropdown Chevron Button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={() => {
                if (onChange) onChange('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
              title="Clear text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {helperText && !isOpen && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          {helperText}
        </p>
      )}

      {/* Floating Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-white/15 shadow-2xl max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item, idx) => {
                const itemText = typeof item === 'string' ? item : item[filterKey];
                const subText =
                  typeof item === 'object' && subTextKey
                    ? item[subTextKey] || (item.city ? `${item.city}, ${item.state || ''}` : '')
                    : '';
                const badge = typeof item === 'object' && badgeKey ? item[badgeKey] : item?.tier || item?.badge;
                const isSelected = value.toLowerCase() === itemText.toLowerCase();
                const isHighlighted = idx === highlightedIndex;

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => handleSelectOption(item)}
                    className={`px-4 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors duration-150 ${
                      isHighlighted
                        ? 'bg-teal-50/80 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100'
                        : isSelected
                        ? 'bg-slate-100/80 dark:bg-white/10 text-slate-900 dark:text-white font-bold'
                        : 'text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                    data-cursor="pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-semibold truncate leading-tight">
                        <HighlightText text={itemText} query={query} />
                      </div>
                      {subText && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          <HighlightText text={subText} query={query} />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {badge && (
                        <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                          {badge}
                        </span>
                      )}
                      {isSelected && (
                        <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      )}
                    </div>
                  </div>
                );
              })
            ) : allowCustom && query ? (
              <div
                onClick={() => {
                  if (onChange) onChange(value);
                  setIsOpen(false);
                }}
                className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 cursor-pointer flex items-center gap-2"
                data-cursor="pointer"
              >
                <span className="text-teal-600 dark:text-teal-400 font-bold">+ Use custom:</span>
                <span className="font-bold underline">"{value}"</span>
              </div>
            ) : (
              <div className="px-4 py-4 text-center text-xs text-slate-400">
                No matching results found.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
