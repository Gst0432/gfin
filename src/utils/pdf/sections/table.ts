import { PDFContext } from '../types';
import { formatAmount } from '../formatters';

export const drawTable = (ctx: PDFContext): number => {
  const { doc, colors, options } = ctx;

  try {
    // En-tête du tableau
    const headers = [
      { header: 'Description', dataKey: 'description' },
      { header: 'Quantité', dataKey: 'quantity' },
      { header: 'Prix unitaire', dataKey: 'unitPrice' },
      { header: 'Total', dataKey: 'total' }
    ];

    // Données du tableau
    const tableData = [{
      description: options.transaction.description || 'Vente',
      quantity: '1',
      unitPrice: `${formatAmount(options.transaction.amount)} FCFA`,
      total: `${formatAmount(options.transaction.amount)} FCFA`
    }];

    // Configuration du style du tableau
    (doc as any).autoTable({
      startY: ctx.yPos + 10,
      head: [headers.map(h => h.header)],
      body: tableData.map(row => [
        row.description,
        { content: row.quantity, styles: { halign: 'center' } },
        { content: row.unitPrice, styles: { halign: 'center' } },
        { content: row.total, styles: { halign: 'center' } }
      ]),
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 8,
        lineColor: [220, 220, 220],
        lineWidth: 0.5,
        font: 'helvetica',
        textColor: [60, 60, 60],
        valign: 'middle'
      },
      headStyles: {
        fillColor: [...colors.primary],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 30 },
        2: { cellWidth: 50 },
        3: { cellWidth: 50 }
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250]
      },
      foot: [[
        { content: 'Total', colSpan: 3, styles: { halign: 'right', fontStyle: 'bold' } },
        { 
          content: `${formatAmount(options.transaction.amount)} FCFA`, 
          styles: { 
            halign: 'center', 
            fontStyle: 'bold',
            fontSize: 12,
            textColor: [...colors.primary]
          } 
        }
      ]],
      footStyles: {
        fillColor: [245, 245, 245]
      }
    });

    // Récupérer la position Y après le tableau
    const finalY = (doc as any).lastAutoTable.finalY;

    // Ajouter les informations de paiement
    doc.setFontSize(10);
    doc.setTextColor(...colors.secondary);
    
    let yPos = finalY + 20;
    
    // Mode de paiement
    doc.setFont('helvetica', 'bold');
    doc.text('Mode de paiement:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(options.transaction.paymentMethod || 'Non spécifié', 100, yPos);
    
    yPos += 10;

    // Statut
    doc.setFont('helvetica', 'bold');
    doc.text('Statut:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text('PAYÉ', 100, yPos);

    // Notes
    yPos += 20;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Merci de votre confiance !', doc.internal.pageSize.width / 2, yPos, { align: 'center' });

    return yPos + 10;
  } catch (error) {
    console.error('Error drawing table:', error);
    throw new Error('Erreur lors de la génération du tableau');
  }
};