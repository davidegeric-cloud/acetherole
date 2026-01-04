import React, { useState } from 'react';
import { User } from '../types';

interface AuthScreenProps {
  onComplete: (user: User) => void;
  onCancel: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onComplete, onCancel }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple mock validation/creation
    const user: User = {
      name: name || email.split('@')[0], // Fallback name for login view
      email: email,
    };

    setIsLoading(false);
    onComplete(user);
  };

  return (
    <div className="w-full max-w-md mx-auto animate-morph-in px-4 relative z-20">
      <div className="bg-[#111827]/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[60px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/10 rounded-full blur-[50px] -z-10"></div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-slate-400 text-sm">
            {isSignUp 
              ? 'Join thousands of engineers practicing daily.' 
              : 'Sign in to continue your interview prep.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 ml-1">Full Name</label>
              <input
                type="text"
                required={isSignUp}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600"
                placeholder="e.g. Alex Chen"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 ml-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600"
              placeholder="alex@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 ml-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full relative overflow-hidden bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 transform ${isLoading ? 'opacity-80 cursor-wait' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              <span>{isSignUp ? 'Get Started' : 'Sign In'}</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <button onClick={onCancel} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                Cancel and go back
            </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;