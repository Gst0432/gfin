import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatAmount = (amount: number | undefined): string => {
  if (typeof amount !== 'number') return '0';
  return amount.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true
  }).replace(/\s/g, '.'); // Remplace les espaces par des points
};

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
};

export const getPaymentMethodLabel = (method: string = 'cash'): string => {
  const methods: { [key: string]: string } = {
    cash: 'Espèces',
    mobile: 'Mobile Money',
    card: 'Carte bancaire',
    transfer: 'Virement bancaire',
    crypto: 'Cryptomonnaie',
    money_transfer: 'Transfert d\'argent'
  };
  return methods[method] || method;
};