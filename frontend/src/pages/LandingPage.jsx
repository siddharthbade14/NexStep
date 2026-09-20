import React from 'react';
import { useStudent } from '../context/StudentContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
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
  ChevronRight
} from 'lucide-react';

export const LandingPage = () => {
  const { setActiveTab } = useStudent();

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

  const steps = [
    {
      step: '01',
      title: 'Onboard in 60 Seconds',
      description: 'Select your university course, current semester, self-reported skills, and dream role (Software Dev, Data Analyst, Embedded Systems).',
      icon: Layers,
      color: 'from-teal-500 to-teal-700'
    },
    {
      step: '02',
      title: 'AI Semantic Gap Analysis',
      description: 'Our sentence-transformer model analyzes your exact syllabus topics against real industry requirements to pinpoint unseen skill gaps.',
      icon: Cpu,
      color: 'from-amber-500 to-amber-600'
    },
    {
      step: '03',
      title: 'Verify Hands-on Skills',
      description: 'Write real code in our sandboxed test runner. Pass real unit test cases to earn verified credentials that recruiters trust.',
      icon: Code2,
      color: 'from-[#1F4E5F] to-[#2C6E8F]'
    },
    {
      step: '04',
      title: 'Unlock Roadmap & Internships',
      description: 'Follow sequenced free learning milestones with re-check quizzes and filter internships where you are already 100% qualified.',
      icon: Briefcase,
      color: 'from-emerald-500 to-teal-700'
    }
  ];

  const whyCards = [
    {
      title: 'Verified Skills, Zero Fluff',
      description: 'Anyone can write "Docker" or "FastAPI" on a resume. NexStep gives students proof-of-competence by testing submitted code against production test cases.',
      icon: ShieldCheck,
      badge: 'Proof of Competence'
    },
    {
      title: 'Curriculum-Aware AI',
      description: 'Other platforms assume you are starting from scratch. NexStep reads your university syllabus from Semester 1 to 8 so you never waste time relearning what your college already covered.',
      icon: GraduationCap,
      badge: 'Syllabus Mapping'
    },
    {
      title: 'Built for Tier 2 & 3 Bharat',
      description: 'Bridging the regional university gap with accessible vernacular support (Hindi, Tamil, Telugu) and practical developer workflows taught at top-tier startups.',
      icon: Languages,
      badge: 'Vernacular Ready'
    },
    {
      title: 'Transparent "Why You Qualify"',
      description: 'No black-box recruitment rejections. Every internship card shows exactly which of your verified skills matched and what is needed next.',
      icon: Building2,
      badge: 'Direct Pipelines'
    }
  ];

  return (
    <div className="space-y-28">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-6 sm:pt-14 pb-16">
        {/* Ambient background glow and grid lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] bg-gradient-to-tr from-teal-500/15 via-[#F4B942]/12 to-emerald-500/10 blur-3xl rounded-full pointer-events-none -z-10 animate-pulse-glow" />
        <div className="absolute -top-10 left-10 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative">
          
          {/* Top Pill Announcement with Live Glowing Dot */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-teal-200/80 shadow-xs hover:border-teal-400/80 hover:shadow-sm hover:scale-[1.02] transition-all cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Sparkles className="w-4 h-4 text-teal-700" />
            <span className="text-xs font-bold text-teal-950 tracking-wide">
              Smart India Hackathon Prototype • Career Mapping Engine
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-xs font-semibold text-emerald-700 hidden sm:inline-block bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
              AI v1.0 Live
            </span>
          </div>

          {/* Hero Headline with Enhanced Depth */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.07]">
            Verified skills. Real roadmaps.{' '}
            <span className="text-brand-gradient block sm:inline drop-shadow-xs">
              Your dream job — mapped.
            </span>
          </h1>

          {/* Hero Subheadline */}
          <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-600 font-normal leading-relaxed">
            Most college degrees leave massive gaps between university textbooks and high-paying tech jobs. 
            <strong className="text-slate-900 font-semibold"> NexStep</strong> uses semantic embeddings to map your college syllabus, reveals exact missing industry skills, and proves your competence through hands-on code challenges.
          </p>

          {/* Action CTAs with Tactile Hover Effects */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              variant="accent"
              size="lg"
              onClick={handleStart}
              iconRight={ArrowRight}
              className="w-full sm:w-auto text-slate-950 font-bold px-8 shadow-accent hover:scale-[1.03] active:scale-[0.98] border border-amber-300"
            >
              Get Started Free
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              onClick={handleExploreDashboard}
              iconLeft={Terminal}
              className="w-full sm:w-auto px-7 border-slate-300/80 hover:border-teal-500/40 hover:bg-slate-50/80"
            >
              Explore Demo Dashboard
            </Button>
          </div>

          {/* Hero Floating 3D Visual Badges */}
          <div className="hidden lg:flex items-center justify-between pointer-events-none absolute -top-4 inset-x-0 -z-1">
            <div className="icon-3d icon-3d-navy p-3 rounded-2xl animate-float-slow shadow-lg flex items-center gap-2.5 px-4 pointer-events-auto">
              <Code2 className="w-5 h-5 text-[#F4B942]" />
              <div className="text-left text-xs font-bold leading-tight">
                <div>Sandboxed Runner</div>
                <div className="text-[10px] text-teal-200 font-medium">Real Python Unit Tests</div>
              </div>
            </div>
            <div className="icon-3d icon-3d-amber p-3 rounded-2xl animate-float-reverse shadow-lg flex items-center gap-2.5 px-4 pointer-events-auto">
              <ShieldCheck className="w-5 h-5 text-amber-900" />
              <div className="text-left text-xs font-bold leading-tight">
                <div>AI Syllabus Match</div>
                <div className="text-[10px] text-amber-900/80 font-medium">sentence-transformers</div>
              </div>
            </div>
          </div>

          {/* Hero Subtext Guarantee Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-1.5 bg-white/70 px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs hover:border-teal-400 transition-colors">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Real Semantic Embedding Engine</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/70 px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs hover:border-teal-400 transition-colors">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Judge0 / Sandboxed Code Runner</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/70 px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs hover:border-teal-400 transition-colors">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Curated 100% Free Resources</span>
            </div>
          </div>

        </div>

        {/* HERO INTERACTIVE PREVIEW CARD WITH SPECULAR DEPTH & GLOW */}
        <div className="max-w-4xl mx-auto mt-14 relative">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-teal-500/20 via-[#F4B942]/20 to-emerald-500/20 blur-xl -z-10 opacity-70" />
          
          <div className="glass-card-premium rounded-3xl overflow-hidden border-2 border-slate-200/90 shadow-2xl hover:border-teal-500/40 glow-ring-teal transition-all duration-300">
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/90 shadow-xs shadow-rose-500/50" />
                <div className="w-3 h-3 rounded-full bg-amber-500/90 shadow-xs shadow-amber-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-xs shadow-emerald-500/50" />
                <span className="text-xs font-mono text-slate-300 ml-2">
                  nexstep-engine // sem-5-cse-to-software-developer
                </span>
              </div>
              <Badge variant="verified" size="sm" className="shadow-xs">Live Gap Engine</Badge>
            </div>
            <div className="p-6 sm:p-8 bg-gradient-to-b from-white/95 via-slate-50/70 to-slate-50/95 backdrop-blur-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                
                {/* Col 1: College Syllabus */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2 hover:border-teal-400 transition-all hover:shadow-md">
                  <div className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center justify-between">
                    <span>Step 1: Syllabus</span>
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  </div>
                  <div className="text-sm font-black text-slate-900">B.Tech CSE (Sem 5)</div>
                  <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                    <p className="flex items-center gap-1.5 text-teal-800 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Data Structures (Sem 3)
                    </p>
                    <p className="flex items-center gap-1.5 text-teal-800 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> DBMS Theory (Sem 4)
                    </p>
                    <p className="flex items-center gap-1.5 text-teal-800 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Operating Systems (Sem 4)
                    </p>
                  </div>
                </div>

                {/* Col 2: Arrow & AI Transformation with 3D Pulse */}
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <div className="icon-3d icon-3d-navy w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg mb-2 group hover:scale-105 transition-transform">
                    <Zap className="w-6 h-6 text-[#F4B942]" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    Semantic AI Matching
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    Detects 7 Industry Gaps
                  </span>
                  <div className="mt-2 text-[10px] font-mono font-bold bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300/80 shadow-2xs">
                    Similarity &lt; 0.60
                  </div>
                </div>

                {/* Col 3: Industry Gap & Verification */}
                <div className="p-4 rounded-2xl bg-white border border-rose-200/90 shadow-sm space-y-3 hover:border-rose-400 transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-rose-800 tracking-wider">
                      Identified Gap Skill
                    </span>
                    <Badge variant="gap" size="sm">Critical Gap</Badge>
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">
                      RESTful APIs & FastAPI
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Missing from college syllabus
                    </div>
                  </div>
                  <Button
                    variant="accent"
                    size="sm"
                    className="w-full text-xs font-bold shadow-accent hover:scale-[1.02] active:scale-[0.98]"
                    onClick={handleExploreDashboard}
                    iconRight={ChevronRight}
                  >
                    Verify This Skill Now
                  </Button>
                </div>

              </div>
            </div>
          </div>
        </div>

      </section>

      {/* STATS CALLOUT BANNER WITH GLOW DEPTH */}
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

      {/* HOW IT WORKS SECTION WITH 3D PEDESTALS */}
      <section className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="primary" size="md">Step-by-Step Architecture</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How NexStep Works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            From textbook syllabi to certified, interview-ready engineering profiles in four transparent stages.
          </p>
        </div>

        <div className="relative">
          {/* Connecting gradient pipeline bar behind stage cards */}
          <div className="hidden lg:block absolute top-12 left-12 right-12 h-1 bg-gradient-to-r from-teal-500 via-[#F4B942] to-emerald-500 opacity-30 -z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              const iconThemes = ['icon-3d-navy', 'icon-3d-purple', 'icon-3d-emerald', 'icon-3d-amber'];
              return (
                <div 
                  key={idx} 
                  className="glass-card-premium p-6 rounded-3xl relative flex flex-col justify-between border border-slate-200/90 group hover:-translate-y-1.5 hover:shadow-xl hover:border-teal-400/80 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className={`icon-3d ${iconThemes[idx % 4]} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-3xl font-black text-slate-300/80 group-hover:text-teal-600 transition-colors font-mono">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                  <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#1F4E5F] group-hover:text-teal-700">
                    <span className="bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">Stage {item.step}</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY NEXSTEP DIFFERENTIATION WITH 3D PEDESTALS */}
      <section className="space-y-12 bg-slate-100/60 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 rounded-3xl border border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="accent" size="md">Strategic Differentiation</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why NexStep is Built Differently
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            We don’t sell video courses or generic mock tests. We engineer transparency for Indian students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {whyCards.map((item, idx) => {
            const Icon = item.icon;
            const themeClasses = ['icon-3d-emerald', 'icon-3d-navy', 'icon-3d-amber', 'icon-3d-purple'];
            return (
              <Card key={idx} hover variant="default" className="p-7 space-y-3.5 bg-white border-slate-200/90 shadow-sm group">
                <div className="flex items-center justify-between">
                  <div className={`icon-3d ${themeClasses[idx % 4]} w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="primary" size="sm">{item.badge}</Badge>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1F4E5F] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CALL TO ACTION BOTTOM BANNER */}
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
              className="text-slate-950 font-bold px-8 shadow-xl hover:scale-105"
            >
              Start Free Gap Analysis
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

