// src/app/components/FrameList.tsx

import * as React from 'react';
import { FrameData } from '../../typings/types';

interface FrameListProps {
  frames: FrameData[];
  isConverting: boolean;
}

export const FrameList: React.FC<FrameListProps> = ({ frames, isConverting }) => {
  return (
    <div className={`frame-list ${isConverting ? 'converting' : ''}`}>
      {frames.length === 0 ? (
        <div className="no-frames">
          <p>Select frames to convert</p>
        </div>
      ) : (
        frames.map(frame => (
          <div key={frame.id} className="frame-item">
            <img 
              src={frame.thumbnail} 
              alt={frame.name} 
              className="frame-thumbnail"
            />
            <div className="frame-info">
              <h3>{frame.name}</h3>
              <p>{`${frame.width} x ${frame.height}`}</p>
              <p>{`${frame.textElements.length} text elements`}</p>
              <p>{`${frame.imageElements.length} image elements`}</p>
              {Math.abs(frame.aspectRatio - 16/9) > 0.01 && (
                <div className="aspect-ratio-warning" title="This frame's aspect ratio differs from the standard 16:9 PowerPoint slide ratio">
                  ⚠️ Non-standard aspect ratio
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};