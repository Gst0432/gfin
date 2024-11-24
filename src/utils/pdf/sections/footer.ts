import { PDFContext } from '../types';

export const drawFooter = (ctx: PDFContext): void => {
  const { doc, colors, options } = ctx;

  try {
    const pageHeight = doc.internal.pageSize.height;
    const footerHeight = 40;
    const footerY = pageHeight - footerHeight;

    // Fond du pied de page
    doc.setFillColor(...colors.primary);
    doc.rect(0, footerY, doc.internal.pageSize.width, footerHeight, 'F');

    // Texte du pied de page
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    // Informations de l'entreprise
    if (options.companyInfo) {
      const footerText = [
        options.companyInfo.name,
        options.companyInfo.address,
        `${options.companyInfo.phone} | ${options.companyInfo.email}`
      ].filter(Boolean).join(' | ');

      doc.text(footerText, doc.internal.pageSize.width / 2, footerY + 15, {
        align: 'center'
      });
    }

    // Numéro de document et date
    const docInfo = `Document N° ${options.transaction.id.slice(0, 8).toUpperCase()} | Généré le ${new Date().toLocaleDateString('fr-FR')}`;
    doc.text(docInfo, doc.internal.pageSize.width / 2, footerY + 25, {
      align: 'center'
    });

    // QR Code (si nécessaire)
    if (!options.isPremium) {
      doc.setFontSize(7);
      doc.text('Document généré par G-Finance', doc.internal.pageSize.width / 2, footerY + 33, {
        align: 'center'
      });
    }
  } catch (error) {
    console.error('Error drawing footer:', error);
    throw new Error('Erreur lors de la génération du pied de page');
  }
};