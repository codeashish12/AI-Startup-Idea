import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Compass, 
  Briefcase, 
  Rocket, 
  GraduationCap, 
  TrendingUp, 
  Brain, 
  Target, 
  BarChart3, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Lock,
  FileText
} from 'lucide-react';
import { GOAL_CATEGORIES } from '../data/sampleData';

interface LandingPageProps {
  onStartSimulation: () => void;
  onViewSampleSimulation: () => void;
  darkMode: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartSimulation,
  onViewSampleSimulation,
  darkMode,
}) => {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Mandatory System Disclaimer Banner */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs sm:text-sm font-medium mb-8 shadow-xl backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300">
              <strong className="text-white">Decision Support System:</strong> This is a scenario-based decision engine. It does not predict the future.
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Simulate Your Future Before Making{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
              Life-Changing Decisions
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Stop guessing your next career pivot, business launch, or education path. Compare 3–5 multi-variable future scenarios backed by our Future Decision Framework (FDF).
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartSimulation}
              className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-xl shadow-indigo-600/25 hover:scale-[1.02]"
            >
              <Sparkles className="w-5 h-5 text-indigo-200" />
              <span>Simulate A Decision Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onViewSampleSimulation}
              className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-semibold text-base border transition-all ${
                darkMode
                  ? 'bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <span>Explore Sample Analysis</span>
            </button>
          </div>

          {/* Key Metrics / Trust Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'} text-left`}>
              <div className="text-2xl font-black text-indigo-400">3–5</div>
              <div className="text-xs font-medium text-slate-400 mt-1">Multi-Path Scenarios</div>
            </div>

            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'} text-left`}>
              <div className="text-2xl font-black text-purple-400">FDF Engine</div>
              <div className="text-xs font-medium text-slate-400 mt-1">Goal, Risk & Opportunity Scores</div>
            </div>

            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'} text-left`}>
              <div className="text-2xl font-black text-emerald-400">100%</div>
              <div className="text-xs font-medium text-slate-400 mt-1">User Context Alignment</div>
            </div>

            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200'} text-left`}>
              <div className="text-2xl font-black text-amber-400">PDF Ready</div>
              <div className="text-xs font-medium text-slate-400 mt-1">Downloadable Reports</div>
            </div>
          </div>

        </div>
      </section>

      {/* Goal Categories Section */}
      <section className={`py-16 border-t ${darkMode ? 'border-slate-800/60 bg-[#0B1120]' : 'border-slate-200 bg-slate-50'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Tailored Decision Categories</h2>
            <p className="text-sm text-slate-400 mt-2">
              Future Engine models unique risk factors, capital requirements, and timelines across major life pivot domains.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GOAL_CATEGORIES.map((cat) => (
              <div
                key={cat.category}
                onClick={onStartSimulation}
                className={`p-6 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] ${
                  darkMode
                    ? 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900'
                    : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                  {cat.category === 'Career' && <Briefcase className="w-5 h-5" />}
                  {cat.category === 'Business' && <Rocket className="w-5 h-5" />}
                  {cat.category === 'Education' && <GraduationCap className="w-5 h-5" />}
                  {cat.category === 'Finance' && <TrendingUp className="w-5 h-5" />}
                  {cat.category === 'Skill Learning' && <Brain className="w-5 h-5" />}
                  {cat.category === 'Custom Goal' && <Target className="w-5 h-5" />}
                </div>

                <h3 className="text-lg font-bold text-slate-100 mb-1">{cat.category}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{cat.description}</p>

                <div className="text-xs text-indigo-400 font-semibold flex items-center space-x-1">
                  <span>Example: "{cat.placeholderTitle}"</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* The Future Decision Framework (FDF) Explained */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-4">
              <Zap className="w-3.5 h-3.5" />
              <span>Future Decision Framework (FDF)</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              A Rigorous Multi-Variable Scoring Engine
            </h2>

            <p className="text-slate-400 mt-4 leading-relaxed">
              Decisions fail when people focus only on upside while ignoring skill gaps, time commitment, or capital burn rate. FDF evaluates every scenario across four primary metrics.
            </p>

            <div className="mt-8 space-y-4">
              
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-sm shrink-0">
                  GS
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Goal Score (0–100)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Calculated from Skill Match, Required Time, Target Budget, Market Demand, and Personal Interest.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 font-bold text-sm shrink-0">
                  RS
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Risk Score (0–100)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Measures Financial Exposure, Skill Gap Depth, Market Competition, Time Opportunity Cost, and Uncertainty.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-sm shrink-0">
                  OS
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Opportunity Score (0–100)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Evaluates Compound Growth, Income Upside, Freedom/Autonomy, Learning Yield, and Global Demand.
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Interactive Preview Card */}
          <div className={`p-6 rounded-3xl border shadow-2xl relative ${
            darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/60 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-mono text-slate-400 ml-2">fdf-simulation-matrix.v1</span>
              </div>
              <span className="text-xs font-semibold text-indigo-400 px-2.5 py-0.5 rounded-full bg-indigo-500/10">
                Live Simulation Output
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Aggressive Strategy</span>
                  <span className="text-xs font-bold text-emerald-400">High Confidence</span>
                </div>
                <div className="text-sm font-bold text-slate-100">Full Immersion Startup Build</div>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Goal Score</span>
                    <span className="text-base font-black text-indigo-400">89</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Risk Score</span>
                    <span className="text-base font-black text-amber-400">68</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Opportunity</span>
                    <span className="text-base font-black text-emerald-400">96</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Balanced Strategy</span>
                  <span className="text-xs font-bold text-emerald-400">High Confidence</span>
                </div>
                <div className="text-sm font-bold text-slate-100">Parallel Evening/Weekend Sprint</div>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Goal Score</span>
                    <span className="text-base font-black text-indigo-400">94</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Risk Score</span>
                    <span className="text-base font-black text-emerald-400">24</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Opportunity</span>
                    <span className="text-base font-black text-indigo-400">86</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Exportable PDF & Roadmap</span>
              </span>
              <button
                onClick={onStartSimulation}
                className="font-bold text-indigo-400 hover:underline"
              >
                Run Your Simulation →
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* Target User Personas */}
      <section className={`py-16 border-t ${darkMode ? 'border-slate-800/60 bg-[#0B1120]' : 'border-slate-200 bg-slate-50'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Built For High-Impact Decision Makers</h2>
            <p className="text-sm text-slate-400 mt-2">
              Whether you are deciding on a college major or bootstrapping a company, Future Engine provides clear scenario pathways.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {['Students', 'Professionals', 'Entrepreneurs', 'Freelancers', 'Creators'].map((persona) => (
              <div
                key={persona}
                className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="font-bold text-sm text-slate-200">{persona}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-12 border-t border-slate-800/60 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-slate-400 font-medium">
            Future Engine — AI-Powered Scenario Decision Support System
          </p>
          <p className="mt-2 text-[11px] text-slate-500 max-w-xl mx-auto">
            Mandatory Disclaimer: Future Engine is an analytical scenario-based decision support tool. It models probabilities and assumptions to assist decision planning and does not predict future outcomes or guarantee specific financial results.
          </p>
        </div>
      </footer>

    </div>
  );
};
