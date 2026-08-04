import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Database,
  Code,
  Sliders,
  CheckCircle2,
  FileText,
  Workflow,
  ArrowRight,
  ShieldAlert,
  TrendingUp,
  BarChart3,
  Copy,
  Check,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { RiskEngine, OpportunityEngine, DecisionEngine } from '../engine/fdfEngine';

interface FdfArchitectureViewProps {
  darkMode: boolean;
}

export const FdfArchitectureView: React.FC<FdfArchitectureViewProps> = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState<'modules' | 'flow' | 'formulas' | 'sandbox' | 'schema' | 'db'>('modules');
  const [copied, setCopied] = useState(false);

  // Interactive Sandbox State
  const [financialRisk, setFinancialRisk] = useState(35);
  const [timeRisk, setTimeRisk] = useState(30);
  const [executionRisk, setExecutionRisk] = useState(40);
  const [incomePotential, setIncomePotential] = useState(75);
  const [growthPotential, setGrowthPotential] = useState(80);
  const [goalFit, setGoalFit] = useState(90);

  // Calculated Sandbox Metrics
  const calculatedRisk = Math.round(financialRisk * 0.25 + timeRisk * 0.15 + executionRisk * 0.20 + 40 * 0.40);
  const calculatedOpp = Math.round(incomePotential * 0.25 + growthPotential * 0.20 + 80 * 0.55);
  const calculatedDecision = Math.max(0, Math.min(100, Math.round(goalFit * 0.35 + calculatedOpp * 0.35 - calculatedRisk * 0.30 + 15)));

  const handleCopySchema = () => {
    const jsonSchema = {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      title: 'FutureDecisionFrameworkReport',
      type: 'object',
      required: ['profile', 'goal', 'scenarios', 'riskAnalysis', 'opportunityAnalysis', 'decisionMatrix', 'roadmap'],
      properties: {
        timestamp: { type: 'string', format: 'date-time' },
        version: { type: 'string', example: 'FDF-v2.5-PRO' },
        profile: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'integer' },
            skills: { type: 'array', items: { type: 'string' } },
            income: { type: 'string' },
            riskTolerance: { type: 'string', enum: ['Low', 'Moderate', 'High'] }
          }
        },
        goal: {
          type: 'object',
          properties: {
            category: { type: 'string' },
            title: { type: 'string' },
            targetTimeframe: { type: 'string' },
            targetBudget: { type: 'string' }
          }
        },
        scenarios: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              strategyType: { type: 'string', enum: ['Aggressive', 'Balanced', 'Conservative', 'Custom'] },
              fdfScores: {
                type: 'object',
                properties: {
                  goalScore: { type: 'number' },
                  riskScore: { type: 'number' },
                  opportunityScore: { type: 'number' },
                  decisionScore: { type: 'number' }
                }
              }
            }
          }
        },
        decisionMatrix: {
          type: 'object',
          properties: {
            weightedFormula: { type: 'string' },
            weights: { type: 'object' },
            confidence: { type: 'string' },
            assumptions: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    };

    navigator.clipboard.writeText(JSON.stringify(jsonSchema, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const engineModules = [
    { id: '1', name: 'Identity Engine', desc: 'Parses profile, skills, experience, income & weekly capacity hours.' },
    { id: '2', name: 'Goal Understanding Engine', desc: 'Converts natural language goals into structured specs, budget & success criteria.' },
    { id: '3', name: 'Skill Gap Engine', desc: 'Identifies current vs missing critical skills and calculates learning effort in hours.' },
    { id: '4', name: 'Scenario Generator', desc: 'Generates 3–5 distinct strategies (Aggressive, Balanced, Conservative).' },
    { id: '5', name: 'Risk Engine', desc: 'Evaluates 7 sub-risk vectors (Financial, Time, Execution, Tech, Market, etc.).' },
    { id: '6', name: 'Opportunity Engine', desc: 'Scores 6 upside vectors (Income, Growth, Learning, Freedom, Demand, Network).' },
    { id: '7', name: 'Decision Engine', desc: 'Computes weighted Decision Score: (GoalFit*0.35 + Opp*0.35 - Risk*0.30).' },
    { id: '8', name: 'Roadmap Engine', desc: 'Outputs weekly sprints, monthly themes, projects & milestone checkpoints.' },
    { id: '9', name: 'Report Engine', desc: 'Outputs standardized JSON report with zero unformatted text blocks.' },
  ];

  return (
    <div className={`space-y-8 p-4 sm:p-8 rounded-3xl border transition-all ${darkMode ? 'bg-[#0B1120] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Cpu className="w-4 h-4" />
            <span>Core Intelligence Specification</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Future Decision Framework <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">(FDF Engine)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            A proprietary multi-engine decision support system. Evaluates multi-vector risks, opportunity ceilings, weighted trade-offs, and executable roadmaps.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Engine Status: ACTIVE
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            v2.5-PRO
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/40">
        {[
          { id: 'modules', label: '9 Engine Modules', icon: Layers },
          { id: 'flow', label: 'Architecture & Flow', icon: Workflow },
          { id: 'formulas', label: 'Formulas & Math', icon: BarChart3 },
          { id: 'sandbox', label: 'Interactive Simulator', icon: Sliders },
          { id: 'schema', label: 'JSON Schema & API', icon: Code },
          { id: 'db', label: 'Database Schema', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : darkMode
                  ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: 9 ENGINE MODULES */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {engineModules.map((mod) => (
              <div
                key={mod.id}
                className={`p-5 rounded-2xl border transition-all hover:border-indigo-500/50 ${
                  darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/20">
                    M{mod.id}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400/50" />
                </div>
                <h3 className="font-bold text-sm text-slate-100 mb-1">{mod.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ARCHITECTURE & FLOW */}
      {activeTab === 'flow' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className="text-base font-bold text-slate-100 mb-4 flex items-center space-x-2">
              <Workflow className="w-4 h-4 text-indigo-400" />
              <span>FDF Data Processing Pipeline</span>
            </h3>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 px-4">
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-center w-full md:w-1/4">
                <span className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold">Input Payload</span>
                <h4 className="font-bold text-xs mt-1 text-white">Profile & Goal Object</h4>
                <p className="text-[11px] text-slate-400 mt-1">Skills, Income, Risk Tolerance, Time Budget</p>
              </div>

              <ArrowRight className="w-5 h-5 text-indigo-400 shrink-0 rotate-90 md:rotate-0" />

              <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-center w-full md:w-2/4">
                <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-bold">FDF Core Processing</span>
                <h4 className="font-bold text-xs mt-1 text-white">Identity, Gap, Risk & Opportunity Engines</h4>
                <p className="text-[11px] text-indigo-200/80 mt-1">Evaluates 7 sub-risk & 6 opportunity vectors simultaneously</p>
              </div>

              <ArrowRight className="w-5 h-5 text-indigo-400 shrink-0 rotate-90 md:rotate-0" />

              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-center w-full md:w-1/4">
                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Output Artifact</span>
                <h4 className="font-bold text-xs mt-1 text-white">Decision Matrix & Roadmap</h4>
                <p className="text-[11px] text-emerald-200/80 mt-1">3 Scenarios, Risk Scores & Weekly Plan</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FORMULAS & MATH */}
      {activeTab === 'formulas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-2xl border space-y-3 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs">
                <ShieldAlert className="w-4 h-4" />
                <span>1. Multi-Vector Risk Algorithm</span>
              </div>
              <p className="text-xs font-mono bg-slate-950 p-3 rounded-xl text-rose-300 border border-slate-800">
                RiskScore = (Fin*0.25) + (Time*0.15) + (Exec*0.20) + (Comp*0.10) + (Tech*0.10) + (Learn*0.10) + (Mkt*0.10)
              </p>
              <p className="text-xs text-slate-400">
                Weights financial runway protection and execution strain heaviest to prevent burnouts or career disruptions.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border space-y-3 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                <TrendingUp className="w-4 h-4" />
                <span>2. Opportunity Potential Score</span>
              </div>
              <p className="text-xs font-mono bg-slate-950 p-3 rounded-xl text-emerald-300 border border-slate-800">
                OppScore = (Income*0.25) + (Growth*0.20) + (Learn*0.15) + (Freedom*0.15) + (Demand*0.15) + (Network*0.10)
              </p>
              <p className="text-xs text-slate-400">
                Calculates upside potential across monetary returns, long-term skill equity, and market longevity.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border space-y-3 md:col-span-2 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
                <BarChart3 className="w-4 h-4" />
                <span>3. Composite Weighted Decision Matrix Formula</span>
              </div>
              <p className="text-xs font-mono bg-slate-950 p-4 rounded-xl text-indigo-300 border border-slate-800 text-center text-sm">
                DecisionScore = (GoalFit * 0.35) + (OpportunityScore * 0.35) - (RiskScore * 0.30)
              </p>
              <p className="text-xs text-slate-400 text-center">
                Maintains a risk-penalty ratio where high upside cannot override unacceptable risk thresholds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INTERACTIVE SANDBOX */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border space-y-6 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>FDF Mathematical Sandbox</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sliders */}
              <div className="space-y-4 md:col-span-2">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Goal Fit Score</span>
                    <span className="font-bold text-indigo-400">{goalFit}/100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goalFit}
                    onChange={(e) => setGoalFit(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Financial Risk</span>
                    <span className="font-bold text-rose-400">{financialRisk}/100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={financialRisk}
                    onChange={(e) => setFinancialRisk(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                    <span>Income Potential</span>
                    <span className="font-bold text-emerald-400">{incomePotential}/100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={incomePotential}
                    onChange={(e) => setIncomePotential(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* Live Output Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between text-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Calculated Decision Score</span>
                  <div className="text-4xl font-black text-indigo-400 mt-2">{calculatedDecision} / 100</div>
                </div>

                <div className="space-y-2 mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Risk Score:</span>
                    <span className="text-rose-400 font-bold">{calculatedRisk}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Opp Score:</span>
                    <span className="text-emerald-400 font-bold">{calculatedOpp}/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: JSON SCHEMA */}
      {activeTab === 'schema' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-medium">Standard JSON Report Schema Specification</span>
            <button
              onClick={handleCopySchema}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON Schema'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto border border-slate-800 max-h-96">
{`{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "FutureDecisionFrameworkReport",
  "type": "object",
  "required": [
    "profile", "goal", "scenarios", "riskAnalysis",
    "opportunityAnalysis", "decisionMatrix", "roadmap"
  ],
  "properties": {
    "timestamp": { "type": "string", "format": "date-time" },
    "version": { "type": "string", "example": "FDF-v2.5-PRO" },
    "profile": { "type": "object" },
    "goal": { "type": "object" },
    "scenarios": { "type": "array" },
    "decisionMatrix": {
      "type": "object",
      "properties": {
        "weightedFormula": { "type": "string" },
        "topRecommendation": { "type": "object" }
      }
    }
  }
}`}
          </pre>
        </div>
      )}

      {/* TAB 6: DATABASE SCHEMA */}
      {activeTab === 'db' && (
        <div className="space-y-4">
          <div className={`p-6 rounded-2xl border space-y-4 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Database className="w-4 h-4 text-indigo-400" />
              <span>Production Relational / Firestore Schema</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-slate-300 space-y-2">
                <span className="text-indigo-400 font-bold">// Collection: users</span>
                <p>id: uuid (PK)</p>
                <p>email: string</p>
                <p>profile_data: jsonb</p>
                <p>created_at: timestamp</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-slate-300 space-y-2">
                <span className="text-indigo-400 font-bold">// Collection: simulations</span>
                <p>id: uuid (PK)</p>
                <p>user_id: uuid (FK)</p>
                <p>goal_details: jsonb</p>
                <p>fdf_report: jsonb</p>
                <p>created_at: timestamp</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
