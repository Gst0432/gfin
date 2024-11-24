import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const UserSubscriptionSales = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { subscriptionSales = [], users } = useStore();
  
  const user = users.find(u => u.id === userId);
  const userSubscriptionSales = subscriptionSales.filter(s => s.sellerId === userId) || [];

  // Filtrer les abonnements actifs et expirés
  const now = new Date();
  const activeSubscriptions = userSubscriptionSales.filter(
    sale => new Date(sale.expiryDate) > now
  );
  const expiredSubscriptions = userSubscriptionSales.filter(
    sale => new Date(sale.expiryDate) <= now
  );

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
          onClick={() => navigate('/admin/users')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Retour
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          Ventes d'abonnements de {user.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Abonnements actifs</h3>
          <p className="text-3xl font-bold text-green-600">
            {activeSubscriptions.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Abonnements expirés</h3>
          <p className="text-3xl font-bold text-red-600">
            {expiredSubscriptions.length}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Tous les abonnements vendus</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'achat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {userSubscriptionSales.map((sale) => {
                const isExpired = new Date(sale.expiryDate) <= now;
                return (
                  <tr key={sale.id} className={isExpired ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.serviceName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <p>{sale.customerPhone}</p>
                        <p className="text-xs text-gray-500">{sale.customerEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.duration} mois
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(sale.purchaseDate), 'dd MMMM yyyy', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(sale.expiryDate), 'dd MMMM yyyy', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.amount.toLocaleString()} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isExpired
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {isExpired ? 'Expiré' : 'Actif'}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {userSubscriptionSales.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Aucun abonnement vendu
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

export default UserSubscriptionSales;