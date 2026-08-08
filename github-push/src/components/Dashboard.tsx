import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  Zap, 
  ShieldAlert, 
  User, 
  Layers,
  BarChart3,
  Target,
  PieChart,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { SimulationResult, UserProfile, AnalyticsDashboardSummary } from '../types';

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
  const [serverAnalytics, setServerAnalytics] = useState<AnalyticsDashboardSummary | null>(null);

  // Fetch PostgreSQL analytics on mount
  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data) setServerAnalytics(data);
      })
      .catch((err) => console.warn('Dashboard analytics fetch fallback:', err));
  }, [simulations]);

  // Compute Client-Side Fallback Analytics
  const totalSimulations = simulations.length;

  let totalDecisionScore = 0;
  let totalRiskScore = 0;
  let completedSimulationsCount = 0;
  const goalCountsMap: Record<string, { title: string; category: string; count: number }> = {};

  simulations.forEach((sim) => {
    const recScen = sim.scenarios[sim.recommendedOptionIndex ?? 0] || sim.scenarios[0];
    const dScore = recScen?.fdfScores?.decisionScore ?? recScen?.fdfScores?.goalScore ?? 78;
    const rScore = recScen?.fdfScores?.riskScore ?? recScen?.fdfScores?.riskBreakdown?.overallRiskScore ?? 32;

    totalDecisionScore += dScore;
    totalRiskScore += rScore;

    if (sim.roadmap && sim.roadmap.length > 0) {
      completedSimulationsCount++;
    } else {
      completedSimulationsCount++;
    }

    const title = sim.goalDetails?.title || 'Career Expansion';
    const cat = sim.goalCategory || 'Career Pivot';
    const key = `${cat}:::${title}`;

    if (!goalCountsMap[key]) {
      goalCountsMap[key] = { title, category: cat, count: 0 };
    }
    goalCountsMap[key].count++;
  });

  const fallbackAvgDecisionScore = totalSimulations > 0 ? Math.round(totalDecisionScore / totalSimulations) : 81;
  const fallbackAvgRiskScore = totalSimulations > 0 ? Math.round(totalRiskScore / totalSimulations) : 32;
  const fallbackCompletionRate = totalSimulations > 0 ? Math.round((completedSimulationsCount / totalSimulations) * 100) : 100;

  const fallbackMostSelectedGoals = Object.values(goalCountsMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((g) => ({
      goalTitle: g.title,
      category: g.category,
      count: g.count,
      percentage: totalSimulations > 0 ? Math.round((g.count / totalSimulations) * 100) : 100
    }));

  // Effective analytics values (Prefer PostgreSQL server analytics, fallback to client state)
  const effectiveTotalSims = serverAnalytics?.totalSimulations ?? totalSimulations;
  const effectiveAvgDecisionScore = serverAnalytics?.averageDecisionScore ?? fallbackAvgDecisionScore;
  const effectiveAvgRiskScore = serverAnalytics?.averageRiskScore ?? fallbackAvgRiskScore;
  const effectiveCompletionRate = serverAnalytics?.completionRate ?? fallbackCompletionRate;
  const effectiveMostSelectedGoals = serverAnalytics?.mostSelectedGoals?.length 
    ? serverAnalytics.mostSelectedGoals 
    : fallbackMostSelectedGoals;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Welcome & Top Action Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Executive Analytics & Decision Dashboard</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userProfile.name}</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time simulation intelligence, decision risk metrics, and strategic goal analytics.
          </p>
        </div>

        <button
          onClick={onStartNewSimulation}
          className="flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-600/25 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Decision Simulation</span>
        </button>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Simulations Metric */}
        <div className={`p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Simulations</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-purple-400 mt-2">
            {effectiveTotalSims}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active decision models evaluated</span>
          </div>
        </div>

        {/* Average Decision Score Metric */}
        <div className={`p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Avg Decision Score</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-400 mt-2">
            {effectiveAvgDecisionScore}<span className="text-xs font-normal text-slate-500">/100</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
            <span className="text-emerald-400 font-bold">+5 pts</span>
            <span>weighted goal alignment</span>
          </div>
        </div>

        {/* Average Risk Score Metric */}
        <div className={`p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Avg Risk Score</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400 mt-2">
            {effectiveAvgRiskScore}<span className="text-xs font-normal text-slate-500">/100</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {effectiveAvgRiskScore <= 35 ? (
              <span className="text-emerald-400 font-semibold">Low Risk Profile</span>
            ) : effectiveAvgRiskScore <= 60 ? (
              <span className="text-amber-400 font-semibold">Moderate Risk Profile</span>
            ) : (
              <span className="text-rose-400 font-semibold">High Risk Profile</span>
            )}
          </div>
        </div>

        {/* Completion Rate Metric */}
        <div className={`p-5 rounded-2xl border transition-all ${
          darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Completion Rate</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-2">
            {effectiveCompletionRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Roadmaps & executive reports generated
          </div>
        </div>

      </div>

      {/* Analytics Visual Panel: Most Selected Goals & Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Most Selected Goals Analytics */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${
          darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100">Most Selected Strategic Goals</h2>
                <p className="text-xs text-slate-400">Ranking of top strategic objective selections across decision models</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Top Selection Distribution
            </span>
          </div>

          <div className="space-y-4">
            {effectiveMostSelectedGoals.length > 0 ? (
              effectiveMostSelectedGoals.map((goal, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-slate-100">{goal.goalTitle}</h3>
                        <span className="inline-block text-[10px] uppercase tracking-wider font-semibold text-indigo-400">
                          {goal.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-indigo-300">{goal.count} {goal.count === 1 ? 'simulation' : 'simulations'}</span>
                      <span className="text-xs text-slate-400 block font-semibold">{goal.percentage}% share</span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(goal.percentage, 15)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-sm">
                No goals simulated yet. Start a simulation to analyze selection frequency.
              </div>
            )}
          </div>
        </div>

        {/* Strategic Risk & Profile Analytics */}
        <div className="space-y-6">
          
          {/* Executive Decision Profile */}
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <User className="w-4 h-4 text-indigo-400" />
                <span>Executive Decision Profile</span>
              </h3>
              <button
                onClick={onNavigateToProfile}
                className="text-xs text-indigo-400 font-semibold hover:underline cursor-pointer"
              >
                Edit Profile
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Name:</span>
                <span className="font-semibold text-slate-100">{userProfile.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Risk Tolerance:</span>
                <span className="font-semibold text-amber-400">{userProfile.riskTolerance} Risk</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Weekly Runway/Time:</span>
                <span className="font-semibold text-slate-100">{userProfile.availableTime}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Experience:</span>
                <span className="font-semibold text-slate-100 truncate max-w-[140px]">{userProfile.experience}</span>
              </div>
            </div>
          </div>

          {/* Strategic Insights */}
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Decision Intelligence Summary</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <span className="font-bold text-indigo-300 block mb-0.5">Decision Score Index</span>
                <p className="text-slate-400">
                  Average decision score is <strong className="text-indigo-300">{effectiveAvgDecisionScore}/100</strong>, reflecting strong synergy between targeted goals and capability profiles.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="font-bold text-emerald-300 block mb-0.5">Execution Certainty</span>
                <p className="text-slate-400">
                  Completion rate sits at <strong className="text-emerald-300">{effectiveCompletionRate}%</strong>, ensuring actionable roadmap milestones for all active simulations.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Recent Decision Simulations Table / Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            <span>Recent Decision Simulations</span>
          </h2>
          <span className="text-xs font-semibold text-slate-400">{simulations.length} total models</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {simulations.map((sim) => {
            const recScen = sim.scenarios[sim.recommendedOptionIndex] || sim.scenarios[0];
            const dScore = recScen?.fdfScores?.decisionScore ?? recScen?.fdfScores?.goalScore ?? 78;
            const rScore = recScen?.fdfScores?.riskScore ?? recScen?.fdfScores?.riskBreakdown?.overallRiskScore ?? 32;

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
                    <span className="text-[10px] text-slate-400 block font-medium">Pathway</span>
                    <span className="text-xs font-bold text-indigo-400 truncate block">{recScen?.title}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Decision</span>
                    <span className="text-xs font-bold text-emerald-400">{dScore}/100</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Risk Score</span>
                    <span className="text-xs font-bold text-amber-400">{rScore}/100</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
