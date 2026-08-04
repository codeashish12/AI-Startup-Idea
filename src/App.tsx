import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { ProfileForm } from './components/ProfileForm';
import { GoalSelection } from './components/GoalSelection';
import { FollowUpStep } from './components/FollowUpStep';
import { ScenarioViewer } from './components/ScenarioViewer';
import { ReportPage } from './components/ReportPage';
import { SavedSimulations } from './components/SavedSimulations';
import { Dashboard } from './components/Dashboard';
import { FdfArchitectureView } from './components/FdfArchitectureView';
import { runFdfEngine } from './engine/fdfEngine';

import { UserProfile, GoalDetails, SimulationResult, AuthState } from './types';
import { DEFAULT_USER_PROFILE, INITIAL_SAMPLE_SIMULATION } from './data/sampleData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // User Profile state with localStorage persistence
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fe_user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
  });

  // Auth State
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('fe_auth');
    return saved ? JSON.parse(saved) : { isAuthenticated: true, user: { email: 'alex@futureengine.ai', name: 'Alex Rivera' } };
  });
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Saved Simulations Library with initial pre-seeded sample simulation
  const [simulations, setSimulations] = useState<SimulationResult[]>(() => {
    const saved = localStorage.getItem('fe_simulations');
    return saved ? JSON.parse(saved) : [INITIAL_SAMPLE_SIMULATION];
  });

  // Simulation Flow Active States
  const [activeGoalDetails, setActiveGoalDetails] = useState<GoalDetails | null>(null);
  const [activeSimulation, setActiveSimulation] = useState<SimulationResult | null>(INITIAL_SAMPLE_SIMULATION);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');
  const [isLoadingSimulation, setIsLoadingSimulation] = useState<boolean>(false);

  // Persist states
  useEffect(() => {
    localStorage.setItem('fe_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('fe_auth', JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    localStorage.setItem('fe_simulations', JSON.stringify(simulations));
  }, [simulations]);

  // Auth Handlers
  const handleLoginSuccess = (user: { email: string; name: string }) => {
    setAuth({ isAuthenticated: true, user });
    setUserProfile((prev) => ({ ...prev, name: user.name }));
  };

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, user: null });
  };

  // Simulation Wizard Handlers
  const handleStartSimulation = () => {
    setCurrentTab('simulate');
  };

  const handleGoalSubmitted = (goal: GoalDetails) => {
    setActiveGoalDetails(goal);
    setCurrentTab('followup');
  };

  const handleRunSimulation = async (followUpAnswers: Record<string, string>) => {
    if (!activeGoalDetails) return;

    setIsLoadingSimulation(true);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          goalCategory: activeGoalDetails.category,
          goalDetails: activeGoalDetails,
          followUpAnswers,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newSim: SimulationResult = {
          id: `sim-${Date.now()}`,
          createdAt: new Date().toISOString(),
          goalCategory: activeGoalDetails.category,
          goalDetails: activeGoalDetails,
          disclaimer: data.disclaimer || 'This is a scenario-based decision support system. It does not predict the future.',
          overallAnalysis: data.overallAnalysis || 'Detailed multi-scenario simulation performed by Future Engine FDF.',
          recommendedOptionIndex: data.recommendedOptionIndex ?? 1,
          scenarios: data.scenarios || [],
          roadmap: data.roadmap || [],
          followUpAnswers,
        };

        setActiveSimulation(newSim);
        setSimulations((prev) => [newSim, ...prev]);
        setCurrentTab('scenarios');
      } else {
        throw new Error('Server simulation non-200');
      }
    } catch (e) {
      console.warn('Simulation API call failed or offline, generating intelligent client-side FDF simulation:', e);
      const fallbackSim = runFdfEngine(userProfile, activeGoalDetails, followUpAnswers);

      setActiveSimulation(fallbackSim);
      setSimulations((prev) => [fallbackSim, ...prev]);
      setCurrentTab('scenarios');
    } finally {
      setIsLoadingSimulation(false);
    }
  };

  const handleProceedToRoadmap = (scenId: string) => {
    setSelectedScenarioId(scenId);
    setCurrentTab('report');
  };

  const handleOpenSimulation = (sim: SimulationResult) => {
    setActiveSimulation(sim);
    setCurrentTab('scenarios');
  };

  const handleDeleteSimulation = (id: string) => {
    setSimulations((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveToLibrary = (sim: SimulationResult) => {
    if (!simulations.some((s) => s.id === sim.id)) {
      setSimulations((prev) => [sim, ...prev]);
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${
      darkMode ? 'bg-[#0B1120] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        auth={auth}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Router */}
      <main className="pb-16">
        {currentTab === 'landing' && (
          <LandingPage
            onStartSimulation={handleStartSimulation}
            onViewSampleSimulation={() => {
              setActiveSimulation(INITIAL_SAMPLE_SIMULATION);
              setCurrentTab('scenarios');
            }}
            darkMode={darkMode}
          />
        )}

        {currentTab === 'dashboard' && (
          <Dashboard
            userProfile={userProfile}
            simulations={simulations}
            onOpenSimulation={handleOpenSimulation}
            onStartNewSimulation={handleStartSimulation}
            onNavigateToProfile={() => setCurrentTab('profile')}
            darkMode={darkMode}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileForm
            profile={userProfile}
            onSaveProfile={(updated) => setUserProfile(updated)}
            darkMode={darkMode}
          />
        )}

        {currentTab === 'simulate' && (
          <GoalSelection
            userProfile={userProfile}
            onSubmitGoal={handleGoalSubmitted}
            darkMode={darkMode}
          />
        )}

        {currentTab === 'followup' && activeGoalDetails && (
          <FollowUpStep
            userProfile={userProfile}
            goalDetails={activeGoalDetails}
            onSubmitSimulation={handleRunSimulation}
            isLoadingSimulation={isLoadingSimulation}
            darkMode={darkMode}
          />
        )}

        {currentTab === 'scenarios' && activeSimulation && (
          <ScenarioViewer
            simulation={activeSimulation}
            onProceedToRoadmap={handleProceedToRoadmap}
            darkMode={darkMode}
          />
        )}

        {currentTab === 'report' && activeSimulation && (
          <ReportPage
            simulation={activeSimulation}
            selectedScenarioId={selectedScenarioId}
            onBackToSimulations={() => setCurrentTab('saved')}
            onSaveToLibrary={handleSaveToLibrary}
            darkMode={darkMode}
          />
        )}

        {currentTab === 'saved' && (
          <SavedSimulations
            simulations={simulations}
            onOpenSimulation={handleOpenSimulation}
            onDeleteSimulation={handleDeleteSimulation}
            onStartNewSimulation={handleStartSimulation}
            darkMode={darkMode}
          />
        )}

        {currentTab === 'fdf-arch' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <FdfArchitectureView darkMode={darkMode} />
          </div>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        darkMode={darkMode}
      />

    </div>
  );
}
