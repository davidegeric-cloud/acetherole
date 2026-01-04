import React from 'react';

interface PricingPanelProps {
  onBack: () => void;
}

const PricingPanel: React.FC<PricingPanelProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-6 py-12 animate-fade-in-up">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Invest in Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Career</span>
        </h2>
        <p className="text-slate-400 text-lg">
          Unlock the full potential of AceTheRole and land your dream job faster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl items-start">
        {/* Free Tier */}
        <div className="p-8 rounded-3xl bg-slate-900/30 border border-white/5 backdrop-blur-sm flex flex-col opacity-75 hover:opacity-100 transition-all duration-300 hover:border-white/10">
          <div className="mb-4">
            <span className="text-slate-400 font-medium tracking-widest text-sm uppercase">Starter</span>
          </div>
          <div className="flex items-baseline mb-8">
            <span className="text-4xl font-bold text-white">$0</span>
            <span className="text-slate-500 ml-2">/ month</span>
          </div>
          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-center text-slate-300">
              <svg className="w-5 h-5 text-slate-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              5 Practice Sessions per 3 hours
            </li>
            <li className="flex items-center text-slate-300">
              <svg className="w-5 h-5 text-slate-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Standard Voice Model
            </li>
             <li className="flex items-center text-slate-300">
              <svg className="w-5 h-5 text-slate-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              Basic Feedback
            </li>
          </ul>
          <button 
             onClick={onBack}
             className="w-full py-4 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-colors"
          >
            Continue Free
          </button>
        </div>

        {/* Full Tier - Highlighted */}
        <div className="relative p-8 rounded-3xl bg-gradient-to-b from-slate-800/80 to-slate-900/80 border border-blue-500/30 backdrop-blur-md flex flex-col shadow-2xl shadow-blue-900/20 transform md:-translate-y-4 hover:-translate-y-6 transition-all duration-300">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
            Most Popular
          </div>
          <div className="mb-4">
            <span className="text-blue-400 font-bold tracking-widest text-sm uppercase">Full Access</span>
          </div>
          <div className="flex items-baseline mb-8">
            <span className="text-5xl font-bold text-white">$5</span>
            <span className="text-slate-400 ml-2">/ month</span>
          </div>
          <ul className="space-y-4 mb-8 flex-grow">
            <li className="flex items-center text-white">
              <div className="p-1 rounded-full bg-blue-500/20 mr-3">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <strong>Unlimited Interviews</strong>
            </li>
            <li className="flex items-center text-white">
              <div className="p-1 rounded-full bg-blue-500/20 mr-3">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              Priority Server Access
            </li>
             <li className="flex items-center text-white">
              <div className="p-1 rounded-full bg-blue-500/20 mr-3">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              Advanced Performance Analytics
            </li>
          </ul>

          <button className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/25 group relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPanel;