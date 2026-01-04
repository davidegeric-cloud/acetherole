import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { InterviewContext } from '../types';
import { createBlob, decode, decodeAudioData } from '../utils/audioUtils';
import Visualizer from './Visualizer';

interface LiveSessionProps {
  context: InterviewContext;
  onEnd: () => void;
}

const LiveSession: React.FC<LiveSessionProps> = ({ context, onEnd }) => {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [micActive, setMicActive] = useState(true);
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);
  const [mouthOpenness, setMouthOpenness] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [needsUserGesture, setNeedsUserGesture] = useState(false);
  
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  
  // Analysers
  const userAnalyserRef = useRef<AnalyserNode | null>(null);
  const modelAnalyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (inputContextRef.current && inputContextRef.current.state !== 'closed') {
       inputContextRef.current.close();
    }
    if (outputContextRef.current && outputContextRef.current.state !== 'closed') {
      outputContextRef.current.close();
    }
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    activeSourcesRef.current.forEach(source => {
      try { source.stop(); } catch(e) {}
    });
    activeSourcesRef.current.clear();
  };

  // Blinking Logic
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Lip Sync Animation Loop
  useEffect(() => {
    const analyzeModelAudio = () => {
      if (modelAnalyserRef.current) {
        const dataArray = new Uint8Array(modelAnalyserRef.current.frequencyBinCount);
        modelAnalyserRef.current.getByteFrequencyData(dataArray);
        
        let sum = 0;
        const range = dataArray.slice(2, 40); 
        for (let i = 0; i < range.length; i++) sum += range[i];
        const average = sum / range.length;
        
        const targetOpenness = Math.max(0, (average - 15) / 140);
        const smoothed = targetOpenness > 0.04 ? targetOpenness : 0;
        
        setMouthOpenness(prev => prev * 0.6 + smoothed * 0.4);
        setIsModelSpeaking(average > 15);
      }
      animationFrameRef.current = requestAnimationFrame(analyzeModelAudio);
    };
    analyzeModelAudio();
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, []);

  const resumeAudio = async () => {
    if (inputContextRef.current?.state === 'suspended') await inputContextRef.current.resume();
    if (outputContextRef.current?.state === 'suspended') await outputContextRef.current.resume();
    setNeedsUserGesture(false);
  };

  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
          setStatus('error');
          return;
        }

        const ai = new GoogleGenAI({ apiKey });
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        
        inputContextRef.current = new AudioContextClass({ sampleRate: 16000 });
        outputContextRef.current = new AudioContextClass({ sampleRate: 24000 });
        
        // Auto-resume audio context immediately to catch user gesture from navigation
        try {
          if (outputContextRef.current.state === 'suspended') {
             await outputContextRef.current.resume();
          }
        } catch (e) {
          console.warn("Could not auto-resume audio context:", e);
          setNeedsUserGesture(true);
        }
        
        userAnalyserRef.current = inputContextRef.current.createAnalyser();
        userAnalyserRef.current.fftSize = 256;

        modelAnalyserRef.current = outputContextRef.current.createAnalyser();
        modelAnalyserRef.current.fftSize = 128;
        modelAnalyserRef.current.smoothingTimeConstant = 0.2;

        outputNodeRef.current = outputContextRef.current.createGain();
        // Boost volume slightly
        outputNodeRef.current.gain.value = 1.2; 
        outputNodeRef.current.connect(outputContextRef.current.destination);

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const sysInstruction = `
          You are Marcus, a hiring manager. 
          The candidate is ready. 
          
          IMMEDIATE ACTION:
          1. Speak immediately. Do not wait.
          2. Say "Hello, I'm Marcus. Let's start the interview." and ask the first question.
          3. Keep it short.
          
          Context: ${context.role} at ${context.companyStyle}.
        `;

        const sessionPromise = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction: sysInstruction,
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } },
            },
          },
          callbacks: {
            onopen: () => {
              if (!mounted) return;
              setStatus('connected');

              sessionPromise.then(session => {
                // FORCE START:
                // 1. Send text trigger to define the user's "ready" state and force a reply.
                const startMsg = {
                  clientContent: {
                    turns: [{ role: 'user', parts: [{ text: "I am ready. Start the interview." }] }],
                    turnComplete: true
                  }
                };
                session.sendRealtimeInput(startMsg as any);
              });

              if (!inputContextRef.current) return;
              const source = inputContextRef.current.createMediaStreamSource(stream);
              sourceRef.current = source;
              source.connect(userAnalyserRef.current!);

              const processor = inputContextRef.current.createScriptProcessor(2048, 1, 1);
              processorRef.current = processor;
              
              // Only send audio when mic is active
              processor.onaudioprocess = (e) => {
                if (!mounted) return;
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                sessionPromise.then(session => {
                   session.sendRealtimeInput({ media: pcmBlob });
                });
              };
              source.connect(processor);
              processor.connect(inputContextRef.current.destination);
            },
            onmessage: async (msg: LiveServerMessage) => {
              if (!mounted) return;
              
              // 1. Audio Output
              const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (base64Audio && outputContextRef.current && outputNodeRef.current && modelAnalyserRef.current) {
                const ctx = outputContextRef.current;
                const arrayBuffer = decode(base64Audio);
                const audioBuffer = await decodeAudioData(arrayBuffer, ctx, 24000, 1);

                const lookahead = 0.05; // 50ms scheduling lookahead
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime + lookahead);

                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(modelAnalyserRef.current);
                modelAnalyserRef.current.connect(outputNodeRef.current);
                
                source.addEventListener('ended', () => {
                  activeSourcesRef.current.delete(source);
                });

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                activeSourcesRef.current.add(source);
              }

              // 2. Interruption handling
              if (msg.serverContent?.interrupted) {
                activeSourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
                activeSourcesRef.current.clear();
                nextStartTimeRef.current = 0;
                setMouthOpenness(0);
                setIsModelSpeaking(false);
              }
            },
            onerror: (err) => {
              console.error("Session error", err);
              setStatus('error');
            }
          }
        });

      } catch (e) {
        console.error("Initialization error", e);
        setStatus('error');
      }
    };

    initSession();
    return () => { mounted = false; cleanup(); };
  }, [context]);

  const toggleMic = () => {
    if (streamRef.current) {
      const enabled = !micActive;
      streamRef.current.getAudioTracks().forEach(track => track.enabled = enabled);
      setMicActive(enabled);
    }
  };

  return (
    <div className="flex flex-col h-full justify-between items-center p-6 relative overflow-hidden bg-[#0B1120]">
       {/* Ambient FX */}
       <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] transition-opacity duration-700 ${isModelSpeaking ? 'opacity-100' : 'opacity-40'}`}></div>
       </div>

      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center z-10">
        <div className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
          <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-[10px] font-bold tracking-widest uppercase text-slate-300">
            {status === 'connected' ? 'Voice Link • Active' : 'Connecting to Core...'}
          </span>
        </div>
        <button onClick={onEnd} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      {/* Avatar Container */}
      <div className="relative z-10 flex-grow flex items-center justify-center w-full">
        {needsUserGesture && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0B1120]/80 backdrop-blur-sm animate-fade-in">
             <button 
               onClick={resumeAudio}
               className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-5 rounded-2xl shadow-2xl shadow-blue-500/20 transform transition hover:scale-105 active:scale-95 flex items-center space-x-3"
             >
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
               <span>Click to Enable Audio</span>
             </button>
          </div>
        )}

        <div className="relative w-64 h-64 md:w-80 md:h-80 transition-transform duration-700">
          
          {/* Outer Glow Ring (Reacts to Voice) */}
          <div className={`absolute -inset-4 rounded-full border border-blue-500/30 transition-all duration-100 ${isModelSpeaking ? 'scale-110 opacity-100' : 'scale-100 opacity-20'}`}></div>
          <div className={`absolute -inset-8 rounded-full border border-indigo-500/20 transition-all duration-150 ${isModelSpeaking ? 'scale-105 opacity-80' : 'scale-100 opacity-10'}`}></div>

          {/* HEAD */}
          <div className={`w-full h-full rounded-[3rem] bg-slate-800 relative shadow-2xl flex flex-col items-center overflow-hidden transition-transform duration-1000 ease-in-out ${isModelSpeaking ? 'scale-[1.02]' : 'scale-100'} ${!isModelSpeaking && micActive ? 'rotate-[-2deg]' : 'rotate-0'}`}>
             
             {/* Skin/Face Gradient */}
             <div className="absolute inset-0 bg-gradient-to-b from-[#E0B195] to-[#C99175]"></div>
             
             {/* Hair */}
             <div className="absolute top-0 w-full h-24 bg-slate-900 rounded-t-[3rem] z-20"></div>
             <div className="absolute top-16 right-0 w-12 h-16 bg-slate-900 rounded-bl-full z-20"></div>

             {/* EYES CONTAINER */}
             <div className="absolute top-28 flex justify-between w-40 z-20">
                {/* Left Eye */}
                <div className={`relative w-14 h-14 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-inner transition-transform duration-100 ${isBlinking ? 'scale-y-[0.1]' : 'scale-y-100'}`}>
                   <div className="w-6 h-6 bg-slate-900 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-2 h-2 bg-white rounded-full absolute top-1 right-1 opacity-80"></div>
                   </div>
                   {/* Eyelid shadow */}
                   <div className="absolute top-0 w-full h-2 bg-black/10"></div>
                </div>

                {/* Right Eye */}
                <div className={`relative w-14 h-14 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-inner transition-transform duration-100 ${isBlinking ? 'scale-y-[0.1]' : 'scale-y-100'}`}>
                   <div className="w-6 h-6 bg-slate-900 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-2 h-2 bg-white rounded-full absolute top-1 right-1 opacity-80"></div>
                   </div>
                    <div className="absolute top-0 w-full h-2 bg-black/10"></div>
                </div>
             </div>

             {/* EYEBROWS */}
             <div className="absolute top-[6.5rem] flex justify-between w-44 z-20 transition-all duration-300">
                <div className={`w-14 h-3 bg-slate-900 rounded-full transition-transform duration-300 ${isModelSpeaking ? '-translate-y-1 rotate-2' : micActive ? '-translate-y-2' : 'translate-y-0'}`}></div>
                <div className={`w-14 h-3 bg-slate-900 rounded-full transition-transform duration-300 ${isModelSpeaking ? '-translate-y-1 -rotate-2' : micActive ? '-translate-y-2' : 'translate-y-0'}`}></div>
             </div>

             {/* Glasses (Wireframe) */}
             <div className="absolute top-[6.8rem] flex justify-center w-full z-30 opacity-90 pointer-events-none">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 border-[3px] border-slate-800 rounded-2xl bg-blue-900/5 backdrop-blur-[1px]"></div>
                  <div className="w-4 h-1 bg-slate-800"></div>
                  <div className="w-16 h-16 border-[3px] border-slate-800 rounded-2xl bg-blue-900/5 backdrop-blur-[1px]"></div>
                </div>
             </div>

             {/* NOSE */}
             <div className="absolute top-48 w-6 h-8 bg-[#B57B5E] rounded-full opacity-60 z-10"></div>

             {/* MOUTH (LIP SYNC CORE) */}
             <div className="absolute bottom-12 z-20 flex flex-col items-center">
                <div 
                  className="bg-[#8A4B35] rounded-full transition-all duration-75 ease-linear shadow-inner"
                  style={{
                    width: isModelSpeaking ? '60px' : '50px',
                    height: `${10 + (mouthOpenness * 40)}px`, // Dynamic Height based on audio
                    borderRadius: isModelSpeaking ? '20px' : '40px',
                    borderBottom: '2px solid rgba(0,0,0,0.1)'
                  }}
                >
                  {/* Teeth hint */}
                  {mouthOpenness > 0.3 && (
                     <div className="w-full h-2 bg-white/80 rounded-t-sm mx-auto mt-[2px] opacity-80"></div>
                  )}
                  {/* Tongue hint */}
                   {mouthOpenness > 0.5 && (
                     <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-3 bg-red-400 rounded-t-full"></div>
                  )}
                </div>
             </div>

             {/* Neck/Collar */}
             <div className="absolute -bottom-10 w-32 h-20 bg-[#C99175] z-0"></div>
             <div className="absolute bottom-0 w-full h-10 bg-slate-900 z-30">
                {/* Collar */}
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-full bg-white transform -skew-x-12 origin-bottom-right border-r border-slate-300"></div>
                 <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-8 h-full bg-white transform skew-x-12 origin-bottom-left border-l border-slate-300"></div>
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-full bg-red-800 z-10"></div>
             </div>
          </div>
        </div>

      </div>

      {/* Controls */}
      <div className="w-full max-w-2xl z-20 flex flex-col items-center space-y-6 pb-6">
        <div className="w-full h-20 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/5 p-4 shadow-xl">
           <Visualizer analyser={userAnalyserRef.current} isActive={micActive} />
        </div>

        <div className="flex items-center gap-6">
           <button 
             onClick={toggleMic}
             className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${
               micActive ? 'bg-slate-800 border-blue-500 text-blue-400' : 'bg-red-900/30 border-red-500 text-red-500'
             }`}
           >
             {micActive ? (
               <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
             ) : (
               <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
             )}
           </button>

           <button onClick={onEnd} className="bg-red-600 hover:bg-red-700 text-white font-bold px-10 py-4 rounded-full shadow-lg shadow-red-600/20 transition-all hover:scale-105">
             End Interview
           </button>
        </div>
      </div>
    </div>
  );
};

export default LiveSession;