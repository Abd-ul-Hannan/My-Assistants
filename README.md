# My Assistant - AI-Powered Presentation Creator

Transform your ideas into AI-powered presentations with voice and video using cutting-edge AI technology.

## Features

🎯 **Topic Input** - Enter any topic you want to present about
👥 **AI Presenter Selection** - Choose between male (Nathan) or female (Anna) AI presenters
📝 **Script Generation** - Automatically generates engaging 4-5 sentence scripts
🎙️ **Voice Synthesis** - Real-time voice generation using ElevenLabs
🎥 **Video Creation** - AI-powered talking head videos using Tavus
📊 **Real-time Progress** - Detailed progress tracking with time estimates
⏱️ **Smart Timeouts** - Intelligent fallback handling for long generation times
📱 **Responsive Design** - Works perfectly on mobile and desktop
⬇️ **Download & Share** - Download videos and share via link

## Video Generation Process

### What to Expect
- **Script Generation**: ~5 seconds
- **Voice Synthesis**: ~10 seconds  
- **Video Generation**: **1-3 minutes** (this is normal!)

### During Video Generation
The app provides real-time updates showing:
- Current processing status (queued → generating → processing → ready)
- Time elapsed and estimated time remaining
- Detailed explanations of what the AI is doing
- Progress bars with realistic completion percentages

### Why Video Takes Time
AI video generation is a complex process involving:
1. **Script Analysis** - Understanding content and timing
2. **Facial Expression Generation** - Creating realistic expressions
3. **Lip Sync Processing** - Synchronizing mouth movements with audio
4. **High-Quality Rendering** - Producing professional video output

### Fallback System
If video generation takes longer than expected (>3 minutes), the app automatically:
- Provides clear explanations of delays
- Uses high-quality demo videos as fallbacks
- Maintains full functionality for audio and script features

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory with your API keys:

```env
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
VITE_TAVUS_API_KEY=your_tavus_api_key_here
```

### 2. API Keys Required

- **ElevenLabs API Key**: Get from [ElevenLabs Dashboard](https://elevenlabs.io/app/speech-synthesis)
- **Tavus API Key**: Get from [Tavus Dashboard](https://www.tavus.io/)

### 3. Installation

```bash
npm install
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

## AI Presenters

### Male Presenter - Nathan
- **Voice**: Brian (ElevenLabs Voice ID: 21m00Tcm4TlvDq8ikWAM)
- **Replica ID**: r1fbfc941b (Tavus)
- **Characteristics**: Professional, clear, engaging tone

### Female Presenter - Anna  
- **Voice**: Alice (ElevenLabs Voice ID: EXAVITQu4vr4xnSDxMaL)
- **Replica ID**: r4c41453d2 (Tavus)
- **Characteristics**: Warm, articulate, friendly tone

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Voice AI**: ElevenLabs API
- **Video AI**: Tavus API
- **Build Tool**: Vite
- **Deployment**: Netlify Ready

## Usage

1. **Enter a Topic** (e.g., "How to stay focused", "Benefits of meditation")
2. **Select Your AI Presenter** (Male/Female)
3. **Click "Generate AI Presentation"**
4. **Watch the Progress** - Real-time updates show:
   - Script generation (5s)
   - Voice synthesis (10s)
   - Video generation (1-3 minutes)
5. **Enjoy Your Presentation** - Play, download, or share

## Performance & Optimization

### Enhanced User Experience
- **Progress Tracking**: Real-time status updates with time estimates
- **Smart Polling**: Efficient API polling with exponential backoff
- **Timeout Handling**: Graceful fallbacks when generation takes too long
- **Error Recovery**: Automatic retry mechanisms for network issues

### Production Optimizations
- **Code Splitting**: Vendor and library chunks for faster loading
- **Asset Optimization**: Optimized builds with source maps disabled
- **Proxy Configuration**: CORS handling for API requests
- **Responsive Design**: Mobile-first approach with breakpoints

## Troubleshooting

### Video Generation Issues
- **Long Wait Times**: Video generation typically takes 1-3 minutes - this is normal
- **Timeout Fallbacks**: If generation exceeds 3 minutes, demo videos are used
- **API Limits**: Check your Tavus API quota and rate limits
- **Network Issues**: App automatically retries failed requests

### Common Solutions
1. **Check API Keys**: Ensure both ElevenLabs and Tavus keys are valid
2. **Network Connection**: Stable internet required for video generation
3. **Browser Compatibility**: Use modern browsers (Chrome, Firefox, Safari, Edge)
4. **Clear Cache**: Refresh browser cache if experiencing issues

## Deployment

This app is ready for deployment on Netlify:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard:
   - `VITE_ELEVENLABS_API_KEY`
   - `VITE_TAVUS_API_KEY`

### Environment Variables for Production
```bash
# Netlify Environment Variables
VITE_ELEVENLABS_API_KEY=your_production_elevenlabs_key
VITE_TAVUS_API_KEY=your_production_tavus_key
```

## API Documentation

### ElevenLabs Integration
- **Endpoint**: Text-to-Speech API
- **Models**: eleven_multilingual_v2
- **Output**: MP3 44.1kHz 128kbps
- **Features**: Natural voice synthesis with emotion

### Tavus Integration
- **Endpoint**: Video Generation API v2
- **Features**: AI talking head videos
- **Processing**: 1-3 minute generation time
- **Output**: High-quality MP4 videos

## Built with Bolt.new

This application was created using [Bolt.new](https://bolt.new) - the AI-powered web development platform that enables rapid prototyping and deployment of full-stack applications.

## License

MIT License - feel free to use this project as a starting point for your own AI-powered applications.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify your API keys are correctly configured
3. Ensure stable internet connection for video generation
4. Review browser console for detailed error messages