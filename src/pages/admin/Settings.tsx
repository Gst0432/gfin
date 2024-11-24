import React from 'react';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const { merchantId, setMerchantId } = useStore();
  const [newMerchantId, setNewMerchantId] = React.useState(merchantId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setMerchantId(newMerchantId);
      toast.success('ID marchand mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de l\'ID marchand');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuration du Paiement</h2>
        
        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID Marchand PaiementPro
            </label>
            <input
              type="text"
              value={newMerchantId}
              onChange={(e) => setNewMerchantId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre ID marchand"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Mettre à jour
          </button>
        </form>
      </div>
    </div>
  );
}