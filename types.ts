export enum AppState {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  SETUP = 'SETUP',
  INTERVIEW = 'INTERVIEW',
  FEEDBACK = 'FEEDBACK',
  PRICING = 'PRICING'
}

export interface User {
  name: string;
  email: string;
}

export interface InterviewContext {
  role: string;
  experienceLevel: string;
  resumeText: string;
  focusArea: string;
  difficulty: 'Friendly' | 'Professional' | 'Ruthless';
  companyStyle: string;
  language: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface AudioVisualizerProps {
  analyser: AnalyserNode | null;
  isActive: boolean;
}