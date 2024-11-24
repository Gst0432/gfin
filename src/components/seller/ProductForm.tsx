import React from 'react';
import { Product } from '../../types';

interface ProductFormProps {
  onSubmit: (productData: Omit<Product, 'id' | 'sellerId'>) => void;
  initialData?: Product | null;
}

export default function ProductForm({ onSubmit, initialData }: ProductFormProps) {
  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    purchasePrice: initialData?.purchasePrice || 0,
    sellingPrice: initialData?.sellingPrice || 0,
    createdAt: initialData?.createdAt || new Date().toISOString(),
    updatedAt: initialData?.updatedAt || new Date().toISOString()
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      setFormData({
        name: '',
        purchasePrice: 0,
        sellingPrice: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  };

  const margin = formData.sellingPrice - formData.purchasePrice;
  const marginPercentage = formData.purchasePrice > 0 
    ? ((margin / formData.purchasePrice) * 100).toFixed(2)
    : '0';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom du produit
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prix d'achat (FCFA)
          </label>
          <input
            type="number"
            value={formData.purchasePrice}
            onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: Number(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prix de vente (FCFA)
          </label>
          <input
            type="number"
            value={formData.sellingPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, sellingPrice: Number(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Marge bénéficiaire
          </label>
          <div className="mt-1 flex items-center space-x-2">
            <div className="flex-1 px-3 py-2 bg-gray-100 rounded-md">
              <span className="text-gray-900 font-medium">{margin.toLocaleString()} FCFA</span>
            </div>
            <div className="px-3 py-2 bg-gray-100 rounded-md">
              <span className="text-gray-900 font-medium">{marginPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {initialData ? 'Mettre à jour' : 'Ajouter le produit'}
        </button>
      </div>
    </form>
  );
}