export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  prompt: string; // Prompt for Gemini
}

export interface GeneratedImage {
  id: number;
  url: string;
}

export type Tab = 'HOME' | 'CHARACTERS' | 'STORY';

export interface CharacterProfile {
  name: string;
  eva: string;
  role: string;
  color: string;
  imgPrompt: string;
}

export interface TrinityItem {
  pilot: string;
  unit: string;
  angel: string;
  quote: string;
  pilotPrompt: string;
  unitPrompt: string;
  angelPrompt: string;
}