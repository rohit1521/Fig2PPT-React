// src/plugin/controller.ts

import { FrameData, TextElement, ImageElement } from '../typings/types';

figma.showUI(__html__, {
  width: 450,
  height: 600,
  themeColors: true
});

const extractTextElements = (frame: FrameNode): TextElement[] => {
  const textNodes: TextElement[] = [];
  
  frame.findAll(node => node.type === 'TEXT').forEach((node, index) => {
    const textNode = node as TextNode;
    const fills = textNode.fills as Paint[];
    const fill = fills && fills.length > 0 ? fills[0] : null;
    const color = fill && fill.type === 'SOLID' ? fill.color : { r: 0, g: 0, b: 0 };
    
    textNodes.push({
      id: node.id,
      content: textNode.characters,
      fontSize: typeof textNode.fontSize === 'number' ? textNode.fontSize : 12,
      fontColor: `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`,
      fontName: typeof textNode.fontName === 'symbol' ? 'Arial' : textNode.fontName.family,
      fontWeight: typeof textNode.fontWeight === 'number' ? textNode.fontWeight : 400,
      textAlign: textNode.textAlignHorizontal,
      x: textNode.x,
      y: textNode.y,
      width: textNode.width,
      height: textNode.height,
      zIndex: index,
      vertical: textNode.textAlignVertical === 'CENTER'
    });
  });

  return textNodes;
};

const hasImageFill = (node: SceneNode): boolean => {
  if ('fills' in node) {
    const fills = node.fills;
    if (Array.isArray(fills)) {
      return fills.some(fill => fill.type === 'IMAGE');
    }
  }
  return false;
};

const extractImageElements = async (frame: FrameNode): Promise<ImageElement[]> => {
  const imageNodes: ImageElement[] = [];
  let zIndex = 0;

  for (const node of frame.findAll(node => 
    node.type === 'RECTANGLE' && hasImageFill(node)
  )) {
    try {
      const imageNode = node as RectangleNode;
      const bytes = await imageNode.exportAsync({
        format: 'PNG',
        constraint: { type: 'SCALE', value: 2 }
      });
      
      imageNodes.push({
        id: node.id,
        base64Data: `data:image/png;base64,${figma.base64Encode(bytes)}`,
        x: imageNode.x,
        y: imageNode.y,
        width: imageNode.width,
        height: imageNode.height,
        zIndex: zIndex++,
        opacity: imageNode.opacity,
        cornerRadius: 'cornerRadius' in imageNode ? imageNode.cornerRadius as number : 0
      });
    } catch (error) {
      console.error(`Failed to process image node: ${node.id}`, error);
    }
  }

  return imageNodes;
};

const processFrame = async (frame: FrameNode): Promise<FrameData> => {
  const bytes = await frame.exportAsync({
    format: 'PNG',
    constraint: { type: 'SCALE', value: 2 }
  });

  const textElements = extractTextElements(frame);
  const imageElements = await extractImageElements(frame);

  return {
    id: frame.id,
    name: frame.name,
    width: frame.width,
    height: frame.height,
    textElements,
    imageElements,
    thumbnail: `data:image/png;base64,${figma.base64Encode(bytes)}`,
    aspectRatio: frame.width / frame.height
  };
};

// Handle selection changes
figma.on('selectionchange', async () => {
  try {
    const selectedFrames = figma.currentPage.selection
      .filter(node => node.type === 'FRAME');

    const frameData = await Promise.all(
      selectedFrames.map(frame => processFrame(frame as FrameNode))
    );

    figma.ui.postMessage({
      type: 'update-frames',
      payload: { frames: frameData }
    });
  } catch (error) {
    console.error('Error processing frames:', error);
    figma.ui.postMessage({
      type: 'error',
      payload: { message: 'Failed to process selected frames' }
    });
  }
});

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'request-frame-data':
      try {
        const selectedFrames = figma.currentPage.selection
          .filter(node => node.type === 'FRAME');

        const frameData = await Promise.all(
          selectedFrames.map(frame => processFrame(frame as FrameNode))
        );

        figma.ui.postMessage({
          type: 'update-frames',
          payload: { frames: frameData }
        });
      } catch (error) {
        figma.ui.postMessage({
          type: 'error',
          payload: { message: 'Failed to process selected frames' }
        });
      }
      break;

    case 'start-conversion':
      try {
        const { frames } = msg.payload;
        
        // Process each frame
        for (let i = 0; i < frames.length; i++) {
          figma.ui.postMessage({
            type: 'update-progress',
            payload: { progress: Math.round(((i + 1) / frames.length) * 100) }
          });
        }

        figma.ui.postMessage({
          type: 'conversion-complete',
          payload: { frames }
        });

      } catch (error) {
        figma.ui.postMessage({
          type: 'error',
          payload: { 
            message: error instanceof Error ? error.message : 'Unknown error occurred'
          }
        });
      }
      break;
  }
};