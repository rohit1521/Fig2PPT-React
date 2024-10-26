// src/typings/types.d.ts

export type TabType = 'converter' | 'settings' | 'about';

export interface ConversionStatus {
  isConverting: boolean;
  progress: number;
  message: string;
  error?: string;
}

export interface TextElement {
  id: string;
  content: string;
  fontSize: number;
  fontColor: string;
  fontName: string;
  fontWeight: number;
  textAlign: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
  italic?: boolean;
  underline?: boolean;
  letterSpacing?: number;
  lineHeight?: number;
  opacity?: number;
  rotation?: number;
  vertical?: boolean;
}

export interface ImageElement {
  id: string;
  base64Data: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
  rotation?: number;
  opacity?: number;
  cornerRadius?: number;
  shadow?: boolean;
  sizing?: 'contain' | 'cover' | 'crop';
}

export interface FrameData {
  id: string;
  name: string;
  width: number;
  height: number;
  textElements: TextElement[];
  imageElements: ImageElement[];
  thumbnail: string;
  aspectRatio: number;
  backgroundColor?: string;
  notes?: string;
}

export interface PluginMessage {
  type: string;
  payload?: {
    frames?: FrameData[];
    progress?: number;
    message?: string;
  };
}