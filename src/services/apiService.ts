import { Gender, GeneratedContent, GenerationStep } from '../types';
import { ScriptGenerator } from './scriptGenerator';
import { ElevenLabsService } from './elevenLabsService';
import { TavusService } from './tavusService';

export class APIService {
  private static instance: APIService;
  private elevenLabsService: ElevenLabsService;
  private tavusService: TavusService;

  private constructor() {
    this.elevenLabsService = new ElevenLabsService();
    this.tavusService = new TavusService();
  }

  public static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  async generatePresentation(
    topic: string, 
    gender: Gender, 
    onProgress?: (step: GenerationStep, details?: string, timeElapsed?: number) => void
  ): Promise<GeneratedContent> {
    try {
      // Step 1: Generate Script
      onProgress?.('script', 'Creating engaging script for your topic...');
      const script = ScriptGenerator.generateScript(topic);
      
      // Step 2: Generate Voice
      onProgress?.('voice', 'Synthesizing natural AI voice...');
      const audioUrl = await this.elevenLabsService.generateVoice(script, gender);
      
      // Step 3: Generate Video
      onProgress?.('video', 'Starting AI video generation...');
      const videoResponse = await this.tavusService.createVideo(script, gender);
      
      // Enhanced video polling with detailed progress
      const videoUrl = await this.tavusService.pollForVideo(
        videoResponse.video_id, 
        gender,
        30, // max attempts
        (status, details, timeElapsed) => {
          onProgress?.('video', `${status}${details ? ` - ${details}` : ''}`, timeElapsed);
        }
      );
      
      onProgress?.('complete', 'Your AI presentation is ready!');
      
      return {
        script,
        audioUrl,
        videoUrl,
        videoId: videoResponse.video_id
      };
    } catch (error) {
      console.error('Error generating presentation:', error);
      throw error;
    }
  }
}