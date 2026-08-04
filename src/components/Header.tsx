import React from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  PlusCircle, 
  Bookmark, 
  User, 
  Sun, 
  Moon, 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  Home
} from 'lucide-react';
import { AuthState } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  auth: AuthState;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  darkMode,
  setDarkMode,
  auth,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-200 ${
      darkMode 
        ? 'bg-[#0B1120]/80 border-slate-800 text-slate-100' 
        : 'bg-white/80 border-slate-200 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentTab('landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 p-0.5 shadow-md group-hover:shadow-indigo-500/25 transition-all">
              <div className="w-full h-full bg-[#0B1120] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-500 via-purple-400 to-indigo-300 bg-clip-text text-transparent">
                  FUTURE ENGINE
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  MVP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none hidden sm:block">
                AI Decision Simulation Platform
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentTab('landing')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'landing'
                  ? darkMode ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                  : darkMode ? 'text-slate-300 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'dashboard'
                  ? darkMode ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                  : darkMode ? 'text-slate-300 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentTab('simulate')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                currentTab === 'simulate'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/25'
                  : darkMode 
                    ? 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30' 
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Simulation</span>
            </button>

            <button
              onClick={() => setCurrentTab('saved')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'saved'
                  ? darkMode ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                  : darkMode ? 'text-slate-300 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Simulations</span>
            </button>

            <button
              onClick={() => setCurrentTab('profile')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'profile'
                  ? darkMode ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                  : darkMode ? 'text-slate-300 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </nav>

          {/* Right Controls (Theme, Auth, Disclaimer Indicator) */}
          <div className="flex items-center space-x-3">
            
            {/* System Disclaimer Indicator Badge */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800/50 text-slate-300 border border-slate-700/50" title="Scenario-based decision support system">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Decision Support AI</span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-slate-800 text-amber-400 hover:bg-slate-700' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Auth Button */}
            {auth.isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {auth.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-indigo-300 max-w-[120px] truncate">
                    {auth.user?.name}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'text-slate-400 hover:text-red-400 hover:bg-slate-800' 
                      : 'text-slate-500 hover:text-red-600 hover:bg-slate-100'
                  }`}
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Navigation Sub-bar */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/40 bg-slate-900/60 text-xs">
        <button
          onClick={() => setCurrentTab('landing')}
          className={`flex flex-col items-center space-y-1 ${currentTab === 'landing' ? 'text-indigo-400' : 'text-slate-400'}`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center space-y-1 ${currentTab === 'dashboard' ? 'text-indigo-400' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setCurrentTab('simulate')}
          className={`flex flex-col items-center space-y-1 ${currentTab === 'simulate' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
        >
          <PlusCircle className="w-4 h-4 text-indigo-400" />
          <span>Simulate</span>
        </button>
        <button
          onClick={() => setCurrentTab('saved')}
          className={`flex flex-col items-center space-y-1 ${currentTab === 'saved' ? 'text-indigo-400' : 'text-slate-400'}`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Library</span>
        </button>
        <button
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center space-y-1 ${currentTab === 'profile' ? 'text-indigo-400' : 'text-slate-400'}`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>

    </header>
  );
};
