// API service for ElevenLabs and Tavus integration
export interface GeneratedContent {
  script: string;
  audioUrl: string;
  videoUrl: string;
}

export class APIService {
  private static instance: APIService;
  
  public static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  async generateScript(topic: string): Promise<string> {
    // Enhanced script generation with more variety
    const scripts = {
      'how to stay focused': 'Focus is the cornerstone of productivity and success in our distraction-filled world. Start by creating a dedicated workspace free from interruptions and digital noise. Practice the Pomodoro technique - work in focused 25-minute intervals followed by short breaks to maintain peak mental performance. Set clear, specific goals for each session and celebrate small victories along the way. Remember, focus is like a muscle that grows stronger with consistent training and deliberate practice.',
      
      'benefits of meditation': 'Meditation is a powerful practice that transforms both mind and body in remarkable ways. Regular meditation reduces stress hormones like cortisol while boosting feel-good neurotransmitters like serotonin and dopamine. It enhances focus, emotional regulation, and self-awareness, creating a calmer, more centered version of yourself. Scientific studies show meditation can lower blood pressure, strengthen immune function, and even slow cellular aging. Just 10-15 minutes of daily practice can revolutionize your mental clarity and overall well-being.',
      
      'time management tips': 'Effective time management is the key to achieving more while feeling less overwhelmed. Start by using the Eisenhower Matrix to categorize tasks by urgency and importance, focusing on what truly matters. Time-block your calendar to protect deep work hours and batch similar activities together for maximum efficiency. Learn to say no to non-essential commitments and delegate tasks when possible. Track your time for one week to identify your biggest time wasters and energy drains.',
      
      'productivity hacks': 'Productivity is about working smarter, not harder, and these proven strategies will transform your output. Begin each day by tackling your most important task first when your energy is highest. Use the two-minute rule - if something takes less than two minutes, do it immediately rather than adding it to your to-do list. Create templates and systems for repetitive tasks to eliminate decision fatigue. Finally, schedule regular breaks and protect your sleep - a well-rested mind is exponentially more productive.',
      
      'stress management': 'Managing stress effectively is crucial for both mental health and peak performance in all areas of life. Start by identifying your stress triggers and developing healthy coping mechanisms like deep breathing exercises or brief walks. Practice the 4-7-8 breathing technique during stressful moments to activate your parasympathetic nervous system. Build regular exercise into your routine as it naturally reduces cortisol and releases mood-boosting endorphins. Remember, stress is often about perception - reframe challenges as opportunities for growth and learning.',
      
      'default': `Understanding ${topic} is essential for personal and professional growth in today's rapidly evolving world. The key principles involve consistent practice, mindful application, and continuous learning from both successes and setbacks. Start with small, manageable steps and gradually build momentum as you develop confidence and competence. Focus on progress over perfection, and remember that mastery comes through deliberate practice and patience. With the right mindset and consistent effort, you can achieve remarkable results in this important area.`
    };

    const key = topic.toLowerCase().trim();
    return scripts[key as keyof typeof scripts] || scripts.default.replace('${topic}', topic);
  }

  async generateVoice(script: string): Promise<string> {
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: script,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Error generating voice:', error);
      // Fallback to a placeholder for demo
      return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmsmBjuBzvLZiTYIG2m98OScTgwOUarm7L1pGwVEutpfGwUzgdzqvWkbBUF3x/PbkzoJFWa5z+RQBwRKsOHiuXsZBCOO4PSqZSMAhIGKhWxdX3SYr6yQYTY1YKHeHXfE7c2LQQoUXrLl6qxPBCOO4PGo0CMyFGyQgJOFcVkzaajdPjMWV6nf3q5YCiAVUK7g46xZCyIVTKvl6alHEQdSqOPwt2UaB0GmztyvVgMRz8AAAACAKgz0KlLuFaDW8FiYgR8FUBTcXhyOQgEoOJm7owuL3KGDcIUXbTno6pNNGBJBzXPMrWEsEhNdrYpQ4V8rGwEQMIbB8Zu0gxsJV6nh3a9Qsz4';
    }
  }

  async generateVideo(script: string, audioUrl: string): Promise<string> {
    try {
      // Check if API key is available
      const apiKey = import.meta.env.VITE_TAVUS_API_KEY;
      if (!apiKey) {
        console.warn('Tavus API key not found, using fallback video');
        return this.getFallbackVideo();
      }

      // Try to create a video using Tavus API with proxy endpoint
      const response = await fetch('/api/tavus/v2/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          script: script,
          replica_id: 'r783537ef5', // Using a default replica ID
          video_name: `AI Presentation - ${Date.now()}`,
          callback_url: null
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Tavus API error:', response.status, errorData);
        
        // Handle specific error cases
        if (response.status === 401) {
          console.warn('Invalid Tavus API key, using fallback video');
        } else if (response.status === 403) {
          console.warn('Tavus API access forbidden, using fallback video');
        } else {
          console.warn(`Tavus API error ${response.status}, using fallback video`);
        }
        
        return this.getFallbackVideo();
      }

      const data = await response.json();
      
      // Tavus returns a video_id, we need to poll for the completed video
      if (data.video_id) {
        return await this.pollForVideo(data.video_id);
      }
      
      console.warn('No video ID returned from Tavus, using fallback video');
      return this.getFallbackVideo();
    } catch (error) {
      console.error('Error generating video:', error);
      
      // Check if it's a network error (CORS, connection issues, etc.)
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.warn('Network error when calling Tavus API (possibly CORS), using fallback video');
      } else {
        console.warn('Unexpected error during video generation, using fallback video');
      }
      
      return this.getFallbackVideo();
    }
  }

  private getFallbackVideo(): string {
    // Return a sample video for demo purposes
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  }

  private async pollForVideo(videoId: string, maxAttempts: number = 30): Promise<string> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(`/api/tavus/v2/videos/${videoId}`, {
          headers: {
            'x-api-key': import.meta.env.VITE_TAVUS_API_KEY
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'completed' && data.download_url) {
            return data.download_url;
          }
        }
        
        // Wait 2 seconds before next attempt
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Error polling for video:', error);
      }
    }
    
    // If polling fails, return fallback video
    console.warn('Video polling timed out, using fallback video');
    return this.getFallbackVideo();
  }

  async generatePresentation(topic: string, onProgress?: (step: string) => void): Promise<GeneratedContent> {
    try {
      onProgress?.('script');
      const script = await this.generateScript(topic);
      
      onProgress?.('voice');
      const audioUrl = await this.generateVoice(script);
      
      onProgress?.('video');
      const videoUrl = await this.generateVideo(script, audioUrl);
      
      onProgress?.('complete');
      
      return {
        script,
        audioUrl,
        videoUrl
      };
    } catch (error) {
      console.error('Error generating presentation:', error);
      throw new Error('Failed to generate presentation. Please try again.');
    }
  }
}