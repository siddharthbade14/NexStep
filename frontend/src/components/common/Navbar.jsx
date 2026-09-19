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
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Code2,
  UserCheck
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
    { id: 'landing', label: 'Home', icon: Compass },
    { id: 'onboarding', label: 'Onboard', icon: Layers },
    { id: 'gap-analysis', label: 'Gap Analysis', icon: Sparkles, highlight: true },
    { id: 'verification', label: 'Verify Skills', icon: CheckCircle },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'roadmap', label: 'Roadmap', icon: MapPin },
    { id: 'opportunities', label: 'Internships', icon: Briefcase }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const verifiedCount = student.verified_skills?.length || 0;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
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
              <span className="text-[10px] font-bold uppercase bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded border border-teal-200/60 tracking-wider">
                Beta
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium hidden sm:block -mt-0.5">
              AI Career Mapping for Bharat
            </p>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 xl:gap-2 px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-medium transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-[#1F4E5F] text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 ${isActive ? 'text-[#F4B942]' : item.highlight ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Student Profile Indicator & Actions (Desktop only >= lg) */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          {/* Active Student Status Pill -> Opens Profile & Credential Passport Modal */}
          <button 
            type="button"
            onClick={() => setProfileModalOpen(true)}
            title="Click to view Student Profile & Skill Passport"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 cursor-pointer transition-all hover:shadow-xs hover:border-teal-500/40 group select-none shrink-0"
          >
            <div className="w-7 h-7 rounded-lg bg-teal-600/10 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              {student?.name?.charAt(0) || 'A'}
            </div>
            <div className="text-left leading-tight shrink-0">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="truncate max-w-[85px] xl:max-w-[120px]">
                  {student?.name ? student.name.split(' ')[0] : 'Aarav'}
                </span>
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium truncate max-w-[85px] xl:max-w-[120px]">
                {student?.dream_role || 'Software Developer'}
              </div>
            </div>
            <div className="shrink-0 flex items-center pl-0.5">
              <Badge variant="verified" size="sm" icon={false} className="whitespace-nowrap shrink-0 font-semibold px-2 py-0.5">
                {verifiedCount} Verified
              </Badge>
            </div>
          </button>

          {/* Quick Demo Reset */}
          <button
            type="button"
            onClick={resetStudentState}
            title="Reset Demo Data to Initial State"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile / Tablet Controls (< lg) */}
        <div className="flex items-center gap-2 lg:hidden">
          <button 
            type="button"
            onClick={() => setProfileModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-50 text-teal-800 text-xs font-semibold hover:bg-teal-100 active:scale-95 transition-all shrink-0 border border-teal-200/60"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
            </span>
            <span className="whitespace-nowrap">{student?.name ? student.name.split(' ')[0] : 'Student'}</span>
            <span className="text-teal-400">•</span>
            <span className="whitespace-nowrap font-bold text-teal-700">{verifiedCount} Verified</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1.5 shadow-lg animate-in slide-in-from-top duration-200">
          <div 
            onClick={() => {
              setMobileMenuOpen(false);
              setProfileModalOpen(true);
            }}
            className="p-3 mb-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-slate-900">{student.name}</p>
                <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded font-semibold">View Passport</span>
              </div>
              <p className="text-[11px] text-slate-500">{student.course} • Sem {student.semester}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetStudentState();
              }}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-200"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1F4E5F] text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F4B942]' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              </button>
            );
          })}
        </div>
      )}
    </header>

    {/* Student Profile & Skill Passport Modal */}
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

