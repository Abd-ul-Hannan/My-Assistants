import React, { useEffect, useState } from 'react';
import { Sparkles, Mic, Video, Brain } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing AI Assistant...');
  const [currentIcon, setCurrentIcon] = useState(0);

  const icons = [Brain, Mic, Video, Sparkles];
  const loadingTexts = [
    'Initializing AI Assistant...',
    'Loading voice synthesis...',
    'Preparing video generation...',
    'Bringing your AI presenter to life...',
    'Ready to create magic...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 1.5;
      });
    }, 40);

    const textInterval = setInterval(() => {
      setLoadingText(prev => {
        const currentIndex = loadingTexts.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadingTexts.length;
        return loadingTexts[nextIndex];
      });
    }, 1800);

    const iconInterval = setInterval(() => {
      setCurrentIcon(prev => (prev + 1) % icons.length);
    }, 1200);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
      clearInterval(iconInterval);
    };
  }, [onComplete]);

  const CurrentIcon = icons[currentIcon];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/20 rounded-full blur-2xl animate-ping"></div>
      </div>

      <div className="text-center z-10 px-8">
        <div className="mb-8 relative">
          {/* Main logo container */}
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm mb-6 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/30 to-white/10 animate-spin"></div>
            <CurrentIcon className="w-14 h-14 text-white z-10 transition-all duration-500 transform hover:scale-110" />
          </div>
          
          {/* App title */}
          <h1 className="text-7xl font-bold text-white mb-3 tracking-tight">
            My Assistant
          </h1>
          <p className="text-2xl text-white/90 font-light">AI-Powered Presentation Creator</p>
        </div>
        
        {/* Progress section */}
        <div className="w-96 mx-auto">
          {/* Progress bar */}
          <div className="bg-white/20 backdrop-blur-sm rounded-full h-3 mb-6 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-white to-white/80 rounded-full h-3 transition-all duration-100 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
            </div>
          </div>
          
          {/* Loading text */}
          <p className="text-white/95 text-lg animate-pulse font-medium">
            {loadingText}
          </p>
          
          {/* Progress percentage */}
          <p className="text-white/70 text-sm mt-2">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;