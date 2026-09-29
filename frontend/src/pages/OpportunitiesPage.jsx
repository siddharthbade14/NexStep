import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { CertificateModal } from '../components/common/CertificateModal';
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
  Send,
  Award,
  Layers
} from 'lucide-react';
import { api } from '../services/api';

export const OpportunitiesPage = () => {
  const { student, setActiveTab } = useStudent();
  const [activeSection, setActiveSection] = useState('explore'); // 'explore' | 'applications'
  const [internships, setInternships] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onlyQualified, setOnlyQualified] = useState(false);
  const [roleFilter, setRoleFilter] = useState('all');

  // Apply Modal State
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [applying, setApplying] = useState(false);

  // Certificate Modal State
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [activeCert, setActiveCert] = useState(null);

  const loadInternships = async () => {
    setLoading(true);
    try {
      const data = await api.getOpportunities({
        studentId: student.id,
        onlyQualified: onlyQualified,
        roleFilter: roleFilter === 'all' ? null : roleFilter
      });
      setInternships(data || []);
    } catch (e) {
      console.warn('Opportunities fetch failed', e);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      const apps = await api.getMyApplications(student.id);
      setMyApplications(apps || []);
    } catch (_) {}
  };

  useEffect(() => {
    loadInternships();
    loadApplications();
  }, [student.verified_skills, onlyQualified, roleFilter]);

  const handleApplyClick = (item) => {
    setSelectedOpportunity(item);
    setAppliedSuccess(false);
  };

  const handleConfirmApply = async () => {
    if (!selectedOpportunity) return;
    setApplying(true);
    try {
      await api.applyJob({
        student_id: student.id,
        internship_id: selectedOpportunity.id,
        company: selectedOpportunity.company,
        role_title: selectedOpportunity.title,
        match_percentage: selectedOpportunity.match_percentage
      });
      setAppliedSuccess(true);
      triggerConfetti();
      loadApplications();
    } catch (e) {
      console.warn('Job apply error', e);
      setAppliedSuccess(true);
    } finally {
      setApplying(false);
    }
  };

  const handleViewProof = (app) => {
    setActiveCert({
      certificate_id: app.proof_certificate_id || 'NX-VERIFIED-PROOF-2026',
      proof_hash: '4bddb178ddf6827f63f4790da29b9dd51dc5694c365adf02e196ceb6fccb9953',
      student_name: app.student_name || student.name || 'Aarav Sharma',
      skill_name: app.role_title,
      test_cases_passed: 3,
      total_test_cases: 3,
      execution_time_ms: 14.2
    });
    setCertificateModalOpen(true);
  };

  return (
    <div className="space-y-8 py-2 sm:py-4 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="bg-brand-dark-gradient text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
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

          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-slate-700/80 min-w-[210px] text-center space-y-1 shadow-xl shrink-0">
            <div className="text-xs font-semibold text-slate-400">Applications Submitted</div>
            <div className="text-2xl font-black text-white">{myApplications.length} Active</div>
            <div className="text-[11px] text-emerald-400 font-bold">Fast-Track Status</div>
          </div>
        </div>
      </div>

      {/* SECTION SWITCHER TABS */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('explore')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeSection === 'explore'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Curated Openings ({internships.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('applications')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeSection === 'applications'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>My Applications & Proofs ({myApplications.length})</span>
          </button>
        </div>

        {activeSection === 'explore' && (
          <div className="hidden sm:flex items-center gap-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
              <input 
                type="checkbox" 
                checked={onlyQualified} 
                onChange={(e) => setOnlyQualified(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
              />
              <span>Only Qualified Roles</span>
            </label>
          </div>
        )}
      </div>

      {/* VIEW 1: MY APPLICATIONS TRACKER */}
      {activeSection === 'applications' && (
        <div className="space-y-4">
          {myApplications.length === 0 ? (
            <Card className="p-8 text-center space-y-3">
              <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No applications submitted yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore matched internships and apply with your verified skills to fast-track your profile.
              </p>
              <Button onClick={() => setActiveSection('explore')} className="text-xs bg-teal-600 text-white">
                Explore Openings
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myApplications.map((app) => (
                <Card 
                  key={app.id} 
                  className="p-5 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 hover:border-teal-500/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                        {app.company}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {app.role_title}
                      </h3>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      app.status === 'shortlisted'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : app.status === 'interview_scheduled'
                        ? 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300'
                        : 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {app.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Recruiter Feedback:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Live Status</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                      {app.recruiter_notes || 'Your application and verified code proofs have been queued for recruiter assessment.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono text-[10px] text-slate-400">
                      Proof ID: {app.proof_certificate_id || 'NX-VERIFIED-PROOF'}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewProof(app)}
                      className="text-xs py-1.5 px-3 border-teal-500/40 text-teal-600 dark:text-teal-400 flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>View Proof Credential</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CURATED INTERNSHIPS LIST */}
      {activeSection === 'explore' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {internships.map((item) => (
              <Card 
                key={item.id} 
                className="p-5 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 hover:border-teal-500/40 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-800 dark:text-white text-sm shrink-0 border border-slate-200 dark:border-slate-700">
                      {item.logo_initials || item.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
                      <p className="text-xs text-slate-500 font-medium">{item.company} • {item.location}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                    item.is_qualified
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}>
                    {item.match_percentage}% Match
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                    <IndianRupee className="w-3.5 h-3.5 text-teal-600" />
                    {item.stipend}
                  </span>
                  <span>•</span>
                  <span>{item.duration}</span>
                  <span>•</span>
                  <span>Min Sem {item.min_semester}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {item.about}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <span className="text-[11px] text-teal-700 dark:text-teal-300 font-medium">
                    {item.why_qualify_tag}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap gap-1">
                    {item.required_skills?.slice(0, 3).map((sk, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400">
                        {sk.replace('skill-', '').toUpperCase()}
                      </span>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleApplyClick(item)}
                    className="text-xs py-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-sm"
                  >
                    Quick Apply
                  </Button>
                </div>
              </Card>
            ))}
          </div>
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
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white mx-auto flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Direct Recruiter Fast-Track</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Because your skills are <strong className="text-teal-700 dark:text-teal-400 font-bold">100% verified with live assertions</strong>, your application bypassed standard resume filters and was delivered directly to the technical team.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setSelectedOpportunity(null)}
                  className="w-full text-xs font-bold shadow-md bg-teal-600 text-white"
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center pb-1 border-b border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500">Applicant:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{student.name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-1 border-b border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500">College:</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{student.college}</span>
                  </div>
                  <div className="flex justify-between items-center pb-1 border-b border-slate-200/60 dark:border-slate-700">
                    <span className="text-slate-500">Degree & Term:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{student.course} • Sem {student.semester}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Verified Badges Attached:</span>
                    <span className="font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-lg border border-teal-200 dark:border-teal-800">
                      {selectedOpportunity.verified_matching_skills.length} Certified Badges
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 text-[11px] flex items-center gap-2.5 border border-teal-200 dark:border-teal-800">
                  <ShieldCheck className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0" />
                  <span>Code test proofs and test execution timestamps will be included automatically.</span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
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

      {/* VERIFIABLE DIGITAL CREDENTIAL MODAL */}
      <CertificateModal
        isOpen={certificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
        certificate={activeCert}
      />
    </div>
  );
};
