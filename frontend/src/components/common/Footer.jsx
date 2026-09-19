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
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center p-1.5">
                <img src="/logo.svg" alt="NexStep Logo" className="w-full h-full" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Nex<span className="text-[#F4B942]">Step</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering India’s 1.5M+ annual engineering students with real curriculum-to-career gap analysis, hands-on code verification, and direct placement roadmaps.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Semantic Mapping</span>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleNav('landing')} className="hover:text-white transition-colors">
                  Product Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('onboarding')} className="hover:text-white transition-colors">
                  Student Onboarding
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gap-analysis')} className="hover:text-white transition-colors">
                  Semantic Gap Analysis
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('verification')} className="hover:text-white transition-colors">
                  Skill Verification IDE
                </button>
              </li>
            </ul>
          </div>

          {/* Career & Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Guidance & Roadmaps
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => handleNav('resources')} className="hover:text-white transition-colors">
                  Curated Free Resources
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('roadmap')} className="hover:text-white transition-colors">
                  Milestone Roadmap
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('opportunities')} className="hover:text-white transition-colors">
                  Verified Internships Matcher
                </button>
              </li>
              <li>
                <span className="text-teal-400 font-medium">Vernacular Ready (Hindi/Tamil/Telugu)</span>
              </li>
            </ul>
          </div>

          {/* Social Impact & Standards */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Bharat Impact
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 space-y-2">
              <p className="font-semibold text-white">Tier 2 & 3 College Focus</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Bridging the syllabus gap between tier-2/3 state university curriculums and high-paying tech industry expectations.
              </p>
              <div className="text-[11px] text-teal-300 font-semibold flex items-center gap-1.5 pt-1">
                <CheckCircle className="w-3 h-3 text-teal-400" />
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
