import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Brain, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Award,
  Layers,
  FileText
} from 'lucide-react';
import { Scenario, SimulationResult } from '../types';

interface ScenarioViewerProps {
  simulation: SimulationResult;
  onProceedToRoadmap: (selectedScenarioId: string) => void;
  darkMode: boolean;
}

export const ScenarioViewer: React.FC<ScenarioViewerProps> = ({
  simulation,
  onProceedToRoadmap,
  darkMode,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    simulation.scenarios[simulation.recommendedOptionIndex]?.id || simulation.scenarios[0]?.id || ''
  );

  const currentScenario = simulation.scenarios.find((s) => s.id === selectedScenarioId) || simulation.scenarios[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Mandatory Disclaimer */}
      <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs sm:text-sm font-medium">
            <strong className="text-white">Decision Support System:</strong> {simulation.disclaimer}
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
          FDF Engine v1.0
        </span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
          <span>{simulation.goalCategory} Simulation</span>
          <span>•</span>
          <span>{simulation.scenarios.length} Scenarios Calculated</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{simulation.goalDetails.title}</h1>
        <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          {simulation.overallAnalysis}
        </p>
      </div>

      {/* Scenario Tabs Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {simulation.scenarios.map((scen, idx) => {
          const isSelected = scen.id === selectedScenarioId;
          const isRecommended = idx === simulation.recommendedOptionIndex;

          return (
            <button
              key={scen.id}
              onClick={() => setSelectedScenarioId(scen.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 shadow-xl ring-2 ring-indigo-500/30'
                  : darkMode
                    ? 'bg-[#0B1120] border-slate-800 hover:border-slate-700 text-slate-300'
                    : 'bg-white border-slate-200 hover:border-indigo-200 text-slate-700'
              }`}
            >
              {isRecommended && (
                <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-slate-950 shadow-md">
                  ★ Recommended
                </span>
              )}

              <div className="flex items-center justify-between mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  scen.strategyType === 'Aggressive' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  scen.strategyType === 'Balanced' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {scen.strategyType}
                </span>

                <span className="text-xs font-mono font-bold text-slate-400">
                  GS: {scen.fdfScores.goalScore}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-100 line-clamp-1">{scen.title}</h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{scen.tagline}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Scenario Detailed View */}
      {currentScenario && (
        <div className="space-y-6">
          
          {/* FDF Score Dashboard Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>Goal Score</span>
                <Award className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-3xl font-black text-indigo-400 mt-2">
                {currentScenario.fdfScores.goalScore}<span className="text-xs font-normal text-slate-500">/100</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Skill & Budget Alignment</div>
            </div>

            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>Risk Score</span>
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              </div>
              <div className={`text-3xl font-black mt-2 ${
                currentScenario.fdfScores.riskScore > 60 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {currentScenario.fdfScores.riskScore}<span className="text-xs font-normal text-slate-500">/100</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Financial & Market Exposure</div>
            </div>

            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>Opportunity Score</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400 mt-2">
                {currentScenario.fdfScores.opportunityScore}<span className="text-xs font-normal text-slate-500">/100</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Long-term Career/Income Upside</div>
            </div>

            <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>Confidence Rating</span>
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl font-bold text-purple-400 mt-2">
                {currentScenario.fdfScores.confidenceLevel} Confidence
              </div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                {currentScenario.fdfScores.confidenceReasoning}
              </div>
            </div>

          </div>

          {/* Narrative Overview Card */}
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className="text-lg font-bold text-slate-100 mb-2 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              <span>Strategy Overview: {currentScenario.title}</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">{currentScenario.summary}</p>

            {/* Quick Metrics Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/60">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Estimated Timeline</div>
                  <div className="text-sm font-bold text-slate-200">{currentScenario.estimatedTimeline}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 font-bold text-xs flex items-center justify-center w-8 h-8">
                  ₹
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Budget / Capital Needed (₹)</div>
                  <div className="text-sm font-bold text-slate-200">{currentScenario.budgetEstimate}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Key Skill Gap</div>
                  <div className="text-sm font-bold text-slate-200 truncate max-w-[180px]">
                    {currentScenario.skillGap.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Advantages vs Disadvantages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Advantages */}
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Advantages & Strategic Perks</span>
              </h3>
              <ul className="space-y-2.5">
                {currentScenario.advantages.map((adv, i) => (
                  <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disadvantages */}
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-base font-bold text-amber-400 mb-4 flex items-center space-x-2">
                <XCircle className="w-5 h-5 text-amber-400" />
                <span>Disadvantages & Resource Demands</span>
              </h3>
              <ul className="space-y-2.5">
                {currentScenario.disadvantages.map((dis, i) => (
                  <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                    <span>{dis}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Risks & Opportunities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Risks */}
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-base font-bold text-red-400 mb-4 flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <span>Identified Risks</span>
              </h3>
              <ul className="space-y-2.5">
                {currentScenario.risks.map((risk, i) => (
                  <li key={i} className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-xs text-slate-300">
                    {risk}
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>Upside Opportunities</span>
              </h3>
              <ul className="space-y-2.5">
                {currentScenario.opportunities.map((opp, i) => (
                  <li key={i} className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-slate-300">
                    {opp}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Suggested Next Steps */}
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className="text-base font-bold text-indigo-400 mb-4 flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Suggested Immediate Action Steps</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentScenario.suggestedNextSteps.map((step, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                    Step {idx + 1}
                  </div>
                  <div className="text-xs font-medium text-slate-200 leading-relaxed">{step}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTA to generate full roadmap & report */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900 border border-indigo-500/30">
            <div>
              <h3 className="text-lg font-bold text-white">Ready to execute this path?</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Generate the phased execution roadmap and downloadable executive report for "{currentScenario.title}".
              </p>
            </div>

            <button
              onClick={() => onProceedToRoadmap(selectedScenarioId)}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30 shrink-0"
            >
              <span>View Execution Roadmap & Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
