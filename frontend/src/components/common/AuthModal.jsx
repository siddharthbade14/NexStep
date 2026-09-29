import React, { useState } from 'react';
import { useStudent } from '../../context/StudentContext';
import { Modal } from './Modal';
import { Button } from './Button';
import { 
  Building2, 
  GraduationCap, 
  Briefcase, 
  KeyRound, 
  UserCheck, 
  LogIn, 
  Sparkles, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { switchRolePersona, loginWithCredentials, DEMO_PERSONAS, currentUser } = useStudent();
  const [activeTab, setActiveTab] = useState('personas'); // 'personas' | 'login' | 'register'
  
  // Login Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePersonaSelect = async (personaId) => {
    await switchRolePersona(personaId);
    onClose();
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await loginWithCredentials(email, password);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Try demo credentials or switch personas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Multi-Role Portal Access & Identity"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* TABS */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('personas')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'personas' 
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Switch Role Demo</span>
          </button>

          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'login' 
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In (JWT Auth)</span>
          </button>
        </div>

        {/* TAB 1: PERSONAS */}
        {activeTab === 'personas' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an authenticated persona below to instantly experience NexStep from the perspective of an engineering student, university placement dean, or corporate recruiter:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {DEMO_PERSONAS.map((p) => {
                const isSelected = currentUser?.id === p.id || (currentUser?.role === p.role && currentUser?.email?.includes(p.id));
                const isTpo = p.role === 'college_tpo';
                const isRecruiter = p.role === 'recruiter';

                return (
                  <button
                    key={p.id}
                    onClick={() => handlePersonaSelect(p.id)}
                    className={`p-4 rounded-2xl border text-left transition-all space-y-2 relative ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 ring-2 ring-teal-500/20'
                        : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}

                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 text-white bg-gradient-to-tr ${p.accentColor || 'from-teal-600 to-cyan-600'}`}>
                        {p.avatar || 'NX'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{p.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {isTpo ? '🏛️ College TPO' : isRecruiter ? '🏢 Corporate Recruiter' : '🎓 Engineering Student'}
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
                      {p.tagline || `${p.college || p.company} • ${p.course || p.designation}`}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CREDENTIAL SIGN IN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <div className="font-bold text-teal-800 dark:text-teal-300">Quick Demo Credentials:</div>
              <div className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                • Student: <span className="text-teal-600 dark:text-teal-400 font-semibold">student@nexstep.in</span> / <span className="font-semibold">student123</span><br />
                • TPO: <span className="text-teal-600 dark:text-teal-400 font-semibold">tpo@dtu.ac.in</span> / <span className="font-semibold">tpo123</span><br />
                • Recruiter: <span className="text-teal-600 dark:text-teal-400 font-semibold">recruiter@swiggy.in</span> / <span className="font-semibold">recruiter123</span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.ac.in"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2.5 text-xs rounded-xl shadow-md"
            >
              {loading ? 'Authenticating...' : 'Sign In with JWT'}
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
};
