// src/app/utils/pptxGenerator.ts

import pptxgen from 'pptxgenjs';
import { FrameData } from '../../typings/types';

export const generatePowerPoint = async (frames: FrameData[]): Promise<Blob> => {
  const pptx = new pptxgen();

  // Set default slide size to 16:9
  pptx.layout = 'LAYOUT_16x9';

  for (const frame of frames) {
    const slide = pptx.addSlide();

    // Add text elements
    for (const textElement of frame.textElements) {
      slide.addText(textElement.content, {
        x: `${(textElement.x / frame.width) * 100}%`,
        y: `${(textElement.y / frame.height) * 100}%`,
        w: `${(textElement.width / frame.width) * 100}%`,
        h: `${(textElement.height / frame.height) * 100}%`,
        fontSize: textElement.fontSize,
        color: textElement.fontColor,
        fontFace: textElement.fontName,
        align: textElement.vertical ? 'center' : textElement.textAlign as any
      });
    }

    // Add image elements
    for (const imageElement of frame.imageElements) {
      slide.addImage({
        data: imageElement.base64Data,
        x: `${(imageElement.x / frame.width) * 100}%`,
        y: `${(imageElement.y / frame.height) * 100}%`,
        w: `${(imageElement.width / frame.width) * 100}%`,
        h: `${(imageElement.height / frame.height) * 100}%`,
        sizing: {
          type: imageElement.sizing || 'contain',
          w: '100%',
          h: '100%'
        }
      });
    }

    // Add frame as background if no elements
    if (frame.textElements.length === 0 && frame.imageElements.length === 0) {
      slide.addImage({
        data: frame.thumbnail,
        x: '0%',
        y: '0%',
        w: '100%',
        h: '100%',
        sizing: {
          type: 'contain',
          w: '100%',
          h: '100%'
        }
      });
    }
  }

  // Convert to Blob
  const buffer = await pptx.write({ outputType: 'blob' });
  return new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  });
};