import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { triggerConfetti } from '../components/common/Confetti';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Code2, 
  CheckCircle2, 
  Briefcase, 
  ShieldCheck, 
  Cpu, 
  Languages, 
  Building2, 
  TrendingUp,
  GraduationCap,
  Terminal,
  Zap,
  ChevronRight,
  Play,
  RotateCcw,
  Check,
  AlertCircle,
  Clock,
  Compass,
  FileCheck,
  IndianRupee,
  Database,
  Binary,
  Target,
  Workflow,
  Award,
  LogIn
} from 'lucide-react';
import { HeroCyberCanvas } from '../components/3d/HeroCyberCanvas';
import { HoloOrbit3D } from '../components/3d/HoloOrbit3D';
import { Card3D } from '../components/3d/Card3D';
import { HeroTitle3D } from '../components/3d/HeroTitle3D';
import { TactileButton3D } from '../components/3d/TactileButton3D';

const SIMULATION_TRACKS = {
  software: {
    id: 'software',
    title: 'Software Developer (Backend & Full-Stack)',
    badge: 'Most Popular',
    ctc: '₹8.5 - 18 LPA',
    collegeCurriculum: [
      { name: 'Data Structures & Algorithms', sem: 'Sem 3', status: 'Covered in Theory' },
      { name: 'Database Management Systems (DBMS)', sem: 'Sem 4', status: 'Covered (SQL basics)' },
      { name: 'Operating Systems & Threading', sem: 'Sem 4', status: 'Covered (Textbook concepts)' }
    ],
    aiGaps: [
      { name: 'Production REST APIs & FastAPI', delta: '-72% Gap', level: 'Critical', score: '0.41' },
      { name: 'Docker & Containerization', delta: '-85% Gap', level: 'Critical', score: '0.28' },
      { name: 'Async State & Production React', delta: '-55% Gap', level: 'High', score: '0.55' }
    ],
    starterSnippet: `def build_api_response(records, page=1):\n    # TODO: Filter completed transactions\n    completed = [r for r in records if r.get('status') == 'completed']\n    return {'status': 'success', 'data': completed, 'total': len(completed)}`,
    matchedInternships: [
      { company: 'Swiggy', role: 'Backend Engineering Intern', stipend: '₹45,000/mo', match: 94 },
      { company: 'CRED', role: 'Platform & API Intern', stipend: '₹50,000/mo', match: 91 },
      { company: 'Postman', role: 'Developer Tooling Intern', stipend: '₹40,000/mo', match: 88 }
    ]
  },
  data: {
    id: 'data',
    title: 'Data Analyst & Analytics Engineer',
    badge: 'High Demand',
    ctc: '₹7.0 - 15 LPA',
    collegeCurriculum: [
      { name: 'Probability & Engineering Statistics', sem: 'Sem 2', status: 'Covered in Math' },
      { name: 'Relational Database Queries', sem: 'Sem 4', status: 'Covered (Single table)' },
      { name: 'Data Warehousing & Mining', sem: 'Sem 5', status: 'Covered (Theory exams)' }
    ],
    aiGaps: [
      { name: 'SQL Window Functions (PARTITION BY)', delta: '-68% Gap', level: 'Critical', score: '0.36' },
      { name: 'Pandas Data Wrangling & Outliers', delta: '-75% Gap', level: 'Critical', score: '0.32' },
      { name: 'Business KPIs & PowerBI Dashboards', delta: '-60% Gap', level: 'High', score: '0.48' }
    ],
    starterSnippet: `def compute_mrr_metrics(subscribers):\n    # TODO: Calculate active revenue & churn\n    active = [s for s in subscribers if s.get('is_active')]\n    mrr = sum(s.get('monthly_fee', 0) for s in active)\n    return {'total_mrr': round(mrr, 2), 'active_users': len(active)}`,
    matchedInternships: [
      { company: 'Zerodha', role: 'Quantitative Data Analyst Intern', stipend: '₹40,000/mo', match: 95 },
      { company: 'Razorpay', role: 'Growth Analytics Intern', stipend: '₹45,000/mo', match: 90 },
      { company: 'Flipkart', role: 'Supply Chain Insights Intern', stipend: '₹35,000/mo', match: 87 }
    ]
  },
  embedded: {
    id: 'embedded',
    title: 'Embedded Systems & Firmware Engineer',
    badge: 'Deep Tech',
    ctc: '₹6.5 - 14 LPA',
    collegeCurriculum: [
      { name: 'Digital Electronics & Logic Gates', sem: 'Sem 3', status: 'Covered in Lab' },
      { name: 'Microprocessors 8085 / 8086', sem: 'Sem 4', status: 'Outdated 16-bit chips' },
      { name: 'Control Systems Engineering', sem: 'Sem 5', status: 'Covered (Theory formulas)' }
    ],
    aiGaps: [
      { name: 'ARM Cortex NVIC & Priority Arbiter', delta: '-80% Gap', level: 'Critical', score: '0.29' },
      { name: 'FreeRTOS Tasks & Mutex Concurrency', delta: '-88% Gap', level: 'Critical', score: '0.24' },
      { name: 'I2C / UART Hardware Bus Debugging', delta: '-65% Gap', level: 'Critical', score: '0.39' }
    ],
    starterSnippet: `def validate_uart_frame(payload):\n    # TODO: Verify header, parity & checksum\n    checksum = sum(payload[:-1]) & 0xFF\n    is_valid = (payload[0] == 0xAA) and (checksum == payload[-1])\n    return {'valid': is_valid, 'bytes_verified': len(payload)}`,
    matchedInternships: [
      { company: 'Texas Instruments', role: 'Embedded Systems Apprentice', stipend: '₹45,000/mo', match: 93 },
      { company: 'Ola Electric', role: 'Battery BMS Firmware Intern', stipend: '₹40,000/mo', match: 89 },
      { company: 'Bosch Mobility', role: 'Automotive Embedded Intern', stipend: '₹35,000/mo', match: 86 }
    ]
  }
};

export const LandingPage = () => {
  const { setActiveTab } = useStudent();
  const { isDark } = useTheme();
  const [selectedTrack, setSelectedTrack] = useState('software');
  const [simCode, setSimCode] = useState(SIMULATION_TRACKS.software.starterSnippet);
  const [simRunning, setSimRunning] = useState(false);
  const [simPassed, setSimPassed] = useState(false);

  const currentTrackData = SIMULATION_TRACKS[selectedTrack];

  const handleTrackSwitch = (trackKey) => {
    setSelectedTrack(trackKey);
    setSimCode(SIMULATION_TRACKS[trackKey].starterSnippet);
    setSimPassed(false);
  };

  const handleRunSimulation = () => {
    setSimRunning(true);
    setTimeout(() => {
      setSimRunning(false);
      setSimPassed(true);
      triggerConfetti();
    }, 600);
  };

  const handleStart = () => {
    setActiveTab('onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreDashboard = () => {
    setActiveTab('gap-analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stats = [
    { label: 'Engineering Colleges Covered', value: '500+', subtext: 'IITs, NITs, State Tech Universities' },
    { label: 'Curriculum Skills Mapped', value: '1,200+', subtext: 'B.Tech CSE, ECE, IT, Electrical' },
    { label: 'Target Placement Uplift', value: '85%', subtext: 'In practical technical interviews' },
    { label: 'Active Mock Internships', value: '₹40k/mo', subtext: 'Average stipend for verified roles' }
  ];

  return (
    <div className="space-y-24 py-4 sm:py-8 transition-colors duration-300">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Clean, Impactful, No Floating Rows)                      */}
      {/* ========================================================================= */}
      <section className="relative overflow-visible pt-4 sm:pt-10 pb-8">
        
        {/* Interactive 3D Cyber Particle Constellation Canvas */}
        <HeroCyberCanvas className="absolute inset-0 w-full h-full pointer-events-none opacity-40 -z-5" />

        {/* Ambient background light orbs with rich multi-hue depth */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[520px] bg-gradient-to-tr from-teal-500/10 via-amber-400/8 to-purple-500/10 dark:from-teal-500/15 dark:via-[#FBBF24]/10 dark:to-purple-500/15 blur-[140px] rounded-full pointer-events-none -z-10" />

        {/* HERO CONTENT CONTAINER */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-7 z-10">
          
          {/* Top Futuristic Telemetry Pill Announcement */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 dark:bg-slate-900/80 text-white border border-teal-500/40 shadow-sm backdrop-blur-xl hover:border-teal-400 transition-all cursor-default" data-cursor="pointer">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-xs font-mono tracking-wide text-teal-300 font-bold uppercase">
              Autonomous Curriculum Verification
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-xs font-mono text-amber-400 hidden sm:inline-block font-semibold">
              AICTE & Industry Mapped
            </span>
          </div>

          {/* 3D Staggered Flip Reveal Hero Headline with Glowing Red Strikethrough */}
          <HeroTitle3D />

          {/* Hero Subheadline */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Indian universities teach textbook theory. Top tech startups interview for production code. 
            <strong className="text-slate-900 dark:text-white font-bold"> NexStep</strong> uses semantic AI embeddings to mathematically calculate your syllabus gap, tests your hands-on code in a sandboxed IDE, and matches you with verified internships.
          </p>

          {/* Hero CTAs with Clear Visual Hierarchy */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <TactileButton3D
              variant="primary"
              size="lg"
              onClick={handleStart}
              iconRight={ArrowRight}
              className="w-full sm:w-auto shadow-accent font-black"
            >
              Analyze My College Syllabus
            </TactileButton3D>
            
            <TactileButton3D
              variant="secondary"
              size="lg"
              onClick={handleExploreDashboard}
              iconLeft={Terminal}
              className="w-full sm:w-auto font-bold"
            >
              Explore Live Gap Dashboard
            </TactileButton3D>

            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-500" />
              <span>Or launch Demo Account →</span>
            </button>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 1B. 3D HOLOGRAPHIC ORBIT ENGINE SHOWCASE                                 */}
        {/* ========================================================================= */}
        <div className="max-w-5xl mx-auto mt-14 mb-4 relative z-10 px-4">
          <div className="relative rounded-3xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border border-slate-200 dark:border-teal-500/30 p-6 sm:p-8 shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden transition-colors duration-300">
            {/* Ambient Radial Lights */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-teal-500/10 dark:bg-teal-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 right-10 w-64 h-32 bg-purple-500/10 dark:bg-purple-500/15 blur-3xl pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
              <div className="text-left max-w-md space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-400/40 text-[11px] font-mono text-teal-700 dark:text-teal-300 font-bold uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live Holographic Telemetry Core
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                  Cryptographic Skill Validation Core
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Real-time visualization of AST code sandbox isolation, HMAC-SHA256 signature verification, and multi-tenant AICTE syllabus audit.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-teal-700/60 text-slate-700 dark:text-teal-300 shadow-2xs">Latency: 1.2ms</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900/90 border border-amber-200 dark:border-amber-700/60 text-amber-700 dark:text-amber-300 shadow-2xs font-medium">Sandbox: Isolated</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-300 shadow-2xs">Proofs: SHA-256</span>
                </div>
              </div>

              {/* 3D Rotating Holographic Orbit with rings & satellites */}
              <div className="shrink-0">
                <HoloOrbit3D className="scale-95 sm:scale-105" />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1C. THE 4-STEP ENGINEERING BRIDGE: PROJECT ARCHITECTURE AT A GLANCE       */}
        {/* ========================================================================= */}
        <div className="max-w-5xl mx-auto mt-10 relative z-10 px-2">
          <div className="p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6 relative overflow-hidden transition-colors duration-300">
            
            {/* Header of Project Architecture Strip */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/20 border border-teal-200 dark:border-teal-400/40 text-teal-600 dark:text-teal-300 flex items-center justify-center shadow-xs">
                  <Workflow className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400">
                      System Architecture
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-500/40">
                      Understand In 10 Seconds
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    The NexStep 4-Step Engineering Bridge
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                <span>Autonomous Student-to-Recruiter Pipeline</span>
              </div>
            </div>

            {/* 4 Connected Step Cards with 3D Tilt Physics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              
              {/* Step 1 */}
              <Card3D maxTilt={10} scale={1.03} className="h-full">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-teal-500/30 backdrop-blur-xl hover:border-teal-500 dark:hover:border-teal-400 hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(45,212,191,0.25)] h-full flex flex-col justify-between group relative transition-all" data-cursor="pointer">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-500/15 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-500/30">
                        Step 01
                      </span>
                      <GraduationCap className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                      University Syllabus
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      Ingests your university curriculum (SPPU, AKTU, VTU) across B.Tech Sem 1–8.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/10 text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>30% College Baseline</span>
                    <span className="text-teal-700 dark:text-teal-400 font-semibold">Theory Focus</span>
                  </div>
                </div>
              </Card3D>

              {/* Step 2 */}
              <Card3D maxTilt={10} scale={1.03} className="h-full">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/70 border border-amber-200 dark:border-amber-500/30 backdrop-blur-xl hover:border-amber-500 dark:hover:border-amber-400 hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] h-full flex flex-col justify-between group relative transition-all" data-cursor="pointer">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/15 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/30">
                        Step 02
                      </span>
                      <Cpu className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                      AI Semantic Gap
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      <code className="text-teal-700 dark:text-teal-300 font-mono text-[11px]">all-MiniLM-L6-v2</code> compares syllabus vectors against 500+ tech job descriptions.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/10 text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>Cosine Similarity</span>
                    <span className="text-rose-600 dark:text-rose-400 font-black">-72% Gap Found</span>
                  </div>
                </div>
              </Card3D>

              {/* Step 3 */}
              <Card3D maxTilt={10} scale={1.03} className="h-full">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/70 border border-emerald-200 dark:border-emerald-500/30 backdrop-blur-xl hover:border-emerald-500 dark:hover:border-emerald-400 hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] h-full flex flex-col justify-between group relative transition-all" data-cursor="pointer">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/30">
                        Step 03
                      </span>
                      <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                      Sandbox Code IDE
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      Student writes real code in an isolated runner. Must pass 3 test assertions to earn verified credentials.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/10 text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>Judge0 Python IDE</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Proof</span>
                  </div>
                </div>
              </Card3D>

              {/* Step 4 */}
              <Card3D maxTilt={10} scale={1.03} className="h-full">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/70 border border-purple-200 dark:border-purple-500/30 backdrop-blur-xl hover:border-purple-500 dark:hover:border-purple-400 hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] h-full flex flex-col justify-between group relative transition-all" data-cursor="pointer">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-500/15 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-500/30">
                        Step 04
                      </span>
                      <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                      Recruiter Match
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      Direct pipeline to top startup internships (Swiggy, CRED, Zerodha) with transparent hiring match criteria.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/10 text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>Verified Passport</span>
                    <span className="text-amber-800 dark:text-amber-300 font-black">₹40k/mo Stipend</span>
                  </div>
                </div>
              </Card3D>

            </div>

            {/* Explanatory summary footer bar */}
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Target className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>
                  <strong className="text-slate-900 dark:text-white">Result:</strong> Zero resume fraud. Engineering students prove hands-on production capability before the interview.
                </span>
              </div>
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] shrink-0 font-semibold">
                Try the interactive simulation below ↓
              </span>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. INTERACTIVE LIVE PLATFORM SIMULATOR                                    */}
        {/* ========================================================================= */}
        <div className="max-w-5xl mx-auto mt-14 relative z-10 px-2">
          
          <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl overflow-hidden border border-slate-200 dark:border-white/15 shadow-xl dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] transition-colors duration-300">
            
            {/* Top Chrome Header & Track Switcher Tabs */}
            <div className="bg-slate-900 px-5 sm:px-8 py-4 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 pr-3 border-r border-slate-800">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-mono text-slate-200 font-bold block">
                    nexstep-simulation // live-career-engine
                  </span>
                  <span className="text-[10px] text-teal-400 font-semibold font-mono">
                    Try switching roles below to preview the platform workflow
                  </span>
                </div>
              </div>

              {/* Interactive Role Switcher Pills */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                {[
                  { id: 'software', label: 'Software Dev' },
                  { id: 'data', label: 'Data Analyst' },
                  { id: 'embedded', label: 'Embedded / IoT' }
                ].map((track) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => handleTrackSwitch(track.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedTrack === track.id
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-slate-950 font-black shadow-[0_0_15px_rgba(45,212,191,0.4)] border border-teal-300 scale-105'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    data-cursor="pointer"
                  >
                    {track.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Interactive 3-Step Simulation Grid */}
            <div className="p-6 sm:p-8 bg-slate-50/60 dark:bg-slate-900/40 space-y-6">
              
              {/* Role Header Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-950/60 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="icon-3d icon-3d-navy w-11 h-11 rounded-xl flex items-center justify-center shadow-xs">
                    {selectedTrack === 'data' ? (
                      <Database className="w-5 h-5 text-amber-300" />
                    ) : selectedTrack === 'embedded' ? (
                      <Binary className="w-5 h-5 text-teal-300" />
                    ) : (
                      <Code2 className="w-5 h-5 text-[#FBBF24]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                        {currentTrackData.title}
                      </h3>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-500/40">
                        {currentTrackData.badge}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Simulating real Indian university syllabus vs. recruiter interview requirements
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Placement CTC</span>
                  <span className="text-lg font-black text-amber-600 dark:text-[#FBBF24]">{currentTrackData.ctc}</span>
                </div>
              </div>

              {/* 3-Column Pipeline Architecture in Action */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column 1: College Syllabus Baseline */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 space-y-3 flex flex-col justify-between shadow-2xs dark:shadow-none">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
                      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        1. College Coursework
                      </span>
                      <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-500/15 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-500/30">
                        Syllabus Baseline
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                      What state university textbooks cover:
                    </p>

                    <div className="space-y-2 mt-2.5">
                      {currentTrackData.collegeCurriculum.map((subj, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 dark:text-white">{subj.name}</span>
                            <span className="text-[10px] font-semibold text-slate-400">{subj.sem}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">{subj.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Mapped automatically from college curriculum</span>
                  </div>
                </div>

                {/* Column 2: AI Semantic Gap Analysis */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/70 border border-amber-200 dark:border-amber-500/30 space-y-3 flex flex-col justify-between shadow-2xs dark:shadow-none">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
                      <span className="text-[10px] font-black text-amber-800 dark:text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        2. AI Semantic Gaps
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/20 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/40">
                        all-MiniLM-L6-v2
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                      Critical production skills missing from textbook syllabi:
                    </p>

                    <div className="space-y-2 mt-2.5">
                      {currentTrackData.aiGaps.map((gap, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-xs shadow-2xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-800 dark:text-slate-100 leading-snug break-words">{gap.name}</span>
                            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-900/40 shrink-0">
                              {gap.delta}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1 pt-1 border-t border-slate-100 dark:border-white/5">
                            <span>Recruiter Expectation</span>
                            <span className="font-mono font-bold text-teal-600 dark:text-teal-400">Cosine: {gap.score}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-white/10 text-[11px] text-amber-800 dark:text-amber-300 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Discovered via semantic vector analysis</span>
                  </div>
                </div>

                {/* Column 3: Live Sandbox Code Verification */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 shadow-xl space-y-3 flex flex-col justify-between code-glow-ide backdrop-blur-xl">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-[10px] font-mono font-bold text-teal-400 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5" />
                        3. Code Sandbox IDE
                      </span>
                      <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700">
                        Isolated Python 3
                      </span>
                    </div>

                    <div className="mt-2.5 bg-slate-900/90 p-3 rounded-xl border border-white/10 font-mono text-[10.5px] leading-relaxed text-emerald-300 overflow-x-auto select-none shadow-inner">
                      <pre className="whitespace-pre-wrap">{simCode}</pre>
                    </div>

                    {/* Test Runner Feedback State */}
                    {simPassed && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 text-xs flex items-center justify-between animate-in zoom-in-95">
                        <span className="flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          3/3 Test Assertions Passed
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">1.2ms</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <Button
                      variant={simPassed ? 'secondary' : 'accent'}
                      size="sm"
                      onClick={handleRunSimulation}
                      loading={simRunning}
                      iconLeft={Play}
                      className="w-full text-xs font-black shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:scale-[1.02] cursor-pointer"
                    >
                      {simPassed ? 'Re-run Sandbox Assertions' : 'Run & Verify Code in Sandbox'}
                    </Button>
                    <span className="text-[10px] text-slate-400 block text-center">
                      {simPassed ? '✓ Skill officially certified & added to passport' : 'Click to execute test cases against Judge0 sandbox'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Bottom Unlock Strip: Real Internships Unlocked with Proof */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Direct Recruiter Pipelines Unlocked Once Verified:
                  </span>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    {currentTrackData.matchedInternships.map((job, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-teal-500/30 text-xs">
                        <Building2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <strong className="text-slate-900 dark:text-white">{job.company}</strong>
                        <span className="text-slate-400">•</span>
                        <span className="text-teal-700 dark:text-teal-300 font-semibold">{job.role}</span>
                        <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-500/30">
                          {job.stipend}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <TactileButton3D
                  variant="secondary"
                  size="sm"
                  onClick={handleExploreDashboard}
                  iconRight={ArrowRight}
                  className="shrink-0 text-xs font-bold"
                >
                  View Full Gap Analysis
                </TactileButton3D>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. PLATFORM IMPACT STATS BANNER                                           */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <TrendingUp className="w-96 h-96 text-teal-400" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left relative z-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1.5 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-teal-400/50 hover:shadow-[0_0_25px_rgba(45,212,191,0.2)] transition-all hover:-translate-y-1" data-cursor="pointer">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#FBBF24] tracking-tight drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)]">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-white">
                {stat.label}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE COMPLETE 4-PILLAR ARCHITECTURE SECTION                             */}
      {/* ========================================================================= */}
      <section className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="primary" size="md">End-to-End System Design</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How NexStep Works: The 4-Pillar Pipeline
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            From textbook syllabi to verified interview-ready engineering credentials in four transparent stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Syllabus Semantic Matcher',
              subtitle: 'AI Cosine Gap Engine',
              desc: 'Our sentence-transformers model (all-MiniLM-L6-v2) reads your exact B.Tech semester subjects, comparing them to live recruiter JDs to isolate missing industry skills.',
              icon: Cpu,
              theme: 'icon-3d-navy',
              tech: 'Sentence-Transformers • Cosine Sim'
            },
            {
              step: '02',
              title: 'Code Sandbox Verification',
              subtitle: 'Proof of Competence IDE',
              desc: 'No self-reported resume fluff. Write real code in an isolated Python/Judge0 runner. Pass 3 rigorous unit test cases to earn tamper-proof certified badges.',
              icon: Code2,
              theme: 'icon-3d-emerald',
              tech: 'Sandboxed Test Runner • Unit Tests'
            },
            {
              step: '03',
              title: 'Adaptive Learning Roadmap',
              subtitle: 'Sequenced Milestones',
              desc: 'Curated free tutorials from MDN, freeCodeCamp, and official docs. Milestones unlock sequentially only after passing rigorous 3-question evaluation quizzes.',
              icon: Compass,
              theme: 'icon-3d-amber',
              tech: 'Sequenced Free Guides • Re-check Quizzes'
            },
            {
              step: '04',
              title: 'Verified Internship Pipeline',
              subtitle: 'Transparent Matching',
              desc: 'Direct pipeline to 12+ Indian tech internships (Swiggy, Zerodha, CRED). We transparently explain "Why You Qualify" based strictly on verified assertions.',
              icon: Briefcase,
              theme: 'icon-3d-purple',
              tech: 'Transparent Criteria • 1-Click Apply'
            }
          ].map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Card3D key={idx} maxTilt={10} scale={1.03} className="h-full">
                <div 
                  className="bg-white/85 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl relative flex flex-col justify-between border border-slate-200 dark:border-white/10 h-full hover:border-teal-500/60 dark:hover:border-teal-400/60 hover:shadow-xl dark:hover:shadow-[0_0_35px_rgba(45,212,191,0.25)] transition-all duration-300 group"
                  data-cursor="pointer"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`icon-3d ${pillar.theme} w-13 h-13 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-3xl font-black text-slate-300 dark:text-slate-700 font-mono group-hover:text-teal-500 dark:group-hover:text-teal-400/60 transition-colors">
                        {pillar.step}
                      </span>
                    </div>

                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-500/15 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-500/30">
                      {pillar.subtitle}
                    </span>

                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-2 mb-2 tracking-tight">
                      {pillar.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                    <span>{pillar.tech}</span>
                    <ChevronRight className="w-4 h-4 text-teal-600 dark:text-teal-400 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Card3D>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. TRADITIONAL PATH VS. NEXSTEP COMPARISON TABLE                          */}
      {/* ========================================================================= */}
      <section className="p-8 sm:p-12 rounded-3xl bg-white/85 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-8 max-w-5xl mx-auto transition-colors duration-300">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge variant="accent" size="sm">The Core Problem We Solve</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Traditional Placement Path vs. NexStep Career Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Why 80% of Indian engineering students from Tier-2/3 colleges get filtered out—and how we fix it.
          </p>
        </div>

        {/* Paired Horizontally Aligned Comparison Rows */}
        <div className="space-y-3.5">
          {[
            {
              problemTitle: "Unverified Resumes",
              problemDesc: "Students list buzzwords (Docker, AWS) without verifiable code evidence.",
              solutionTitle: "Proof-of-Competence",
              solutionDesc: "Every skill badge is backed by passed test assertions in our isolated sandbox."
            },
            {
              problemTitle: "Syllabus Blindspot",
              problemDesc: "Colleges assume students know modern async APIs; students assume textbooks are enough.",
              solutionTitle: "Exact AI Gap Isolation",
              solutionDesc: "Mathematical semantic matching reveals precisely what to learn each semester."
            },
            {
              problemTitle: "Mass Recruiter Trap",
              problemDesc: "0 practical proof forces graduates into ₹3.5 LPA mass recruiter service companies.",
              solutionTitle: "Direct High-CTC Internships",
              solutionDesc: "Direct qualification matching for ₹35,000–₹50,000/mo high-growth startup roles."
            }
          ].map((item, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              {/* Problem Cell */}
              <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
                <span className="text-rose-500 font-bold text-sm leading-none shrink-0 mt-0.5">✕</span>
                <p className="leading-relaxed">
                  <strong className="text-slate-900 dark:text-white font-bold">{item.problemTitle}: </strong>
                  {item.problemDesc}
                </p>
              </div>

              {/* Solution Cell */}
              <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-300 dark:border-teal-500/40 shadow-xs flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
                <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-slate-900 dark:text-white font-bold">{item.solutionTitle}: </strong>
                  {item.solutionDesc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CALL TO ACTION BOTTOM BANNER                                           */}
      {/* ========================================================================= */}
      <section className="text-center rounded-3xl p-10 sm:p-14 space-y-6 relative overflow-hidden border border-teal-500/40 shadow-xl bg-gradient-to-r from-teal-900/90 via-[#0B1120] to-teal-900/90 text-white backdrop-blur-2xl">
        {/* Ambient Lights */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-teal-500/20 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-10 w-64 h-32 bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Map Your Degree to Industry Reality Today.
          </h2>
          <p className="text-sm sm:text-base text-teal-100 font-normal leading-relaxed">
            Takes less than 2 minutes. Enter your branch and semester to see your exact curriculum gaps and start verifying skills immediately.
          </p>
          <div className="pt-2">
            <TactileButton3D
              variant="primary"
              size="lg"
              onClick={handleStart}
              iconRight={ArrowRight}
            >
              Start Free Gap Analysis
            </TactileButton3D>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
