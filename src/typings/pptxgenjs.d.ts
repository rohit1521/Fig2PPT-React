declare module 'pptxgenjs' {
  export default class PptxGenJS {
    layout: string;
    addSlide(): Slide;
    write(options: { outputType: string }): Promise<ArrayBuffer>;
  }

  export class Slide {
    addText(text: string, options: TextOptions): void;
    addImage(options: ImageOptions): void;
  }

  export interface TextOptions {
    x: string;
    y: string;
    w: string;
    h: string;
    fontSize: number;
    color: string;
    fontFace: string;
    align: string;
  }

  export interface ImageOptions {
    data: string;
    x: string;
    y: string;
    w: string;
    h: string;
    sizing?: { type: string; w: string; h: string };
  }
}
