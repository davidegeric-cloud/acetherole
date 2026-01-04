import React, { useState } from 'react';
import SetupScreen from './components/SetupScreen';
import LiveSession from './components/LiveSession';
import LandingPage from './components/LandingPage';
import PricingPanel from './components/PricingPanel';
import AuthScreen from './components/AuthScreen';
import { AppState, InterviewContext, User } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [context, setContext] = useState<InterviewContext | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const handleStartInterview = (ctx: InterviewContext) => {
    setContext(ctx);
    setAppState(AppState.INTERVIEW);
  };

  const handleEndInterview = () => {
    setAppState(AppState.SETUP); 
  };

  const checkAuthAndNavigate = (targetState: AppState) => {
    if (user) {
      setAppState(targetState);
    } else {
      setAppState(AppState.AUTH);
    }
  };

  const handleAuthComplete = (newUser: User) => {
    setUser(newUser);
    // Default to SETUP after login, or previous intent if we tracked it (simplified here)
    setAppState(AppState.SETUP);
  };

  const handleLogout = () => {
    setUser(null);
    setAppState(AppState.LANDING);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="border-b border-white/5 bg-[#0B1120]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => setAppState(AppState.LANDING)}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 group-hover:to-white transition-all">
              AceTheRole
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
            {(appState !== AppState.LANDING && user) && (
              <button onClick={() => setAppState(AppState.SETUP)} className="hover:text-white transition-colors duration-200">Dashboard</button>
            )}
            
            <button onClick={() => setAppState(AppState.PRICING)} className={`hover:text-white transition-colors duration-200 ${appState === AppState.PRICING ? 'text-white' : ''}`}>Pricing</button>

            <div className="h-4 w-px bg-white/10"></div>
            
            {user ? (
              <div className="flex items-center space-x-4">
                 <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-slate-300 text-xs uppercase tracking-wider font-bold">{user.name}</span>
                 </div>
                 <button 
                  onClick={handleLogout}
                  className="text-xs border border-white/10 bg-white/5 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors text-slate-300"
                 >
                   Sign Out
                 </button>
              </div>
            ) : (
              <button 
                onClick={() => setAppState(AppState.AUTH)}
                className="text-white hover:text-blue-400 transition-colors font-semibold"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative z-10 justify-center">
        {appState === AppState.LANDING && (
          <LandingPage onStart={() => checkAuthAndNavigate(AppState.SETUP)} />
        )}

        {appState === AppState.AUTH && (
          <AuthScreen 
            onComplete={handleAuthComplete} 
            onCancel={() => setAppState(AppState.LANDING)} 
          />
        )}

        {appState === AppState.PRICING && (
          <PricingPanel onBack={() => checkAuthAndNavigate(AppState.SETUP)} />
        )}

        {appState === AppState.SETUP && (
          <div className="flex-grow flex items-center justify-center py-12 px-4">
            <SetupScreen onStart={handleStartInterview} />
          </div>
        )}

        {appState === AppState.INTERVIEW && context && (
          <LiveSession context={context} onEnd={handleEndInterview} />
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-auto bg-[#0B1120]/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm">
            AceTheRole AI © 2025 • Practice makes perfect
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;