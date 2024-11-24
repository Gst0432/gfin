import React from 'react';
import { Service } from '../../types';

interface ServiceFormProps {
  onSubmit: (serviceData: Omit<Service, 'id' | 'sellerId'>) => void;
  initialData?: Service | null;
}

export default function ServiceForm({ onSubmit, initialData }: ServiceFormProps) {
  const [formData, setFormData] = React.useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    expiryDate: initialData?.expiryDate || format(addMonths(new Date(), 1), 'yyyy-MM-dd')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      setFormData({
        title: '',
        description: '',
        price: 0,
        expiryDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd')
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Titre du service
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prix (FCFA)
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date d'expiration
          </label>
          <input
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            min={format(new Date(), 'yyyy-MM-dd')}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {initialData ? 'Mettre à jour' : 'Ajouter le service'}
        </button>
      </div>
    </form>
  );
}

// Fonction utilitaire pour formater les dates
function format(date: Date, format: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return format.replace('yyyy', year.toString())
               .replace('MM', month)
               .replace('dd', day);
}

// Fonction utilitaire pour ajouter des mois à une date
function addMonths(date: Date, months: number): Date {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
}