import React, { useState } from 'react';
import { useStudent } from '../../context/StudentContext';
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
  Award
} from 'lucide-react';
import { Badge } from './Badge';
import { Modal } from './Modal';
import { Button } from './Button';

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
  const { student, activeTab, setActiveTab, resetStudentState } = useStudent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Compass, tag: null },
    { id: 'onboarding', label: 'Onboarding', icon: Layers, tag: 'Setup' },
    { id: 'gap-analysis', label: 'Gap Analysis', icon: Sparkles, tag: 'AI Core', highlight: true },
    { id: 'verification', label: 'Verify Skills', icon: CheckCircle, badgeCount: student.verified_skills?.length || 0 },
    { id: 'resources', label: 'Resources', icon: BookOpen, tag: 'Guides' },
    { id: 'roadmap', label: 'Milestone Roadmap', icon: MapPin, tag: 'Path' },
    { id: 'opportunities', label: 'Internships', icon: Briefcase, tag: '12 Live', badgeColor: 'bg-amber-100 text-amber-800' }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const verifiedCount = student.verified_skills?.length || 0;

  // Render the core sidebar navigation content (shared between desktop sidebar and mobile drawer)
  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-white text-slate-800">
      
      {/* 1. BRAND HEADER */}
      <div className="p-5 pb-4 border-b border-slate-100/90 flex items-center justify-between">
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center p-2 shadow-xs group-hover:scale-105 transition-transform duration-200">
            <img src="/logo.svg" alt="NexStep Logo" className="w-full h-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-[#1F4E5F]">
                Nex<span className="text-[#F4B942]">Step</span>
              </span>
              <span className="text-[9px] font-extrabold uppercase bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded border border-teal-200/60 tracking-wider">
                AI v2.4
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium -mt-0.5">
              Career Engine for Bharat
            </p>
          </div>
        </div>
      </div>

      {/* 2. STUDENT CREDENTIAL PASSPORT CARD */}
      <div className="p-4 pb-3">
        <div 
          onClick={() => setProfileModalOpen(true)}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-teal-50/50 border-sharp-teal hover:border-teal-400 hover:shadow-md cursor-pointer transition-all duration-200 group"
          title="Click to view Student Skill Passport"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600/15 to-teal-800/10 text-teal-900 font-black text-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-teal-200/80 shadow-2xs">
              {student?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {student?.name || 'Aarav Sharma'}
                </span>
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                {student?.dream_role || 'Software Developer'}
              </p>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Passport Status
            </span>
            <span className="font-black text-emerald-700 bg-emerald-50/90 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
              {verifiedCount} Verified
            </span>
          </div>
        </div>
      </div>

      {/* 3. VERTICAL NAVIGATION LINKS */}
      <div className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto sidebar-scroll">
        <div className="px-3 pb-1 pt-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Navigation Menu
          </span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#1F4E5F] to-[#2C6E8F] text-white shadow-brand border-l-4 border-[#F4B942] pl-2.5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 hover:border-slate-200/90 border border-transparent hover:translate-x-1'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                  isActive 
                    ? 'bg-white/15 text-[#F4B942] border border-white/20' 
                    : item.highlight 
                      ? 'bg-amber-50 text-amber-600 border border-amber-200/80' 
                      : 'bg-slate-100 text-slate-500 border border-slate-200/60'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {item.tag && !isActive && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                    item.badgeColor 
                      ? 'bg-amber-50 text-amber-800 border-amber-200/80' 
                      : item.highlight 
                        ? 'bg-amber-100 text-amber-800 border-amber-300' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {item.tag}
                  </span>
                )}
                {item.badgeCount !== undefined && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isActive 
                      ? 'bg-[#F4B942] text-slate-950 font-black border-amber-400' 
                      : 'bg-teal-50 text-teal-800 border-teal-200'
                  }`}>
                    {item.badgeCount}
                  </span>
                )}
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-teal-200" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. SIDEBAR FOOTER: TELEMETRY & CONTROLS */}
      <div className="p-3 border-t border-slate-200/80 space-y-2 bg-slate-50/70">
        {/* Real-time AI Telemetry Pill */}
        <div className="p-3 rounded-2xl bg-white border-sharp text-[10px] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-black text-slate-800 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-teal-600" />
              AI Inference Engine
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-500 font-medium">
            <span className="font-mono text-[9px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">all-MiniLM-L6-v2</span>
            <span className="text-teal-700 font-semibold">22ms latency</span>
          </div>
        </div>

        {/* Demo Reset Button */}
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset student profile & verified credentials back to initial DTU state?')) {
              resetStudentState();
            }
          }}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-dashed border-slate-300 hover:border-rose-300"
          title="Reset demo data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Profile</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* ========================================================================= */}
      {/* DESKTOP VERTICAL SIDEBAR (Persistent Left-Docked on lg: and above)         */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex flex-col w-68 xl:w-72 h-screen sticky top-0 bg-white sidebar-border-right z-30 shrink-0 select-none overflow-hidden">
        {renderSidebarContent()}
      </aside>

      {/* ========================================================================= */}
      {/* MOBILE / TABLET TOP BAR (< lg)                                            */}
      {/* ========================================================================= */}
      <div className="lg:hidden sticky top-0 z-40 w-full h-15 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 flex items-center justify-between shadow-xs">
        
        {/* Brand */}
        <div 
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center p-1.5">
            <img src="/logo.svg" alt="NexStep Logo" className="w-full h-full" />
          </div>
          <span className="text-lg font-black tracking-tight text-[#1F4E5F]">
            Nex<span className="text-[#F4B942]">Step</span>
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setProfileModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200/60"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-bold">{verifiedCount} Verified</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE / TABLET OFF-CANVAS DRAWER (< lg)                                 */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STUDENT PROFILE & SKILL PASSPORT MODAL                                    */}
      {/* ========================================================================= */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title="Student Profile & Skill Passport"
        subtitle="Verified academic credentials & career readiness on NexStep"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4 pt-1">
          {/* Student Profile Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#1F4E5F]/10 via-[#2C6E8F]/5 to-amber-500/5 border border-teal-900/10 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-brand-gradient text-white font-black text-xl flex items-center justify-center shadow-xs shrink-0">
              {student?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-slate-900 truncate">
                  {student?.name || 'Aarav Sharma'}
                </h4>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Verified Student
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium truncate mt-0.5">
                {student?.college || 'Delhi Technological University (DTU)'}
              </p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 mt-1">
                <span>{student?.course || 'B.Tech CSE'} (Sem {student?.semester || 5})</span>
                <span>•</span>
                <span className="font-semibold text-teal-800">Target: {student?.dream_role || 'Software Developer'}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics 3-Col Bar */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/60">
              <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Verified Skills</p>
              <p className="text-xl font-black text-emerald-600 mt-0.5">{verifiedCount}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Self-Reported</p>
              <p className="text-xl font-black text-slate-800 mt-0.5">{student?.self_reported_skills?.length || 0}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60">
              <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Language</p>
              <p className="text-xs font-bold text-slate-800 mt-1.5 truncate">{student?.language || 'English'}</p>
            </div>
          </div>

          {/* Verified Skills Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Verified Skill Credentials
                </h5>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Validated by Code Sandbox</span>
            </div>

            {student?.verified_skills && student.verified_skills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {student.verified_skills.map((skillId) => (
                  <div 
                    key={skillId}
                    className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-emerald-950 truncate">
                          {formatSkillName(skillId)}
                        </p>
                        <p className="text-[9px] text-emerald-700 font-medium">NexStep Certified</p>
                      </div>
                    </div>
                    <Badge variant="verified" size="sm" icon={false} className="shrink-0 text-[10px] px-2 py-0.2">
                      Verified
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-xs text-slate-600 font-medium">No skills verified yet.</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Solve a coding challenge to earn your first certified badge!</p>
              </div>
            )}
          </div>

          {/* Self-Reported Skills Section */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-slate-500" />
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Self-Reported Skills
                </h5>
              </div>
              <span className="text-[10px] text-slate-400">Claimed in profile</span>
            </div>

            <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              {student?.self_reported_skills && student.self_reported_skills.length > 0 ? (
                student.self_reported_skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white text-slate-700 border border-slate-200 shadow-2xs flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">None added</span>
              )}
            </div>
          </div>

          {/* Action Links & Buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                iconLeft={Layers}
                onClick={() => {
                  setProfileModalOpen(false);
                  handleNavClick('onboarding');
                }}
              >
                Edit Profile
              </Button>
              <Button
                variant="secondary"
                size="sm"
                iconLeft={CheckCircle}
                onClick={() => {
                  setProfileModalOpen(false);
                  handleNavClick('verification');
                }}
              >
                Verify Skills
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-rose-600 text-xs"
                iconLeft={RotateCcw}
                onClick={() => {
                  if (window.confirm('Reset demo profile to initial DTU student state?')) {
                    resetStudentState();
                    setProfileModalOpen(false);
                  }
                }}
              >
                Reset Demo
              </Button>
              <Button
                variant="primary"
                size="sm"
                iconRight={ArrowRight}
                onClick={() => {
                  setProfileModalOpen(false);
                  handleNavClick('gap-analysis');
                }}
              >
                View Gaps
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
