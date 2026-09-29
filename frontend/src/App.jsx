import React, { useState } from 'react';
import { StudentProvider, useStudent } from './context/StudentContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { PageContainer } from './components/layout/PageContainer';
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { GapAnalysisPage } from './pages/GapAnalysisPage';
import { VerificationPage } from './pages/VerificationPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { OpportunitiesPage } from './pages/OpportunitiesPage';
import { LoginPage } from './pages/LoginPage';
import { TpoDashboardPage } from './pages/TpoDashboardPage';
import { RecruiterPortalPage } from './pages/RecruiterPortalPage';
import { CustomCursor } from './components/3d/CustomCursor';
import { SpatialBackground3D } from './components/3d/SpatialBackground3D';

const AppContent = () => {
  const { activeTab, setActiveTab } = useStudent();
  const { isDark } = useTheme();
  const [selectedSkillToVerify, setSelectedSkillToVerify] = useState(null);

  const handleSelectSkillToVerify = (skillId) => {
    setSelectedSkillToVerify(skillId);
    setActiveTab('verification');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'login':
        return <LoginPage />;
      case 'tpo-dashboard':
        return <TpoDashboardPage />;
      case 'recruiter-portal':
        return <RecruiterPortalPage />;
      case 'onboarding':
        return <OnboardingPage />;
      case 'gap-analysis':
        return <GapAnalysisPage onSelectSkillToVerify={handleSelectSkillToVerify} />;
      case 'verification':
        return <VerificationPage initialSkillId={selectedSkillToVerify} />;
      case 'resources':
        return <ResourcesPage />;
      case 'roadmap':
        return <RoadmapPage onSelectSkillToVerify={handleSelectSkillToVerify} />;
      case 'opportunities':
        return <OpportunitiesPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 selection:bg-[#2DD4BF] selection:text-slate-950 font-sans relative overflow-x-hidden transition-colors duration-300">
      {/* Global Interactive 3D Cursor */}
      <CustomCursor />
      
      {/* Live React Three Fiber 3D Background Canvas */}
      <SpatialBackground3D />

      <Navbar />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden relative z-10">
        <div className="flex-1">
          <PageContainer>
            {renderActiveScreen()}
          </PageContainer>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <StudentProvider>
        <AppContent />
      </StudentProvider>
    </ThemeProvider>
  );
}
