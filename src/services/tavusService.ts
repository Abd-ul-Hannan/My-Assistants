import { Gender } from '../types';
import { presenterDefaults } from '../config/presenters';

export interface TavusVideoResponse {
  video_id: string;
  status: string;
  download_url?: string;
  stream_url?: string;
  hosted_url?: string;
  status_details?: string;
  error_details?: string;
}

export class TavusService {
  private apiKey: string;
  private baseUrl = 'https://tavusapi.com/v2';

  constructor() {
    const apiKey = import.meta.env.VITE_TAVUS_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_TAVUS_API_KEY is required');
    }
    this.apiKey = apiKey;
  }

  private getFallbackVideo(gender: Gender): string {
    const fallbackVideos = {
      male: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      female: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    };
    return fallbackVideos[gender];
  }

  async createVideo(script: string, gender: Gender): Promise<TavusVideoResponse> {
    try {
      const replicaId = presenterDefaults[gender].replica_id;
      console.log("Creating video with replicaId:", replicaId);

      // Validate inputs
      if (!script || script.trim().length === 0) {
        throw new Error('Script cannot be empty');
      }

      if (!replicaId) {
        throw new Error('Replica ID is required');
      }

      const response = await fetch(`${this.baseUrl}/videos`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          script: script.trim(),
          replica_id: replicaId,
          video_name: `My Assistant Video - ${Date.now()}`
        })
      });

      console.log("Tavus API response status:", response.status);

      if (!response.ok) {
        let errorData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json().catch(() => null);
        } else {
          const errorText = await response.text().catch(() => 'Unknown error');
          errorData = { error: errorText };
        }

        console.error(`Tavus API error: ${response.status} - ${response.statusText}`, errorData);
        
        return {
          video_id: 'fallback',
          status: 'fallback',
          error_details: errorData?.error || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      const result = await response.json();
      console.log("Video creation success:", result);
      
      if (!result.video_id) {
        console.warn('Invalid response: missing video_id', result);
        return {
          video_id: 'fallback',
          status: 'fallback',
          error_details: 'Invalid API response: missing video_id'
        };
      }

      return {
        video_id: result.video_id,
        status: result.status || 'unknown',
        hosted_url: result.hosted_url,
        status_details: result.status_details
      };

    } catch (error) {
      console.error('Error creating Tavus video:', error);
      return {
        video_id: 'fallback',
        status: 'fallback',
        error_details: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getVideoStatus(videoId: string): Promise<TavusVideoResponse> {
    try {
      if (!videoId || videoId === 'fallback') {
        throw new Error('Invalid video ID');
      }

      const response = await fetch(`${this.baseUrl}/videos/${videoId}`, {
        headers: {
          'x-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        let errorData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json().catch(() => null);
        } else {
          const errorText = await response.text().catch(() => 'Unknown error');
          errorData = { error: errorText };
        }

        console.error(`Failed to get video status: ${response.status}`, errorData);
        throw new Error(`Failed to get video status: ${response.status} - ${errorData?.error || response.statusText}`);
      }

      const result = await response.json();
      return {
        video_id: result.video_id,
        status: result.status,
        download_url: result.download_url,
        stream_url: result.stream_url,
        hosted_url: result.hosted_url,
        status_details: result.status_details,
        error_details: result.error_details
      };

    } catch (error) {
      console.error('Error getting video status:', error);
      throw new Error(`Failed to get video status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async pollForVideo(
    videoId: string, 
    gender: Gender, 
    maxAttempts: number = 30,
    onProgress?: (status: string, details?: string, timeElapsed?: number) => void
  ): Promise<string> {
    if (videoId === 'fallback') {
      console.log('Using fallback video due to API issues');
      onProgress?.('Using demo video due to API limitations', 'Demo video will be used instead', 0);
      return this.getFallbackVideo(gender);
    }

    console.log(`Starting to poll for video ${videoId} (max ${maxAttempts} attempts)`);
    const startTime = Date.now();

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const timeElapsed = Math.round((Date.now() - startTime) / 1000);
        const videoData = await this.getVideoStatus(videoId);

        console.log(`Polling attempt ${attempt + 1}/${maxAttempts}: status = ${videoData.status}`);

        // Provide detailed progress updates
        const progressMessage = this.getProgressMessage(videoData.status, attempt + 1, maxAttempts);
        onProgress?.(progressMessage, videoData.status_details, timeElapsed);

        // Check for successful completion
        if (videoData.status === 'ready' || videoData.status === 'completed') {
          if (videoData.download_url) {
            console.log('Video completed and ready to download.');
            onProgress?.('Video generation complete!', 'Your AI presenter video is ready', timeElapsed);
            return videoData.download_url;
          } else if (videoData.stream_url) {
            console.log('Video completed, using stream URL.');
            onProgress?.('Video generation complete!', 'Your AI presenter video is ready', timeElapsed);
            return videoData.stream_url;
          } else if (videoData.hosted_url) {
            console.log('Video completed, using hosted URL.');
            onProgress?.('Video generation complete!', 'Your AI presenter video is ready', timeElapsed);
            return videoData.hosted_url;
          }
        }

        // Check for failure states
        if (videoData.status === 'failed' || videoData.status === 'error') {
          console.warn(`Video generation failed with status: ${videoData.status}`);
          onProgress?.('Video generation failed, using demo video', videoData.error_details || 'Using fallback video', timeElapsed);
          return this.getFallbackVideo(gender);
        }

        // Calculate dynamic wait time based on attempt and expected duration
        const baseWaitTime = 4000; // 4 seconds base
        const progressiveWait = Math.min(attempt * 1000, 6000); // Up to 6 seconds additional
        const waitTime = baseWaitTime + progressiveWait;

        // Show estimated time remaining
        const estimatedTotal = this.getEstimatedDuration(videoData.status);
        const estimatedRemaining = Math.max(0, estimatedTotal - timeElapsed);
        
        if (estimatedRemaining > 0) {
          onProgress?.(
            progressMessage, 
            `Estimated time remaining: ${estimatedRemaining}s`, 
            timeElapsed
          );
        }

        await new Promise(resolve => setTimeout(resolve, waitTime));

      } catch (error) {
        console.error(`Polling attempt ${attempt + 1} failed:`, error);
        const timeElapsed = Math.round((Date.now() - startTime) / 1000);
        
        if (attempt === maxAttempts - 1) {
          console.warn('Video generation timed out after max attempts, using fallback');
          onProgress?.('Generation timed out, using demo video', 'Using fallback video due to timeout', timeElapsed);
          return this.getFallbackVideo(gender);
        }

        onProgress?.(`Retrying... (${attempt + 1}/${maxAttempts})`, 'Connection issue, retrying', timeElapsed);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    const timeElapsed = Math.round((Date.now() - startTime) / 1000);
    console.warn('Video generation timed out, using fallback');
    onProgress?.('Generation timed out, using demo video', 'Using fallback video due to timeout', timeElapsed);
    return this.getFallbackVideo(gender);
  }

  private getProgressMessage(status: string, attempt: number, maxAttempts: number): string {
    const statusMessages: Record<string, string> = {
      'queued': 'Video queued for processing...',
      'generating': 'AI is generating your video...',
      'processing': 'Processing and rendering video...',
      'uploading': 'Uploading your video...',
      'ready': 'Video is ready!',
      'completed': 'Video generation complete!',
      'failed': 'Video generation failed',
      'error': 'An error occurred'
    };

    const baseMessage = statusMessages[status] || `Processing video (${status})...`;
    
    if (status === 'generating' || status === 'processing') {
      return `${baseMessage} (${attempt}/${maxAttempts})`;
    }
    
    return baseMessage;
  }

  private getEstimatedDuration(status: string): number {
    // Estimated durations in seconds based on status
    const estimations: Record<string, number> = {
      'queued': 120, // 2 minutes
      'generating': 90, // 1.5 minutes
      'processing': 60, // 1 minute
      'uploading': 30, // 30 seconds
      'ready': 0,
      'completed': 0
    };

    return estimations[status] || 90;
  }
}