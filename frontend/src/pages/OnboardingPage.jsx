import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
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
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';

export const OnboardingPage = () => {
  const { student, updateProfile, setActiveTab } = useStudent();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: student.name || 'Aarav Sharma',
    college: student.college || 'Delhi Technological University (DTU)',
    course: student.course || 'B.Tech CSE',
    semester: student.semester || 5,
    dream_role: student.dream_role || 'Software Developer',
    language: student.language || 'English',
    self_reported_skills: student.self_reported_skills || ['Python', 'Data Structures', 'DBMS', 'Git']
  });

  const [customSkillInput, setCustomSkillInput] = useState('');

  // When demo account is clicked or student profile is reset, start Onboarding strictly from Step 1
  useEffect(() => {
    if (student?.resetTimestamp) {
      setCurrentStep(1);
      setFormData({
        name: student.name || '',
        college: student.college || 'Delhi Technological University (DTU)',
        course: student.course || 'B.Tech CSE',
        semester: student.semester || 1,
        dream_role: student.dream_role || 'Software Developer',
        language: student.language || 'English',
        self_reported_skills: student.self_reported_skills || []
      });
      setCustomSkillInput('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [student?.resetTimestamp]);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const data = await api.getOnboardingMeta();
        setMeta(data);
      } catch (e) {
        console.warn('Could not fetch meta from backend, using defaults', e);
      }
    };
    loadMeta();
  }, []);

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const toggleSkill = (skill) => {
    setFormData(prev => {
      const skills = prev.self_reported_skills || [];
      if (skills.includes(skill)) {
        return { ...prev, self_reported_skills: skills.filter(s => s !== skill) };
      } else {
        return { ...prev, self_reported_skills: [...skills, skill] };
      }
    });
  };

  const addCustomSkill = (e) => {
    e.preventDefault();
    if (!customSkillInput.trim()) return;
    const trimmed = customSkillInput.trim();
    if (!formData.self_reported_skills.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        self_reported_skills: [...prev.self_reported_skills, trimmed]
      }));
    }
    setCustomSkillInput('');
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      self_reported_skills: prev.self_reported_skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await api.submitOnboarding(formData);
      updateProfile(result);
    } catch (err) {
      console.warn('Backend submission failed, saving locally', err);
      updateProfile(formData);
    } finally {
      setLoading(false);
      setActiveTab('gap-analysis');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const availableCourses = meta?.courses || [
    { id: 'B.Tech CSE', name: 'B.Tech Computer Science & Engineering' },
    { id: 'B.Tech ECE', name: 'B.Tech Electronics & Communication Engineering' },
    { id: 'B.Tech IT', name: 'B.Tech Information Technology' },
    { id: 'B.Tech Electrical', name: 'B.Tech Electrical Engineering' }
  ];

  const availableRoles = meta?.roles || [
    { id: 'Software Developer', title: 'Software Developer', badge: 'High Demand', avg_salary: '₹8.5 - 18 LPA' },
    { id: 'Data Analyst', title: 'Data Analyst', badge: 'Rapid Growth', avg_salary: '₹6.5 - 14 LPA' },
    { id: 'Embedded Systems Engineer', title: 'Embedded Systems Engineer', badge: 'Hardware / IoT', avg_salary: '₹7.0 - 16 LPA' }
  ];

  const suggestedSkillsList = meta?.suggested_skills || [
    'Python', 'C++', 'Java', 'SQL', 'JavaScript', 'HTML/CSS',
    'Data Structures', 'Git', 'React', 'DBMS', 'Operating Systems',
    'Machine Learning', 'FastAPI', 'Pandas', 'Docker', 'Embedded C'
  ];

  const availableLanguages = meta?.languages || [
    'English', 'Hindi (हिन्दी)', 'Tamil (தமிழ்)', 'Telugu (తెలుగు)', 'Bengali (বাংলা)', 'Marathi (मराठी)'
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 sm:py-8">
      
      {/* Onboarding Header */}
      <div className="text-center space-y-3">
        <div className="icon-3d icon-3d-navy w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
          <Sparkles className="w-7 h-7 text-teal-300" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-xs font-bold text-[#1F4E5F] border border-teal-200">
          <Target className="w-3.5 h-3.5 text-[#F4B942]" />
          <span>Student Profiling & Curriculum Matcher</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Let’s Map Your Career Journey
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Tell us about your university and current skills to compute your real-time curriculum gap analysis and unlocked career pathway.
        </p>
      </div>

      {/* Modern 4-Step Stepper Header */}
      <div className="glass-card-premium p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          {[
            { num: 1, label: 'College' },
            { num: 2, label: 'Term & Skills' },
            { num: 3, label: 'Target Role' },
            { num: 4, label: 'Confirmation' }
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
                        ? 'bg-gradient-to-r from-[#1F4E5F] to-[#2C6E8F] text-white shadow-brand scale-110 glow-ring-teal'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4 text-white" /> : s.num}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-bold tracking-tight ${
                    isCurrent ? 'text-[#1F4E5F]' : isDone ? 'text-emerald-700' : 'text-slate-400'
                  }`}>
                    {s.label}
                  </span>
                </div>

                {idx < 3 && (
                  <div className="flex-1 h-1 mx-2 sm:mx-4 rounded-full bg-slate-100 overflow-hidden relative -top-3">
                    <div 
                      className={`h-full transition-all duration-500 ease-out ${
                        currentStep > idx + 1 ? 'bg-emerald-500' : currentStep === idx + 1 ? 'bg-gradient-to-r from-[#1F4E5F] to-amber-400 w-1/2' : 'w-0'
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

      {/* STEP 1: College & Course */}
      {currentStep === 1 && (
        <div className="p-6 sm:p-8 space-y-6 bg-white border border-slate-200/90 rounded-3xl shadow-lg animate-in fade-in duration-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1F4E5F] to-teal-400"></div>

          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
            <div className="icon-3d icon-3d-navy w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Your College & Degree</h2>
              <p className="text-xs text-slate-500">We cross-reference state and autonomous college syllabi across India</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1F4E5F] text-sm text-slate-900 bg-slate-50/50 hover:border-slate-300 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                College / University Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. Delhi Technological University, Anna University, NIT Trichy"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1F4E5F] text-sm text-slate-900 bg-slate-50/50 hover:border-slate-300 transition-colors"
                />
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Works for Tier 1, 2, and 3 state university curricula across India.
              </p>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                Select Your Course
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableCourses.map((c) => {
                  const isSelected = formData.course === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setFormData({ ...formData, course: c.id })}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                        isSelected
                          ? 'border-[#1F4E5F] bg-teal-50/60 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 bg-white shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-slate-900">{c.id}</span>
                        {isSelected ? (
                          <span className="w-5 h-5 rounded-full bg-[#1F4E5F] text-white flex items-center justify-center text-xs">
                            <Check className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full border border-slate-300"></span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-snug">{c.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Semester & Self-Reported Skills */}
      {currentStep === 2 && (
        <div className="p-6 sm:p-8 space-y-6 bg-white border border-slate-200/90 rounded-3xl shadow-lg animate-in fade-in duration-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-[#F4B942]"></div>

          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
            <div className="icon-3d icon-3d-amber w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Current Semester & Known Skills</h2>
              <p className="text-xs text-slate-500">Helps compute completed vs pending degree requirements</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Semester Selector */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                Current Semester
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                  const isSelected = formData.semester === sem;
                  return (
                    <button
                      key={sem}
                      type="button"
                      onClick={() => setFormData({ ...formData, semester: sem })}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#1F4E5F] to-[#2C6E8F] text-white shadow-md shadow-[#1F4E5F]/30 scale-105'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Sem {sem}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Self-Reported Skills Tag Cloud */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                Skills You Already Know / Have Used
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestedSkillsList.map((skill) => {
                  const isSelected = formData.self_reported_skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95 ${
                        isSelected
                          ? 'bg-[#1F4E5F] text-white shadow-xs font-bold'
                          : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Free Text Input */}
              <form onSubmit={addCustomSkill} className="flex gap-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  placeholder="Add another skill (e.g. Next.js, Redis, OpenCV)..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1F4E5F] text-xs text-slate-900 bg-slate-50/50 hover:border-slate-300"
                />
                <Button type="submit" variant="secondary" size="sm" iconLeft={Plus} className="text-xs font-bold">
                  Add
                </Button>
              </form>

              {/* Active Selected Skills Pills */}
              {formData.self_reported_skills.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-2">
                    Selected Skills ({formData.self_reported_skills.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {formData.self_reported_skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 shadow-xs"
                      >
                        <span>{s}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(s)}
                          className="text-teal-600 hover:text-teal-900 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Interests & Dream Job/Role */}
      {currentStep === 3 && (
        <div className="p-6 sm:p-8 space-y-6 bg-white border border-slate-200/90 rounded-3xl shadow-lg animate-in fade-in duration-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-[#1F4E5F]"></div>

          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
            <div className="icon-3d icon-3d-navy w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
              <Target className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Your Target / Dream Role</h2>
              <p className="text-xs text-slate-500">We will calculate your curriculum gap and roadmap specifically for this role</p>
            </div>
          </div>

          <div className="space-y-4">
            {availableRoles.map((role) => {
              const isSelected = formData.dream_role === role.id;
              const roleIconMap = {
                'Software Developer': 'icon-3d-navy',
                'Data Analyst': 'icon-3d-amber',
                'Embedded Systems Engineer': 'icon-3d-emerald'
              };
              const rolePedestal = roleIconMap[role.id] || 'icon-3d-navy';

              return (
                <div
                  key={role.id}
                  onClick={() => setFormData({ ...formData, dream_role: role.id })}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
                    isSelected
                      ? 'border-[#1F4E5F] bg-teal-50/40 shadow-md ring-1 ring-[#1F4E5F]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className={`icon-3d ${rolePedestal} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
                        {role.id.includes('Data') ? (
                          <Sparkles className="w-5 h-5 text-slate-950" />
                        ) : role.id.includes('Embedded') ? (
                          <Target className="w-5 h-5 text-white" />
                        ) : (
                          <Code className="w-5 h-5 text-teal-300" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-slate-900 tracking-tight">{role.title}</span>
                          <Badge variant="accent" size="sm" icon={false}>{role.badge}</Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          Expected Fresher CTC: <strong className="text-slate-800 font-bold">{role.avg_salary}</strong>
                        </p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'border-[#1F4E5F] bg-[#1F4E5F] text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 4: Preferred Language & Review */}
      {currentStep === 4 && (
        <div className="p-6 sm:p-8 space-y-6 bg-white border border-slate-200/90 rounded-3xl shadow-lg animate-in fade-in duration-200 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>

          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
            <div className="icon-3d icon-3d-purple w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
              <Languages className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Preferred Language & Confirmation</h2>
              <p className="text-xs text-slate-500">Vernacular career guidance for students across India</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                Preferred Guidance Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1F4E5F] text-sm text-slate-900 bg-slate-50/50 hover:border-slate-300 transition-colors cursor-pointer"
              >
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang.split(' ')[0]}>
                    {lang}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Technical topics are presented in English, with concepts and AI roadmaps personalized in your preferred vernacular dialect.
              </p>
            </div>

            {/* Profile Review Summary Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-teal-50/30 border border-slate-200 space-y-3 shadow-xs">
              <div className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Profile Review Summary</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/70">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Student</span>
                  <span className="font-bold text-slate-900 text-sm">{formData.name}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/70">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">University</span>
                  <span className="font-bold text-slate-900 truncate block text-sm">{formData.college}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/70">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Degree & Term</span>
                  <span className="font-bold text-slate-900 text-sm">{formData.course} • Sem {formData.semester}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200/70">
                  <span className="text-slate-400 font-medium block text-[10px] uppercase">Target Career</span>
                  <span className="font-black text-[#1F4E5F] text-sm">{formData.dream_role}</span>
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
            className="px-5 hover:-translate-y-0.5 active:translate-y-0"
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
          className="px-7 text-slate-950 font-bold shadow-accent hover:-translate-y-0.5 active:translate-y-0"
        >
          {currentStep === totalSteps ? 'Generate My Gap Analysis' : 'Continue'}
        </Button>
      </div>

    </div>
  );
};
