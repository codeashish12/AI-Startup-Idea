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
        ? 'bg-[#0B1120]/90 border-slate-800/80 text-slate-100' 
        : 'bg-white/90 border-slate-200/80 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo & Brand - Single-line aligned lockup */}
          <div 
            onClick={() => setCurrentTab('landing')}
            className="flex items-center space-x-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-500 p-0.5 shadow-sm group-hover:shadow-indigo-500/20 transition-all flex items-center justify-center">
              <div className="w-full h-full bg-[#0B1120] rounded-[6px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
                FUTURE ENGINE
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                FDF AI
              </span>
            </div>
          </div>

          {/* Navigation Links - Compact spacing */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentTab('landing')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'landing'
                  ? darkMode ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                  : darkMode ? 'text-slate-300 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'dashboard'
                  ? darkMode ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                  : darkMode ? 'text-slate-300 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setCurrentTab('simulate')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                currentTab === 'simulate'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/20'
                  : darkMode 
                    ? 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30' 
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Simulation</span>
            </button>

            <button
              onClick={() => setCurrentTab('saved')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'saved'
                  ? darkMode ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                  : darkMode ? 'text-slate-300 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Simulations</span>
            </button>

            <button
              onClick={() => setCurrentTab('fdf-arch')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'fdf-arch'
                  ? darkMode ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                  : darkMode ? 'text-slate-300 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>FDF Spec</span>
            </button>

            <button
              onClick={() => setCurrentTab('profile')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'profile'
                  ? darkMode ? 'bg-indigo-600/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                  : darkMode ? 'text-slate-300 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-1.5 rounded-lg transition-colors ${
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
                <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                    {auth.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-indigo-300 max-w-[100px] truncate">
                    {auth.user?.name}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className={`p-1.5 rounded-lg transition-colors ${
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
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
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
