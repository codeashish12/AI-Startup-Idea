import React, { useState } from 'react';
import { 
  Bookmark, 
  Search, 
  Trash2, 
  ArrowRight, 
  Calendar, 
  Layers, 
  BarChart3, 
  PlusCircle,
  Briefcase,
  Rocket,
  GraduationCap,
  TrendingUp,
  Brain,
  Target
} from 'lucide-react';
import { SimulationResult } from '../types';

interface SavedSimulationsProps {
  simulations: SimulationResult[];
  onOpenSimulation: (sim: SimulationResult) => void;
  onDeleteSimulation: (id: string) => void;
  onStartNewSimulation: () => void;
  darkMode: boolean;
}

export const SavedSimulations: React.FC<SavedSimulationsProps> = ({
  simulations,
  onOpenSimulation,
  onDeleteSimulation,
  onStartNewSimulation,
  darkMode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filtered = simulations.filter((sim) => {
    const matchesSearch =
      sim.goalDetails.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sim.overallAnalysis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || sim.goalCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Decision Library</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Decision Simulations</h1>
          <p className="text-sm text-slate-400 mt-1">
            Review past multi-scenario analyses, compare FDF metrics, and track progress.
          </p>
        </div>

        <button
          onClick={onStartNewSimulation}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/20 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Simulation</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className={`p-4 rounded-2xl border mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 ${
        darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search simulations..."
            className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['All', 'Career', 'Business', 'Education', 'Finance', 'Skill Learning', 'Custom Goal'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : darkMode
                    ? 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Grid of Saved Simulations */}
      {filtered.length === 0 ? (
        <div className={`p-12 rounded-2xl border text-center ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
          <Bookmark className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No Simulations Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm || selectedCategory !== 'All'
              ? 'Try clearing your search filters to view all saved decision simulations.'
              : 'Create your first AI decision simulation to compare pathways and track progress.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((sim) => {
            const recommendedScenario = sim.scenarios[sim.recommendedOptionIndex] || sim.scenarios[0];

            return (
              <div
                key={sim.id}
                className={`p-6 rounded-2xl border transition-all hover:scale-[1.01] ${
                  darkMode ? 'bg-[#0B1120] border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {sim.goalCategory}
                  </span>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(sim.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-100 line-clamp-1">{sim.goalDetails.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {sim.overallAnalysis}
                </p>

                {/* Scenarios Badge Bar */}
                <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Top Pathway</span>
                    <span className="font-bold text-indigo-400">{recommendedScenario?.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Goal Score</span>
                    <span className="font-black text-emerald-400">{recommendedScenario?.fdfScores.goalScore}/100</span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <button
                    onClick={() => onDeleteSimulation(sim.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    title="Delete simulation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenSimulation(sim)}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm"
                  >
                    <span>View Analysis & Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
