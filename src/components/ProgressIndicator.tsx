import React from 'react';
import { FileText, Mic, Video, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { GenerationStep, ProgressDetails } from '../types';

interface ProgressIndicatorProps {
  currentStep: GenerationStep;
  isGenerating: boolean;
  progressDetails?: ProgressDetails | null;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentStep, 
  isGenerating, 
  progressDetails 
}) => {
  const steps = [
    { key: 'script', label: 'Generating Script', icon: FileText, estimatedTime: '5s' },
    { key: 'voice', label: 'Creating Voice', icon: Mic, estimatedTime: '10s' },
    { key: 'video', label: 'Generating Video', icon: Video, estimatedTime: '60-120s' },
    { key: 'complete', label: 'Complete', icon: CheckCircle, estimatedTime: '' }
  ];

  const getStepStatus = (stepKey: string) => {
    const stepIndex = steps.findIndex(s => s.key === stepKey);
    const currentIndex = steps.findIndex(s => s.key === currentStep);
    
    if (stepIndex < currentIndex || currentStep === 'complete') {
      return 'completed';
    } else if (stepIndex === currentIndex && isGenerating) {
      return 'active';
    } else {
      return 'pending';
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (!isGenerating && currentStep !== 'complete') {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Creating your presentation...</h3>
        {progressDetails?.timeElapsed && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Elapsed: {formatTime(progressDetails.timeElapsed)}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.key);
          const Icon = step.icon;
          const isCurrentStep = step.key === currentStep;
          
          return (
            <div key={step.key} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                status === 'completed' 
                  ? 'bg-green-500 text-white' 
                  : status === 'active'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={`font-medium ${
                    status === 'completed' ? 'text-green-700' :
                    status === 'active' ? 'text-blue-700' :
                    'text-gray-500'
                  }`}>
                    {step.label}
                  </p>
                  {step.estimatedTime && status === 'pending' && (
                    <span className="text-xs text-gray-400">~{step.estimatedTime}</span>
                  )}
                </div>

                {/* Enhanced progress details for video generation */}
                {isCurrentStep && progressDetails?.message && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{progressDetails.message}</p>
                    {step.key === 'video' && status === 'active' && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full animate-pulse transition-all duration-500" 
                               style={{ width: progressDetails.timeElapsed ? `${Math.min((progressDetails.timeElapsed / 90) * 100, 95)}%` : '20%' }}>
                          </div>
                        </div>
                        {progressDetails.timeElapsed && progressDetails.timeElapsed > 30 && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                            <AlertCircle className="w-3 h-3" />
                            <span>Video generation can take 1-3 minutes. Please be patient...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Standard progress bar for other steps */}
                {status === 'active' && step.key !== 'video' && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                )}
              </div>
              
              {status === 'active' && (
                <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              )}
              
              {status === 'completed' && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
          );
        })}
      </div>

      {/* Additional info for video generation */}
      {currentStep === 'video' && isGenerating && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <Video className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">AI Video Generation in Progress</h4>
              <p className="text-sm text-blue-700 mb-2">
                Our AI is creating a personalized video with your chosen presenter. This process typically takes 1-3 minutes.
              </p>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• Analyzing script content and timing</li>
                <li>• Generating realistic facial expressions</li>
                <li>• Synchronizing lip movements with audio</li>
                <li>• Rendering high-quality video output</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;