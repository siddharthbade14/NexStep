import React, { createContext, useContext, useState, useEffect } from 'react';

const StudentContext = createContext();

const DEFAULT_STUDENT = {
  id: 'demo-student',
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

  useEffect(() => {
    try {
      localStorage.setItem('nexstep_student', JSON.stringify(student));
    } catch (err) {
      console.error('Failed to save student profile to localStorage', err);
    }
  }, [student]);

  const updateProfile = (newProfile) => {
    setStudent(prev => ({
      ...prev,
      ...newProfile,
      // preserve verified skills unless explicitly passed
      verified_skills: newProfile.verified_skills || prev.verified_skills || ['skill-git'],
      completed_quizzes: newProfile.completed_quizzes || prev.completed_quizzes || ['skill-git']
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
      completed_quizzes: ['skill-git']
    });
  };

  return (
    <StudentContext.Provider value={{
      student,
      updateProfile,
      addVerifiedSkill,
      addCompletedQuiz,
      resetStudentState,
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
