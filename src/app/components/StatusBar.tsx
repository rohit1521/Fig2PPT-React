// src/app/components/StatusBar.tsx

import * as React from 'react';

interface StatusBarProps {
  message: string;
  error?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ message, error }) => {
  return (
    <div className={`status-bar ${error ? 'error' : ''}`}>
      {message}
    </div>
  );
};