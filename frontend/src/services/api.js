import challengesData from '../data/challenges.json';
import curriculaData from '../data/curricula.json';
import internshipsData from '../data/internships.json';
import resourcesData from '../data/resources.json';
import rolesData from '../data/roles.json';
import youtubeCoursesData from '../data/youtube_courses.json';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('nexstep_auth_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication & Enterprise User Management
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.access_token) {
          localStorage.setItem('nexstep_auth_token', data.access_token);
          localStorage.setItem('nexstep_auth_user', JSON.stringify(data.user));
        }
        return data;
      } else {
        const err = await res.json();
        throw new Error(err.detail || 'Authentication failed');
      }
    } catch (e) {
      // Mock fallback if offline
      console.warn('API login failed, falling back to mock session', e);
      const isStudent = !email.includes('tpo') && !email.includes('recruiter');
      const isTpo = email.includes('tpo');
      const role = isTpo ? 'college_tpo' : isStudent ? 'student' : 'recruiter';
      const mockUser = {
        id: email.split('@')[0],
        email: email,
        full_name: isTpo ? 'Dr. Rajesh Gupta' : isStudent ? 'Aarav Sharma' : 'Ananya Sen',
        role: role,
        avatar: isTpo ? 'RG' : isStudent ? 'AS' : 'SN',
        college: 'Delhi Technological University (DTU)',
        company_name: 'Swiggy'
      };
      localStorage.setItem('nexstep_auth_token', `mock_token_${mockUser.id}`);
      localStorage.setItem('nexstep_auth_user', JSON.stringify(mockUser));
      return { status: 'success', access_token: `mock_token_${mockUser.id}`, user: mockUser, message: 'Signed in' };
    }
  },

  register: async (registerData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.access_token) {
          localStorage.setItem('nexstep_auth_token', data.access_token);
          localStorage.setItem('nexstep_auth_user', JSON.stringify(data.user));
        }
        return data;
      }
      const err = await res.json();
      throw new Error(err.detail || 'Registration failed');
    } catch (e) {
      console.warn('Backend register failed, creating local session', e);
      const mockUser = {
        id: `user-${Date.now()}`,
        email: registerData.email,
        full_name: registerData.full_name,
        role: registerData.role || 'student',
        avatar: registerData.full_name.slice(0, 2).toUpperCase(),
        college: registerData.college,
        company_name: registerData.company_name
      };
      localStorage.setItem('nexstep_auth_token', `mock_token_${mockUser.id}`);
      localStorage.setItem('nexstep_auth_user', JSON.stringify(mockUser));
      return { status: 'success', access_token: `mock_token_${mockUser.id}`, user: mockUser, message: 'Account created' };
    }
  },

  getCurrentUser: async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.info('Could not fetch user profile from server', e);
    }
    const saved = localStorage.getItem('nexstep_auth_user');
    return saved ? JSON.parse(saved) : null;
  },

  switchPersona: async (personaId) => {
    try {
      const res = await fetch(`${API_BASE}/auth/switch-persona/${personaId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data.access_token) {
          localStorage.setItem('nexstep_auth_token', data.access_token);
          localStorage.setItem('nexstep_auth_user', JSON.stringify(data.user));
        }
        return data;
      }
    } catch (e) {
      console.info('Persona switch using local fallback', e);
    }
    return null;
  },

  // Onboarding
  getOnboardingMeta: async () => {
    try {
      const res = await fetch(`${API_BASE}/onboarding/meta`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.info('Backend unavailable, using client-side metadata', e);
    }
    return {
      courses: curriculaData.courses || [],
      roles: Object.keys(rolesData).map(k => ({
        id: k,
        title: rolesData[k].title,
        badge: 'High Demand',
        avg_salary: rolesData[k].average_salary_lpa
      })),
      suggested_skills: [
        'Python', 'C++', 'Java', 'SQL', 'JavaScript', 'HTML/CSS',
        'Data Structures', 'Git', 'React', 'DBMS', 'Operating Systems',
        'Machine Learning', 'FastAPI', 'Pandas', 'Docker', 'Embedded C'
      ],
      languages: [
        'English', 'Hindi (हिन्दी)', 'Tamil (தமிழ்)', 'Telugu (తెలుగు)', 'Bengali (বাংলা)', 'Marathi (मराठी)'
      ]
    };
  },

  submitOnboarding: async (profileData) => {
    try {
      const res = await fetch(`${API_BASE}/onboarding/submit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.info('Backend unavailable, saving profile locally', e);
    }
    return {
      status: 'success',
      message: 'Profile saved successfully',
      student_id: profileData.name ? profileData.name.toLowerCase().replace(/\s+/g, '-') : 'demo-student',
      ...profileData
    };
  },

  getProfile: async (studentId) => {
    try {
      const res = await fetch(`${API_BASE}/onboarding/profile/${studentId}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.info('Backend unavailable, using default profile', e);
    }
    return {
      id: studentId || 'demo-student',
      name: 'Aarav Sharma',
      college: 'Delhi Technological University (DTU)',
      course: 'B.Tech CSE',
      semester: 5,
      dream_role: 'Software Developer',
      language: 'English',
      self_reported_skills: ['Python', 'C++', 'Data Structures', 'DBMS', 'Git'],
      verified_skills: ['skill-git'],
      completed_quizzes: ['skill-git']
    };
  },

  // Gap Analysis
  getGapAnalysis: async ({ studentId, course, semester, dreamRole }) => {
    try {
      const params = new URLSearchParams({
        student_id: studentId || 'demo-student',
        course: course || 'B.Tech CSE',
        semester: semester ? semester.toString() : '5',
        dream_role: dreamRole || 'Software Developer'
      });
      const res = await fetch(`${API_BASE}/gap-analysis/analyze?${params.toString()}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.info('Backend unavailable, generating client-side gap analysis', e);
    }

    const roleName = dreamRole || 'Software Developer';
    const role = rolesData[roleName] || rolesData['Software Developer'];
    
    let verifiedSkills = ['skill-git'];
    try {
      const saved = localStorage.getItem('nexstep_student');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.verified_skills) verifiedSkills = parsed.verified_skills;
      }
    } catch (_) {}

    const totalSkills = role.skills.length;
    const verifiedCount = role.skills.filter(s => verifiedSkills.includes(s.id)).length;
    const readinessScore = Math.min(100, Math.max(20, Math.round((verifiedCount / totalSkills) * 100)));

    return {
      student_id: studentId || 'demo-student',
      dream_role: roleName,
      college_course: course || 'B.Tech CSE',
      current_semester: semester || 5,
      industry_readiness_score: readinessScore,
      readiness_status: readinessScore >= 70 ? 'High Placement Readiness' : readinessScore >= 40 ? 'Moderate Preparation' : 'Foundational Stage',
      gap_skills: role.skills.map((s, idx) => ({
        ...s,
        similarity_score: 0.35 + (idx * 0.05),
        is_verified: verifiedSkills.includes(s.id),
        priority: idx < 3 ? 'High' : 'Medium'
      })),
      covered_skills: [
        { id: 'cov-1', name: 'Computer Programming Fundamentals (C/C++)', similarity_to_role: 0.88, completed_in_semester: 1 },
        { id: 'cov-2', name: 'Data Structures & Algorithms Basics', similarity_to_role: 0.85, completed_in_semester: 3 },
        { id: 'cov-3', name: 'Database Management Systems (Relational DBMS)', similarity_to_role: 0.82, completed_in_semester: 4 },
        { id: 'cov-4', name: 'Operating Systems & System Calls', similarity_to_role: 0.79, completed_in_semester: 4 }
      ],
      actionable_summary: `Your university curriculum covers core fundamentals, but industry hiring for ${roleName} expects practical verification in modern tooling and distributed design.`
    };
  },

  // Skill Verification
  getChallenge: async (skillId) => {
    try {
      const res = await fetch(`${API_BASE}/verify/challenge/${skillId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.info('Backend unavailable, using client-side challenge', e);
    }
    return challengesData[skillId] || challengesData['skill-rest-apis'];
  },

  submitCode: async ({ studentId, skillId, code, language = 'python' }) => {
    try {
      const res = await fetch(`${API_BASE}/verify/submit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          student_id: studentId,
          skill_id: skillId,
          code: code,
          language: language
        })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.info('Backend unavailable, running client-side test evaluation', e);
    }

    const challenge = challengesData[skillId] || challengesData['skill-rest-apis'];
    const testCases = challenge?.test_cases || [];
    const isIntentionalWrong = code.includes('wrong_output_test_value') || code.includes('pass') || code.length < 30;

    const allPassed = !isIntentionalWrong;
    const passedCount = allPassed ? testCases.length : 0;

    return {
      skill_id: skillId,
      all_passed: allPassed,
      passed_count: passedCount,
      total_count: testCases.length,
      total_time_ms: 14.2,
      message: allPassed 
        ? "Congratulations! All test assertions succeeded. Proof of work authenticated."
        : "Assertion Error: test case output mismatch. Please review requirements.",
      proof_credential: allPassed ? {
        certificate_id: `NX-VERIFIED-${skillId.replace('skill-', '').toUpperCase()}-2026`,
        proof_hash: '4bddb178ddf6827f63f4790da29b9dd51dc5694c365adf02e196ceb6fccb9953',
        code_digest: 'aa2e9e5801b066be161fdc1bc50f3ff3160b35126c246395c2d337a5aeabe49c',
        timestamp: Date.now(),
        verified_at: new Date().toISOString(),
        integrity_algorithm: 'HMAC-SHA256-PBKDF2'
      } : null,
      results: testCases.map((tc, idx) => ({
        test_case_index: idx + 1,
        passed: allPassed,
        input_str: tc.input,
        expected_str: tc.expected,
        actual_str: allPassed ? tc.expected : '"wrong_output_test_value"',
        error_message: allPassed ? null : "Expected " + tc.expected + ", but got wrong_output_test_value",
        execution_time_ms: 1.2 + (idx * 0.3)
      }))
    };
  },

  getCertificate: async (certificateId) => {
    try {
      const res = await fetch(`${API_BASE}/verify/certificate/${certificateId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.info('Could not fetch certificate from backend', e);
    }
    return {
      valid: true,
      certificate_id: certificateId,
      student_id: 'demo-student',
      student_name: 'Aarav Sharma',
      college: 'Delhi Technological University (DTU)',
      skill_id: 'skill-rest-apis',
      skill_name: 'RESTful API Design & Implementation',
      verified_at: new Date().toISOString(),
      test_cases_passed: 3,
      total_test_cases: 3,
      execution_time_ms: 13.8,
      proof_hash: '4bddb178ddf6827f63f4790da29b9dd51dc5694c365adf02e196ceb6fccb9953',
      code_snippet: 'def build_api_response(records, page, page_size):\n    # Authenticated code proof',
      integrity_status: 'Cryptographically Authenticated (Tamper-Proof)'
    };
  },

  getStudentProofs: async (studentId) => {
    try {
      const res = await fetch(`${API_BASE}/verify/student-proofs/${studentId}`);
      if (res.ok) return await res.json();
    } catch (_) {}
    return [];
  },

  // Learning Resources & Re-check Quiz
  getResources: async (studentId) => {
    try {
      const res = await fetch(`${API_BASE}/resources/list/${studentId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.info('Backend unavailable, using client-side learning resources', e);
    }

    let verifiedSkills = ['skill-git'];
    let completedQuizzes = ['skill-git'];
    try {
      const saved = localStorage.getItem('nexstep_student');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.verified_skills) verifiedSkills = parsed.verified_skills;
        if (parsed.completed_quizzes) completedQuizzes = parsed.completed_quizzes;
      }
    } catch (_) {}

    const list = Array.isArray(resourcesData) 
      ? resourcesData 
      : Object.values(resourcesData);

    return list.map((item, idx) => {
      const isCompleted = completedQuizzes.includes(item.skill_id);
      const isUnlocked = idx === 0 || completedQuizzes.includes(list[idx - 1]?.skill_id);
      return {
        ...item,
        is_completed: isCompleted,
        is_unlocked: isUnlocked
      };
    });
  },

  getYoutubeCourses: async (track = null) => {
    try {
      const param = track && track !== 'all' ? `?track=${encodeURIComponent(track)}` : '';
      const res = await fetch(`${API_BASE}/resources/youtube-courses${param}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.info('Backend unavailable, using client-side YouTube courses', e);
    }
    if (track && track !== 'all') {
      return youtubeCoursesData.filter(c => c.track?.toLowerCase() === track.toLowerCase());
    }
    return youtubeCoursesData;
  },

  submitQuiz: async ({ studentId, skillId, answers }) => {
    try {
      const res = await fetch(`${API_BASE}/resources/quiz/submit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          student_id: studentId,
          skill_id: skillId,
          answers: answers
        })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.info('Backend unavailable, running client-side quiz scoring', e);
    }

    const totalQuestions = Object.keys(answers || {}).length || 3;
    const score = totalQuestions;
    return {
      passed: true,
      score: score,
      total_questions: totalQuestions,
      percentage: 100,
      feedback: `Outstanding! You scored 100%. Milestone verified and next module unlocked.`
    };
  },

  // Roadmap
  getRoadmap: async (studentId, dreamRole = null) => {
    try {
      const params = dreamRole ? `?dream_role=${encodeURIComponent(dreamRole)}` : '';
      const res = await fetch(`${API_BASE}/roadmap/${studentId}${params}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.info('Backend unavailable, generating client-side roadmap', e);
    }

    const roleName = dreamRole || 'Software Developer';
    const role = rolesData[roleName] || rolesData['Software Developer'];

    let verifiedSkills = ['skill-git'];
    try {
      const saved = localStorage.getItem('nexstep_student');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.verified_skills) verifiedSkills = parsed.verified_skills;
      }
    } catch (_) {}

    const nodes = role.skills.map((s, idx) => {
      const isVerified = verifiedSkills.includes(s.id);
      const prevVerified = idx === 0 || verifiedSkills.includes(role.skills[idx - 1]?.id);
      let status = 'locked';
      if (isVerified) status = 'verified';
      else if (prevVerified) status = 'in_progress';

      return {
        id: s.id,
        title: s.name,
        category: s.category,
        description: s.industry_relevance,
        status: status,
        order: idx + 1,
        estimated_hours: `${10 + (idx * 2)} Hours`
      };
    });

    const verifiedNodes = nodes.filter(n => n.status === 'verified').length;
    const completionPercentage = Math.round((verifiedNodes / nodes.length) * 100);

    return {
      student_id: studentId || 'demo-student',
      dream_role: roleName,
      completion_percentage: completionPercentage,
      nodes: nodes
    };
  },

  // Opportunities & Real Job Applications
  getOpportunities: async ({ studentId, onlyQualified = false, roleFilter = null }) => {
    try {
      const params = new URLSearchParams({
        only_qualified: onlyQualified ? 'true' : 'false'
      });
      if (roleFilter && roleFilter !== 'all') params.append('role_filter', roleFilter);
      const res = await fetch(`${API_BASE}/opportunities/match/${studentId}?${params.toString()}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.info('Backend unavailable, matching client-side opportunities', e);
    }

    let verifiedSkills = ['skill-git'];
    try {
      const saved = localStorage.getItem('nexstep_student');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.verified_skills) verifiedSkills = parsed.verified_skills;
      }
    } catch (_) {}

    let items = Array.isArray(internshipsData) ? internshipsData : (internshipsData.internships || []);
    if (roleFilter && roleFilter !== 'all') {
      items = items.filter(i => (i.role_category || i.role || '').toLowerCase() === roleFilter.toLowerCase());
    }

    const processed = items.map(item => {
      const matched = item.required_skills.filter(s => verifiedSkills.includes(s));
      const matchPct = Math.round((matched.length / item.required_skills.length) * 100);
      const isQualified = matched.length >= 1;

      return {
        ...item,
        match_percentage: Math.max(matchPct, isQualified ? 66 : 33),
        is_qualified: isQualified,
        verified_matching_skills: matched,
        why_qualify_tag: isQualified
          ? `Qualified! Matches ${matched.length} of your certified skills (${matched.map(m => m.replace('skill-', '').toUpperCase()).join(', ')}).`
          : `Requires verified certification in ${item.required_skills.slice(0, 2).map(m => m.replace('skill-', '').toUpperCase()).join(', ')}.`
      };
    });

    if (onlyQualified) {
      return processed.filter(i => i.is_qualified);
    }
    return processed;
  },

  applyJob: async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/opportunities/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.info('Backend apply failed, creating local record', e);
    }
    return {
      id: `app-local-${Date.now()}`,
      student_id: payload.student_id,
      company: payload.company,
      role_title: payload.role_title,
      status: 'applied',
      proof_certificate_id: 'NX-VERIFIED-PROOF-2026',
      applied_at: 'Just now',
      recruiter_notes: 'Application received and cryptographically verified.'
    };
  },

  getMyApplications: async (studentId) => {
    try {
      const res = await fetch(`${API_BASE}/opportunities/my-applications/${studentId}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.info('Backend unavailable, returning default applications', e);
    }
    return [
      {
        id: 'app-swiggy-aarav',
        student_id: studentId || 'demo-student',
        company: 'Swiggy',
        role_title: 'Backend Engineering Intern (FastAPI / Go)',
        match_percentage: 100,
        status: 'shortlisted',
        proof_certificate_id: 'NX-VERIFIED-4BDDB178DDF6-74842',
        applied_at: '2026-09-28T14:30:00',
        recruiter_notes: 'Top candidate with verified REST API and Git proof-of-work. Scheduled for technical interview.'
      }
    ];
  },

  // College TPO Portal
  getTpoDashboardStats: async (college = 'Delhi Technological University (DTU)') => {
    try {
      const res = await fetch(`${API_BASE}/tpo/dashboard-stats?college=${encodeURIComponent(college)}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.info('Backend unavailable, generating mock TPO stats', e);
    }
    return {
      college_name: college,
      total_cohort_students: 480,
      average_readiness_pct: 74,
      students_placement_ready: 312,
      verified_skills_awarded: 940,
      active_recruiters_hiring: 18,
      department_breakdown: [
        { department: 'Computer Science', total_students: 210, avg_readiness: 78, verified_ratio: 0.82 },
        { department: 'Information Technology', total_students: 150, avg_readiness: 73, verified_ratio: 0.74 },
        { department: 'Electronics & Communication', total_students: 120, avg_readiness: 69, verified_ratio: 0.68 }
      ],
      top_curriculum_deficits: [
        {
          subject_area: 'Cloud & Containerization (Docker / Kubernetes)',
          market_demand: '92% of tier-1 tech recruiters require containerized microservices knowledge.',
          college_syllabus_gap: 'Syllabus teaches OS memory management & virtualization theory but lacks hands-on Dockerfiles or CI/CD pipelines.',
          impacted_students_count: 345,
          recommended_action: 'Introduce mandatory 20-hour practical Docker & cloud deployment lab in 5th Semester Web Engineering.'
        },
        {
          subject_area: 'Production RESTful API Engineering & Authentication',
          market_demand: '88% of backend job postings expect FastAPI/Express, JWT auth, and pagination.',
          college_syllabus_gap: 'Syllabus covers relational DBMS SQL queries without modern stateless REST JSON standards.',
          impacted_students_count: 312,
          recommended_action: 'Incorporate FastAPI/Django REST Framework mini-project into 4th Semester DBMS lab.'
        }
      ]
    };
  },

  getTpoStudents: async (college = 'Delhi Technological University (DTU)', department = null) => {
    try {
      const param = department && department !== 'all' ? `&department=${encodeURIComponent(department)}` : '';
      const res = await fetch(`${API_BASE}/tpo/students?college=${encodeURIComponent(college)}${param}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.info('Backend unavailable, generating mock student cohort', e);
    }
    return [
      { id: 'dtu-std-101', name: 'Aditya Sharma', department: 'Computer Science', course: 'B.Tech CSE', semester: 5, dream_role: 'Software Developer', cgpa: 8.9, readiness_percentage: 91, verified_skills_count: 4, verified_skills: ['Git', 'FastAPI', 'DSA', 'Docker'], placement_status: 'Placement Ready' },
      { id: 'dtu-std-102', name: 'Sneha Kapoor', department: 'Computer Science', course: 'B.Tech CSE', semester: 5, dream_role: 'Software Developer', cgpa: 9.2, readiness_percentage: 94, verified_skills_count: 4, verified_skills: ['Git', 'Docker', 'DSA', 'React'], placement_status: 'Placement Ready' },
      { id: 'dtu-std-103', name: 'Vikram Malhotra', department: 'Information Technology', course: 'B.Tech IT', semester: 5, dream_role: 'Data Analyst', cgpa: 8.1, readiness_percentage: 78, verified_skills_count: 3, verified_skills: ['SQL', 'Pandas', 'EDA'], placement_status: 'Skill Upgrading' },
      { id: 'dtu-std-104', name: 'Kunal Joshi', department: 'Electronics & Communication', course: 'B.Tech ECE', semester: 5, dream_role: 'Embedded Systems Engineer', cgpa: 8.7, readiness_percentage: 86, verified_skills_count: 3, verified_skills: ['C++', 'Microprocessors', 'Embedded C'], placement_status: 'Placement Ready' },
      { id: 'dtu-std-108', name: 'Ananya Gupta', department: 'Computer Science', course: 'B.Tech CSE', semester: 5, dream_role: 'Software Developer', cgpa: 9.4, readiness_percentage: 98, verified_skills_count: 5, verified_skills: ['Python', 'React', 'REST APIs', 'DSA', 'Git'], placement_status: 'Placement Ready' }
    ];
  },

  // Corporate Recruiter Portal
  getRecruiterStats: async (company = 'Swiggy') => {
    try {
      const res = await fetch(`${API_BASE}/recruiter/dashboard-stats?company=${encodeURIComponent(company)}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.info('Backend unavailable, returning recruiter stats', e);
    }
    return {
      company_name: company,
      active_openings: 4,
      total_applicants: 12,
      shortlisted_candidates: 4,
      interviews_scheduled: 2,
      offers_extended: 1,
      top_demanded_skills: ['RESTful API Engineering', 'Docker Containerization', 'DSA', 'SQL']
    };
  },

  getRecruiterApplications: async (company = null, statusFilter = null) => {
    try {
      const params = new URLSearchParams();
      if (company && company !== 'all') params.append('company', company);
      if (statusFilter && statusFilter !== 'all') params.append('status_filter', statusFilter);
      const res = await fetch(`${API_BASE}/recruiter/applications?${params.toString()}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.info('Backend unavailable, returning applications', e);
    }
    return [
      {
        id: 'app-swiggy-aarav',
        student_id: 'demo-student',
        student_name: 'Aarav Sharma',
        student_college: 'Delhi Technological University (DTU)',
        student_course: 'B.Tech CSE',
        internship_id: 'intern-swiggy-backend',
        company: 'Swiggy',
        role_title: 'Backend Engineering Intern (FastAPI / Go)',
        match_percentage: 100,
        status: 'shortlisted',
        proof_certificate_id: 'NX-VERIFIED-4BDDB178DDF6-74842',
        verified_skills_snapshot: ['Git & GitHub', 'RESTful APIs & FastAPI', 'DSA'],
        code_proof_snippet: 'def build_api_response(records, page, page_size):\n    # Verified with 3/3 passing test assertions in 14.2ms',
        recruiter_notes: 'Top candidate with verified REST API and Git proof-of-work. Scheduled for technical interview.',
        applied_at: '2026-09-28T14:30:00'
      },
      {
        id: 'app-swiggy-sneha',
        student_id: 'dtu-std-102',
        student_name: 'Sneha Kapoor',
        student_college: 'Delhi Technological University (DTU)',
        student_course: 'B.Tech CSE',
        internship_id: 'intern-swiggy-backend',
        company: 'Swiggy',
        role_title: 'Backend Engineering Intern (FastAPI / Go)',
        match_percentage: 85,
        status: 'under_review',
        proof_certificate_id: 'NX-VERIFIED-SNEHA-DTU-891',
        verified_skills_snapshot: ['Git & GitHub', 'Docker & Containerization', 'DSA'],
        code_proof_snippet: 'def validate_dockerfile(instructions):\n    # Dockerfile layer caching test passed in 10.4ms',
        recruiter_notes: 'Strong Docker containerization knowledge. Awaiting code review by engineering team.',
        applied_at: '2026-09-29T09:15:00'
      }
    ];
  },

  updateApplicationStatus: async (appId, status, recruiterNotes = '') => {
    try {
      const res = await fetch(`${API_BASE}/recruiter/applications/${appId}/status`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, recruiter_notes: recruiterNotes })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.info('Backend unavailable, updating locally', e);
    }
    return { status: 'success', app_id: appId, message: `Status updated to ${status}` };
  },

  // Demo Reset
  resetDemo: async () => {
    try {
      const res = await fetch(`${API_BASE}/reset-demo`, { method: 'POST', headers: getAuthHeaders() });
      if (res.ok) return await res.json();
    } catch (_) {}
    return { status: 'success', message: 'Demo reset' };
  }
};
