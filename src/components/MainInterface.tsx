import React, { useState } from 'react';
import { Sparkles, Send, RotateCcw } from 'lucide-react';
import { Gender, GeneratedContent, GenerationStep, ProgressDetails } from '../types';
import GenderSelector from './GenderSelector';
import ProgressIndicator from './ProgressIndicator';
import ResultsDisplay from './ResultsDisplay';

interface MainInterfaceProps {
  onGenerate: (topic: string, gender: Gender) => void;
  isGenerating: boolean;
  generatedContent: GeneratedContent | null;
  currentStep: GenerationStep;
  progressDetails: ProgressDetails | null;
  error: string | null;
}

const MainInterface: React.FC<MainInterfaceProps> = ({ 
  onGenerate, 
  isGenerating, 
  generatedContent, 
  currentStep,
  progressDetails,
  error 
}) => {
  const [topic, setTopic] = useState('');
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && selectedGender) {
      onGenerate(topic.trim(), selectedGender);
    }
  };

  const handleReset = () => {
    setTopic('');
    setSelectedGender(null);
  };

  const canGenerate = topic.trim() && selectedGender && !isGenerating;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">My Assistant</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your ideas into AI-powered presentations with voice and video
          </p>
        </div>

        {/* Input Section */}
        {!generatedContent && (
          <div className="max-w-3xl mx-auto mb-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Topic Input */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <label htmlFor="topic" className="block text-lg font-semibold text-gray-900 mb-4">
                  What would you like to present about?
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., How to stay focused, Benefits of meditation, Time management tips..."
                    className="flex-1 px-6 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg"
                    disabled={isGenerating}
                  />
                </div>
              </div>

              {/* Gender Selection */}
              {topic.trim() && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <GenderSelector
                    selectedGender={selectedGender}
                    onGenderSelect={setSelectedGender}
                    disabled={isGenerating}
                  />
                </div>
              )}

              {/* Generate Button */}
              {topic.trim() && selectedGender && (
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={!canGenerate}
                    className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3 mx-auto text-lg font-semibold shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                    Generate AI Presentation
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Generation Failed</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Progress Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <ProgressIndicator 
            currentStep={currentStep} 
            isGenerating={isGenerating}
            progressDetails={progressDetails}
          />
        </div>

        {/* Results Section */}
        {generatedContent && (
          <div className="max-w-6xl mx-auto mb-12">
            <ResultsDisplay content={generatedContent} topic={topic} />
            
            {/* Reset Button */}
            <div className="text-center mt-8">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors mx-auto"
              >
                <RotateCcw className="w-5 h-5" />
                Create Another Presentation
              </button>
            </div>
          </div>
        )}

        {/* Built with Bolt.new Badge */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all">
            <a
              href="https://bolt.new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2 font-medium"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Built with Bolt.new
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainInterface;