import React from 'react';
import { Bike, Package } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message = 'Loading...' 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className={`${sizeClasses[size]} animate-spin-slow`}>
          <Bike className="w-full h-full text-primary-500" />
        </div>
        <div className={`absolute -top-2 -right-2 ${size === 'small' ? 'w-3 h-3' : size === 'medium' ? 'w-4 h-4' : 'w-6 h-6'} animate-bounce-gentle`}>
          <Package className="w-full h-full text-accent-500" />
        </div>
      </div>
      <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 animate-pulse-soft">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;