import React, { useState, useEffect, useCallback } from 'react';
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
import {
  PROTECTED_TABS,
  AuthSuccessResponse,
  clearAuthSession,
  loadPersistedAuthState,
  mapApiProfileToUserProfile,
  persistAuthSession,
  updateProfileOnServer,
  verifySession,
} from './utils/auth';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [authReady, setAuthReady] = useState<boolean>(false);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fe_user_profile');
    return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
  });

  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);

  const [simulations, setSimulations] = useState<SimulationResult[]>(() => {
    const saved = localStorage.getItem('fe_simulations');
    return saved ? JSON.parse(saved) : [INITIAL_SAMPLE_SIMULATION];
  });

  const [activeGoalDetails, setActiveGoalDetails] = useState<GoalDetails | null>(null);
  const [activeSimulation, setActiveSimulation] = useState<SimulationResult | null>(INITIAL_SAMPLE_SIMULATION);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('');
  const [isLoadingSimulation, setIsLoadingSimulation] = useState<boolean>(false);

  const applyAuthSuccess = useCallback((response: AuthSuccessResponse) => {
    persistAuthSession(response.token, response.user);
    setAuth({
      isAuthenticated: true,
      user: {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
      },
      token: response.token,
    });
    if (response.profile) {
      setUserProfile(mapApiProfileToUserProfile(response.profile));
    } else {
      setUserProfile((prev) => ({ ...prev, name: response.user.name }));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const persisted = loadPersistedAuthState();
      if (!persisted.token) {
        if (!cancelled) {
          setAuth({ isAuthenticated: false, user: null, token: null });
          setAuthReady(true);
        }
        return;
      }

      const profile = await verifySession(persisted.token);
      if (cancelled) return;

      if (profile && persisted.user) {
        setAuth({
          isAuthenticated: true,
          user: persisted.user,
          token: persisted.token,
        });
        setUserProfile(mapApiProfileToUserProfile(profile));
      } else {
        clearAuthSession();
        setAuth({ isAuthenticated: false, user: null, token: null });
      }
      setAuthReady(true);
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('fe_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      localStorage.setItem(
        'fe_auth',
        JSON.stringify({ isAuthenticated: true, user: auth.user, token: auth.token })
      );
    }
  }, [auth]);

  useEffect(() => {
    localStorage.setItem('fe_simulations', JSON.stringify(simulations));
  }, [simulations]);

  useEffect(() => {
    if (!authReady) return;
    if (PROTECTED_TABS.has(currentTab) && !auth.isAuthenticated) {
      setPendingTab(currentTab);
      setCurrentTab('landing');
      setIsAuthOpen(true);
    }
  }, [authReady, currentTab, auth.isAuthenticated]);

  const navigateToTab = useCallback(
    (tab: string) => {
      if (PROTECTED_TABS.has(tab) && !auth.isAuthenticated) {
        setPendingTab(tab);
        setIsAuthOpen(true);
        return;
      }
      setCurrentTab(tab);
    },
    [auth.isAuthenticated]
  );

  const handleLoginSuccess = (response: AuthSuccessResponse) => {
    applyAuthSuccess(response);
    if (pendingTab && PROTECTED_TABS.has(pendingTab)) {
      setCurrentTab(pendingTab);
      setPendingTab(null);
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    setAuth({ isAuthenticated: false, user: null, token: null });
    setPendingTab(null);
    if (PROTECTED_TABS.has(currentTab)) {
      setCurrentTab('landing');
    }
  };

  const handleSaveProfile = async (updated: UserProfile) => {
    setUserProfile(updated);
    if (auth.isAuthenticated) {
      try {
        const savedProfile = await updateProfileOnServer(updated);
        setUserProfile(mapApiProfileToUserProfile(savedProfile));
      } catch (err) {
        console.error('Failed to sync profile to server:', err);
      }
    }
  };

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
    if (!auth.isAuthenticated) {
      setPendingTab('report');
      setIsAuthOpen(true);
      return;
    }
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

  const canAccessProtected = auth.isAuthenticated;

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${
      darkMode ? 'bg-[#0B1120] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      <Header
        currentTab={currentTab}
        setCurrentTab={navigateToTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        auth={auth}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

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

        {currentTab === 'dashboard' && authReady && canAccessProtected && (
          <Dashboard
            userProfile={userProfile}
            simulations={simulations}
            onOpenSimulation={handleOpenSimulation}
            onStartNewSimulation={handleStartSimulation}
            onNavigateToProfile={() => navigateToTab('profile')}
            darkMode={darkMode}
          />
        )}

        {currentTab === 'profile' && authReady && canAccessProtected && (
          <ProfileForm
            profile={userProfile}
            onSaveProfile={handleSaveProfile}
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

        {currentTab === 'report' && authReady && canAccessProtected && activeSimulation && (
          <ReportPage
            simulation={activeSimulation}
            selectedScenarioId={selectedScenarioId}
            onBackToSimulations={() => navigateToTab('saved')}
            onSaveToLibrary={handleSaveToLibrary}
            darkMode={darkMode}
          />
        )}

        {currentTab === 'saved' && authReady && canAccessProtected && (
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

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setPendingTab(null);
        }}
        onLoginSuccess={handleLoginSuccess}
        darkMode={darkMode}
      />

    </div>
  );
}
