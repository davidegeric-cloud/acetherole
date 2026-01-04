import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-6 py-12 md:py-20 animate-fade-in-up">
       {/* Hero Content */}
       <div className="text-center max-w-5xl mx-auto mb-20 relative">
          {/* Decorative blur behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-500/20 rounded-full blur-[100px] -z-10"></div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.1]">
            Crush Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">High-Stakes Interview</span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Practice with an AI hiring manager that actually listens. Real-time voice interaction, resume-tailored questions, and zero judgement.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStart}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 font-lg rounded-full hover:bg-blue-500 hover:scale-105 shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] w-full sm:w-auto"
            >
              <span>Start Practice Session</span>
              <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </button>
          </div>
       </div>

       {/* Feature Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-20">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 backdrop-blur-sm group">
             <div className="w-14 h-14 bg-gradient-to-br from-blue-500/10 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
             </div>
             <h3 className="text-xl font-bold text-white mb-3">Hyper-Realistic Voice</h3>
             <p className="text-slate-400 leading-relaxed">Experience fluid, low-latency conversation with interruptions and natural turn-taking. It feels like talking to a human.</p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 backdrop-blur-sm group">
             <div className="w-14 h-14 bg-gradient-to-br from-purple-500/10 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
             </div>
             <h3 className="text-xl font-bold text-white mb-3">Context Aware</h3>
             <p className="text-slate-400 leading-relaxed">Paste your resume and job description. The AI dynamically adapts its questioning strategy to your specific background.</p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 backdrop-blur-sm group">
             <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/10 to-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
             </div>
             <h3 className="text-xl font-bold text-white mb-3">Live Confidence Metrics</h3>
             <p className="text-slate-400 leading-relaxed">Visualize your speaking patterns in real-time. Learn to speak with authority, minimize fillers, and pace yourself.</p>
          </div>
       </div>

       {/* Social Proof */}
       <div className="pt-10 border-t border-white/5 w-full text-center">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">Trusted by candidates from</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-40 grayscale select-none">
             <span className="text-xl font-bold font-sans text-white">Google</span>
             <span className="text-xl font-bold font-serif text-white">Meta</span>
             <span className="text-xl font-bold font-mono text-white">Netflix</span>
             <span className="text-xl font-bold font-sans italic text-white">Amazon</span>
             <span className="text-xl font-bold font-serif text-white">Apple</span>
          </div>
       </div>
    </div>
  );
};

export default LandingPage;