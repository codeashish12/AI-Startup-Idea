import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';
import {
  loginWithEmail,
  signupWithEmail,
  parseAuthError,
  AuthSuccessResponse,
} from '../utils/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (response: AuthSuccessResponse) => void;
  darkMode: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  darkMode,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'forgot') {
      setResetSent(true);
      setTimeout(() => setResetSent(false), 4000);
      return;
    }

    setIsSubmitting(true);
    try {
      const response =
        mode === 'signup'
          ? await signupWithEmail(email.trim(), password, name.trim())
          : await loginWithEmail(email.trim(), password);

      onLoginSuccess(response);
      onClose();
    } catch (err: unknown) {
      setError(parseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('Google sign-in is not available. Please use email/password to sign in.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className={`relative w-full max-w-md rounded-2xl border p-6 shadow-2xl transition-all ${
        darkMode ? 'bg-[#0B1120] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Access</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === 'login' && 'Welcome to Future Engine'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' && 'Sign in to access your saved decision scenarios and simulations.'}
            {mode === 'signup' && 'Start comparing future paths with AI decision simulation.'}
            {mode === 'forgot' && 'Enter your email to receive password reset instructions.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    darkMode ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                  darkMode ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-indigo-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    darkMode ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          {resetSent && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              Password reset link sent to {email}. Check your inbox!
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            <span>
              {mode === 'login' && (isSubmitting ? 'Signing In...' : 'Sign In')}
              {mode === 'signup' && (isSubmitting ? 'Creating Account...' : 'Create Account')}
              {mode === 'forgot' && 'Send Reset Instructions'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {mode !== 'forgot' && (
          <>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className={`px-2 text-slate-500 ${darkMode ? 'bg-[#0B1120]' : 'bg-white'}`}>
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google login temporarily disabled - use email/password instead */}
          </>
        )}

        {/* Toggle Mode */}
        <div className="mt-6 text-center text-xs text-slate-400">
          {mode === 'login' && (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className="font-semibold text-indigo-400 hover:underline"
              >
                Sign up
              </button>
            </p>
          )}
          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="font-semibold text-indigo-400 hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="font-semibold text-indigo-400 hover:underline"
            >
              Back to Sign in
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
