import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { api } from '../services/api';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  BookOpen, 
  AlertTriangle, 
  Download, 
  Search, 
  Filter, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight,
  GraduationCap,
  Layers,
  ChevronRight,
  Cpu
} from 'lucide-react';

export const TpoDashboardPage = () => {
  const { student, currentUser } = useStudent();
  const [stats, setStats] = useState(null);
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const collegeName = currentUser?.college || student.college || 'Delhi Technological University (DTU)';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dashStats, cohort] = await Promise.all([
          api.getTpoDashboardStats(collegeName),
          api.getTpoStudents(collegeName, selectedDept)
        ]);
        setStats(dashStats);
        setStudentsList(cohort);
      } catch (e) {
        console.warn('Failed to load TPO data', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [collegeName, selectedDept]);

  const handleExportReport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const filteredStudents = studentsList.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.dream_role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'all' || s.department.toLowerCase() === selectedDept.toLowerCase();
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-8 py-2 sm:py-4 max-w-7xl mx-auto">
      {/* HEADER BANNER */}
      <div className="bg-brand-dark-gradient text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md border border-white/20 text-[#F4B942] shadow-sm">
              <Building2 className="w-3.5 h-3.5" />
              <span>Institutional TPO & Dean Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {collegeName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Batch placement readiness analytics, real-time university syllabus gap heatmaps, and verifiable skill credential audits across engineering cohorts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={handleExportReport}
              className="bg-white/10 border-white/20 hover:bg-white/20 text-white backdrop-blur-md flex items-center gap-2 text-xs font-semibold"
            >
              <Download className="w-4 h-4 text-[#F4B942]" />
              <span>{downloadSuccess ? 'AICTE Audit Downloaded!' : 'Export AICTE Audit'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Cohort Size</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.total_cohort_students || 480}
            </div>
            <p className="text-xs text-slate-500 mt-1">Active 3rd & 4th Year Students</p>
          </div>
        </Card>

        <Card className="p-5 border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg Industry Readiness</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.average_readiness_pct || 74}%
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1">+8.4% uplift this semester</p>
          </div>
        </Card>

        <Card className="p-5 border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Placement Ready</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.students_placement_ready || 312}
            </div>
            <p className="text-xs text-slate-500 mt-1">Ready for Day-1 Campus Drives</p>
          </div>
        </Card>

        <Card className="p-5 border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Verified Proofs</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.verified_skills_awarded || 940}
            </div>
            <p className="text-xs text-slate-500 mt-1">Tamper-Proof Code Certificates</p>
          </div>
        </Card>
      </div>

      {/* DEPARTMENT BREAKDOWN & CURRICULUM DEFICITS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Readiness Column */}
        <Card className="p-6 border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-teal-600" />
              <span>Department Readiness</span>
            </h3>
            <span className="text-xs text-slate-500">Live Cohort</span>
          </div>

          <div className="space-y-4">
            {stats?.department_breakdown?.map((dept, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{dept.department}</span>
                  <span className="text-xs font-black text-teal-600 dark:text-teal-400">{dept.avg_readiness}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${dept.avg_readiness}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>{dept.total_students} Enrolled</span>
                  <span>{Math.round(dept.verified_ratio * 100)}% Verified Ratio</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AICTE Syllabus Deficit & Intervention Guide (2 Columns) */}
        <Card className="p-6 lg:col-span-2 border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Curriculum Deficit & AICTE Action Plan</span>
              </h3>
              <p className="text-xs text-slate-500">
                Identified curriculum gaps between state university syllabi and recruiter demand with actionable interventions.
              </p>
            </div>
            <Badge variant="warning" className="shrink-0 text-xs">Priority Actions</Badge>
          </div>

          <div className="space-y-3">
            {stats?.top_curriculum_deficits?.map((def, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      {def.subject_area}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      <strong>University Gap:</strong> {def.college_syllabus_gap}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-lg border border-amber-300/40">
                    {def.impacted_students_count} Students
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#F4B942] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">Intervention Plan: </span>
                    {def.recommended_action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* STUDENT COHORT DIRECTORY */}
      <Card className="p-6 border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600" />
              <span>Student Cohort Readiness Directory</span>
            </h3>
            <p className="text-xs text-slate-500">
              Inspect student readiness scores, verified skill credentials, and placement qualification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search students, roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {['all', 'Computer Science', 'Information Technology', 'Electronics & Communication'].map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedDept === dept 
                      ? 'bg-teal-600 text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {dept === 'all' ? 'All Depts' : dept.replace('Electronics & Communication', 'ECE').replace('Information Technology', 'IT').replace('Computer Science', 'CSE')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-200 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Dept / Course</th>
                <th className="py-3.5 px-4">Dream Role</th>
                <th className="py-3.5 px-4">CGPA</th>
                <th className="py-3.5 px-4">Readiness</th>
                <th className="py-3.5 px-4">Verified Proofs</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-600/10 text-teal-600 flex items-center justify-center font-bold text-xs shrink-0">
                      {s.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span>{s.name}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-800 dark:text-slate-200 font-medium">{s.department}</div>
                    <div className="text-[10px] text-slate-400">{s.course} • Sem {s.semester}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                    {s.dream_role}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {s.cgpa}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{s.readiness_percentage}%</span>
                      <div className="w-16 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-teal-500 h-full rounded-full" 
                          style={{ width: `${s.readiness_percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {s.verified_skills.slice(0, 3).map((sk, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-[10px] font-medium">
                          {sk}
                        </span>
                      ))}
                      {s.verified_skills.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500">
                          +{s.verified_skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      s.placement_status === 'Placement Ready'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                    }`}>
                      {s.placement_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
