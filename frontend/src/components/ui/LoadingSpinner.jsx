import React from 'react';

export function LoadingSpinner({ size = 'md', label = 'Analyzing water safety data...' }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative">
        <div className={`${sizes[size]} border-sky-200 border-t-sky-600 rounded-full animate-spin`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-sky-500 rounded-full animate-ping" />
        </div>
      </div>
      {label && <p className="text-sm font-medium text-slate-600 animate-pulse">{label}</p>}
    </div>
  );
}

export default LoadingSpinner;
