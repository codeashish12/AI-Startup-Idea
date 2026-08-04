import React, { useState } from 'react';
import { User, Briefcase, DollarSign, Clock, MapPin, GraduationCap, ShieldAlert, Target, Save, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileFormProps {
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  darkMode: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSaveProfile,
  darkMode,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [newSkill, setNewSkill] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
          <User className="w-3.5 h-3.5" />
          <span>Decision Profile</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile & Decision Context</h1>
        <p className="text-sm text-slate-400 mt-1">
          Future Engine uses your background, income, location, and risk tolerance to customize Future Decision Framework (FDF) calculations for realistic scenarios.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Personal & Demographics Card */}
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
          <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <User className="w-5 h-5 text-indigo-400" />
            <span>Personal & Location</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleChange('age', parseInt(e.target.value) || 18)}
                className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                min={16}
                max={99}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>City / State</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="e.g. Bengaluru, KA or Delhi NCR or Mumbai, MH"
                className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                required
              />
            </div>
          </div>
        </div>

        {/* Education & Experience Card */}
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
          <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <span>Education & Experience</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Education Background</label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => handleChange('education', e.target.value)}
                placeholder="e.g. Bachelor's in CS / Self-taught"
                className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>Professional Experience</span>
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => handleChange('experience', e.target.value)}
                placeholder="e.g. 4 years as Frontend Engineer"
                className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                required
              />
            </div>
          </div>

          {/* Skills tags */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1">Skills & Competencies</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 text-slate-400 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill (e.g. Product Design, PyTorch)..."
                className={`flex-1 px-3 py-1.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-1.5 rounded-xl font-medium text-xs text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
              >
                Add Skill
              </button>
            </div>
          </div>
        </div>

        {/* Financial & Constraints Card */}
        <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-[#0B1120] border-slate-800' : 'bg-white border-slate-200'}`}>
          <h2 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-indigo-400" />
            <span>Financials, Time & Risk Capacity</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Income / Runway (₹)</label>
              <input
                type="text"
                value={formData.income}
                onChange={(e) => handleChange('income', e.target.value)}
                placeholder="e.g. ₹18,00,000 / year (₹18 LPA) or ₹5 Lakhs savings"
                className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Available Time Commitment</span>
              </label>
              <input
                type="text"
                value={formData.availableTime}
                onChange={(e) => handleChange('availableTime', e.target.value)}
                placeholder="e.g. 15 hours / week"
                className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                <span>Risk Tolerance</span>
              </label>
              <select
                value={formData.riskTolerance}
                onChange={(e) => handleChange('riskTolerance', e.target.value as any)}
                className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="Low">Low (Prioritize Stability & Low Burn)</option>
                <option value="Moderate">Moderate (Balanced Risk & Reward)</option>
                <option value="High">High (Aggressive Upside & Fast Growth)</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
              <Target className="w-3.5 h-3.5 text-slate-400" />
              <span>Overarching Life / Career Vision</span>
            </label>
            <textarea
              value={formData.goalsSummary}
              onChange={(e) => handleChange('goalsSummary', e.target.value)}
              rows={2}
              placeholder="Briefly state your main priorities over the next 1-3 years..."
              className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess ? (
            <div className="flex items-center space-x-2 text-emerald-400 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5" />
              <span>Profile updated successfully!</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400">
              Future Engine updates calculations dynamically based on this profile.
            </span>
          )}

          <button
            type="submit"
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>

      </form>
    </div>
  );
};
