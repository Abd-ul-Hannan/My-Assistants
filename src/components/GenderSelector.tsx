import React from 'react';
import { User, UserCheck } from 'lucide-react';
import { Gender } from '../types';

interface GenderSelectorProps {
  selectedGender: Gender | null;
  onGenderSelect: (gender: Gender) => void;
  disabled?: boolean;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({ 
  selectedGender, 
  onGenderSelect, 
  disabled = false 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Choose Your AI Presenter</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Male Presenter */}
        <button
          onClick={() => onGenderSelect('male')}
          disabled={disabled}
          className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
            selectedGender === 'male'
              ? 'border-blue-500 bg-blue-50 shadow-lg'
              : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex flex-col items-center space-y-3">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              selectedGender === 'male' ? 'bg-blue-500' : 'bg-gray-400'
            }`}>
              {selectedGender === 'male' ? (
                <UserCheck className="w-8 h-8 text-white" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900">Nathan</h4>
              <p className="text-sm text-gray-600">Male Presenter</p>
              <p className="text-xs text-gray-500 mt-1">Voice: Brian</p>
            </div>
          </div>
        </button>

        {/* Female Presenter */}
        <button
          onClick={() => onGenderSelect('female')}
          disabled={disabled}
          className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
            selectedGender === 'female'
              ? 'border-pink-500 bg-pink-50 shadow-lg'
              : 'border-gray-200 bg-white hover:border-pink-300 hover:shadow-md'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex flex-col items-center space-y-3">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              selectedGender === 'female' ? 'bg-pink-500' : 'bg-gray-400'
            }`}>
              {selectedGender === 'female' ? (
                <UserCheck className="w-8 h-8 text-white" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900">Anna</h4>
              <p className="text-sm text-gray-600">Female Presenter</p>
              <p className="text-xs text-gray-500 mt-1">Voice: Alice</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default GenderSelector;