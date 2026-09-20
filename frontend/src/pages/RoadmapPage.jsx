import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { 
  Check,
  CheckCircle2, 
  Clock, 
  Lock, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Target, 
  GraduationCap, 
  Code2, 
  Briefcase, 
  Award, 
  Layers, 
  ChevronRight, 
  ShieldCheck, 
  Compass, 
  Zap 
} from 'lucide-react';
import { api } from '../services/api';

export const RoadmapPage = ({ onSelectSkillToVerify }) => {
  const { student, setActiveTab } = useStudent();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeNodeDetail, setActiveNodeDetail] = useState(null);

  const loadRoadmap = async () => {
    setLoading(true);
    try {
      const data = await api.getRoadmap(student.id, student.dream_role);
      setRoadmap(data);
      // default detail to the first in-progress node
      const inProg = data.nodes?.find(n => n.status === 'in_progress') || data.nodes?.[0];
      setActiveNodeDetail(inProg);
    } catch (e) {
      console.warn('Roadmap API call failed', e);
      // Safe fallback state so page never goes blank
      setRoadmap({
        student_id: student.id,
        dream_role: student.dream_role || 'Software Developer',
        nodes: [
          {
            id: 'foundation-core',
            title: 'College Core Curriculum',
            category: 'Academic Foundation',
            status: 'verified',
            order: 1,
            description: 'Core engineering principles and programming fundamentals from your college syllabus.',
            estimated_hours: 'Sem 1 - 4',
            is_target_role: false
          },
          {
            id: 'skill-git',
            title: 'Git & GitHub Collaboration',
            category: 'Tooling',
            status: student.verified_skills?.includes('skill-git') ? 'verified' : 'in_progress',
            order: 2,
            description: 'Branching, PRs, and team collaboration workflows.',
            estimated_hours: '3 Hours',
            is_target_role: false
          },
          {
            id: 'skill-rest-apis',
            title: 'RESTful APIs & FastAPI',
            category: 'Backend',
            status: student.verified_skills?.includes('skill-rest-apis') ? 'verified' : 'in_progress',
            order: 3,
            description: 'HTTP verbs, Pydantic validation, and production API design.',
            estimated_hours: '5 Hours',
            is_target_role: false
          },
          {
            id: 'target-goal',
            title: `Goal: ${student.dream_role || 'Software Developer'}`,
            category: 'Target Career',
            status: 'locked',
            order: 4,
            description: `Industry-ready ${student.dream_role} profile with verified practical skills.`,
            estimated_hours: 'Placement Ready',
            is_target_role: true
          }
        ],
        completion_percentage: 25
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmap();
  }, [student.verified_skills, student.completed_quizzes, student.dream_role]);

  const handleActionClick = (node) => {
    if (node.is_target_role) {
      setActiveTab('opportunities');
    } else {
      if (onSelectSkillToVerify) {
        onSelectSkillToVerify(node.id);
      } else {
        setActiveTab('verification');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && !roadmap) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#1F4E5F] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-700">
          Generating personalized career roadmap milestones...
        </p>
      </div>
    );
  }

  const nodes = roadmap?.nodes || [];
  const verifiedNodes = nodes.filter(n => n.status === 'verified').length;
  const totalNodes = nodes.length;
  const percentage = roadmap?.completion_percentage ?? (totalNodes > 0 ? Math.round((verifiedNodes / totalNodes) * 100) : 0);

  return (
    <div className="space-y-8 py-2 sm:py-4 max-w-6xl mx-auto">
      
      {/* HERO BANNER */}
      <div className="bg-brand-gradient text-white rounded-3xl p-6 sm:p-10 shadow-brand relative overflow-hidden">
        {/* Decorative Compass watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none translate-x-10">
          <Compass className="w-96 h-96 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-[#F4B942]" />
              <span>Personalized Placement Stepper</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Roadmap to {roadmap?.dream_role}
            </h1>
            
            <p className="text-xs sm:text-sm text-teal-100 max-w-2xl leading-relaxed">
              From your current college syllabus ({student.course}, Sem {student.semester}) to industry-standard placement qualification. 
              Color-coded by verification status.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 min-w-[220px] text-center sm:text-left space-y-2">
            <div className="flex items-center justify-between text-xs text-teal-100 font-semibold">
              <span>Roadmap Completion</span>
              <span className="text-white font-bold">{percentage}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-accent-gradient h-full rounded-full transition-all duration-700 ease-out" 
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="text-[11px] text-teal-200">
              {verifiedNodes} of {totalNodes} milestones certified
            </div>
          </div>
        </div>
      </div>

      {/* STATUS LEGEND */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#1F4E5F] inline-block shadow-xs" />
            <span className="text-slate-800">Deep Navy = Verified / College Core</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#F4B942] inline-block shadow-xs animate-pulse" />
            <span className="text-slate-800">Warm Amber = Current In-Progress Target</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-slate-300 inline-block" />
            <span className="text-slate-500">Slate Grey = Locked Future Milestone</span>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Target Role: <strong className="text-slate-900">{student.dream_role}</strong>
        </div>
      </div>

      {/* TIMELINE STEPPER LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT / CENTER: The Milestone Timeline (7 cols) */}
        <div className="lg:col-span-7 relative pl-6 sm:pl-8 space-y-8">
          
          {/* Vertical Connecting Pipeline Bar with Gradient Glow */}
          <div className="absolute left-4 sm:left-4.5 top-4 bottom-6 w-1.5 bg-gradient-to-b from-teal-600 via-[#F4B942] to-slate-200 rounded-full shadow-xs -z-0" />

          {nodes.map((node, index) => {
            const isVerified = node.status === 'verified';
            const isInProgress = node.status === 'in_progress';
            const isLocked = node.status === 'locked';
            const isSelected = activeNodeDetail?.id === node.id;

            return (
              <div
                key={node.id}
                onClick={() => setActiveNodeDetail(node)}
                className="relative flex items-start gap-4 sm:gap-6 cursor-pointer group"
              >
                {/* Node Milestone 3D Sphere Anchor */}
                <div
                  className={`relative z-10 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-md shrink-0 ${
                    isVerified
                      ? 'icon-3d icon-3d-navy ring-4 ring-teal-100 scale-105'
                      : isInProgress
                      ? 'icon-3d icon-3d-amber ring-4 ring-amber-300/80 shadow-accent scale-110 animate-pulse-glow'
                      : 'bg-white text-slate-400 border-2 border-slate-300 ring-2 ring-slate-100'
                  }`}
                >
                  {isVerified ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : isInProgress ? (
                    <Zap className="w-5 h-5 text-amber-950 fill-amber-950" />
                  ) : node.is_target_role ? (
                    <Target className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                {/* Node Card Box with Spring Hover */}
                <Card
                  variant="default"
                  hover
                  className={`flex-1 p-5 transition-all duration-300 border ${
                    isSelected
                      ? 'border-[#1F4E5F] ring-2 ring-teal-600/30 bg-white shadow-lg'
                      : isVerified
                      ? 'border-teal-200/90 bg-gradient-to-r from-teal-50/20 to-white hover:bg-white hover:border-teal-400 shadow-xs'
                      : isInProgress
                      ? 'border-amber-300 bg-gradient-to-r from-amber-50/30 to-white hover:bg-white shadow-brand'
                      : 'border-slate-200/90 bg-slate-50/70 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Milestone {node.order}
                        </span>

                        {isVerified ? (
                          <Badge variant="verified" size="sm">
                            Verified
                          </Badge>
                        ) : isInProgress ? (
                          <Badge variant="in_progress" size="sm">
                            In Progress
                          </Badge>
                        ) : (
                          <Badge variant="locked" size="sm">
                            Locked
                          </Badge>
                        )}

                        <span className="text-[11px] text-slate-400 font-medium">
                          {node.category}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1F4E5F] transition-colors">
                        {node.title}
                      </h3>

                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {node.description}
                      </p>
                    </div>

                    <ChevronRight className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                      isSelected ? 'text-[#1F4E5F] translate-x-1' : 'text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5'
                    }`} />
                  </div>
                </Card>
              </div>
            );
          })}

        </div>

        {/* RIGHT: Active Milestone Deep-Dive Inspection Card (5 cols sticky) */}
        <div className="lg:col-span-5 sticky top-8">
          {activeNodeDetail ? (
            <div className="glass-card-premium p-6 sm:p-8 space-y-6 rounded-3xl border border-slate-200/90 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    activeNodeDetail.status === 'verified'
                      ? 'bg-teal-50 text-teal-800'
                      : activeNodeDetail.status === 'in_progress'
                      ? 'bg-amber-50 text-amber-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {activeNodeDetail.status === 'verified' ? (
                      <CheckCircle2 className="w-5 h-5 text-teal-600" />
                    ) : activeNodeDetail.status === 'in_progress' ? (
                      <Clock className="w-5 h-5 text-amber-600" />
                    ) : (
                      <Lock className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Milestone #{activeNodeDetail.order} Details
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {activeNodeDetail.category}
                    </span>
                  </div>
                </div>

                <Badge
                  variant={
                    activeNodeDetail.status === 'verified'
                      ? 'verified'
                      : activeNodeDetail.status === 'in_progress'
                      ? 'in_progress'
                      : 'locked'
                  }
                  size="sm"
                >
                  {activeNodeDetail.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {activeNodeDetail.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {activeNodeDetail.description}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Effort:</span>
                  <span className="font-bold text-slate-800">{activeNodeDetail.estimated_hours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Industry Relevance:</span>
                  <span className="font-bold text-teal-700">Day 1 Production Core</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Role:</span>
                  <span className="font-bold text-slate-800">{roadmap?.dream_role}</span>
                </div>
              </div>

              {/* Action for selected node */}
              <div className="pt-2">
                {activeNodeDetail.status === 'verified' ? (
                  <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-center space-y-2">
                    <p className="text-xs font-bold text-teal-900 flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                      Milestone Officially Verified
                    </p>
                    <p className="text-[11px] text-teal-700">
                      You have passed the unit test assertions for this skill.
                    </p>
                  </div>
                ) : (
                  <Button
                    variant={activeNodeDetail.status === 'in_progress' ? 'accent' : 'primary'}
                    size="lg"
                    onClick={() => handleActionClick(activeNodeDetail)}
                    iconRight={ArrowRight}
                    className={`w-full font-bold text-xs sm:text-sm ${
                      activeNodeDetail.status === 'in_progress' ? 'text-slate-950 shadow-accent' : ''
                    }`}
                  >
                    {activeNodeDetail.is_target_role
                      ? 'Browse Qualified Internships'
                      : 'Take Verification Challenge'}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <Card variant="default" className="p-8 text-center text-slate-500 text-xs bg-slate-50">
              Select any roadmap milestone to inspect requirements and learning pathways.
            </Card>
          )}
        </div>

      </div>

    </div>
  );
};
