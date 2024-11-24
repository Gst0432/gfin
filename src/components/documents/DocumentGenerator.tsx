import React from 'react';
import { Download } from 'lucide-react';
import { Transaction } from '../../types';
import { generatePDF } from '../../utils/generatePDF';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

interface DocumentGeneratorProps {
  transaction: Transaction;
}

export default function DocumentGenerator({ transaction }: DocumentGeneratorProps) {
  const { user } = useStore();
  const [loading, setLoading] = React.useState(false);

  const handleGenerateDocument = async (type: 'receipt' | 'invoice' | 'sale') => {
    if (loading) return;
    
    try {
      setLoading(true);
      
      // Validate transaction data
      if (!transaction || !transaction.amount) {
        throw new Error('Données de transaction invalides');
      }

      // Get company info from user settings
      const companyInfo = user?.companyInfo ? {
        name: user.companyInfo.name || '',
        address: user.companyInfo.address || '',
        phone: user.companyInfo.phone || '',
        email: user.companyInfo.email || '',
        logo: user.companyInfo.logo || ''
      } : undefined;

      await generatePDF({
        type,
        transaction,
        companyInfo,
        isPremium: user?.isPremium || false
      });

      toast.success('Document généré avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du document:', error);
      toast.error('Erreur lors de la génération du document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleGenerateDocument('receipt')}
        disabled={loading}
        className="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Générer un reçu"
      >
        <Download className={`h-4 w-4 ${loading ? 'animate-pulse' : ''}`} />
      </button>
      <div className="relative group">
        <button
          disabled={loading}
          className="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          •••
        </button>
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
          <div className="py-1">
            <button
              onClick={() => handleGenerateDocument('invoice')}
              disabled={loading}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Générer une facture
            </button>
            <button
              onClick={() => handleGenerateDocument('sale')}
              disabled={loading}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Générer un bon de vente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}