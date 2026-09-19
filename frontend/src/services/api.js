const API_BASE = '/api';

export const api = {
  // Onboarding
  getOnboardingMeta: async () => {
    const res = await fetch(`${API_BASE}/onboarding/meta`);
    if (!res.ok) throw new Error('Failed to fetch onboarding metadata');
    return res.json();
  },

  submitOnboarding: async (profileData) => {
    const res = await fetch(`${API_BASE}/onboarding/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    if (!res.ok) throw new Error('Failed to submit onboarding profile');
    return res.json();
  },

  getProfile: async (studentId) => {
    const res = await fetch(`${API_BASE}/onboarding/profile/${studentId}`);
    if (!res.ok) throw new Error('Failed to fetch student profile');
    return res.json();
  },

  // Gap Analysis
  getGapAnalysis: async ({ studentId, course, semester, dreamRole }) => {
    const params = new URLSearchParams({
      student_id: studentId || 'demo-student',
      course: course || 'B.Tech CSE',
      semester: semester ? semester.toString() : '5',
      dream_role: dreamRole || 'Software Developer'
    });
    const res = await fetch(`${API_BASE}/gap-analysis/analyze?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to run gap analysis');
    return res.json();
  },

  // Skill Verification
  getChallenge: async (skillId) => {
    const res = await fetch(`${API_BASE}/verify/challenge/${skillId}`);
    if (!res.ok) throw new Error('Failed to load coding challenge');
    return res.json();
  },

  submitCode: async ({ studentId, skillId, code, language = 'python' }) => {
    const res = await fetch(`${API_BASE}/verify/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId,
        skill_id: skillId,
        code: code,
        language: language
      })
    });
    if (!res.ok) throw new Error('Code evaluation failed');
    return res.json();
  },

  // Learning Resources & Re-check Quiz
  getResources: async (studentId) => {
    const res = await fetch(`${API_BASE}/resources/list/${studentId}`);
    if (!res.ok) throw new Error('Failed to fetch resources');
    return res.json();
  },

  submitQuiz: async ({ studentId, skillId, answers }) => {
    const res = await fetch(`${API_BASE}/resources/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId,
        skill_id: skillId,
        answers: answers
      })
    });
    if (!res.ok) throw new Error('Quiz evaluation failed');
    return res.json();
  },

  // Roadmap
  getRoadmap: async (studentId, dreamRole = null) => {
    const params = dreamRole ? `?dream_role=${encodeURIComponent(dreamRole)}` : '';
    const res = await fetch(`${API_BASE}/roadmap/${studentId}${params}`);
    if (!res.ok) throw new Error('Failed to fetch roadmap');
    return res.json();
  },

  // Opportunities
  getOpportunities: async ({ studentId, onlyQualified = false, roleFilter = null }) => {
    const params = new URLSearchParams({
      only_qualified: onlyQualified ? 'true' : 'false'
    });
    if (roleFilter) params.append('role_filter', roleFilter);
    const res = await fetch(`${API_BASE}/opportunities/match/${studentId}?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch opportunities');
    return res.json();
  },

  // Demo Reset
  resetDemo: async () => {
    const res = await fetch(`${API_BASE}/reset-demo`, { method: 'POST' });
    return res.json();
  }
};
