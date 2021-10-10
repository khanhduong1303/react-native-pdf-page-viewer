import { NativeModules } from 'react-native';

export type PageDim = { height: number; width: number };

type PdfUtilType = {
  /**
   * Get the number of pages of a pdf.
   */
  getPageCount(source: string): Promise<number>;

  /**
   * Get the dimensions of every page.
   */
  getPageSizes(source: string): Promise<PageDim[]>;

  /**
   * Get base 64 image for a page.
   */

  getBase64Image(source: string, page: number): Promise<string>;

  /**
   * Get the isLocked of a pdf.
   */
   isLocked(source: string): Promise<boolean>;
};

/**
 * Utility pdf actions.
 */
export const PdfUtil: PdfUtilType = NativeModules.RNPdfUtil;
