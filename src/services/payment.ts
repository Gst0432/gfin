import { loadScript } from '../utils/script-loader';

interface PaiementProConfig {
  amount: number;
  description: string;
  channel: string;
  referenceNumber: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastname: string;
  customerPhoneNumber: string;
  notificationURL?: string;
  returnURL?: string;
  returnContext?: string;
}

export class PaymentService {
  private static instance: PaymentService;
  private merchantId: string = '';
  private initialized: boolean = false;
  private baseURL: string = window.location.origin;
  private readonly PAYMENT_URL = 'https://vente.paiementpro.net/g-startup/1936';

  private constructor() {}

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async initialize(merchantId: string): Promise<void> {
    if (!merchantId) {
      throw new Error('ID marchand non valide');
    }

    if (!this.initialized) {
      this.initialized = true;
    }
    
    this.merchantId = merchantId;
  }

  async processPayment(config: PaiementProConfig): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      if (!this.merchantId) {
        throw new Error('ID marchand non configuré');
      }

      if (!this.initialized) {
        throw new Error('Le service de paiement n\'est pas initialisé');
      }

      // Rediriger directement vers l'URL de paiement
      return {
        success: true,
        url: this.PAYMENT_URL
      };
      
    } catch (error) {
      console.error('Erreur de paiement:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue lors du paiement'
      };
    }
  }
}