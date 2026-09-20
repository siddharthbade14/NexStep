import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { triggerConfetti } from '../components/common/Confetti';
import { 
  Briefcase, 
  MapPin, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Sparkles, 
  Filter, 
  Building2, 
  AlertCircle,
  GraduationCap,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { api } from '../services/api';

export const OpportunitiesPage = () => {
  const { student, setActiveTab } = useStudent();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlyQualified, setOnlyQualified] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');

  // Simulated Apply Modal
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [applying, setApplying] = useState(false);

  const loadInternships = async () => {
    setLoading(true);
    try {
      const data = await api.getOpportunities({
        studentId: student.id,
        onlyQualified: onlyQualified,
        roleFilter: roleFilter === 'all' ? null : roleFilter
      });
      setInternships(data);
    } catch (e) {
      console.warn('Opportunities fetch failed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInternships();
  }, [student.verified_skills, onlyQualified, roleFilter]);

  const handleApplyClick = (item) => {
    setSelectedOpportunity(item);
    setAppliedSuccess(false);
  };

  const handleConfirmApply = () => {
    setApplying(true);
    setTimeout(() => {
      setApplying(false);
      setAppliedSuccess(true);
      triggerConfetti();
    }, 800);
  };

  const verifiedSkillsList = student.verified_skills || [];

  return (
    <div className="space-y-8 py-2 sm:py-4 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="bg-brand-dark-gradient text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md border border-white/20 text-[#F4B942] shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Skill Job-Matching Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Curated High-Growth Tech Internships
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Transparent Indian tech internships. We match your <strong className="text-white font-semibold">verified skills</strong> directly against active recruiter requirements so you know exactly why you qualify.
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 min-w-[210px] text-center space-y-2 shadow-xl shrink-0">
            <div className="icon-3d icon-3d-amber w-11 h-11 rounded-2xl mx-auto flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">Your Verified Skills</span>
              <div className="text-2xl font-black text-[#F4B942] tracking-tight">
                {verifiedSkillsList.length} Certified
              </div>
            </div>
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Active For Matching
            </span>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Roles' },
            { id: 'Software Developer', label: 'Software Dev' },
            { id: 'Data Analyst', label: 'Data Analyst' },
            { id: 'Embedded Systems Engineer', label: 'Embedded / IoT' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 ${
                roleFilter === tab.id
                  ? 'bg-gradient-to-r from-[#1F4E5F] to-[#2C6E8F] text-white shadow-md shadow-[#1F4E5F]/20'
                  : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Qualified Toggle Switch */}
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700 select-none px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors">
          <input
            type="checkbox"
            checked={onlyQualified}
            onChange={(e) => setOnlyQualified(e.target.checked)}
            className="w-4 h-4 rounded text-[#1F4E5F] focus:ring-[#1F4E5F] cursor-pointer"
          />
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Show Only Qualified</span>
          </span>
        </label>

      </div>

      {/* INTERNSHIPS GRID */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#1F4E5F] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Matching verified skill profiles with active postings...</p>
        </div>
      ) : internships.length === 0 ? (
        <Card variant="default" className="p-12 text-center space-y-4 bg-white border-slate-200/90 shadow-sm rounded-3xl">
          <div className="icon-3d icon-3d-amber w-14 h-14 rounded-2xl mx-auto flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-slate-950" />
          </div>
          <h3 className="text-base font-black text-slate-900">No matching qualified internships found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            You currently have {verifiedSkillsList.length} verified skills. Complete challenges in the Skill Verification IDE to unlock direct interview applications.
          </p>
          <Button
            variant="accent"
            size="md"
            onClick={() => setActiveTab('verification')}
            className="text-slate-950 font-bold shadow-accent"
          >
            Verify Next Skill Now
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {internships.map((item) => {
            // Pick aesthetic 3D company badge styling based on name
            const companyColorMap = {
              'Google': 'icon-3d-blue',
              'Swiggy': 'icon-3d-amber',
              'Zerodha': 'icon-3d-emerald',
              'Razorpay': 'icon-3d-navy',
              'Flipkart': 'icon-3d-amber',
              'Ola Electric': 'icon-3d-emerald',
              'Postman': 'icon-3d-rose',
              'CRED': 'icon-3d-purple'
            };
            const iconClass = companyColorMap[item.company] || 'icon-3d-navy';

            return (
              <div
                key={item.id}
                className={`p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                  item.is_qualified
                    ? 'glass-card-premium border-teal-300/80 hover:border-teal-500 shadow-md hover:shadow-2xl ring-1 ring-teal-500/20 hover:-translate-y-1.5 glow-ring-teal'
                    : 'bg-white/90 border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                {/* Specular highlight on qualified cards */}
                {item.is_qualified && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 via-[#F4B942] to-emerald-400"></div>
                )}

                <div className="space-y-4 pt-1">
                  
                  {/* Top Row: Company Logo Pedestal & Match Percentage */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className={`icon-3d ${iconClass} w-13 h-13 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 shadow-md`}>
                        {item.logo_initials}
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-700 font-bold">{item.company}</span>
                          <span>•</span>
                          <span className="text-slate-400 font-normal">{item.location}</span>
                        </p>
                      </div>
                    </div>

                    {item.is_qualified ? (
                      <Badge variant="verified" size="sm">
                        {item.match_percentage}% Match
                      </Badge>
                    ) : (
                      <Badge variant="in_progress" size="sm">
                        {item.match_percentage}% Match
                      </Badge>
                    )}
                  </div>

                  {/* Compensation & Duration Details */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 font-black text-amber-900 bg-gradient-to-r from-amber-50 to-amber-100/70 px-2.5 py-1 rounded-lg border border-amber-300/80 shadow-xs">
                      <IndianRupee className="w-3.5 h-3.5 text-amber-600" />
                      <span>{item.stipend}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-slate-600 px-2 py-1 rounded-lg bg-slate-100/70">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.duration}</span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-400 px-2 py-1 rounded-lg bg-slate-50">
                      {item.batch}
                    </div>
                  </div>

                  {/* About Role */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {item.about}
                  </p>

                  {/* Required Skills Badges */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      Required Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.required_skills.map((s) => {
                        const isSkillVerified = verifiedSkillsList.includes(s);
                        const cleanName = s.replace('skill-', '').replace('-', ' ').toUpperCase();
                        return (
                          <span
                            key={s}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all hover:scale-105 ${
                              isSkillVerified
                                ? 'bg-teal-50 text-teal-800 border-teal-300 shadow-xs'
                                : 'bg-slate-100/80 text-slate-500 border-slate-200'
                            }`}
                          >
                            {isSkillVerified ? (
                              <CheckCircle2 className="w-3 h-3 text-teal-600" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            )}
                            <span>{cleanName}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Why You Qualify Transparency Box */}
                  <div className={`p-3.5 rounded-2xl text-xs space-y-1 border ${
                    item.is_qualified
                      ? 'bg-gradient-to-r from-teal-50/90 to-emerald-50/90 border-teal-200 text-teal-950 font-medium'
                      : 'bg-slate-50/90 border-slate-200 text-slate-600'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-700">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Skill Match Breakdown:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {item.why_qualify_tag}
                    </p>
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <a
                    href={item.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
                  >
                    <span>Company Portal</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>

                  {item.is_qualified ? (
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => handleApplyClick(item)}
                      iconRight={Send}
                      className="text-xs font-bold text-slate-950 shadow-accent px-5 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Quick Apply
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setActiveTab('verification')}
                      className="text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Verify Skills to Apply
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QUICK APPLY MODAL */}
      <Modal
        isOpen={Boolean(selectedOpportunity)}
        onClose={() => setSelectedOpportunity(null)}
        title={appliedSuccess ? "Application Submitted!" : `Apply to ${selectedOpportunity?.company}`}
        subtitle={appliedSuccess ? "Your verified profile was delivered to the hiring recruiter." : `Position: ${selectedOpportunity?.title}`}
        maxWidth="max-w-md"
      >
        {selectedOpportunity && (
          <div className="space-y-5 pt-1">
            {appliedSuccess ? (
              <div className="text-center py-4 space-y-4">
                <div className="icon-3d icon-3d-emerald w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-lg font-black text-slate-900 tracking-tight">Direct Recruiter Fast-Track</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Because your skills are <strong className="text-teal-700 font-bold">100% verified with live assertions</strong>, your application bypassed standard resume filters and was delivered directly to the technical team.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setSelectedOpportunity(null)}
                  className="w-full text-xs font-bold shadow-md"
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center pb-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Applicant:</span>
                    <span className="font-bold text-slate-900">{student.name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">College:</span>
                    <span className="font-bold text-slate-900 truncate max-w-[200px]">{student.college}</span>
                  </div>
                  <div className="flex justify-between items-center pb-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Degree & Term:</span>
                    <span className="font-bold text-slate-900">{student.course} • Sem {student.semester}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Verified Badges Attached:</span>
                    <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
                      {selectedOpportunity.verified_matching_skills.length} Certified Badges
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-50/80 text-teal-900 text-[11px] flex items-center gap-2.5 border border-teal-200">
                  <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Code test proofs and test execution timestamps will be included automatically.</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedOpportunity(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="accent"
                    size="md"
                    onClick={handleConfirmApply}
                    loading={applying}
                    iconRight={Send}
                    className="text-xs font-bold text-slate-950 shadow-accent px-6 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Confirm & Send Profile
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
};
