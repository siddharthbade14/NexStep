import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { CircularProgress, ProgressBar } from '../components/common/ProgressBar';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  BookOpen, 
  Code2, 
  TrendingUp, 
  GraduationCap, 
  Briefcase, 
  RefreshCw,
  Clock,
  Layers,
  ChevronRight,
  ShieldCheck,
  Search,
  Zap,
  Target,
  BarChart3,
  Cpu,
  Flame,
  Award
} from 'lucide-react';
import { api } from '../services/api';

const AVAILABLE_ROLES = [
  { id: 'Software Developer', title: 'Software Developer', icon: Code2, salary: '₹8.5 - 18 LPA', badge: 'High Demand' },
  { id: 'Data Analyst', title: 'Data Analyst', icon: BarChart3, salary: '₹6.5 - 14 LPA', badge: 'Rapid Growth' },
  { id: 'Embedded Systems Engineer', title: 'Embedded / IoT', icon: Cpu, salary: '₹7.0 - 16 LPA', badge: 'Hardware' }
];

export const GapAnalysisPage = ({ onSelectSkillToVerify }) => {
  const { student, updateProfile, setActiveTab } = useStudent();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('all_gaps'); // 'all_gaps', 'all', 'verified', 'covered'
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAnalysis = async () => {
    setLoading(true);
    try {
      const res = await api.getGapAnalysis({
        studentId: student.id,
        course: student.course,
        semester: student.semester,
        dreamRole: student.dream_role
      });
      setData(res);
    } catch (e) {
      console.warn('Gap analysis API call failed, using cached state', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysis();
  }, [student.course, student.semester, student.dream_role, student.verified_skills]);

  const handleRoleChange = (newRole) => {
    updateProfile({ dream_role: newRole });
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await loadAnalysis();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleVerifySkill = (skillId) => {
    if (onSelectSkillToVerify) {
      onSelectSkillToVerify(skillId);
    } else {
      setActiveTab('verification');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToResources = (skillId) => {
    setActiveTab('resources');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && !data) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-14 h-14 border-4 border-[#1F4E5F] border-t-amber-400 rounded-full animate-spin mx-auto shadow-md" />
        <div className="space-y-1">
          <h3 className="text-base font-black text-slate-900 tracking-tight">Computing AI Semantic Gap Analysis</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Evaluating 384-dimensional vector similarity across university course syllabi vs. active industry hiring specs...
          </p>
        </div>
      </div>
    );
  }

  const gapSkills = data?.gap_skills || [];
  const coveredSkills = data?.covered_skills || [];
  const verifiedCount = student.verified_skills?.length || 0;
  const totalGaps = gapSkills.length;
  const readinessPercent = data?.readiness_percentage || (totalGaps > 0 ? Math.round((verifiedCount / totalGaps) * 100) : 25);

  // Highest ROI unverified skill for recommendation
  const nextRecommendedSkill = gapSkills.find(s => !student.verified_skills?.includes(s.id)) || gapSkills[0];

  const filteredSkills = () => {
    let list = [];
    if (filter === 'all_gaps') list = gapSkills;
    else if (filter === 'verified') list = gapSkills.filter(s => student.verified_skills?.includes(s.id));
    else if (filter === 'covered') list = coveredSkills;
    else list = [...gapSkills, ...coveredSkills];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => 
        s.name?.toLowerCase().includes(q) || 
        s.category?.toLowerCase().includes(q) ||
        s.expected_depth?.toLowerCase().includes(q)
      );
    }
    return list;
  };

  return (
    <div className="space-y-8 py-2 sm:py-4 max-w-6xl mx-auto">
      
      {/* HEADER HERO BANNER */}
      <div className="bg-brand-dark-gradient text-white rounded-3xl p-6 sm:p-9 shadow-2xl border border-slate-800 relative overflow-hidden">
        {/* Ambient radial lighting */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-2xl">
            
            {/* Top Telemetry Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 backdrop-blur-md text-[11px] font-semibold text-teal-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>AI Embeddings Active (all-MiniLM-L6-v2)</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[11px] font-medium text-slate-300 border border-white/15">
                <GraduationCap className="w-3.5 h-3.5 text-[#F4B942]" />
                <span>{student.college || 'Delhi Technological University (DTU)'}</span>
              </div>
            </div>

            {/* Main Headline */}
            <div>
              <div className="text-xs font-bold text-amber-400 tracking-wider uppercase mb-1">
                Semester {student.semester} • {student.course} Career Intelligence
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                Curriculum Gap Dashboard: <span className="text-[#F4B942]">{data?.dream_role}</span>
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {data?.role_overview || 'We dynamically cross-reference your university semester curriculum with real recruiter technical screening benchmarks.'}
            </p>

            {/* Quick Interactive Target Role Switcher */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-teal-400" />
                <span>Target Career Track</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_ROLES.map((r) => {
                  const Icon = r.icon;
                  const isCurrent = student.dream_role === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleRoleChange(r.id)}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
                        isCurrent
                          ? 'bg-gradient-to-r from-amber-400 to-[#F4B942] text-slate-950 shadow-md shadow-amber-500/20 ring-2 ring-amber-300'
                          : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700/90 border border-slate-700'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{r.title}</span>
                      {isCurrent && <span className="text-[10px] bg-slate-950/20 px-1 rounded">Active</span>}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Quick Stats Summary Card on Right */}
          <div className="bg-slate-900/85 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 min-w-[220px] text-center space-y-3 shadow-xl shrink-0 self-start lg:self-center">
            <div className="icon-3d icon-3d-amber w-12 h-12 rounded-2xl mx-auto flex items-center justify-center">
              <Award className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Placement Readiness Rank</span>
              <div className="text-2xl sm:text-3xl font-black text-[#F4B942] tracking-tight">
                Top {readinessPercent >= 50 ? '15%' : '35%'}
              </div>
              <span className="text-[11px] text-teal-300 font-medium">Batch Placement Tier</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-2">
              <button
                onClick={handleManualRefresh}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                title="Refresh Semantic Engine"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-teal-400' : ''}`} />
                <span>Sync Analysis</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* READINESS & METRICS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Readiness Score Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-teal-500/40 transition-all duration-300 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1F4E5F] via-teal-400 to-[#F4B942]"></div>
          <CircularProgress
            percentage={readinessPercent}
            size={110}
            strokeWidth={10}
            title="Industry Readiness"
            subtitle={`${verifiedCount} of ${totalGaps} core skills certified`}
          />
          <div className="mt-3">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
              readinessPercent >= 70
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : readinessPercent >= 35
                ? 'bg-teal-100 text-teal-800 border border-teal-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}>
              {readinessPercent >= 70 ? 'Placement Qualified' : readinessPercent >= 35 ? 'Accelerated Learner' : 'Foundational Stage'}
            </span>
          </div>
        </div>

        {/* Verified Skills Summary Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-400/50 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                Certified Assertions
              </span>
              <div className="icon-3d icon-3d-emerald w-9 h-9 rounded-xl flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-4.5 h-4.5 text-white" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {verifiedCount}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                of {totalGaps} requirements verified
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
            {/* Segmented Progress Blocks */}
            <div className="flex items-center gap-1">
              {[...Array(totalGaps || 8)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                    i < verifiedCount 
                      ? 'bg-emerald-500 shadow-xs' 
                      : 'bg-slate-200'
                  }`}
                  title={i < verifiedCount ? `Skill ${i + 1} Verified` : `Skill ${i + 1} Pending`}
                />
              ))}
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{Math.round((verifiedCount / (totalGaps || 1)) * 100)}% verification completed</span>
            </p>
          </div>
        </div>

        {/* University Coverage Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-teal-500/40 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#1F4E5F]"></div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                Curriculum Overlap
              </span>
              <div className="icon-3d icon-3d-navy w-9 h-9 rounded-xl flex items-center justify-center shadow-xs">
                <GraduationCap className="w-4.5 h-4.5 text-white" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {coveredSkills.length}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                of {data?.total_role_skills || 8} Syllabus Subjects
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
            <ProgressBar
              value={coveredSkills.length}
              max={data?.total_role_skills || 8}
              color="teal"
              size="sm"
            />
            <span className="text-[11px] text-slate-500 block font-medium">
              Autonomous College Syllabus Synced
            </span>
          </div>
        </div>

        {/* Target Salary Band */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-400/60 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400"></div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                Fresher CTC Benchmark
              </span>
              <div className="icon-3d icon-3d-amber w-9 h-9 rounded-xl flex items-center justify-center shadow-xs">
                <TrendingUp className="w-4.5 h-4.5 text-amber-950" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {data?.target_salary_band || '₹8.5 - 18 LPA'}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-medium">Placement Demand:</span>
            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
              High Volume
            </span>
          </div>
        </div>

      </div>

      {/* CURRICULUM VS INDUSTRY EXPECTATION GAP MATRIX */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="icon-3d icon-3d-navy w-7 h-7 rounded-lg flex items-center justify-center">
                <Layers className="w-4 h-4 text-teal-300" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Curriculum vs. Industry Expectation Gap Matrix
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Differential comparison showing where university curricula stop and industry expectations begin.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-300 inline-block" />
              <span className="text-slate-600">College Syllabi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-gradient-to-r from-[#1F4E5F] to-teal-500 inline-block" />
              <span className="text-teal-900 font-bold">Industry Benchmark</span>
            </div>
          </div>
        </div>

        {/* 4 Core Domain Benchmarks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              domain: 'Problem Solving & Algorithmic Complexity',
              college: 80,
              industry: 90,
              gap: 'Minimal Gap (10%)',
              status: 'minimal',
              notes: 'College covers sorting & trees; industry expects HashMaps, DP, and space-time optimization.'
            },
            {
              domain: 'Production REST APIs & Async Backends',
              college: 25,
              industry: 95,
              gap: 'Critical Gap (70%)',
              status: 'critical',
              notes: 'College teaches static SQL or PHP; industry tests token auth, rate limiting, and FastAPI.'
            },
            {
              domain: 'Containerization & DevOps Pipelines',
              college: 15,
              industry: 85,
              gap: 'High Priority (70%)',
              status: 'high',
              notes: 'Rarely covered in university labs; mandatory for modern microservices and deployments.'
            },
            {
              domain: 'Production Database Tuning & Indexing',
              college: 50,
              industry: 90,
              gap: 'Moderate Gap (40%)',
              status: 'moderate',
              notes: 'College teaches 3NF normalization; industry requires query profiling and connection pooling.'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 tracking-tight">{item.domain}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  item.status === 'minimal' 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : item.status === 'critical'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {item.gap}
                </span>
              </div>

              {/* Differential Comparison Bar */}
              <div className="space-y-1">
                <div className="h-2.5 w-full bg-slate-200/80 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-slate-400" 
                    style={{ width: `${item.college}%` }}
                    title={`College Coverage: ${item.college}%`}
                  />
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-[#1F4E5F]" 
                    style={{ width: `${item.industry - item.college}%` }}
                    title={`Industry Delta: ${item.industry - item.college}%`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>College: {item.college}%</span>
                  <span className="text-teal-700 font-bold">Target: {item.industry}%</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-snug">
                {item.notes}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* HIGHEST ROI RECOMMENDATION ACTION CARD */}
      {nextRecommendedSkill && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-teal-500/10 to-amber-500/15 border-2 border-amber-400/80 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="icon-3d icon-3d-amber w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md">
              <Flame className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-400/20 text-amber-900 text-[10px] font-black uppercase tracking-wider mb-1 border border-amber-400/40">
                <Zap className="w-3 h-3 text-amber-600" />
                <span>Highest ROI Next Action</span>
              </div>
              <h4 className="text-base font-black text-slate-900 tracking-tight">
                Recommended Next Target: {nextRecommendedSkill.name}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 max-w-xl leading-relaxed">
                Closing this priority requirement will advance your placement readiness score to <strong className="text-teal-800 font-bold">{Math.min(100, readinessPercent + 15)}%</strong> and qualify you for active internship applications.
              </p>
            </div>
          </div>
          <Button
            variant="accent"
            size="md"
            onClick={() => handleVerifySkill(nextRecommendedSkill.id)}
            iconRight={ArrowRight}
            className="text-xs font-bold text-slate-950 shadow-accent shrink-0 px-6 hover:scale-105 active:scale-95"
          >
            Launch Challenge
          </Button>
        </div>
      )}

      {/* FILTER BUTTONS & SEARCH TOOLBAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter('all_gaps')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
              filter === 'all_gaps'
                ? 'bg-gradient-to-r from-[#1F4E5F] to-[#2C6E8F] text-white shadow-md shadow-[#1F4E5F]/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/90'
            }`}
          >
            Curriculum Gaps ({gapSkills.length})
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
              filter === 'verified'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/90'
            }`}
          >
            Verified Certified ({verifiedCount})
          </button>
          <button
            onClick={() => setFilter('covered')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
              filter === 'covered'
                ? 'bg-[#1F4E5F] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/90'
            }`}
          >
            University Covered ({coveredSkills.length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
              filter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/90'
            }`}
          >
            All Role Skills ({data?.total_role_skills || 8})
          </button>
        </div>

        {/* Real-time Search Input */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills by keyword..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200/90 text-xs font-medium text-slate-800 bg-white shadow-2xs focus:ring-2 focus:ring-[#1F4E5F] focus:border-transparent transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* RANKED GAP SKILLS LIST WITH 3D ACCENTS */}
      <div className="space-y-4">
        {filteredSkills().length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
            <div className="icon-3d icon-3d-amber w-12 h-12 rounded-2xl mx-auto flex items-center justify-center">
              <Search className="w-5 h-5 text-slate-950" />
            </div>
            <h4 className="text-base font-black text-slate-900">No skills match your search query</h4>
            <p className="text-xs text-slate-500">Try clearing the search box or selecting a different tab.</p>
            <Button variant="secondary" size="sm" onClick={() => setSearchQuery('')}>Clear Search</Button>
          </div>
        ) : (
          filteredSkills().map((skill) => {
            const isVerified = student.verified_skills?.includes(skill.id);
            const isGap = skill.is_gap;

            // Difficulty styling
            const diffDotClass = skill.difficulty === 'Beginner' 
              ? 'bg-emerald-500' 
              : skill.difficulty === 'Advanced' 
              ? 'bg-purple-500' 
              : 'bg-amber-500';

            return (
              <div
                key={skill.id}
                className={`p-6 sm:p-7 rounded-3xl transition-all duration-300 border relative overflow-hidden bg-white hover:-translate-y-0.5 ${
                  isVerified
                    ? 'border-teal-300/90 shadow-xs hover:border-teal-500/70 hover:shadow-md'
                    : isGap
                    ? 'border-amber-300/80 shadow-xs hover:border-amber-400 hover:shadow-md'
                    : 'border-slate-200/90 shadow-2xs hover:border-slate-300'
                }`}
              >
                {/* Specular top sheen line */}
                {isVerified ? (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
                ) : isGap ? (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-[#F4B942] to-amber-500" />
                ) : (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-teal-500" />
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Left Info with 3D Icon Badge */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`icon-3d ${isVerified ? 'icon-3d-emerald' : isGap ? 'icon-3d-amber' : 'icon-3d-blue'} w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shrink-0 mt-1`}>
                      {isVerified ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : isGap ? (
                        <AlertCircle className="w-6 h-6 text-amber-950" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-white" />
                      )}
                    </div>

                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {isVerified ? (
                          <Badge variant="verified" size="sm">
                            Verified by Sandbox Assertions
                          </Badge>
                        ) : isGap ? (
                          <Badge variant="gap" size="sm">
                            Curriculum Gap
                          </Badge>
                        ) : (
                          <Badge variant="covered" size="sm">
                            Covered in University Syllabus
                          </Badge>
                        )}

                        <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                          {skill.category}
                        </span>

                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                          <span className={`w-2 h-2 rounded-full ${diffDotClass}`} />
                          <span>{skill.difficulty}</span>
                        </span>

                        {skill.similarity_score && (
                          <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
                            {Math.round(skill.similarity_score * 100)}% Cosine Match
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 tracking-tight">
                          <span>{skill.name}</span>
                          {isVerified && <CheckCircle2 className="w-5 h-5 text-teal-600 inline shrink-0" />}
                        </h3>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          <strong className="text-slate-800">Recruiter Evaluation Intent: </strong>
                          {skill.industry_relevance}
                        </p>
                      </div>

                      {/* Explicit Contrast Box: University Theory vs Industry Depth */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/80 text-xs space-y-1.5">
                        <div className="flex items-start gap-2">
                          <span className="text-slate-400 font-bold shrink-0 text-[11px] uppercase tracking-wider">🎓 College Basis:</span>
                          <span className="text-slate-700 font-medium">{skill.curriculum_match_subject || 'Theory lectures & semester end exam'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-teal-700 font-bold shrink-0 text-[11px] uppercase tracking-wider">💼 Industry Tests:</span>
                          <span className="text-slate-800 font-semibold">{skill.expected_depth}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Action CTAs */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2.5 min-w-[210px] shrink-0">
                    {isVerified ? (
                      <div className="w-full text-center lg:text-right space-y-1">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-300 shadow-2xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Certification Active</span>
                        </div>
                        <button
                          onClick={() => handleVerifySkill(skill.id)}
                          className="block text-[11px] font-semibold text-slate-500 hover:text-slate-900 mt-1.5 transition-colors underline"
                        >
                          Re-evaluate Code Solution
                        </button>
                      </div>
                    ) : (
                      <>
                        <Button
                          variant="accent"
                          size="md"
                          onClick={() => handleVerifySkill(skill.id)}
                          iconLeft={Code2}
                          className="w-full text-xs font-bold shadow-accent hover:scale-[1.02] active:scale-[0.98]"
                        >
                          Verify in Sandbox IDE
                        </Button>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleGoToResources(skill.id)}
                          iconLeft={BookOpen}
                          className="w-full text-xs hover:border-teal-400 text-slate-700"
                        >
                          Free Learning Guide
                        </Button>
                      </>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default GapAnalysisPage;
