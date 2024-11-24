import { jsPDF } from 'jspdf';
import { Transaction } from '../../types';

export interface GeneratePDFOptions {
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

export interface PDFColors {
  primary: [number, number, number];
  secondary: [number, number, number];
  lightGray: [number, number, number];
}

export interface PDFContext {
  doc: jsPDF;
  colors: PDFColors;
  yPos: number;
  options: GeneratePDFOptions;
}