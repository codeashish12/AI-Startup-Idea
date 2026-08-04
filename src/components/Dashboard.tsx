import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Zap, 
  ShieldAlert, 
  FileText, 
  User, 
  Layers
} from 'lucide-react';
import { SimulationResult, UserProfile } from '../types';

interface DashboardProps {
  userProfile: UserProfile;
  simulations: SimulationResult[];
  onOpenSimulation: (sim: SimulationResult) => void;
  onStartNewSimulation: () => void;
  onNavigateToProfile: () => void;
  darkMode: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  simulations,
  onOpenSimulation,
  onStartNewSimulation,
  onNavigateToProfile,
  darkMode,
}) => {
  // Calculate aggregated Future Score based on profile completeness & simulation scores
  const recentSim = simulations[0];
  const topScenario = recentSim?.scenarios[recentSim.recommendedOptionIndex] || recentSim?.scenarios[0];
  const futureScore = topScenario ? Math.round((topScenario.fdfScores.goalScore + topScenario.fdfScores.opportunityScore) / 2) : 84;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Welcome & Top Metric Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Executive Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userProfile.name}</h1>
          <p className="text-sm text-slate-400 mt-1">
            Track active scenario simulations, monitor Future Decision Framework metrics, and manage roadmaps.
          </p>
        </div>

        <button
          onClick={onStartNewSimulation}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-600/25 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Decision Simulation</span>
        </button>
      </div>

      {/* Top Key Performance Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Future Score Metric */}
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Aggregated Future Score</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-indigo-400 mt-2">
            {futureScore}<span className="text-xs font-normal text-slate-500">/100</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
            <span className="text-emerald-400 font-bold">+6%</span>
            <span>from profile alignment</span>
          </div>
        </div>

        {/* Total Simulations Run */}
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Decision Simulations</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-purple-400 mt-2">
            {simulations.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Multi-scenario evaluations</div>
        </div>

        {/* Risk Capacity */}
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Risk Capacity</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-2">
            {userProfile.riskTolerance} Risk
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{userProfile.availableTime} available</div>
        </div>

        {/* Recommended Strategy */}
        <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Top Pathway Strategy</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2 truncate">
            {topScenario?.strategyType || 'Balanced'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Optimized for stability</div>
        </div>

      </div>

      {/* Main Content Split: Recent Simulations & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Decision Simulations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              <span>Recent Decision Simulations</span>
            </h2>
            <span className="text-xs font-semibold text-slate-400">{simulations.length} total</span>
          </div>

          <div className="space-y-4">
            {simulations.map((sim) => {
              const recScen = sim.scenarios[sim.recommendedOptionIndex] || sim.scenarios[0];

              return (
                <div
                  key={sim.id}
                  onClick={() => onOpenSimulation(sim)}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] ${
                    darkMode
                      ? 'bg-[#0B1120] border-slate-800 hover:border-indigo-500/50'
                      : 'bg-white border-slate-200 hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {sim.goalCategory}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(sim.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100">{sim.goalDetails.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{sim.overallAnalysis}</p>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/60 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Top Pathway</span>
                      <span className="text-xs font-bold text-indigo-400 truncate block">{recScen?.title}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Goal Score</span>
                      <span className="text-xs font-bold text-emerald-400">{recScen?.fdfScores.goalScore}/100</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Risk Score</span>
                      <span className="text-xs font-bold text-amber-400">{recScen?.fdfScores.riskScore}/100</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Strategic Recommendations & Quick Actions */}
        <div className="space-y-6">
          
          {/* Quick Profile Summary Card */}
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <User className="w-4 h-4 text-indigo-400" />
                <span>Decision Profile</span>
              </h3>
              <button
                onClick={onNavigateToProfile}
                className="text-xs text-indigo-400 font-semibold hover:underline"
              >
                Edit Profile
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Name:</span>
                <span className="font-semibold">{userProfile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Experience:</span>
                <span className="font-semibold truncate max-w-[150px]">{userProfile.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Income / Runway:</span>
                <span className="font-semibold">{userProfile.income}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Available Time:</span>
                <span className="font-semibold">{userProfile.availableTime}</span>
              </div>
            </div>
          </div>

          {/* Strategic AI Recommendations */}
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Strategic AI Recommendations</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs">
                <span className="font-bold text-indigo-300 block mb-0.5">Focus on High-Leverage Skills</span>
                <p className="text-slate-400">Your profile shows high tech proficiency. Pair prompt engineering with product discovery for a 2x career multiplier.</p>
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
                <span className="font-bold text-purple-300 block mb-0.5">De-Risk Financial Runway</span>
                <p className="text-slate-400">With Moderate risk tolerance, choose a Balanced parallel execution path (10-15 hrs/wk) to preserve current income.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
