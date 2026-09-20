import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
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
  Award
} from 'lucide-react';

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
    <div className="space-y-28 py-4 sm:py-8">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH AMBIENT LIGHTING & DYNAMIC FLOATING BADGES           */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-4 sm:pt-8 pb-8">
        
        {/* Ambient background light orbs & subtle grid */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[460px] bg-gradient-to-tr from-teal-500/10 via-[#F4B942]/8 to-emerald-500/10 blur-3xl rounded-full pointer-events-none -z-10 animate-pulse-glow" />
        <div className="absolute -top-16 left-12 w-64 h-64 bg-teal-400/8 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-36 right-10 w-72 h-72 bg-amber-400/8 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* HERO STAGE WITH TIGHTLY-FRAMED FLOATING BADGES */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">

          {/* --- MINIMALIST FLOATING BADGES (Restrained colors, natural framing) --- */}
          
          {/* Floating Badge 1: Upper Left (Syllabus to Sandbox Code Assertions) */}
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-2 rounded-xl floating-badge-minimal animate-float-drift absolute top-3 -left-4 2xl:-left-10 z-20 select-none">
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/70">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-700" />
            </div>
            <div className="text-left leading-tight pr-1">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900 block text-xs">3/3 Assertions Passed</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Judge0 Sandbox • 1.2ms</span>
            </div>
          </div>

          {/* Floating Badge 2: Upper Right (Recruiter Qualification Match) */}
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-2 rounded-xl floating-badge-minimal animate-float-gentle absolute top-2 -right-4 2xl:-right-10 z-20 select-none">
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/70">
              <Briefcase className="w-3.5 h-3.5 text-slate-700" />
            </div>
            <div className="text-left leading-tight pr-1">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900 block text-xs">Swiggy • Qualified</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">₹45,000/mo Stipend</span>
            </div>
          </div>

          {/* Floating Badge 3: Lower Left (Semantic Gap AI Engine) */}
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-2 rounded-xl floating-badge-minimal animate-float-diagonal absolute top-48 -left-2 2xl:-left-8 z-20 select-none">
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/70">
              <Cpu className="w-3.5 h-3.5 text-slate-700" />
            </div>
            <div className="text-left leading-tight pr-1">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900 block text-xs">all-MiniLM-L6-v2</span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0"></span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Cosine Delta: 0.38</span>
            </div>
          </div>

          {/* Floating Badge 4: Lower Right (Verified Career Leap) */}
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-2 rounded-xl floating-badge-minimal animate-float-bounce absolute top-52 -right-2 2xl:-right-8 z-20 select-none">
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200/70">
              <TrendingUp className="w-3.5 h-3.5 text-slate-700" />
            </div>
            <div className="text-left leading-tight pr-1">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900 block text-xs">Placement Uplift</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
              </div>
              <span className="text-[10px] text-slate-700 font-mono font-medium">₹4.5L → ₹14.5 LPA</span>
            </div>
          </div>

          {/* HERO CONTENT CONTAINER */}
          <div className="max-w-3xl mx-auto text-center space-y-7 relative z-10 px-2">
            
            {/* Top Minimal Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-2xs hover:border-slate-300 hover:bg-white transition-all cursor-default">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-slate-700">
                Smart India Hackathon Prototype
              </span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline-block bg-slate-100 px-2 py-0.5 rounded-full">
                Live Python IDE Sandbox
              </span>
            </div>

            {/* Hero Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08]">
              College syllabus is only <span className="text-slate-400 line-through decoration-rose-500 decoration-4">30%</span> of the job.{' '}
              <span className="text-brand-gradient block sm:inline drop-shadow-xs">
                NexStep verifies the other 70%.
              </span>
            </h1>

            {/* Hero Subheadline explaining the whole mission */}
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              Indian universities teach textbook theory. Top tech startups interview for production code. 
              <strong className="text-slate-900 font-bold"> NexStep</strong> uses semantic AI embeddings to mathematically calculate your syllabus gap, tests your hands-on code in a sandboxed IDE, and matches you with verified internships.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-1">
              <Button
                variant="accent"
                size="lg"
                onClick={handleStart}
                iconRight={ArrowRight}
                className="w-full sm:w-auto text-slate-950 font-black px-8 shadow-accent hover:scale-[1.03] active:scale-[0.98] border border-amber-400 text-sm"
              >
                Analyze My College Syllabus
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                onClick={handleExploreDashboard}
                iconLeft={Terminal}
                className="w-full sm:w-auto px-7 border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-sm font-bold"
              >
                Explore Live Gap Dashboard
              </Button>
            </div>

            {/* Responsive Floating Micro-Cards (Minimalist aesthetic across all screens) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 max-w-3xl mx-auto">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs text-left animate-float-drift hover:border-slate-300 hover:bg-white transition-all">
                <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div className="leading-tight">
                  <span className="text-[11px] font-semibold text-slate-900 block">30% Academic</span>
                  <span className="text-[9px] text-slate-500 font-mono">Sem 1-8 Syllabi</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs text-left animate-float-gentle hover:border-slate-300 hover:bg-white transition-all">
                <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                  <Cpu className="w-3.5 h-3.5" />
                </div>
                <div className="leading-tight">
                  <span className="text-[11px] font-semibold text-slate-900 block">AI Gap Engine</span>
                  <span className="text-[9px] text-slate-500 font-mono">MiniLM Vectors</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs text-left animate-float-diagonal hover:border-slate-300 hover:bg-white transition-all">
                <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                  <Code2 className="w-3.5 h-3.5" />
                </div>
                <div className="leading-tight">
                  <span className="text-[11px] font-semibold text-slate-900 block">Code Sandbox</span>
                  <span className="text-[9px] text-slate-500 font-mono">3 Unit Tests</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs text-left animate-float-bounce hover:border-slate-300 hover:bg-white transition-all">
                <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                  <Briefcase className="w-3.5 h-3.5" />
                </div>
                <div className="leading-tight">
                  <span className="text-[11px] font-semibold text-slate-900 block">Verified Match</span>
                  <span className="text-[9px] text-slate-500 font-mono">₹35k-50k/mo</span>
                </div>
              </div>
            </div>

            {/* Micro Guarantee Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-full border border-slate-200/80 shadow-2xs">
                <Check className="w-3.5 h-3.5 text-slate-600" /> B.Tech Sem 1–8 Syllabi Mapped
              </span>
              <span className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-full border border-slate-200/80 shadow-2xs">
                <Check className="w-3.5 h-3.5 text-slate-600" /> Code Sandbox Assertions
              </span>
              <span className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-full border border-slate-200/80 shadow-2xs">
                <Check className="w-3.5 h-3.5 text-slate-600" /> 100% Transparent Hiring Match
              </span>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 1B. THE 4-STEP ENGINEERING BRIDGE: PROJECT ARCHITECTURE AT A GLANCE       */}
        {/* (Makes the entire project understandable in 5 seconds right on the fold) */}
        {/* ========================================================================= */}
        <div className="max-w-5xl mx-auto mt-12 relative z-10 px-2">
          <div className="p-6 sm:p-8 rounded-3xl glass-card-premium border-sharp-teal shadow-xl space-y-6">
            
            {/* Header of Project Architecture Strip */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1F4E5F] text-[#F4B942] flex items-center justify-center shadow-xs">
                  <Workflow className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-teal-800">
                      System Architecture
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                      Understand In 10 Seconds
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    The NexStep 4-Step Engineering Bridge
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Autonomous Student-to-Recruiter Pipeline</span>
              </div>
            </div>

            {/* 4 Connected Step Cards with visual arrows */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-teal-400 hover:shadow-md transition-all group relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Step 01
                  </span>
                  <GraduationCap className="w-4 h-4 text-teal-600" />
                </div>
                <h4 className="text-sm font-black text-slate-900 tracking-tight">
                  University Syllabus
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Ingests your university curriculum (SPPU, AKTU, VTU) across B.Tech Sem 1–8.
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-500 flex items-center justify-between">
                  <span>30% College Baseline</span>
                  <span className="text-teal-700 font-semibold">Theory Focus</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-white border-sharp-amber shadow-2xs hover:border-amber-400 hover:shadow-md transition-all group relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Step 02
                  </span>
                  <Cpu className="w-4 h-4 text-amber-600" />
                </div>
                <h4 className="text-sm font-black text-slate-900 tracking-tight">
                  AI Semantic Gap
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <code className="text-teal-800 font-mono text-[11px]">all-MiniLM-L6-v2</code> compares syllabus vectors against 500+ tech job descriptions.
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-500 flex items-center justify-between">
                  <span>Cosine Similarity</span>
                  <span className="text-rose-700 font-black">-72% Gap Found</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-white border-sharp-teal shadow-2xs hover:border-teal-500 hover:shadow-md transition-all group relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Step 03
                  </span>
                  <Terminal className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="text-sm font-black text-slate-900 tracking-tight">
                  Sandbox Code IDE
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Student writes real code in an isolated runner. Must pass 3 test assertions to earn verified credentials.
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-500 flex items-center justify-between">
                  <span>Judge0 Python IDE</span>
                  <span className="text-emerald-700 font-bold">100% Proof</span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-2xl bg-white border-sharp shadow-2xs hover:border-teal-500 hover:shadow-md transition-all group relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#1F4E5F] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Step 04
                  </span>
                  <Briefcase className="w-4 h-4 text-[#1F4E5F]" />
                </div>
                <h4 className="text-sm font-black text-slate-900 tracking-tight">
                  Recruiter Match
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Direct pipeline to top startup internships (Swiggy, CRED, Zerodha) with transparent hiring match criteria.
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-500 flex items-center justify-between">
                  <span>Verified Passport</span>
                  <span className="text-amber-800 font-black">₹40k/mo Stipend</span>
                </div>
              </div>

            </div>

            {/* Explanatory summary footer bar */}
            <div className="p-3.5 rounded-2xl bg-slate-100/80 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Target className="w-4 h-4 text-teal-700 shrink-0" />
                <span>
                  <strong>Result:</strong> Zero resume fraud. Engineering students prove hands-on production capability before the interview.
                </span>
              </div>
              <span className="text-slate-500 font-mono text-[11px] shrink-0 font-semibold">
                Try the interactive simulation below ↓
              </span>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. INTERACTIVE LIVE PLATFORM SIMULATOR (Understand the project in 10s)   */}
        {/* ========================================================================= */}
        <div className="max-w-5xl mx-auto mt-14 relative z-10">
          
          {/* Outer Specular Aura */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-teal-500/25 via-[#F4B942]/20 to-emerald-500/25 blur-xl -z-10 opacity-80" />

          <div className="glass-card-premium rounded-3xl overflow-hidden border-2 border-slate-200/90 shadow-2xl">
            
            {/* Top Chrome Header & Track Switcher Tabs */}
            <div className="bg-slate-900 px-5 sm:px-8 py-4 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 pr-3 border-r border-slate-800">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-mono text-slate-300 font-bold block">
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedTrack === track.id
                        ? 'bg-gradient-to-r from-[#1F4E5F] to-[#2C6E8F] text-white shadow-brand border border-teal-400/40 scale-105'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {track.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Interactive 3-Step Simulation Grid */}
            <div className="p-6 sm:p-8 bg-gradient-to-b from-white/95 via-slate-50/80 to-slate-50/95 space-y-6">
              
              {/* Role Header Banner */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-[#1F4E5F]/8 via-teal-50/40 to-amber-50/40 border-sharp-teal">
                <div className="flex items-center gap-3">
                  <div className="icon-3d icon-3d-navy w-11 h-11 rounded-xl flex items-center justify-center shadow-sm">
                    {selectedTrack === 'data' ? (
                      <Database className="w-5 h-5 text-amber-300" />
                    ) : selectedTrack === 'embedded' ? (
                      <Binary className="w-5 h-5 text-teal-300" />
                    ) : (
                      <Code2 className="w-5 h-5 text-[#F4B942]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-900 tracking-tight">
                        {currentTrackData.title}
                      </h3>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                        {currentTrackData.badge}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      Simulating real Indian university syllabus vs. recruiter interview requirements
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Placement CTC</span>
                  <span className="text-lg font-black text-[#1F4E5F]">{currentTrackData.ctc}</span>
                </div>
              </div>

              {/* 3-Column Pipeline Architecture in Action */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Column 1: College Syllabus Baseline */}
                <div className="p-5 rounded-2xl bg-white border-sharp space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-teal-700" />
                        1. College Coursework
                      </span>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Syllabus Baseline
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-2 font-medium">
                      What state university textbooks cover:
                    </p>

                    <div className="space-y-2 mt-2.5">
                      {currentTrackData.collegeCurriculum.map((subj, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{subj.name}</span>
                            <span className="text-[10px] font-semibold text-slate-400">{subj.sem}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 block mt-0.5">{subj.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Mapped automatically from college curriculum</span>
                  </div>
                </div>

                {/* Column 2: AI Semantic Gap Analysis */}
                <div className="p-5 rounded-2xl bg-white border-sharp-amber space-y-3 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-amber-600" />
                        2. AI Semantic Gaps
                      </span>
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                        all-MiniLM-L6-v2
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-2 font-medium">
                      Critical production skills missing from textbook syllabi:
                    </p>

                    <div className="space-y-2 mt-2.5">
                      {currentTrackData.aiGaps.map((gap, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 truncate">{gap.name}</span>
                            <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 shrink-0">
                              {gap.delta}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-amber-900 mt-1">
                            <span>Recruiter Expectation</span>
                            <span className="font-mono font-bold">Cosine: {gap.score}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-[11px] text-amber-900 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Discovered via semantic vector analysis</span>
                  </div>
                </div>

                {/* Column 3: Live Sandbox Code Verification */}
                <div className="p-5 rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between code-glow-ide">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-[10px] font-mono font-bold text-teal-400 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5" />
                        3. Code Sandbox IDE
                      </span>
                      <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                        Isolated Python 3
                      </span>
                    </div>

                    <div className="mt-2.5 bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-[10.5px] leading-relaxed text-emerald-300 overflow-x-auto select-none">
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

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <Button
                      variant={simPassed ? 'secondary' : 'accent'}
                      size="sm"
                      onClick={handleRunSimulation}
                      loading={simRunning}
                      iconLeft={Play}
                      className="w-full text-xs font-black shadow-accent"
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
              <div className="p-4 rounded-2xl bg-white border-sharp flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Direct Recruiter Pipelines Unlocked Once Verified:
                  </span>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    {currentTrackData.matchedInternships.map((job, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs">
                        <Building2 className="w-3.5 h-3.5 text-teal-700" />
                        <strong className="text-slate-900">{job.company}</strong>
                        <span className="text-slate-400">•</span>
                        <span className="text-teal-900 font-semibold">{job.role}</span>
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded">
                          {job.stipend}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleExploreDashboard}
                  iconRight={ArrowRight}
                  className="shrink-0 text-xs font-bold"
                >
                  View Full Gap Analysis
                </Button>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 3. PLATFORM IMPACT STATS BANNER                                           */}
      {/* ========================================================================= */}
      <section className="bg-brand-dark-gradient rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <TrendingUp className="w-96 h-96 text-white" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left relative z-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1.5 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F4B942] tracking-tight drop-shadow-sm">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-slate-100">
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How NexStep Works: The 4-Pillar Pipeline
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
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
              <div 
                key={idx}
                className="glass-card-premium p-6 rounded-3xl relative flex flex-col justify-between border-sharp hover:-translate-y-1.5 hover:shadow-xl hover:border-teal-400/80 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`icon-3d ${pillar.theme} w-13 h-13 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-3xl font-black text-slate-300 font-mono">
                      {pillar.step}
                    </span>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    {pillar.subtitle}
                  </span>

                  <h3 className="text-base font-black text-slate-900 mt-2 mb-2 tracking-tight">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 font-mono">
                  <span>{pillar.tech}</span>
                  <ChevronRight className="w-4 h-4 text-teal-600 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. TRADITIONAL PATH VS. NEXSTEP COMPARISON TABLE                          */}
      {/* ========================================================================= */}
      <section className="p-8 sm:p-12 rounded-3xl bg-white border-sharp shadow-sm space-y-8 max-w-5xl mx-auto">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge variant="accent" size="sm">The Core Problem We Solve</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Traditional Placement Path vs. NexStep Career Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Why 80% of Indian engineering students from Tier-2/3 colleges get filtered out—and how we fix it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Path Card */}
          <div className="p-6 rounded-3xl bg-rose-50/40 border border-rose-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-800 font-black text-sm uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>The Broken Traditional Way</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold text-base leading-none">✕</span>
                <span><strong>Unverified Resumes:</strong> Students list buzzwords (Docker, AWS) without verifiable code evidence.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold text-base leading-none">✕</span>
                <span><strong>Syllabus Blindspot:</strong> Colleges assume students know modern async APIs; students assume textbooks are enough.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold text-base leading-none">✕</span>
                <span><strong>Mass Recruiter Trap:</strong> 0 practical proof forces graduates into ₹3.5 LPA mass recruiter service companies.</span>
              </li>
            </ul>
          </div>

          {/* NexStep Path Card */}
          <div className="p-6 rounded-3xl bg-teal-50/40 border-2 border-teal-300 shadow-brand space-y-4">
            <div className="flex items-center gap-2 text-teal-800 font-black text-sm uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
              <span>The NexStep Verified Pipeline</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Proof-of-Competence:</strong> Every skill badge is backed by passed test assertions in our isolated Python sandbox.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Exact AI Gap Isolation:</strong> Mathematical semantic matching reveals precisely what to learn each semester.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Direct High-CTC Internships:</strong> Direct qualification matching for ₹35,000–₹50,000/mo high-growth startup roles.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CALL TO ACTION BOTTOM BANNER                                           */}
      {/* ========================================================================= */}
      <section className="text-center bg-brand-gradient text-white rounded-3xl p-10 sm:p-14 shadow-brand space-y-6 relative overflow-hidden border border-teal-600/30">
        <div className="max-w-2xl mx-auto space-y-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Map Your Degree to Industry Reality Today.
          </h2>
          <p className="text-sm sm:text-base text-teal-100 font-normal leading-relaxed">
            Takes less than 2 minutes. Enter your branch and semester to see your exact curriculum gaps and start verifying skills immediately.
          </p>
          <div className="pt-2">
            <Button
              variant="accent"
              size="lg"
              onClick={handleStart}
              iconRight={ArrowRight}
              className="text-slate-950 font-black px-8 shadow-xl hover:scale-105"
            >
              Start Free Gap Analysis
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
