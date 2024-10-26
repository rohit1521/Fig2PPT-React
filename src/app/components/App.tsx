// src/app/components/App.tsx

import * as React from 'react';
import { FrameData, PluginMessage, TabType, ConversionStatus } from '../../typings/types';
import { generatePowerPoint } from '../utils/pptxGenerator'
import { Navigation } from './Navigation';
import { FrameList } from './FrameList';
import { ProgressBar } from './ProgressBar';
import { StatusBar } from './StatusBar';
import '../styles/ui.css';

export const App: React.FC = () => {
  const [frames, setFrames] = React.useState<FrameData[]>([]);
  const [activeTab, setActiveTab] = React.useState<TabType>('converter');
  const [status, setStatus] = React.useState<ConversionStatus>({
    isConverting: false,
    progress: 0,
    message: 'Ready'
  });

  const handlePluginMessage = React.useCallback((event: MessageEvent<{ pluginMessage: PluginMessage }>) => {
    const { type, payload } = event.data.pluginMessage;

    switch (type) {
      case 'update-frames':
        if (payload?.frames) {
          setFrames(payload.frames);
        }
        break;

      case 'update-progress':
        if (typeof payload?.progress === 'number') {
          setStatus(prev => ({
            ...prev,
            progress: payload.progress,
            message: `Converting... ${payload.progress}%`
          }));
        }
        break;

      case 'conversion-complete':
        if (payload?.frames) {
          generatePowerPoint(payload.frames)
            .then(blob => {
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'presentation.pptx';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);

              setStatus({
                isConverting: false,
                progress: 100,
                message: 'PPTX file generated!'
              });

              setTimeout(() => {
                setStatus(prev => ({
                  ...prev,
                  progress: 0,
                  message: 'Ready'
                }));
              }, 3000);
            })
            .catch(error => {
              setStatus({
                isConverting: false,
                progress: 0,
                error: error.message,
                message: `Error: ${error.message}`
              });
            });
        }
        break;

      case 'error':
        setStatus(prev => ({
          ...prev,
          isConverting: false,
          error: payload?.message,
          message: `Error: ${payload?.message}`
        }));
        break;
    }
  }, []);

  React.useEffect(() => {
    window.addEventListener('message', handlePluginMessage);
    parent.postMessage({ pluginMessage: { type: 'request-frame-data' } }, '*');

    return () => {
      window.removeEventListener('message', handlePluginMessage);
    };
  }, [handlePluginMessage]);

  const handleConvert = React.useCallback(() => {
    if (frames.length === 0) return;

    setStatus({
      isConverting: true,
      progress: 0,
      message: 'Starting conversion...'
    });

    parent.postMessage({
      pluginMessage: {
        type: 'start-conversion',
        payload: { frames }
      }
    }, '*');
  }, [frames]);

  return (
    <div className="plugin-container">
      <Navigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {activeTab === 'converter' && (
        <>
          <FrameList 
            frames={frames}
            isConverting={status.isConverting}
          />
          <ProgressBar progress={status.progress} />
          <StatusBar 
            message={status.message}
            error={status.error}
          />
          <button
            className="convert-button"
            onClick={handleConvert}
            disabled={status.isConverting || frames.length === 0}
          >
            {status.isConverting ? 'Converting...' : 'Convert Selected Frames'}
          </button>
        </>
      )}

      {activeTab === 'settings' && (
        <div className="settings-container">
          <h2>Settings</h2>
          <p>Settings options coming soon...</p>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="about-container">
          <h2>About</h2>
          <p>Figma to PowerPoint Converter</p>
          <p>Version 1.0.0</p>
        </div>
      )}
    </div>
  );
};