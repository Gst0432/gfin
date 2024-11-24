import { PDFContext } from '../types';

interface GState {
  opacity: number;
}

interface ExtendedJsPDF extends PDFContext['doc'] {
  GState?: (state: GState) => any;
}

export const drawWatermark = (ctx: PDFContext): void => {
  const { doc, options } = ctx;
  const extendedDoc = doc as ExtendedJsPDF;
  
  if (!options.isPremium && extendedDoc.GState) {
    try {
      // Save current state
      doc.saveGraphicsState();
      
      // Set watermark properties
      doc.setGState(new extendedDoc.GState({ opacity: 0.1 }));
      doc.setTextColor(128, 128, 128);
      doc.setFontSize(40);
      doc.setFont('helvetica', 'bold');
      
      // Calculate center position
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const centerX = pageWidth / 2;
      const centerY = pageHeight / 2;
      
      // Draw rotated watermark
      doc.saveGraphicsState();
      doc.text('G-FINANCE', centerX, centerY, { 
        align: 'center',
        angle: 45
      });
      doc.restoreGraphicsState();
      
      // Restore original state
      doc.restoreGraphicsState();
    } catch (error) {
      console.warn('Watermark drawing failed:', error);
    }
  }
};