export interface PresenterConfig {
  voice_id: string;
  replica_id: string;
}

export interface PresenterDefaults {
  male: PresenterConfig;
  female: PresenterConfig;
}

export interface GeneratedContent {
  script: string;
  audioUrl: string;
  videoUrl: string;
  videoId?: string;
}

export type Gender = 'male' | 'female';
export type GenerationStep = 'script' | 'voice' | 'video' | 'complete';

export interface ProgressDetails {
  step: GenerationStep;
  message: string;
  details?: string;
  timeElapsed?: number;
}