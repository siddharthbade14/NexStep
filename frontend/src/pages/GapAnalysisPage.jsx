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
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';

export const GapAnalysisPage = ({ onSelectSkillToVerify }) => {
  const { student, setActiveTab } = useStudent();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('all_gaps'); // 'all_gaps', 'all', 'verified', 'covered'

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
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#1F4E5F] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-700">
          Running sentence-transformers semantic matching on your syllabus...
        </p>
      </div>
    );
  }

  const gapSkills = data?.gap_skills || [];
  const coveredSkills = data?.covered_skills || [];
  const verifiedCount = student.verified_skills?.length || 0;
  const totalGaps = gapSkills.length;

  const filteredSkills = () => {
    if (filter === 'all_gaps') return gapSkills;
    if (filter === 'verified') return gapSkills.filter(s => student.verified_skills?.includes(s.id));
    if (filter === 'covered') return coveredSkills;
    return [...gapSkills, ...coveredSkills];
  };

  return (
    <div className="space-y-8 py-2 sm:py-4">
      
      {/* HEADER BANNER & STUDENT OVERVIEW */}
      <div className="bg-brand-gradient text-white rounded-3xl p-6 sm:p-8 shadow-brand relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent" size="sm" icon={false}>
                Live Gap Analysis
              </Badge>
              <span className="text-xs text-teal-100 font-medium">
                {student.course} • Semester {student.semester}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Curriculum Gap Report: {data?.dream_role}
            </h1>
            <p className="text-xs sm:text-sm text-teal-50 max-w-2xl leading-relaxed">
              {data?.role_overview}
            </p>
          </div>

          {/* Quick Refresh & Switch Role */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('onboarding')}
              className="px-4 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-colors"
            >
              Edit Degree / Role
            </button>
            <button
              onClick={loadAnalysis}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-colors"
              title="Re-run Semantic Analysis"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* READINESS & METRICS SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* Readiness Score Card */}
        <Card variant="elevated" hover className="p-6 flex flex-col items-center justify-center text-center bg-white border-slate-200/90 shadow-xs hover:border-teal-500/40">
          <CircularProgress
            percentage={data?.readiness_percentage || 25}
            size={105}
            strokeWidth={10}
            title="Industry Readiness"
            subtitle="Based on verified skills"
          />
        </Card>

        {/* Verified Skills Summary Card */}
        <Card variant="elevated" hover className="p-6 flex flex-col justify-between bg-white border-slate-200/90 shadow-xs hover:border-teal-500/40">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Verification Progress
              </span>
              <div className="icon-3d icon-3d-emerald w-8 h-8 rounded-xl flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {verifiedCount}
              </span>
              <span className="text-sm font-semibold text-slate-500">
                of {totalGaps} verified
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <ProgressBar
              value={verifiedCount}
              max={totalGaps || 1}
              color="emerald"
              size="sm"
            />
          </div>
        </Card>

        {/* University Coverage Card */}
        <Card variant="elevated" hover className="p-6 flex flex-col justify-between bg-white border-slate-200/90 shadow-xs hover:border-teal-500/40">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                University Coverage
              </span>
              <div className="icon-3d icon-3d-navy w-8 h-8 rounded-xl flex items-center justify-center shadow-xs">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {coveredSkills.length}
              </span>
              <span className="text-sm font-semibold text-slate-500">
                of {data?.total_role_skills || 8} skills
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <ProgressBar
              value={coveredSkills.length}
              max={data?.total_role_skills || 8}
              color="teal"
              size="sm"
            />
          </div>
        </Card>

        {/* Target Salary Band */}
        <Card variant="elevated" hover className="p-6 flex flex-col justify-between bg-white border-slate-200/90 shadow-xs hover:border-amber-400">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Target Salary Band
              </span>
              <div className="icon-3d icon-3d-amber w-8 h-8 rounded-xl flex items-center justify-center shadow-xs">
                <TrendingUp className="w-4 h-4 text-amber-950" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {data?.target_salary_band || '8.5 - 18 LPA'}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            Based on current Bangalore/NCR tech stipends
          </div>
        </Card>

      </div>

      {/* FILTER BUTTONS & TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter('all_gaps')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
              filter === 'all_gaps'
                ? 'bg-brand-gradient text-white shadow-brand'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Missing Curriculum Gaps ({gapSkills.length})
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
              filter === 'verified'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Verified Skills ({verifiedCount})
          </button>
          <button
            onClick={() => setFilter('covered')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
              filter === 'covered'
                ? 'bg-[#1F4E5F] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Syllabus Covered ({coveredSkills.length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
              filter === 'all'
                ? 'bg-[#1F4E5F] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Role Skills ({data?.total_role_skills || 8})
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Embeddings: <strong className="text-slate-700 font-mono">all-MiniLM-L6-v2</strong>
        </div>
      </div>

      {/* RANKED GAP SKILLS LIST WITH 3D ACCENTS */}
      <div className="space-y-4">
        {filteredSkills().map((skill) => {
          const isVerified = student.verified_skills?.includes(skill.id);
          const isGap = skill.is_gap;

          return (
            <Card
              key={skill.id}
              hover
              className={`p-6 transition-all border ${
                isVerified
                  ? 'border-teal-300/90 bg-gradient-to-r from-emerald-50/40 via-white to-teal-50/20 shadow-xs hover:border-teal-500/50'
                  : isGap
                  ? 'border-amber-300/90 bg-gradient-to-r from-amber-50/30 via-white to-orange-50/15 hover:border-amber-400/90 shadow-xs'
                  : 'border-slate-200/90 bg-white hover:border-slate-300'
              }`}
            >
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

                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {isVerified ? (
                        <Badge variant="verified" size="sm">
                          Verified by Code Challenge
                        </Badge>
                      ) : isGap ? (
                        <Badge variant="gap" size="sm">
                          Curriculum Gap ({Math.round(skill.similarity_score * 100)}% match)
                        </Badge>
                      ) : (
                        <Badge variant="covered" size="sm">
                          Covered in Syllabus ({Math.round(skill.similarity_score * 100)}% match)
                        </Badge>
                      )}

                      <Badge variant="neutral" size="sm" icon={false}>
                        {skill.category}
                      </Badge>

                      <Badge variant="neutral" size="sm" icon={false}>
                        {skill.difficulty}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span>{skill.name}</span>
                        {isVerified && <CheckCircle2 className="w-5 h-5 text-teal-600 inline shrink-0" />}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        <strong className="text-slate-800">Why recruiters test this: </strong>
                        {skill.industry_relevance}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Expected Industry Depth: </span>
                      <span>{skill.expected_depth}</span>
                      <div className="mt-1 text-[11px] text-slate-400">
                        Closest College Subject: <span className="font-mono text-slate-600 font-medium">{skill.curriculum_match_subject}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Action CTAs */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2.5 min-w-[200px] shrink-0">
                  {isVerified ? (
                    <div className="w-full text-center lg:text-right">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-100/90 px-3.5 py-1.5 rounded-xl border border-teal-200 shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        <span>Skill Verified</span>
                      </div>
                      <button
                        onClick={() => handleVerifySkill(skill.id)}
                        className="block text-[11px] text-slate-500 hover:text-slate-800 mt-1.5 underline"
                      >
                        Re-take Challenge
                      </button>
                    </div>
                  ) : (
                    <>
                      <Button
                        variant="accent"
                        size="md"
                        onClick={() => handleVerifySkill(skill.id)}
                        iconLeft={Code2}
                        className="w-full text-xs font-bold shadow-accent hover:scale-[1.02]"
                      >
                        Verify This Skill
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleGoToResources(skill.id)}
                        iconLeft={BookOpen}
                        className="w-full text-xs hover:border-teal-400"
                      >
                        Free Learning Guide
                      </Button>
                    </>
                  )}
                </div>

              </div>
            </Card>
          );
        })}
      </div>

    </div>
  );
};
