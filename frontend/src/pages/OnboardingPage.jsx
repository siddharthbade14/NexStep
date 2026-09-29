import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { AutocompleteInput } from '../components/common/AutocompleteInput';
import { 
  GraduationCap, 
  BookOpen, 
  Code, 
  Briefcase, 
  Languages, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Plus, 
  X, 
  Sparkles, 
  Building, 
  Target, 
  CheckCircle2,
  Search,
  Compass,
  Cpu,
  Database,
  Layers,
  MapPin,
  TrendingUp,
  Brain,
  Calendar,
  Award
} from 'lucide-react';
import { api } from '../services/api';
import {
  COLLEGES_AND_UNIVERSITIES,
  DEGREE_PROGRAMS,
  ENGINEERING_STREAMS,
  DOMAINS_OF_INTEREST,
  EXPANDED_TARGET_ROLES,
  MASTER_SKILLS_DATABASE,
  GRADUATION_YEARS,
  PREFERRED_WORK_MODES,
  INDIAN_TECH_HUBS
} from '../data/onboardingData';

export const OnboardingPage = () => {
  const { student, updateProfile, setActiveTab } = useStudent();
  const { isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State with Comprehensive LinkedIn-style Profile Attributes
  const [formData, setFormData] = useState({
    name: student.name || 'Aarav Sharma',
    college: student.college || 'Delhi Technological University (DTU)',
    degree: student.degree || 'B.Tech (Bachelor of Technology)',
    stream: student.stream || 'Computer Science & Engineering (CSE)',
    course: student.course || 'B.Tech CSE',
    semester: student.semester || 5,
    grad_year: student.grad_year || 2026,
    cgpa: student.cgpa || 8.6,
    domain: student.domain || 'Full-Stack & Web Engineering',
    dream_role: student.dream_role || 'Software Developer (Backend & Full-Stack)',
    preferred_work_mode: student.preferred_work_mode || 'Hybrid (Office + Remote)',
    preferred_location: student.preferred_location || 'Bengaluru (Bangalore)',
    language: student.language || 'English',
    self_reported_skills: student.self_reported_skills || ['Python', 'Data Structures', 'FastAPI', 'React', 'Docker', 'PostgreSQL', 'Git'],
    target_companies: student.target_companies || ['Swiggy', 'Zerodha', 'CRED']
  });

  const [customSkillSearch, setCustomSkillSearch] = useState('');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('All');

  // When demo account is reset, re-initialize
  useEffect(() => {
    if (student?.resetTimestamp) {
      setCurrentStep(1);
      setFormData({
        name: student.name || '',
        college: student.college || 'Delhi Technological University (DTU)',
        degree: student.degree || 'B.Tech (Bachelor of Technology)',
        stream: student.stream || 'Computer Science & Engineering (CSE)',
        course: student.course || 'B.Tech CSE',
        semester: student.semester || 1,
        grad_year: student.grad_year || 2028,
        cgpa: student.cgpa || 8.0,
        domain: student.domain || 'Full-Stack & Web Engineering',
        dream_role: student.dream_role || 'Software Developer (Backend & Full-Stack)',
        preferred_work_mode: 'Hybrid (Office + Remote)',
        preferred_location: 'Bengaluru (Bangalore)',
        language: student.language || 'English',
        self_reported_skills: student.self_reported_skills || ['Python', 'Git'],
        target_companies: ['Swiggy', 'Zerodha']
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [student?.resetTimestamp]);

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 80, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 80, behavior: 'smooth' });
    }
  };

  const toggleSkill = (skillName) => {
    setFormData(prev => {
      const skills = prev.self_reported_skills || [];
      if (skills.includes(skillName)) {
        return { ...prev, self_reported_skills: skills.filter(s => s !== skillName) };
      } else {
        return { ...prev, self_reported_skills: [...skills, skillName] };
      }
    });
  };

  const addSkillDirect = (skillName) => {
    if (!skillName || !skillName.trim()) return;
    const trimmed = skillName.trim();
    if (!formData.self_reported_skills.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        self_reported_skills: [...prev.self_reported_skills, trimmed]
      }));
    }
    setCustomSkillSearch('');
  };

  const removeSkill = (skillName) => {
    setFormData(prev => ({
      ...prev,
      self_reported_skills: prev.self_reported_skills.filter(s => s !== skillName)
    }));
  };

  const toggleCompany = (company) => {
    setFormData(prev => {
      const current = prev.target_companies || [];
      if (current.includes(company)) {
        return { ...prev, target_companies: current.filter(c => c !== company) };
      } else {
        return { ...prev, target_companies: [...current, company] };
      }
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await api.submitOnboarding(formData);
      updateProfile({ ...formData, ...result });
    } catch (err) {
      console.warn('Backend submission fallback to local store', err);
      updateProfile(formData);
    } finally {
      setLoading(false);
      setActiveTab('gap-analysis');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Skill category filter options
  const skillCategories = ['All', 'Language', 'Web Framework', 'Backend', 'AI & Data', 'DevOps', 'Database', 'Embedded'];
  const filteredSkillsPool = MASTER_SKILLS_DATABASE.filter(s => {
    if (selectedSkillCategory === 'All') return true;
    if (selectedSkillCategory === 'Backend') return s.category === 'Backend' || s.category === 'Architecture';
    return s.category === selectedSkillCategory;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 sm:py-8 transition-colors duration-300">
      
      {/* Onboarding Header */}
      <div className="text-center space-y-3">
        <div className="icon-3d icon-3d-navy w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
          <Sparkles className="w-7 h-7 text-teal-300" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/80 text-xs font-bold text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30">
          <Target className="w-3.5 h-3.5 text-amber-500 dark:text-[#FBBF24]" />
          <span>LinkedIn-Grade Engineering Profiler & Syllabus Matcher</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Let’s Map Your Engineering Journey
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          Search your college, stream, dream role, and competencies. Our AI computes your real-time curriculum gap and unlocked high-paying internships.
        </p>
      </div>

      {/* Modern 4-Step Stepper Header */}
      <div className="bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm relative overflow-hidden transition-colors duration-300">
        <div className="flex items-center justify-between relative z-10">
          {[
            { num: 1, label: 'Education & Stream' },
            { num: 2, label: 'Domain & Career' },
            { num: 3, label: 'Skills & Tools' },
            { num: 4, label: 'Preferences & Review' }
          ].map((s, idx) => {
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            return (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center gap-1.5 z-10">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm transition-all duration-300 ${
                      isDone
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-gradient-to-r from-teal-600 to-indigo-600 text-white shadow-md scale-110'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-white/10'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4 text-white" /> : s.num}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-bold tracking-tight ${
                    isCurrent 
                      ? 'text-teal-700 dark:text-teal-300' 
                      : isDone 
                      ? 'text-emerald-600 dark:text-emerald-400' 
                      : 'text-slate-400'
                  }`}>
                    {s.label}
                  </span>
                </div>

                {idx < 3 && (
                  <div className="flex-1 h-1 mx-2 sm:mx-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative -top-3">
                    <div 
                      className={`h-full transition-all duration-500 ease-out ${
                        currentStep > idx + 1 ? 'bg-emerald-500' : currentStep === idx + 1 ? 'bg-gradient-to-r from-teal-500 to-amber-400 w-1/2' : 'w-0'
                      }`}
                      style={{ width: currentStep > idx + 1 ? '100%' : currentStep === idx + 1 ? '50%' : '0%' }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: EDUCATION, UNIVERSITY & STREAM (LinkedIn Style)                   */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="p-6 sm:p-8 space-y-6 bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-xl animate-in fade-in duration-200 relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-600"></div>

          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-white/10">
            <div className="icon-3d icon-3d-navy w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">University, Degree & Stream</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Search with autocomplete across 100+ Indian universities, autonomous colleges, and streams</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-slate-900 dark:text-white bg-slate-50/70 dark:bg-slate-950/70 hover:border-slate-300 dark:hover:border-white/20 transition-all"
                data-cursor="pointer"
              />
            </div>

            {/* College / University Autocomplete with Match Highlighting */}
            <AutocompleteInput
              label="College / University Name"
              value={formData.college}
              onChange={(val) => setFormData({ ...formData, college: val })}
              options={COLLEGES_AND_UNIVERSITIES}
              filterKey="name"
              subTextKey="city"
              badgeKey="tier"
              icon={Building}
              placeholder="Search by college name, city (e.g. DTU, IIT, Anna, Pune, Trichy)..."
              helperText="Suggests matching colleges and affiliations across Tier 1, 2, and state universities."
            />

            {/* Degree Program Selector */}
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Degree Program
              </label>
              <div className="relative">
                <select
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-slate-900 dark:text-white bg-slate-50/70 dark:bg-slate-950/70 hover:border-slate-300 dark:hover:border-white/20 transition-all cursor-pointer"
                  data-cursor="pointer"
                >
                  {DEGREE_PROGRAMS.map((prog) => (
                    <option key={prog} value={prog} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {prog}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stream / Branch Autocomplete with Match Highlighting */}
            <AutocompleteInput
              label="Stream / Branch of Specialization"
              value={formData.stream}
              onChange={(val) => {
                const matchedStream = ENGINEERING_STREAMS.find(s => s.name === val || s.id === val);
                setFormData({ 
                  ...formData, 
                  stream: val,
                  course: matchedStream?.id || val
                });
              }}
              options={ENGINEERING_STREAMS}
              filterKey="name"
              subTextKey="code"
              badgeKey="category"
              icon={BookOpen}
              placeholder="Search stream (e.g. Computer Science, AI, Data Science, ECE, EEE)..."
              helperText="Matches your semester syllabus with industry skill benchmarks."
            />

            {/* Current Semester & Graduation Year Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Current Semester
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                    const isSelected = formData.semester === sem;
                    return (
                      <button
                        key={sem}
                        type="button"
                        onClick={() => setFormData({ ...formData, semester: sem })}
                        className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-sm scale-105'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                        data-cursor="pointer"
                      >
                        Sem {sem}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Passing Out Year</span>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">Graduation</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {GRADUATION_YEARS.map((yr) => {
                    const isSelected = formData.grad_year === yr;
                    return (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => setFormData({ ...formData, grad_year: yr })}
                        className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-500 to-[#FBBF24] text-slate-950 font-black shadow-sm scale-105'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                        data-cursor="pointer"
                      >
                        {yr}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: DOMAIN OF INTEREST & DREAM CAREER ROLE (LinkedIn Style)            */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="p-6 sm:p-8 space-y-6 bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-xl animate-in fade-in duration-200 relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400"></div>

          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-white/10">
            <div className="icon-3d icon-3d-amber w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
              <Target className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Domain of Interest & Target Role</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Personalize your semantic gap analysis and industry interview benchmark</p>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* Domain of Interest Search & Selector */}
            <AutocompleteInput
              label="Select or Search Your Domain of Interest"
              value={formData.domain}
              onChange={(val) => setFormData({ ...formData, domain: val })}
              options={DOMAINS_OF_INTEREST}
              filterKey="name"
              subTextKey="desc"
              icon={Compass}
              placeholder="Search domain (e.g. Full-Stack, AI, DevOps, Embedded, FinTech)..."
              helperText="We tune the semantic embeddings strictly to industry expectations in this domain."
            />

            {/* Quick Domain Grid Cards */}
            <div>
              <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Popular Engineering Domains:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {DOMAINS_OF_INTEREST.slice(0, 6).map((d) => {
                  const isSelected = formData.domain === d.name;
                  return (
                    <div
                      key={d.id}
                      onClick={() => setFormData({ ...formData, domain: d.name })}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-950/40 shadow-xs'
                          : 'border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                      data-cursor="pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{d.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{d.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target Job Role Autocomplete with Match Highlighting */}
            <AutocompleteInput
              label="Target / Dream Job Role"
              value={formData.dream_role}
              onChange={(val) => setFormData({ ...formData, dream_role: val })}
              options={EXPANDED_TARGET_ROLES}
              filterKey="title"
              subTextKey="avg_salary"
              badgeKey="badge"
              icon={Briefcase}
              placeholder="Search dream role (e.g. Frontend, Machine Learning, DevOps, Embedded)..."
              helperText="Over 10+ tech roles mapped to real startup and enterprise interview standards."
            />

            {/* Preferred Work Mode & Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Preferred Work Mode
                </label>
                <div className="space-y-1.5">
                  {PREFERRED_WORK_MODES.map((mode) => {
                    const isSelected = formData.preferred_work_mode === mode.label;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, preferred_work_mode: mode.label })}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 font-bold'
                            : 'border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                        data-cursor="pointer"
                      >
                        <span>{mode.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Target Tech Hub
                </label>
                <select
                  value={formData.preferred_location}
                  onChange={(e) => setFormData({ ...formData, preferred_location: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm text-slate-900 dark:text-white bg-slate-50/70 dark:bg-slate-950/70 hover:border-slate-300 dark:hover:border-white/20 transition-all cursor-pointer"
                  data-cursor="pointer"
                >
                  {INDIAN_TECH_HUBS.map((hub) => (
                    <option key={hub} value={hub} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {hub}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-2">
                  Matches you with hiring partners active in these technology corridors.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: SKILLS AUTOCOMPLETE & COMPETENCY CLOUD (LinkedIn Style)          */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="p-6 sm:p-8 space-y-6 bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-xl animate-in fade-in duration-200 relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500"></div>

          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-white/10">
            <div className="icon-3d icon-3d-emerald w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Skills & Technical Competencies</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Search from 150+ programming languages, frameworks, cloud platforms, and databases</p>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* Live Real-Time Skill Autocomplete Search Bar */}
            <AutocompleteInput
              label="Search & Add Any Skill (With Real-Time Word Matching)"
              value={customSkillSearch}
              onChange={(val) => setCustomSkillSearch(val)}
              onSelect={(item) => {
                const name = typeof item === 'string' ? item : item.name;
                addSkillDirect(name);
              }}
              options={MASTER_SKILLS_DATABASE}
              filterKey="name"
              subTextKey="category"
              badgeKey="category"
              icon={Search}
              placeholder="Type to search skills (e.g. Python, React, Next.js, Docker, Pandas, ARM)..."
              helperText="Press Enter or click a suggestion to immediately add it to your competencies."
              maxSuggestions={10}
            />

            {/* Category Filter Pills */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Browse by Category:
                </span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono font-medium">
                  {filteredSkillsPool.length} skills in pool
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skillCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedSkillCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedSkillCategory === cat
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    data-cursor="pointer"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Skills Tag Cloud */}
            <div>
              <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Click to Quick-Add ({selectedSkillCategory}):
              </span>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10">
                {filteredSkillsPool.map((skill) => {
                  const isSelected = formData.self_reported_skills.includes(skill.name);
                  return (
                    <button
                      key={skill.name}
                      type="button"
                      onClick={() => toggleSkill(skill.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'bg-teal-700 dark:bg-teal-600 text-white shadow-xs font-bold'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:border-slate-300'
                      }`}
                      data-cursor="pointer"
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{skill.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Selected Skills Badges List */}
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                  Your Selected Competencies ({formData.self_reported_skills.length})
                </span>
                {formData.self_reported_skills.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, self_reported_skills: [] })}
                    className="text-[11px] text-rose-600 dark:text-rose-400 font-bold hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {formData.self_reported_skills.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.self_reported_skills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 text-xs font-bold border border-teal-200 dark:border-teal-500/30 shadow-2xs animate-in zoom-in-95 duration-150"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(s)}
                        className="text-teal-600 dark:text-teal-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                        title="Remove skill"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-1 font-medium">
                  No skills selected yet. Search above or click suggestions to add skills you have used.
                </p>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: PREFERENCES, TARGET COMPANIES & REVIEW (LinkedIn Style)            */}
      {/* ========================================================================= */}
      {currentStep === 4 && (
        <div className="p-6 sm:p-8 space-y-6 bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-xl animate-in fade-in duration-200 relative overflow-hidden transition-colors duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-500"></div>

          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-white/10">
            <div className="icon-3d icon-3d-purple w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
              <Languages className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Preferred Language & Profile Review</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Vernacular career guidance & direct recruiter alignment</p>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* Preferred Language Dropdown */}
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Preferred Career Guidance Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm text-slate-900 dark:text-white bg-slate-50/70 dark:bg-slate-950/70 hover:border-slate-300 dark:hover:border-white/20 transition-all cursor-pointer"
                data-cursor="pointer"
              >
                {['English', 'Hindi (हिन्दी)', 'Tamil (தமிழ்)', 'Telugu (తెలుగు)', 'Bengali (বাংলা)', 'Marathi (मराठी)'].map((lang) => (
                  <option key={lang} value={lang.split(' ')[0]} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {lang}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                Technical sandbox tests are evaluated in code; quizzes and AI explanations adapt to your dialect.
              </p>
            </div>

            {/* Target Companies Multi-Select */}
            <div>
              <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                Target Tech Startups & Enterprises:
              </span>
              <div className="flex flex-wrap gap-2">
                {['Swiggy', 'Zerodha', 'CRED', 'Razorpay', 'Google', 'Microsoft', 'Postman', 'Flipkart', 'Ola Electric', 'Texas Instruments'].map((comp) => {
                  const isSelected = formData.target_companies.includes(comp);
                  return (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => toggleCompany(comp)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 border border-amber-300 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-slate-300'
                      }`}
                      data-cursor="pointer"
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {comp}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LinkedIn-Grade Comprehensive Review Card */}
            <div className="p-5 rounded-3xl bg-slate-50/90 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                <div className="text-xs font-black uppercase text-teal-700 dark:text-teal-400 tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Profile Overview (Ready for Vector Gap Analysis)</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                  AICTE AI Engine
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Candidate</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{formData.name}</span>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Institution</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate block text-sm" title={formData.college}>
                    {formData.college}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Degree & Stream</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block truncate" title={formData.stream}>
                    {formData.stream}
                  </span>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">Sem {formData.semester} • Class of {formData.grad_year}</span>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Domain of Focus</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block truncate">{formData.domain}</span>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Target Career Role</span>
                  <span className="font-black text-amber-600 dark:text-[#FBBF24] text-sm block truncate">{formData.dream_role}</span>
                </div>

                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Selected Skills</span>
                  <span className="font-black text-teal-600 dark:text-teal-400 text-sm">{formData.self_reported_skills.length} Competencies</span>
                  <span className="text-[10px] text-slate-400 block truncate">{formData.preferred_location}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer Buttons */}
      <div className="flex items-center justify-between pt-2">
        {currentStep > 1 ? (
          <Button
            variant="secondary"
            size="md"
            onClick={handleBack}
            iconLeft={ArrowLeft}
            className="px-5 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            data-cursor="pointer"
          >
            Back
          </Button>
        ) : (
          <div />
        )}

        <Button
          variant="accent"
          size="md"
          onClick={handleNext}
          loading={loading}
          iconRight={currentStep === totalSteps ? CheckCircle2 : ArrowRight}
          className="px-7 text-slate-950 font-black shadow-accent hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          data-cursor="pointer"
        >
          {currentStep === totalSteps ? 'Compute Real-Time Gap Analysis' : 'Continue'}
        </Button>
      </div>

    </div>
  );
};

export default OnboardingPage;
