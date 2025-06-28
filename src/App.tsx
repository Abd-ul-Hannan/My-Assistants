import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import MainInterface from './components/MainInterface';
import { APIService } from './services/apiService';
import { Gender, GeneratedContent, GenerationStep, ProgressDetails } from './types';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [currentStep, setCurrentStep] = useState<GenerationStep>('script');
  const [progressDetails, setProgressDetails] = useState<ProgressDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiService = APIService.getInstance();

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleGenerate = async (topic: string, gender: Gender) => {
    setIsGenerating(true);
    setGeneratedContent(null);
    setCurrentStep('script');
    setProgressDetails(null);
    setError(null);
    
    try {
      const content = await apiService.generatePresentation(topic, gender, (step, details, timeElapsed) => {
        setCurrentStep(step);
        setProgressDetails({
          step,
          message: details || '',
          timeElapsed
        });
      });
      setGeneratedContent(content);
    } catch (error) {
      console.error('Generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <MainInterface
      onGenerate={handleGenerate}
      isGenerating={isGenerating}
      generatedContent={generatedContent}
      currentStep={currentStep}
      progressDetails={progressDetails}
      error={error}
    />
  );
}

export default App;