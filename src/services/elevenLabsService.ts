import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { Gender } from '../types';
import { presenterDefaults } from '../config/presenters';

export class ElevenLabsService {
  private client: ElevenLabsClient;

  constructor() {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_ELEVENLABS_API_KEY is required');
    }
    this.client = new ElevenLabsClient({ apiKey });
  }

  async generateVoice(text: string, gender: Gender): Promise<string> {
    try {
      const voiceId = presenterDefaults[gender].voice_id;

      const audio = await this.client.textToSpeech.convert(voiceId, {
        output_format: "mp3_44100_128",
        text,
        model_id: "eleven_multilingual_v2"
      });

      // Convert the audio stream to a blob and create URL
      const chunks: Uint8Array[] = [];
      const reader = audio.getReader();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Error generating voice:', error);
      throw new Error('Failed to generate voice. Please check your ElevenLabs API key.');
    }
  }
}