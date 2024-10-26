// src/app/components/ProgressBar.tsx

import * as React from 'react';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="progress-bar">
      <div 
        className="progress-bar-fill"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};