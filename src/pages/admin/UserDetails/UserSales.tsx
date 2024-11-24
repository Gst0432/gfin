import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DocumentGenerator from '../../../components/documents/DocumentGenerator';

const UserSales = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { users, transactions } = useStore();
  
  const user = users.find(u => u.id === userId);
  const userSales = transactions.filter(t => t.sellerId === userId && t.type === 'sale');

  const totalSales = userSales.reduce((sum, t) => sum + t.amount, 0);

  if (!user) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Utilisateur non trouvé</h3>
              <div className="mt-2">
                <button
                  onClick={() => navigate('/admin/users')}
                  className="text-sm font-medium text-red-800 hover:text-red-900"
                >
                  Retour à la liste des utilisateurs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(`/admin/users/${userId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Retour
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          Ventes de {user.name}
        </h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Historique des ventes</h2>
            <p className="text-sm text-gray-500">
              Total des ventes : {totalSales.toLocaleString()} FCFA
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mode de paiement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {userSales.map((sale) => (
                <tr key={sale.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(sale.date), 'dd MMMM yyyy', { locale: fr })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sale.buyerDetails?.name}</div>
                    <div className="text-xs text-gray-500">{sale.buyerDetails?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {sale.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.amount.toLocaleString()} FCFA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sale.paymentMethod === 'cash' && 'Espèces'}
                    {sale.paymentMethod === 'mobile' && 'Mobile Money'}
                    {sale.paymentMethod === 'card' && 'Carte bancaire'}
                    {sale.paymentMethod === 'transfer' && 'Virement bancaire'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <DocumentGenerator transaction={sale} />
                  </td>
                </tr>
              ))}
              {userSales.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Aucune vente enregistrée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserSales;