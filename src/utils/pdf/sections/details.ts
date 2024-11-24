import { PDFContext } from '../types';
import { formatAmount, getPaymentMethodLabel } from '../formatters';

export const drawDetails = (ctx: PDFContext): number => {
  const { doc, colors, options, yPos: startY } = ctx;
  let yPos = startY;

  try {
    // Company info
    doc.setTextColor(...colors.secondary);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    
    if (options.companyInfo?.name) {
      doc.text('ÉMETTEUR', 20, yPos);
      yPos += 8;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(options.companyInfo.name, 20, yPos);
      yPos += 6;
      
      if (options.companyInfo.address) {
        doc.text(options.companyInfo.address, 20, yPos);
        yPos += 6;
      }
      if (options.companyInfo.phone) {
        doc.text(`Tél: ${options.companyInfo.phone}`, 20, yPos);
        yPos += 6;
      }
      if (options.companyInfo.email) {
        doc.text(`Email: ${options.companyInfo.email}`, 20, yPos);
        yPos += 6;
      }
    }

    // Customer info
    yPos = startY;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENT', 120, yPos);
    yPos += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    if (options.transaction.buyerDetails?.name) {
      doc.text(options.transaction.buyerDetails.name, 120, yPos);
      yPos += 6;
    }
    if (options.transaction.buyerDetails?.email) {
      doc.text(options.transaction.buyerDetails.email, 120, yPos);
      yPos += 6;
    }
    if (options.transaction.buyerDetails?.phone) {
      doc.text(options.transaction.buyerDetails.phone, 120, yPos);
      yPos += 6;
    }

    // Transaction details
    yPos += 10;
    doc.setFillColor(...colors.lightGray);
    doc.rect(20, yPos, doc.internal.pageSize.width - 40, 20, 'F');
    yPos += 5;
    
    // Date
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', 30, yPos + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(options.transaction.date).toLocaleDateString('fr-FR'), 55, yPos + 7);
    
    // Payment method
    doc.setFont('helvetica', 'bold');
    doc.text('Mode de paiement:', 120, yPos + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(getPaymentMethodLabel(options.transaction.paymentMethod), 170, yPos + 7);

    return yPos + 20;
  } catch (error) {
    console.error('Error drawing details:', error);
    throw new Error('Erreur lors de la génération des détails');
  }
};