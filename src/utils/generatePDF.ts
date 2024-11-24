import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Transaction } from '../types';
import { drawHeader } from './pdf/sections/header';
import { drawTable } from './pdf/sections/table';
import { drawFooter } from './pdf/sections/footer';
import { PDFContext, PDFColors } from './pdf/types';

interface GeneratePDFOptions {
  type: 'receipt' | 'invoice' | 'sale';
  transaction: Transaction;
  companyInfo?: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    logo?: string;
  };
  isPremium?: boolean;
}

export async function generatePDF({ type, transaction, companyInfo, isPremium = false }: GeneratePDFOptions): Promise<void> {
  try {
    // Créer un nouveau document PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Configuration des couleurs
    const colors: PDFColors = {
      primary: [102, 103, 171],
      secondary: [60, 60, 60],
      lightGray: [220, 220, 220]
    };

    // Contexte PDF partagé
    const ctx: PDFContext = {
      doc,
      colors,
      yPos: 0,
      options: { type, transaction, companyInfo, isPremium }
    };

    // Dessiner l'en-tête
    ctx.yPos = await drawHeader(ctx);

    // Dessiner le tableau
    ctx.yPos = drawTable(ctx);

    // Dessiner le pied de page
    drawFooter(ctx);

    // Sauvegarder le PDF
    const fileName = `${type}_${transaction.id.slice(0, 8)}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Erreur lors de la génération du document');
  }
}