import React, { useState } from 'react';
import { StudentProvider, useStudent } from './context/StudentContext';
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

const AppContent = () => {
  const { activeTab, setActiveTab } = useStudent();
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC] text-slate-900 bg-grid-pattern selection:bg-[#1F4E5F] selection:text-white">
      <Navbar />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
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
    <StudentProvider>
      <AppContent />
    </StudentProvider>
  );
}
