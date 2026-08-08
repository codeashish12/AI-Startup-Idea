import React, { useState } from 'react';
import { 
  Briefcase, 
  Rocket, 
  GraduationCap, 
  TrendingUp, 
  Brain, 
  Target, 
  ArrowRight, 
  Clock, 
  DollarSign, 
  Sparkles,
  Zap
} from 'lucide-react';
import { GoalCategory, GoalDetails, UserProfile } from '../types';
import { GOAL_CATEGORIES } from '../data/sampleData';

interface GoalSelectionProps {
  userProfile: UserProfile;
  onSubmitGoal: (details: GoalDetails) => void;
  darkMode: boolean;
}

export const GoalSelection: React.FC<GoalSelectionProps> = ({
  userProfile,
  onSubmitGoal,
  darkMode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory>('Career');
  const [title, setTitle] = useState('Senior SDE se AI Product Manager Transition');
  const [description, setDescription] = useState(
    'Engineering role se AI Product Lead me switch karna hai Bengaluru/Gurugram tech market me upcoming 6-9 months me.'
  );
  const [targetTimeframe, setTargetTimeframe] = useState('6–12 Months');
  const [targetBudget, setTargetBudget] = useState('₹1,00,000 – ₹3,00,000');
  const [keyPriority, setKeyPriority] = useState('Maximizing Career Leverage & CTC Upside');

  const handleCategorySelect = (category: GoalCategory) => {
    setSelectedCategory(category);
    const catData = GOAL_CATEGORIES.find((c) => c.category === category);
    if (catData) {
      setTitle(catData.placeholderTitle);
      setDescription(catData.defaultDetails);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitGoal({
      category: selectedCategory,
      title,
      description,
      targetTimeframe,
      targetBudget,
      keyPriority,
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Title */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1: Goal Parameterization</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Define Your Decision Target</h1>
        <p className="text-sm text-slate-400 mt-1">
          Select a domain and articulate the decision or goal you want Future Engine to simulate across multiple scenarios.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Category Picker Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {GOAL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.category;
            return (
              <div
                key={cat.category}
                onClick={() => handleCategorySelect(cat.category)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                    : darkMode
                      ? 'bg-[#0B1120] border-slate-800 text-slate-300 hover:border-slate-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800/60 text-indigo-400'}`}>
                    {cat.category === 'Career' && <Briefcase className="w-4 h-4" />}
                    {cat.category === 'Business' && <Rocket className="w-4 h-4" />}
                    {cat.category === 'Education' && <GraduationCap className="w-4 h-4" />}
                    {cat.category === 'Finance' && <TrendingUp className="w-4 h-4" />}
                    {cat.category === 'Skill Learning' && <Brain className="w-4 h-4" />}
                    {cat.category === 'Custom Goal' && <Target className="w-4 h-4" />}
                  </div>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>}
                </div>
                <div className="font-bold text-sm">{cat.category}</div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">{cat.description}</div>
              </div>
            );
          })}
        </div>

        {/* Goal Detail Fields */}
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
          <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            <span>Goal Specification</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Headline / Decision Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Launch AI B2B SaaS vs Join Series B Scaleup"
                className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Context & Objectives</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what success looks like, key constraints, and any specific trade-offs you are weighing..."
                className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Target Timeframe</span>
                </label>
                <select
                  value={targetTimeframe}
                  onChange={(e) => setTargetTimeframe(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="1–3 Months">1–3 Months (Immediate Sprint)</option>
                  <option value="3–6 Months">3–6 Months (Short-Term Pivot)</option>
                  <option value="6–12 Months">6–12 Months (Medium-Term Build)</option>
                  <option value="1–2 Years">1–2 Years (Long-Term Trajectory)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                  <span className="text-indigo-400 font-bold text-xs">₹</span>
                  <span>Available Budget / Capital (₹)</span>
                </label>
                <input
                  type="text"
                  value={targetBudget}
                  onChange={(e) => setTargetBudget(e.target.value)}
                  placeholder="e.g. ₹50,000 - ₹2,00,000 or Minimal"
                  className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Top Primary Outcome</label>
                <select
                  value={keyPriority}
                  onChange={(e) => setKeyPriority(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="Maximizing Long-term Income & Wealth">Maximizing Income & Wealth</option>
                  <option value="Work/Life Balance & Autonomy">Autonomy & Work/Life Balance</option>
                  <option value="Rapid Skill Growth & Market Power">Rapid Skill Growth & Reputation</option>
                  <option value="Risk Minimization & Stability">Maximum Security & Stability</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-600/20"
          >
            <span>Generate AI Follow-up Questions</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
};
