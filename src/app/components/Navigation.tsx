// src/app/components/Navigation.tsx

import * as React from 'react';
import { TabType } from '../../typings/types';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="navigation">
      <button
        className={`nav-button ${activeTab === 'converter' ? 'active' : ''}`}
        onClick={() => onTabChange('converter')}
      >
        Converter
      </button>
      <button
        className={`nav-button ${activeTab === 'settings' ? 'active' : ''}`}
        onClick={() => onTabChange('settings')}
      >
        Settings
      </button>
      <button
        className={`nav-button ${activeTab === 'about' ? 'active' : ''}`}
        onClick={() => onTabChange('about')}
      >
        About
      </button>
    </nav>
  );
};