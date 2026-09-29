import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { Button } from '../components/common/Button';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Compass, 
  GraduationCap, 
  Cpu, 
  Briefcase, 
  UserCheck, 
  Layers, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { triggerConfetti } from '../components/common/Confetti';

export const LoginPage = () => {
  const { DEMO_PERSONAS, startDemoOnboarding, loginStudent, setActiveTab } = useStudent();
  
  // Selection & Form State
  const [selectedPersonaId, setSelectedPersonaId] = useState('demo-student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeMode, setActiveMode] = useState('demo'); // 'demo' | 'standard'

  const selectedPersona = DEMO_PERSONAS.find(p => p.id === selectedPersonaId) || DEMO_PERSONAS[0];

  // 1-Click Launch Demo Account & Start Onboarding from the beginning
  const handleLaunchDemo = async (personaToUse = selectedPersona) => {
    setLoading(true);
    setErrorMsg('');
    try {
      triggerConfetti();
      await startDemoOnboarding(personaToUse);
    } catch (err) {
      console.error('Demo launch error:', err);
      setErrorMsg('Failed to initialize demo sandbox. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Standard Login Submit
  const handleStandardSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const isDemoCreds = email.includes('demo') || email.includes('student');
      
      loginStudent({
        email,
        password,
        persona: isDemoCreds ? selectedPersona : null
      });

      setSuccessMsg('Successfully authenticated! Redirecting...');
      triggerConfetti();

      setTimeout(() => {
        // If demo credentials or requested, direct to onboarding step 1
        if (isDemoCreds) {
          startDemoOnboarding(selectedPersona);
        } else {
          setActiveTab('gap-analysis');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 700);
    }, 600);
  };

  // Auto-fill Demo Credentials
  const handleFillDemoCreds = () => {
    setEmail('demo.student@dtu.ac.in');
    setPassword('nexstep2026');
    setErrorMsg('');
  };

  return (
    <div className="relative min-h-[85vh] py-6 sm:py-12 flex flex-col justify-center items-center">
      
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-teal-500/12 via-[#F4B942]/12 to-emerald-500/12 blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-teal-400/15 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none -z-10 animate-float-reverse" />

      <div className="w-full max-w-5xl px-4 sm:px-6 space-y-8">
        
        {/* Top Header & Mission Statement */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/90 border border-teal-200 dark:border-teal-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
              Smart India Hackathon 2024 Portal
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-[11px] font-mono text-teal-700 dark:text-teal-300 font-semibold bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md">
              Evaluator & Student Access
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Sign in to <span className="text-brand-gradient">NexStep</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Experience our AI-powered curriculum gap analysis and verified hands-on skill passport. 
            Choose an instant <strong className="text-slate-900 dark:text-white">Demo Account</strong> or sign in with your email.
          </p>
        </div>

        {/* Mode Switcher Tabs (Demo Account vs Standard Login) */}
        <div className="flex justify-center">
          <div className="p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 inline-flex shadow-inner">
            <button
              type="button"
              onClick={() => setActiveMode('demo')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 ${
                activeMode === 'demo'
                  ? 'bg-gradient-to-r from-[#1F4E5F] to-[#2C6E8F] text-white shadow-brand scale-100'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#F4B942]" />
              <span>Instant Demo Account</span>
              <span className="text-[10px] bg-[#F4B942] text-slate-950 font-black px-1.5 py-0.2 rounded-full ml-1">
                Recommended
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('standard')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 ${
                activeMode === 'standard'
                  ? 'bg-gradient-to-r from-[#1F4E5F] to-[#2C6E8F] text-white shadow-brand scale-100'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Standard Sign In</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODE 1: HERO DEMO ACCOUNT (DEFAULT & RECOMMENDED)                         */}
        {/* ========================================================================= */}
        {activeMode === 'demo' && (
          <div className="space-y-6">
            {/* Featured Launchpad Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/90 border-2 border-teal-500/80 dark:border-teal-500/60 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1F4E5F] via-[#F4B942] to-teal-400" />
              
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 px-2.5 py-0.5 rounded-full">
                      Zero Friction Setup
                    </span>
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Starts Onboarding From Beginning (Step 1)
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    One-Click Evaluator Demo Account
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    Instantly launches a clean student profile with all verified skills reset so you can test 
                    the real-time Onboarding flow, semantic syllabus gap calculator, and code sandbox from scratch.
                  </p>
                </div>

                <div className="w-full lg:w-auto shrink-0">
                  <Button
                    variant="accent"
                    size="lg"
                    onClick={() => handleLaunchDemo(selectedPersona)}
                    disabled={loading}
                    iconRight={ArrowRight}
                    className="w-full sm:w-auto font-black px-8 py-4 text-base text-slate-950 shadow-accent hover:scale-[1.03] active:scale-[0.98] border border-amber-400"
                  >
                    {loading ? 'Initializing Sandbox...' : '🚀 Launch Demo Account & Start Onboarding'}
                  </Button>
                </div>
              </div>

              {/* Persona Selection Header */}
              <div className="pt-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      Select Demo Student Persona:
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Pick any university discipline to inspect tailored AI curricula and gap analysis:
                    </p>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    Click any card to select & launch
                  </span>
                </div>

                {/* Persona Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
                  {DEMO_PERSONAS.map((p) => {
                    const isSelected = selectedPersonaId === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPersonaId(p.id)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between text-left group relative ${
                          isSelected
                            ? 'bg-gradient-to-br from-slate-50 via-white to-teal-50/60 dark:from-slate-800 dark:via-slate-900 dark:to-teal-950/40 border-[#1F4E5F] dark:border-teal-400 shadow-md ring-2 ring-teal-500/20'
                            : 'bg-white dark:bg-slate-900/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/90 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute -top-2.5 right-3 bg-[#1F4E5F] text-[#F4B942] font-black text-[9px] uppercase px-2 py-0.5 rounded-full border border-teal-700 shadow-2xs">
                            Active Choice
                          </span>
                        )}

                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.accentColor || 'from-teal-600 to-cyan-600'} text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform`}>
                              {p.avatar || 'ST'}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                                {p.name || 'Custom Blank Profile'}
                              </h4>
                              <p className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 truncate">
                                {p.dream_role}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 dark:text-slate-500">University:</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[130px]" title={p.college}>
                                {p.college || 'Unset (Custom)'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400 dark:text-slate-500">Course & Sem:</span>
                              <span className="font-mono text-slate-700 dark:text-slate-300">
                                {p.course} • Sem {p.semester}
                              </span>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic leading-snug line-clamp-2">
                            "{p.tagline}"
                          </p>
                        </div>

                        <div className="pt-3 mt-2 border-t border-slate-100/90 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPersonaId(p.id);
                              handleLaunchDemo(p);
                            }}
                            className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                              isSelected
                                ? 'bg-[#1F4E5F] text-white hover:bg-[#2C6E8F]'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                          >
                            <span>Launch As {p.name ? p.name.split(' ')[0] : 'Blank'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Demo Info Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0 border border-teal-200/60 dark:border-teal-800/60">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                    Starts at Step 1
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    College & academic profile wizard
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200/60 dark:border-amber-800/60">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                    Pre-cleared Sandbox
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    0 initial verified skills for fresh test
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/60 dark:border-emerald-800/60">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                    Verified Skill Tests
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Hands-on IDE assertions & quizzes
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 2: STANDARD CREDENTIALS LOGIN                                        */}
        {/* ========================================================================= */}
        {activeMode === 'standard' && (
          <div className="max-w-md mx-auto w-full">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1F4E5F] to-teal-400" />
              
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Student & Recruiter Login</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Sign in with university credentials or use prefilled demo credentials.
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Success Message */}
              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Quick autofill helper pill */}
              <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60 flex items-center justify-between text-xs">
                <span className="text-amber-900 dark:text-amber-200 font-medium text-[11px]">
                  Testing without an account?
                </span>
                <button
                  type="button"
                  onClick={handleFillDemoCreds}
                  className="font-black text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 bg-amber-200/70 dark:bg-amber-900/60 hover:bg-amber-300/80 px-2.5 py-1 rounded-lg text-[10px] transition-colors"
                >
                  ⚡ Auto-fill Demo Creds
                </button>
              </div>

              <form onSubmit={handleStandardSubmit} className="space-y-4">
                {/* Email input */}
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    University / College Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. aarav.sharma@dtu.ac.in"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E5F] dark:focus:ring-teal-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    required
                  />
                </div>

                {/* Password input */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('For hackathon demonstration, enter any password or use the 1-click Demo Account!')}
                      className="text-[11px] font-medium text-teal-700 dark:text-teal-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4E5F] dark:focus:ring-teal-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                    />
                    <span>Remember my device</span>
                  </label>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  iconRight={ArrowRight}
                  className="w-full font-black py-3 text-sm shadow-brand hover:scale-[1.01]"
                >
                  {loading ? 'Authenticating...' : 'Sign In to NexStep'}
                </Button>
              </form>

              {/* Bottom switch to demo */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
                Want to evaluate without entering credentials?{' '}
                <button
                  type="button"
                  onClick={() => setActiveMode('demo')}
                  className="font-bold text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 underline underline-offset-2 ml-1"
                >
                  Switch to Demo Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Guarantee Banner */}
        <div className="pt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            AI-Verified Academic Standards
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-teal-600" />
            500+ Engineering Colleges
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-amber-600" />
            Direct Recruiter Verification
          </span>
        </div>

      </div>
    </div>
  );
};
