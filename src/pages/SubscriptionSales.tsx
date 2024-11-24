import React from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, CreditCard, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SubscriptionSales = () => {
  const navigate = useNavigate();
  const { subscriptionSales = [], addSubscriptionSale, user } = useStore();
  const [showNewSaleForm, setShowNewSaleForm] = React.useState(false);
  const [newSale, setNewSale] = React.useState({
    serviceName: '',
    duration: 1,
    amount: 0,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });

  const handleSubscriptionClick = () => {
    if (!user?.isPremium) {
      toast.error('Cette fonctionnalité est réservée aux utilisateurs premium');
      navigate('/subscriptions');
      return;
    }
    setShowNewSaleForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.isPremium) {
      toast.error('Cette fonctionnalité est réservée aux utilisateurs premium');
      navigate('/subscriptions');
      return;
    }

    try {
      const sale = {
        id: crypto.randomUUID(),
        ...newSale,
        sellerId: user?.id || '',
        purchaseDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + newSale.duration * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active' as const
      };
      
      addSubscriptionSale(sale);
      setShowNewSaleForm(false);
      setNewSale({
        serviceName: '',
        duration: 1,
        amount: 0,
        customerName: '',
        customerEmail: '',
        customerPhone: '',
      });
      toast.success('Vente d\'abonnement enregistrée');
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement de la vente');
    }
  };

  const userSubscriptionSales = subscriptionSales.filter(sale => sale.sellerId === user?.id);
  const totalRevenue = userSubscriptionSales.reduce((sum, sale) => sum + sale.amount, 0);
  const activeSubscriptions = userSubscriptionSales.filter(
    sale => new Date(sale.expiryDate) > new Date()
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Ventes d'Abonnements</h2>
            <p className="text-sm text-gray-500">
              Gérez vos ventes d'abonnements et suivez leur statut
            </p>
          </div>
          <button
            onClick={handleSubscriptionClick}
            className={`flex items-center gap-2 ${
              user?.isPremium 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                : 'bg-gray-400 cursor-not-allowed'
            } text-white px-4 py-2 rounded-md transition-colors`}
          >
            <Plus className="h-5 w-5" />
            <span>Nouvelle Vente</span>
            <Crown className="h-4 w-4 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-600">Revenus Totaux</p>
            <p className="text-2xl font-bold text-blue-900">
              {totalRevenue.toLocaleString()} FCFA
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-green-600">Abonnements Actifs</p>
            <p className="text-2xl font-bold text-green-900">
              {activeSubscriptions.length}
            </p>
          </div>
        </div>

        {!user?.isPremium && (
          <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6">
            <div className="flex items-center">
              <Crown className="h-5 w-5 text-purple-500 mr-2" />
              <p className="text-sm text-purple-700">
                Passez à la version Premium pour accéder aux fonctionnalités de vente d'abonnements.{' '}
                <button
                  onClick={() => navigate('/subscriptions')}
                  className="font-medium underline hover:text-purple-900"
                >
                  Découvrir les avantages Premium
                </button>
              </p>
            </div>
          </div>
        )}

        {showNewSaleForm && user?.isPremium && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Enregistrer une vente d'abonnement
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom du service
                  </label>
                  <input
                    type="text"
                    value={newSale.serviceName}
                    onChange={(e) => setNewSale(prev => ({ ...prev, serviceName: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Durée (mois)
                  </label>
                  <input
                    type="number"
                    value={newSale.duration}
                    onChange={(e) => setNewSale(prev => ({ ...prev, duration: Number(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Montant (FCFA)
                  </label>
                  <input
                    type="number"
                    value={newSale.amount}
                    onChange={(e) => setNewSale(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom du client
                  </label>
                  <input
                    type="text"
                    value={newSale.customerName}
                    onChange={(e) => setNewSale(prev => ({ ...prev, customerName: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email du client
                  </label>
                  <input
                    type="email"
                    value={newSale.customerEmail}
                    onChange={(e) => setNewSale(prev => ({ ...prev, customerEmail: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Téléphone du client
                  </label>
                  <input
                    type="tel"
                    value={newSale.customerPhone}
                    onChange={(e) => setNewSale(prev => ({ ...prev, customerPhone: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowNewSaleForm(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
                const isExpired = new Date(sale.expiryDate) <= new Date();
                return (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                        {sale.serviceName}
                      </div>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
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
                    Aucune vente d'abonnement enregistrée
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

export default SubscriptionSales;