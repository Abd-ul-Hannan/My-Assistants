import React from 'react';
import { Play, RotateCcw, Download, Share2, Volume2, Video as VideoIcon } from 'lucide-react';
import { GeneratedContent } from '../types';

interface ResultsDisplayProps {
  content: GeneratedContent;
  topic: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ content, topic }) => {
  const handlePlayAudio = () => {
    if (content.audioUrl) {
      const audio = new Audio(content.audioUrl);
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  const handleDownloadVideo = () => {
    if (content.videoUrl) {
      const a = document.createElement('a');
      a.href = content.videoUrl;
      a.download = `my-assistant-${topic.replace(/\s+/g, '-').toLowerCase()}.mp4`;
      a.click();
    }
  };

  const handleShareVideo = async () => {
    if (navigator.share && content.videoUrl) {
      try {
        await navigator.share({
          title: 'My Assistant - AI Generated Video',
          text: `Check out this AI-generated video about: ${topic}`,
          url: content.videoUrl,
        });
      } catch (error) {
        // Fallback to clipboard
        if (content.videoUrl) {
          await navigator.clipboard.writeText(content.videoUrl);
          alert('Video URL copied to clipboard!');
        }
      }
    } else if (content.videoUrl) {
      await navigator.clipboard.writeText(content.videoUrl);
      alert('Video URL copied to clipboard!');
    }
  };

  const handleReplayVideo = () => {
    const video = document.querySelector('#generated-video') as HTMLVideoElement;
    if (video) {
      video.currentTime = 0;
      video.play();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your AI Presentation is Ready!</h2>
        <p className="text-gray-600">Topic: <span className="font-semibold">{topic}</span></p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Script Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Generated Script & Voice</h3>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-gray-700 leading-relaxed text-sm">
              {content.script}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handlePlayAudio}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Play className="w-4 h-4" />
              Play Audio
            </button>
            
            <button
              onClick={handlePlayAudio}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Replay
            </button>
          </div>
        </div>

        {/* Video Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <VideoIcon className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">AI Presenter Video</h3>
          </div>
          
          <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden mb-6">
            {content.videoUrl ? (
              <video
                id="generated-video"
                src={content.videoUrl}
                controls
                className="w-full h-full object-cover"
                poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjM2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFJIFByZXNlbnRlcjwvdGV4dD48L3N2Zz4="
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <VideoIcon className="w-16 h-16 opacity-50" />
              </div>
            )}
          </div>
          
          {/* Video Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => {
                const video = document.querySelector('#generated-video') as HTMLVideoElement;
                if (video) video.play();
              }}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              <Play className="w-4 h-4" />
              Play
            </button>
            
            <button
              onClick={handleReplayVideo}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Replay
            </button>
            
            <button
              onClick={handleDownloadVideo}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            
            <button
              onClick={handleShareVideo}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;