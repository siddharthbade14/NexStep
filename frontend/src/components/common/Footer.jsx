import React from 'react';
import { useStudent } from '../../context/StudentContext';
import { Compass, Sparkles, CheckCircle, MapPin, Heart } from 'lucide-react';

export const Footer = () => {
  const { setActiveTab } = useStudent();

  const handleNav = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-100/90 dark:bg-slate-950 text-slate-600 dark:text-slate-300 pt-16 pb-12 border-t border-slate-200 dark:border-slate-800/80 mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center p-1.5 shadow-sm">
                <img src="/logo.svg" alt="NexStep Logo" className="w-full h-full dark:invert dark:brightness-200" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Nex<span className="text-amber-500 dark:text-[#F4B942]">Step</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Empowering India’s 1.5M+ annual engineering students with real curriculum-to-career gap analysis, hands-on code verification, and direct placement roadmaps.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Semantic Mapping</span>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <button onClick={() => handleNav('landing')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer" data-cursor="pointer">
                  Product Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('onboarding')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer" data-cursor="pointer">
                  Student Onboarding
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gap-analysis')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer" data-cursor="pointer">
                  Semantic Gap Analysis
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('verification')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer" data-cursor="pointer">
                  Skill Verification IDE
                </button>
              </li>
            </ul>
          </div>

          {/* Career & Resources */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Guidance & Roadmaps
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <button onClick={() => handleNav('resources')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer" data-cursor="pointer">
                  Curated Free Resources
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('roadmap')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer" data-cursor="pointer">
                  Milestone Roadmap
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('opportunities')} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer" data-cursor="pointer">
                  Verified Internships Matcher
                </button>
              </li>
              <li>
                <span className="text-teal-600 dark:text-teal-400 font-medium">Vernacular Ready (Hindi/Tamil/Telugu)</span>
              </li>
            </ul>
          </div>

          {/* Social Impact & Standards */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Bharat Impact
            </h3>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-2 shadow-2xs">
              <p className="font-bold text-slate-900 dark:text-white">Tier 2 & 3 College Focus</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Bridging the syllabus gap between tier-2/3 state university curriculums and high-paying tech industry expectations.
              </p>
              <div className="text-[11px] text-teal-700 dark:text-teal-300 font-semibold flex items-center gap-1.5 pt-1">
                <CheckCircle className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                <span>Zero Hallucination Matching</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 NexStep Technologies. Built for Smart India Hackathon.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Indian College Students</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
