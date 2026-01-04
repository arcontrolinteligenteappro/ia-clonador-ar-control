
export interface CloneProject {
  id: string;
  name: string;
  url?: string;
  description: string;
  imageUrl?: string;
  code: string;
  timestamp: number;
}

export interface GeminiResponse {
  analysis: string;
  code: string;
  suggestions: string[];
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  GENERATING = 'GENERATING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}
