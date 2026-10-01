import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStudent } from '../../context/StudentContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Compass, 
  Layers, 
  CheckCircle, 
  CheckCircle2,
  BookOpen, 
  MapPin, 
  Briefcase, 
  RotateCcw, 
  Menu, 
  X,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Code2,
  Cpu,
  ArrowRight,
  Activity,
  Award,
  LogIn,
  Building2,
  UserCheck,
  Users
} from 'lucide-react';
import { Badge } from './Badge';
import { Modal } from './Modal';
import { Button } from './Button';
import { AuthModal } from './AuthModal';
import { ThemeToggle } from './ThemeToggle';

const SKILL_NAMES = {
  'skill-git': 'Git & Version Control',
  'skill-dsa': 'Data Structures & Algorithms',
  'skill-rest-apis': 'RESTful APIs & Backend',
  'skill-docker': 'Docker & Containers',
  'skill-react': 'React & Frontend State',
  'skill-sql-adv': 'Advanced SQL & Database Tuning',
  'skill-sys-design': 'System Design & Scalability',
  'skill-cicd': 'CI/CD & DevOps Automation',
  'skill-sql-da': 'SQL for Data Analytics',
  'skill-pandas': 'Pandas & Data Wrangling',
  'skill-bi-dashboards': 'PowerBI & Dashboards',
  'skill-stats': 'Applied Statistics & Probability',
  'skill-eda': 'Exploratory Data Analysis',
  'skill-business-metrics': 'Business KPIs & Metrics',
  'skill-embedded-c': 'Embedded C & Microcontrollers',
  'skill-protocols': 'UART, SPI & I2C Protocols',
  'skill-arm-cortex': 'ARM Cortex Architecture',
  'skill-rtos': 'FreeRTOS & Concurrency',
  'skill-hw-debug': 'Hardware Debugging & Logic Analyzers',
  'skill-pcb-basics': 'PCB Layout & Schematics'
};

const formatSkillName = (skillId) => {
  if (!skillId) return '';
  if (SKILL_NAMES[skillId]) return SKILL_NAMES[skillId];
  return skillId
    .replace(/^skill-/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export const Navbar = () => {
  const { student, currentUser, currentRole, activeTab, setActiveTab, resetStudentState } = useStudent();
  const { isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const getNavItems = () => {
    if (currentRole === 'college_tpo') {
      return [
        { id: 'tpo-dashboard', label: 'TPO Analytics', icon: Building2, tag: 'Institutional', highlight: true },
        { id: 'gap-analysis', label: 'Curriculum Gap Engine', icon: Sparkles, tag: 'AI Core' },
        { id: 'resources', label: 'Curriculum Resources', icon: BookOpen, tag: 'AICTE' },
        { id: 'opportunities', label: 'Hiring Partners', icon: Briefcase, tag: 'Recruiters' },
        { id: 'landing', label: 'Home Page', icon: Compass, tag: null }
      ];
    }
    if (currentRole === 'recruiter') {
      return [
        { id: 'recruiter-portal', label: 'Recruiter Hub', icon: Briefcase, tag: 'Talent Pool', highlight: true },
        { id: 'opportunities', label: 'Active Openings', icon: Layers, tag: 'Hiring' },
        { id: 'verification', label: 'Code Proof Benchmarks', icon: CheckCircle, tag: 'Sandbox' },
        { id: 'landing', label: 'Home Page', icon: Compass, tag: null }
      ];
    }
    // Default student
    return [
      { id: 'landing', label: 'Home', icon: Compass, tag: null },
      { id: 'gap-analysis', label: 'Gap Analysis', icon: Sparkles, tag: 'AI Core' },
      { id: 'verification', label: 'Verify Skills', icon: CheckCircle, badgeCount: student.verified_skills?.length || 0 },
      { id: 'resources', label: 'Learning Hub', icon: BookOpen, tag: 'Courses' },
      { id: 'roadmap', label: 'Milestone Roadmap', icon: MapPin, tag: 'Path' },
      { id: 'opportunities', label: 'Internships & Jobs', icon: Briefcase, tag: 'Verified' },
      { id: 'onboarding', label: 'Edit Profile', icon: Layers, tag: 'Setup' }
    ];
  };

  const navItems = getNavItems();

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isTpo = currentRole === 'college_tpo';
  const isRecruiter = currentRole === 'recruiter';

  const roleLabel = isTpo ? '🏛️ College TPO' : isRecruiter ? '🏢 Tech Recruiter' : '🎓 Student';
  const userName = currentUser?.full_name || student?.name || 'Aarav Sharma';
  const userSubtext = isTpo 
    ? (currentUser?.college || 'DTU')
    : isRecruiter 
    ? (currentUser?.company_name || 'Swiggy')
    : (student?.dream_role || 'Software Developer');

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full text-slate-800 dark:text-slate-100 relative">
      
      {/* 1. BRAND HEADER */}
      <div className="p-4 sm:p-5 pb-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-3 cursor-pointer group"
          data-cursor="pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-indigo-600 flex items-center justify-center p-2 shadow-[0_0_20px_rgba(45,212,191,0.35)] group-hover:scale-105 transition-transform duration-200 border border-white/20">
            <img src="/logo.svg" alt="NexStep Logo" className="w-full h-full dark:invert dark:brightness-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Nex<span className="text-amber-500 dark:text-[#FBBF24]">Step</span>
              </span>
              <span className="text-[9px] font-extrabold uppercase bg-teal-500/15 text-teal-700 dark:text-teal-300 px-1.5 py-0.5 rounded border border-teal-500/30 tracking-wider">
                AI-Powered
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Verified Career Engine
            </p>
          </div>
        </div>

        {/* Compact Theme Switcher Button in Header */}
        <ThemeToggle variant="compact" />
      </div>

      {/* 2. USER CREDENTIAL & ACTIVE ROLE CARD */}
      <div className="p-4 pb-3">
        <div 
          onClick={() => setAuthModalOpen(true)}
          className="p-3.5 rounded-2xl bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-teal-500/50 hover:bg-slate-200/50 dark:hover:bg-white/10 hover:shadow-[0_0_25px_rgba(45,212,191,0.2)] cursor-pointer transition-all duration-300 group relative overflow-hidden"
          title="Click to Switch Role or View Profile"
          data-cursor="pointer"
        >
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 via-purple-500/20 to-indigo-500/20 text-teal-600 dark:text-teal-300 font-black text-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-teal-400/40 shadow-sm">
              {currentUser?.avatar || userName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {userName}
                </span>
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                {userSubtext}
              </p>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[10px] relative z-10">
            <span className="text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1">
              {roleLabel}
            </span>
            <span className="font-extrabold text-amber-700 dark:text-[#FBBF24] bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
              Switch Role ▾
            </span>
          </div>
        </div>
      </div>

      {/* 3. VERTICAL NAVIGATION LINKS WITH PHYSICAL SLIDING LAYOUT-ID PILL */}
      <div className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto sidebar-scroll">
        <div className="px-3 pb-1 pt-1 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 font-mono">
            {isTpo ? 'TPO Institutional' : isRecruiter ? 'Recruiter Pipeline' : 'Navigation Hub'}
          </span>
          <span className="text-[9px] font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/80 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-800">
            Verified
          </span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div key={item.id} className="relative">
              {/* Framer Motion Physical Sliding Pill on Y-Axis */}
              {isActive && (
                <motion.div
                  layoutId="activeNavPill"
                  className={`absolute inset-0 rounded-xl pointer-events-none ${
                    isDark
                      ? 'bg-gradient-to-r from-teal-500/20 via-cyan-500/15 to-purple-500/20 border border-teal-400/50 shadow-[0_0_20px_rgba(45,212,191,0.25)]'
                      : 'bg-teal-50/90 border border-teal-300 shadow-sm'
                  }`}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              <button
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full group relative z-10 flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-teal-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5'
                }`}
                data-cursor="pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                    isActive 
                      ? 'bg-teal-500/20 text-teal-600 dark:text-[#2DD4BF] border border-teal-400/40 shadow-xs' 
                      : item.highlight 
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30' 
                        : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.tag && !isActive && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                      item.highlight 
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' 
                        : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10'
                    }`}>
                      {item.tag}
                    </span>
                  )}
                  {item.badgeCount !== undefined && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isActive 
                        ? 'bg-amber-400 dark:bg-[#FBBF24] text-slate-950 font-black border-amber-400 shadow-xs' 
                        : 'bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                    }`}>
                      {item.badgeCount}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-teal-600 dark:text-teal-300" />
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* 4. SIDEBAR FOOTER: 3D PULSING AI INFERENCE STATUS & UTILITY CONTROLS */}
      <div className="p-3 border-t border-slate-200 dark:border-white/10 space-y-2 bg-slate-50/90 dark:bg-slate-950/80">
        
        {/* Real-time AI Inference Engine Online Pill with 3D Pulsing Dot */}
        <div className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              AI Inference Engine
            </span>
            
            {/* 3D Pulsing Dot with expanding concentric waves */}
            <span className="flex items-center gap-1.5 text-teal-700 dark:text-teal-300 font-mono font-bold bg-teal-50 dark:bg-teal-950/90 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-500/40">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500 shadow-[0_0_10px_#2dd4bf]"></span>
              </span>
              Online
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-mono text-[9px]">
            <span>MiniLM-L6-v2</span>
            <span className="text-teal-600 dark:text-teal-400 font-bold">1.2ms Latency</span>
          </div>
        </div>

        {/* Quick Multi-Role / Login Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition-all border border-slate-200 dark:border-white/10 cursor-pointer shadow-2xs"
            title="Switch Persona or Login"
            data-cursor="pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Switch Role</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset student profile & verified credentials back to initial DTU state?')) {
                resetStudentState();
              }
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors border border-slate-200 dark:border-white/10 cursor-pointer"
            title="Reset demo data"
            data-cursor="pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* DESKTOP VERTICAL FLOATING FROSTED GLASS SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-68 xl:w-72 h-screen sticky top-0 bg-white/80 dark:bg-slate-950/60 backdrop-blur-2xl border-r border-slate-200 dark:border-white/10 z-30 shrink-0 select-none overflow-hidden shadow-2xl transition-colors duration-300">
        {renderSidebarContent()}
      </aside>

      {/* MOBILE / TABLET TOP BAR */}
      <div className="lg:hidden sticky top-0 z-40 w-full h-15 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 px-4 flex items-center justify-between shadow-sm transition-colors duration-300">
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-2 cursor-pointer"
          data-cursor="pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center p-1.5 border border-white/20 shadow-xs">
            <img src="/logo.svg" alt="NexStep Logo" className="w-full h-full dark:invert dark:brightness-200" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
            Nex<span className="text-amber-500 dark:text-[#FBBF24]">Step</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile Theme Switcher */}
          <ThemeToggle variant="compact" />

          <button 
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-[#FBBF24] text-slate-950 text-xs font-bold border border-amber-300 shadow-xs cursor-pointer"
            data-cursor="pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Role</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl cursor-pointer"
            aria-label="Toggle Menu"
            data-cursor="pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-slate-950 shadow-2xl z-10 flex flex-col border-r border-slate-200 dark:border-white/10">
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* AUTH & MULTI-ROLE SWITCHER MODAL */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;
