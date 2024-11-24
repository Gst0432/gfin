import { PDFContext } from '../types';

export const drawHeader = async (ctx: PDFContext): Promise<number> => {
  const { doc, colors, options } = ctx;
  let yPos = 20;

  try {
    // En-tête avec dégradé
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, doc.internal.pageSize.width, 70, 'F');

    // Logo de l'entreprise (si disponible)
    if (options.companyInfo?.logo) {
      try {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            try {
              doc.addImage(img, 'PNG', 20, 15, 40, 40);
              resolve();
            } catch (e) {
              reject(e);
            }
          };
          img.onerror = reject;
          img.src = options.companyInfo.logo;
        });
      } catch (error) {
        console.warn('Logo loading failed:', error);
      }
    }

    // Informations de l'entreprise
    const startX = options.companyInfo?.logo ? 70 : 20;

    // Nom de l'entreprise
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(options.companyInfo?.name || 'Entreprise', startX, 30);

    // Adresse et coordonnées
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    if (options.companyInfo?.address) {
      doc.text(options.companyInfo.address, startX, 40);
    }

    if (options.companyInfo?.phone) {
      doc.text(`Tél: ${options.companyInfo.phone}`, startX, 48);
    }

    if (options.companyInfo?.email) {
      doc.text(`Email: ${options.companyInfo.email}`, startX, 56);
    }

    // Type de document et numéro
    doc.setFontSize(30);
    doc.setFont('helvetica', 'bold');
    const docType = options.type === 'receipt' ? 'REÇU' :
                   options.type === 'invoice' ? 'FACTURE' : 'BON DE VENTE';
    doc.text(
      docType,
      doc.internal.pageSize.width - 25,
      35,
      { align: 'right' }
    );

    // Numéro de document
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `N° ${options.transaction.id.slice(0, 8).toUpperCase()}`,
      doc.internal.pageSize.width - 25,
      45,
      { align: 'right' }
    );

    // Date
    const date = new Date(options.transaction.date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    doc.text(
      `Date: ${date}`,
      doc.internal.pageSize.width - 25,
      53,
      { align: 'right' }
    );

    yPos = 90;

    // Informations client
    doc.setTextColor(...colors.secondary);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENT', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    if (options.transaction.buyerDetails?.name) {
      doc.text(options.transaction.buyerDetails.name, 20, yPos);
      yPos += 6;
    }
    if (options.transaction.buyerDetails?.email) {
      doc.text(`Email: ${options.transaction.buyerDetails.email}`, 20, yPos);
      yPos += 6;
    }
    if (options.transaction.buyerDetails?.phone) {
      doc.text(`Tél: ${options.transaction.buyerDetails.phone}`, 20, yPos);
      yPos += 6;
    }

    // Ligne de séparation
    yPos += 10;
    doc.setDrawColor(...colors.lightGray);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, doc.internal.pageSize.width - 20, yPos);

    return yPos + 10;
  } catch (error) {
    console.error('Error drawing header:', error);
    throw new Error('Erreur lors de la génération de l\'en-tête');
  }
};