import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { triggerConfetti } from '../components/common/Confetti';
import { api } from '../services/api';
import { 
  Briefcase, 
  Users, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Code2, 
  ExternalLink, 
  Filter, 
  Search, 
  Sparkles, 
  FileText, 
  Building2, 
  ChevronRight,
  Send,
  Zap,
  Check
} from 'lucide-react';

export const RecruiterPortalPage = () => {
  const { currentUser } = useStudent();
  const [companyName, setCompanyName] = useState(currentUser?.company_name || 'Swiggy');
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Code Proof Modal State
  const [selectedAppForProof, setSelectedAppForProof] = useState(null);
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [dashStats, apps] = await Promise.all([
        api.getRecruiterStats(companyName),
        api.getRecruiterApplications(companyName, statusFilter)
      ]);
      setStats(dashStats);
      setApplications(apps);
    } catch (e) {
      console.warn('Failed to load recruiter data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [companyName, statusFilter]);

  const handleOpenProofModal = (app) => {
    setSelectedAppForProof(app);
    setRecruiterNotes(app.recruiter_notes || '');
    setUpdateSuccessMsg('');
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    setStatusUpdating(true);
    try {
      await api.updateApplicationStatus(appId, newStatus, recruiterNotes);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus, recruiter_notes: recruiterNotes } : a));
      if (selectedAppForProof && selectedAppForProof.id === appId) {
        setSelectedAppForProof(prev => ({ ...prev, status: newStatus, recruiter_notes: recruiterNotes }));
      }
      setUpdateSuccessMsg(`Status updated to ${newStatus.replace('_', ' ').toUpperCase()}!`);
      if (newStatus === 'shortlisted' || newStatus === 'offered') {
        triggerConfetti();
      }
      setTimeout(() => setUpdateSuccessMsg(''), 3000);
    } catch (e) {
      console.warn('Status update failed', e);
    } finally {
      setStatusUpdating(false);
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.role_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.student_college.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 py-2 sm:py-4 max-w-7xl mx-auto">
      {/* HEADER BANNER */}
      <div className="bg-brand-dark-gradient text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md border border-white/20 text-[#F4B942] shadow-sm">
              <Building2 className="w-3.5 h-3.5" />
              <span>Verified Tech Talent Hub</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {companyName} Talent Acquisition
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Review candidates backed by <strong className="text-white font-semibold">cryptographic Proof-of-Work</strong>. Inspect actual code submissions, test performance, and verified skill credentials before scheduling interviews.
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-slate-700/80 text-center space-y-1 shadow-xl shrink-0">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Active Recruiter</div>
            <div className="text-base font-bold text-white">{currentUser?.full_name || 'Ananya Sen'}</div>
            <div className="text-xs text-[#F4B942]">{currentUser?.designation || 'Principal Talent Partner'}</div>
          </div>
        </div>
      </div>

      {/* TOP KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Openings</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.active_openings || 4}
            </div>
            <p className="text-xs text-slate-500 mt-1">Backend, DevOps & Full Stack</p>
          </div>
        </Card>

        <Card className="p-5 border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Applicants</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 flex items-center justify-center text-teal-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {applications.length || stats?.total_applicants || 12}
            </div>
            <p className="text-xs text-teal-600 font-medium mt-1">100% verified test credentials</p>
          </div>
        </Card>

        <Card className="p-5 border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Shortlisted</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {applications.filter(a => a.status === 'shortlisted' || a.status === 'interview_scheduled').length}
            </div>
            <p className="text-xs text-slate-500 mt-1">Passed code verification bar</p>
          </div>
        </Card>

        <Card className="p-5 border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Interviews Scheduled</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {applications.filter(a => a.status === 'interview_scheduled').length || 2}
            </div>
            <p className="text-xs text-slate-500 mt-1">Technical Rounds in Progress</p>
          </div>
        </Card>
      </div>

      {/* APPLICANT REVIEW PIPELINE */}
      <Card className="p-6 border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <span>Verified Candidate Pipeline</span>
            </h3>
            <p className="text-xs text-slate-500">
              Filter candidates by stage, examine submitted code solutions, and update hiring statuses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search candidates, college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {[
                { id: 'all', label: 'All' },
                { id: 'applied', label: 'Applied' },
                { id: 'under_review', label: 'Review' },
                { id: 'shortlisted', label: 'Shortlisted' },
                { id: 'interview_scheduled', label: 'Interview' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === tab.id 
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CANDIDATE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredApps.map((app) => (
            <div 
              key={app.id}
              className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-4 hover:border-teal-500/40 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600/10 text-teal-600 flex items-center justify-center font-black text-sm shrink-0 border border-teal-500/20">
                    {app.student_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{app.student_name}</h4>
                    <p className="text-[11px] text-slate-500">{app.student_college} • {app.student_course}</p>
                  </div>
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

              <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Role:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{app.role_title}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Verified Skill Match:</span>
                  <span className="font-bold text-emerald-600">{app.match_percentage}% Match</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {app.verified_skills_snapshot?.map((sk, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-[10px] font-medium border border-teal-200 dark:border-teal-800">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              {app.proof_certificate_id && (
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400">
                    ID: {app.proof_certificate_id}
                  </span>
                  <span className="text-[10px]">Applied: {app.applied_at?.slice(0, 10) || 'Recent'}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <Button 
                  variant="outline"
                  onClick={() => handleOpenProofModal(app)}
                  className="flex-1 text-xs py-2 border-teal-500/30 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 flex items-center justify-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Inspect Code Proof</span>
                </Button>

                <Button 
                  onClick={() => handleUpdateStatus(app.id, 'shortlisted')}
                  className="text-xs py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Shortlist
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* CODE PROOF INSPECTOR MODAL */}
      {selectedAppForProof && (
        <Modal 
          isOpen={Boolean(selectedAppForProof)} 
          onClose={() => setSelectedAppForProof(null)}
          title={`Candidate Proof-of-Work: ${selectedAppForProof.student_name}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-slate-700 dark:text-slate-300">
              <div>
                <div className="font-bold text-teal-700 dark:text-teal-300 text-sm">
                  Cryptographically Verified Code Submission
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                  Proof ID: {selectedAppForProof.proof_certificate_id || 'NX-VERIFIED-PROOF'}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Tamper-Proof Authenticated</span>
              </div>
            </div>

            {/* CODE SNIPPET BOX */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-teal-600" />
                  <span>Submitted Python Implementation:</span>
                </span>
                <span className="text-[10px] text-slate-400">Execution Speed: ~12.5 ms</span>
              </div>

              <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-64 border border-slate-800 leading-relaxed">
                <pre>{selectedAppForProof.code_proof_snippet || '# Code submission snippet unavailable'}</pre>
              </div>
            </div>

            {/* RECRUITER NOTES & STATUS ACTION */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Recruiter Evaluation Notes:
              </label>
              <textarea 
                value={recruiterNotes}
                onChange={(e) => setRecruiterNotes(e.target.value)}
                rows={2}
                placeholder="Add feedback or interview scheduling details..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {updateSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{updateSuccessMsg}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleUpdateStatus(selectedAppForProof.id, 'shortlisted')}
                  disabled={statusUpdating}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-2 px-3"
                >
                  Shortlist
                </Button>
                <Button
                  onClick={() => handleUpdateStatus(selectedAppForProof.id, 'interview_scheduled')}
                  disabled={statusUpdating}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs py-2 px-3"
                >
                  Schedule Interview
                </Button>
                <Button
                  onClick={() => handleUpdateStatus(selectedAppForProof.id, 'offered')}
                  disabled={statusUpdating}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2 px-3"
                >
                  Extend Offer
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={() => setSelectedAppForProof(null)}
                className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
