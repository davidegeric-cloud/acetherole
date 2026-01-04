import React, { useState } from 'react';
import { InterviewContext } from '../types';

interface SetupScreenProps {
  onStart: (context: InterviewContext) => void;
}

const PRESETS = [
  {
    name: "FAANG Frontend",
    role: "Senior Frontend Engineer",
    company: "Big Tech (FAANG)",
    focus: "System Design, React Internals, Performance",
    difficulty: "Professional"
  },
  {
    name: "Startup PM",
    role: "Product Manager",
    company: "Series B Startup",
    focus: "Product Sense, Prioritization, Metrics",
    difficulty: "Ruthless"
  },
  {
    name: "HFT C++ Dev",
    role: "Low Latency Engineer",
    company: "High Frequency Trading Firm",
    focus: "Memory Management, Concurrency, Algorithms",
    difficulty: "Ruthless"
  },
  {
    name: "Enterprise Java",
    role: "Staff Software Engineer",
    company: "Fortune 500 Enterprise",
    focus: "Microservices, Scalability, Leadership",
    difficulty: "Friendly"
  }
];

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [role, setRole] = useState('Senior Frontend Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Senior');
  const [resumeText, setResumeText] = useState('');
  const [focusArea, setFocusArea] = useState('System Design & Behavioral');
  const [difficulty, setDifficulty] = useState<'Friendly' | 'Professional' | 'Ruthless'>('Professional');
  const [companyStyle, setCompanyStyle] = useState('Big Tech (FAANG)');
  const [language, setLanguage] = useState('English');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({ role, experienceLevel, resumeText, focusArea, difficulty, companyStyle, language });
  };

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setRole(preset.role);
    setCompanyStyle(preset.company);
    setFocusArea(preset.focus);
    setDifficulty(preset.difficulty as any);
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-morph-in px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Control</span>
          </h1>
          <p className="text-slate-400">Configure your interview simulation parameters.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
           <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-xs font-mono text-blue-300 uppercase">System Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Configuration Panel */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmit} className="bg-[#111827]/80 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px] -z-10"></div>
            
            {/* Quick Load Presets */}
            <div className="mb-8">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Quick Load Presets</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => loadPreset(p)}
                    className="text-xs font-medium px-3 py-2 rounded-lg border border-white/10 bg-slate-800/50 hover:bg-blue-600/20 hover:border-blue-500/50 hover:text-blue-300 transition-all text-slate-400 text-left"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Language - Added Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
                  Language
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
                    placeholder="e.g. English, Spanish, Hindi, Japanese"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Target Role</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
                    placeholder="e.g. Senior Product Manager"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Experience */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Level</label>
                <select
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <option>Intern</option>
                  <option>Junior (L3)</option>
                  <option>Mid-Level (L4)</option>
                  <option>Senior (L5)</option>
                  <option>Staff (L6)</option>
                  <option>Principal (L7+)</option>
                </select>
              </div>

              {/* Company Style */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Target Company Style</label>
                <select
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                  value={companyStyle}
                  onChange={(e) => setCompanyStyle(e.target.value)}
                >
                  <option>Big Tech (FAANG)</option>
                  <option>High Growth Startup</option>
                  <option>Traditional Enterprise</option>
                  <option>Finance / HFT</option>
                  <option>Consulting Agency</option>
                </select>
              </div>
            </div>

            {/* Focus Area */}
            <div className="space-y-2 mb-6">
                <label className="text-sm font-semibold text-slate-300">Interview Focus</label>
                <input
                  type="text"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                  placeholder="e.g. System Design, Behavioral, Live Coding"
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                />
            </div>

            {/* Resume Context */}
            <div className="space-y-2 mb-8">
              <label className="text-sm font-semibold text-slate-300 flex justify-between">
                <span>Resume Context / Key Skills</span>
                <span className="text-xs text-slate-500">Paste summary</span>
              </label>
              <textarea
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white h-24 focus:ring-2 focus:ring-blue-500/50 outline-none resize-none leading-relaxed text-sm"
                placeholder="I have 5 years of experience in React and Node.js. I led a team of 4 engineers..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="group w-full relative overflow-hidden bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
            >
               <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_2s_linear_infinite] opacity-0 group-hover:opacity-100"></div>
              <div className="flex items-center justify-center space-x-2">
                <span className="uppercase tracking-widest text-sm">Initialize Simulation</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>
          </form>
        </div>

        {/* Sidebar / Difficulty Settings */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Difficulty Card */}
          <div className="bg-[#111827]/80 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Intensity Level
            </h3>
            
            <div className="space-y-3">
              {[
                { id: 'Friendly', desc: 'Constructive & Encouraging', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' },
                { id: 'Professional', desc: 'Standard Corporate Tone', color: 'border-blue-500/50 bg-blue-500/10 text-blue-400' },
                { id: 'Ruthless', desc: 'High Pressure / Stress Test', color: 'border-red-500/50 bg-red-500/10 text-red-400' }
              ].map((opt) => (
                <div 
                  key={opt.id}
                  onClick={() => setDifficulty(opt.id as any)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${difficulty === opt.id ? opt.color + ' shadow-lg' : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:border-slate-600'}`}
                >
                  <div>
                    <div className="font-bold text-sm">{opt.id}</div>
                    <div className="text-xs opacity-70">{opt.desc}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${difficulty === opt.id ? 'border-current' : 'border-slate-600'}`}>
                    {difficulty === opt.id && <div className="w-2 h-2 rounded-full bg-current" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Info Card */}
          <div className="bg-[#111827]/80 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-xl">
             <div className="flex items-center space-x-3 mb-4">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
               </div>
               <div>
                 <div className="text-white font-bold text-sm">Neural Voice Engine</div>
                 <div className="text-xs text-slate-400">Native Audio-to-Audio</div>
               </div>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400 border-b border-white/5 pb-2">
                  <span>Latency</span>
                  <span className="text-emerald-400 font-mono">Lightning Fast</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 border-b border-white/5 pb-2">
                  <span>Voice Engine</span>
                  <span className="text-blue-400 font-mono">Fenrir (Deep)</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 pt-1">
                  <span>Context Window</span>
                  <span className="text-purple-400 font-mono">1M Tokens</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SetupScreen;