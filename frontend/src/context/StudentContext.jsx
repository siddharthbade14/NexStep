import React, { createContext, useContext, useState, useEffect } from 'react';

const StudentContext = createContext();

export const DEMO_PERSONAS = [
  {
    id: 'demo-student',
    name: 'Aarav Sharma',
    college: 'Delhi Technological University (DTU)',
    course: 'B.Tech CSE',
    semester: 5,
    dream_role: 'Software Developer',
    language: 'English',
    self_reported_skills: ['Python', 'C++', 'Data Structures', 'DBMS', 'Git'],
    avatar: 'AS',
    department: 'Computer Science',
    tagline: 'Aspiring Full-Stack & Backend Systems Engineer',
    accentColor: 'from-teal-600 to-cyan-600'
  },
  {
    id: 'demo-priya',
    name: 'Priya Nair',
    college: 'NIT Trichy',
    course: 'B.Tech ECE',
    semester: 5,
    dream_role: 'Embedded Systems Engineer',
    language: 'English',
    self_reported_skills: ['C++', 'Microprocessors', 'Digital Electronics', 'Basic C', 'Git'],
    avatar: 'PN',
    department: 'Electronics & Communication',
    tagline: 'Firmware & ARM Cortex Architecture Enthusiast',
    accentColor: 'from-amber-600 to-orange-600'
  },
  {
    id: 'demo-rohan',
    name: 'Rohan Verma',
    college: 'Netaji Subhas University of Technology (NSUT)',
    course: 'B.Tech IT',
    semester: 5,
    dream_role: 'Data Analyst',
    language: 'English',
    self_reported_skills: ['Python', 'SQL', 'Statistics', 'Excel', 'Data Visualization'],
    avatar: 'RV',
    department: 'Information Technology',
    tagline: 'Business Intelligence & Exploratory Data Analysis',
    accentColor: 'from-purple-600 to-indigo-600'
  },
  {
    id: 'demo-blank',
    name: '',
    college: '',
    course: 'B.Tech CSE',
    semester: 1,
    dream_role: 'Software Developer',
    language: 'English',
    self_reported_skills: [],
    avatar: 'NEW',
    department: 'Custom Student Profile',
    tagline: 'Build a completely custom profile from scratch',
    accentColor: 'from-slate-600 to-slate-800'
  }
];

const DEFAULT_STUDENT = {
  ...DEMO_PERSONAS[0],
  verified_skills: ['skill-git'],
  completed_quizzes: ['skill-git']
};

export const StudentProvider = ({ children }) => {
  const [student, setStudent] = useState(() => {
    try {
      const saved = localStorage.getItem('nexstep_student');
      return saved ? JSON.parse(saved) : DEFAULT_STUDENT;
    } catch {
      return DEFAULT_STUDENT;
    }
  });

  const [activeTab, setActiveTab] = useState('landing');
  const [lastVerifiedSkill, setLastVerifiedSkill] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nexstep_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nexstep_student', JSON.stringify(student));
    } catch (err) {
      console.error('Failed to save student profile to localStorage', err);
    }
  }, [student]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('nexstep_auth_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('nexstep_auth_user');
      }
    } catch (err) {
      console.error('Failed to save auth state to localStorage', err);
    }
  }, [currentUser]);

  const updateProfile = (newProfile) => {
    setStudent(prev => ({
      ...prev,
      ...newProfile,
      // preserve verified skills unless explicitly passed
      verified_skills: newProfile.verified_skills !== undefined ? newProfile.verified_skills : (prev.verified_skills || []),
      completed_quizzes: newProfile.completed_quizzes !== undefined ? newProfile.completed_quizzes : (prev.completed_quizzes || [])
    }));
  };

  const addVerifiedSkill = (skillId) => {
    setStudent(prev => {
      const current = prev.verified_skills || [];
      if (current.includes(skillId)) return prev;
      return {
        ...prev,
        verified_skills: [...current, skillId]
      };
    });
    setLastVerifiedSkill(skillId);
  };

  const addCompletedQuiz = (skillId) => {
    setStudent(prev => {
      const current = prev.completed_quizzes || [];
      if (current.includes(skillId)) return prev;
      return {
        ...prev,
        completed_quizzes: [...current, skillId],
        // also count towards verified skills
        verified_skills: prev.verified_skills.includes(skillId) ? prev.verified_skills : [...prev.verified_skills, skillId]
      };
    });
  };

  const resetStudentState = async () => {
    try {
      await fetch('/api/reset-demo', { method: 'POST' });
    } catch (e) {
      console.warn('Backend reset call failed', e);
    }
    setStudent({
      ...DEFAULT_STUDENT,
      verified_skills: ['skill-git'],
      completed_quizzes: ['skill-git'],
      resetTimestamp: Date.now()
    });
  };

  // Launch Demo Account and start Onboarding directly from the beginning (Step 1)
  const startDemoOnboarding = async (persona = DEMO_PERSONAS[0]) => {
    try {
      await fetch('/api/reset-demo', { method: 'POST' });
    } catch (e) {
      console.warn('Backend reset call failed', e);
    }

    const freshStudent = {
      ...persona,
      verified_skills: [], // WIPE verified skills so onboarding begins from scratch
      completed_quizzes: [],
      resetTimestamp: Date.now() // Signals OnboardingPage to reset step to 1
    };

    setStudent(freshStudent);
    setCurrentUser({
      id: freshStudent.id,
      name: freshStudent.name || 'Demo Student',
      email: `${freshStudent.id}@demo.nexstep.in`,
      isDemo: true
    });

    try {
      localStorage.setItem('nexstep_student', JSON.stringify(freshStudent));
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }

    setActiveTab('onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Standard user login
  const loginStudent = ({ email, password, persona = null }) => {
    const selectedPersona = persona || DEMO_PERSONAS[0];
    const userObj = {
      id: selectedPersona.id,
      name: selectedPersona.name || email.split('@')[0],
      email: email || 'student@dtu.ac.in',
      isDemo: Boolean(persona || email?.includes('demo'))
    };

    setCurrentUser(userObj);
    return userObj;
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('landing');
  };

  return (
    <StudentContext.Provider value={{
      student,
      currentUser,
      DEMO_PERSONAS,
      updateProfile,
      addVerifiedSkill,
      addCompletedQuiz,
      resetStudentState,
      startDemoOnboarding,
      loginStudent,
      logout,
      activeTab,
      setActiveTab,
      lastVerifiedSkill,
      setLastVerifiedSkill
    }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};
