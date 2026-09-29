import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const StudentContext = createContext();

export const DEMO_PERSONAS = [
  // Students
  {
    id: 'demo-student',
    name: 'Aarav Sharma',
    college: 'Delhi Technological University (DTU)',
    course: 'B.Tech CSE',
    degree: 'B.Tech',
    stream: 'Computer Science & Engineering',
    domain: 'Full-Stack & Web Engineering',
    semester: 5,
    grad_year: 2026,
    dream_role: 'Software Developer',
    role: 'student',
    language: 'English',
    self_reported_skills: ['Python', 'C++', 'Data Structures', 'DBMS', 'Git'],
    avatar: 'AS',
    department: 'Computer Science',
    preferred_work_mode: 'Hybrid (Office + Remote)',
    preferred_location: 'Bengaluru (Bangalore)',
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
    role: 'student',
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
    role: 'student',
    language: 'English',
    self_reported_skills: ['Python', 'SQL', 'Statistics', 'Excel', 'Data Visualization'],
    avatar: 'RV',
    department: 'Information Technology',
    tagline: 'Business Intelligence & Exploratory Data Analysis',
    accentColor: 'from-purple-600 to-indigo-600'
  },
  // College TPO
  {
    id: 'tpo-dtu',
    name: 'Dr. Rajesh Gupta',
    college: 'Delhi Technological University (DTU)',
    role: 'college_tpo',
    department: 'Training & Placement Office',
    designation: 'Head of Placements & Industry Relations',
    avatar: 'RG',
    tagline: 'Leading placement readiness and curriculum modernization for 2,400+ engineers',
    accentColor: 'from-blue-600 to-indigo-700'
  },
  // Corporate Recruiters
  {
    id: 'recruiter-swiggy',
    name: 'Ananya Sen',
    company: 'Swiggy',
    role: 'recruiter',
    department: 'Engineering Talent Acquisition',
    designation: 'Principal Tech Talent Partner',
    avatar: 'AS',
    tagline: 'Sourcing top-tier verified backend and cloud engineering interns across Bharat',
    accentColor: 'from-orange-500 to-amber-600'
  },
  {
    id: 'recruiter-zerodha',
    name: 'Karan Mehta',
    company: 'Zerodha',
    role: 'recruiter',
    department: 'Core Systems Recruiting',
    designation: 'Lead Engineering Recruiter',
    avatar: 'KM',
    tagline: 'Hiring verified full-stack, distributed systems, and low-latency developers',
    accentColor: 'from-emerald-600 to-teal-700'
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
      return saved ? JSON.parse(saved) : {
        id: 'demo-student',
        email: 'student@nexstep.in',
        full_name: 'Aarav Sharma',
        role: 'student',
        avatar: 'AS',
        college: 'Delhi Technological University (DTU)'
      };
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
        verified_skills: prev.verified_skills.includes(skillId) ? prev.verified_skills : [...prev.verified_skills, skillId]
      };
    });
  };

  const resetStudentState = async () => {
    try {
      await api.resetDemo();
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

  const startDemoOnboarding = async (persona = DEMO_PERSONAS[0]) => {
    try {
      await api.resetDemo();
    } catch (e) {
      console.warn('Backend reset call failed', e);
    }

    const freshStudent = {
      ...persona,
      verified_skills: [],
      completed_quizzes: [],
      resetTimestamp: Date.now()
    };

    setStudent(freshStudent);
    setCurrentUser({
      id: freshStudent.id,
      name: freshStudent.name || 'Demo Student',
      full_name: freshStudent.name || 'Demo Student',
      email: `${freshStudent.id}@demo.nexstep.in`,
      role: 'student',
      avatar: freshStudent.avatar || 'DS',
      college: freshStudent.college,
      isDemo: true
    });

    setActiveTab('onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Multi-Role Persona Switcher (Student, TPO, Recruiter)
  const switchRolePersona = async (personaId) => {
    const found = DEMO_PERSONAS.find(p => p.id === personaId) || DEMO_PERSONAS[0];
    
    // Attempt backend switch
    try {
      await api.switchPersona(personaId);
    } catch (_) {}

    const role = found.role || 'student';
    const userObj = {
      id: found.id,
      name: found.name,
      full_name: found.name,
      email: `${found.id}@nexstep.in`,
      role: role,
      avatar: found.avatar,
      college: found.college,
      company_name: found.company,
      designation: found.designation
    };

    setCurrentUser(userObj);

    if (role === 'student') {
      setStudent(prev => ({
        ...found,
        verified_skills: prev.verified_skills || ['skill-git'],
        completed_quizzes: prev.completed_quizzes || ['skill-git']
      }));
      setActiveTab('gap-analysis');
    } else if (role === 'college_tpo') {
      setActiveTab('tpo-dashboard');
    } else if (role === 'recruiter') {
      setActiveTab('recruiter-portal');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    return userObj;
  };

  const loginWithCredentials = async (email, password) => {
    const result = await api.login(email, password);
    if (result && result.user) {
      setCurrentUser(result.user);
      if (result.user.role === 'college_tpo') {
        setActiveTab('tpo-dashboard');
      } else if (result.user.role === 'recruiter') {
        setActiveTab('recruiter-portal');
      } else {
        setActiveTab('gap-analysis');
      }
      return result.user;
    }
    throw new Error('Login failed');
  };

  const logout = () => {
    localStorage.removeItem('nexstep_auth_token');
    localStorage.removeItem('nexstep_auth_user');
    setCurrentUser(null);
    setActiveTab('landing');
  };

  const currentRole = currentUser?.role || student?.role || 'student';

  return (
    <StudentContext.Provider value={{
      student,
      currentUser,
      currentRole,
      DEMO_PERSONAS,
      updateProfile,
      addVerifiedSkill,
      addCompletedQuiz,
      resetStudentState,
      startDemoOnboarding,
      switchRolePersona,
      loginWithCredentials,
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
