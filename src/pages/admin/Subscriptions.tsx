import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Calendar, Plus, Users } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { format, addMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

const Subscriptions = () => {
  const navigate = useNavigate();
  const { users, transactions, updateUser } = useStore();
  const [showActivationModal, setShowActivationModal] = React.useState(false);
  const [activationForm, setActivationForm] = React.useState({
    email: '',
    duration: 1
  });

  const premiumUsers = users.filter(user => user.isPremium);
  const activeSubscriptions = premiumUsers.filter(
    user => user.premiumExpiryDate && new Date(user.premiumExpiryDate) > new Date()
  );
  const expiringSubscriptions = activeSubscriptions.filter(
    user => {
      const expiryDate = new Date(user.premiumExpiryDate!);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return expiryDate <= thirtyDaysFromNow;
    }
  );

  const totalRevenue = transactions
    .filter(t => t.type === 'premium')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleToggleAutoRenew = async (userId: string, currentValue: boolean) => {
    try {
      await updateUser(userId, { autoRenew: !currentValue });
      toast.success('Renouvellement automatique mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleExtendSubscription = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const currentExpiry = user.premiumExpiryDate ? new Date(user.premiumExpiryDate) : new Date();
      const newExpiry = new Date(currentExpiry);
      newExpiry.setMonth(newExpiry.getMonth() + 1);

      await updateUser(userId, { 
        premiumExpiryDate: newExpiry.toISOString(),
        isPremium: true
      });
      toast.success('Abonnement prolongé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la prolongation');
    }
  };

  const handleActivatePremium = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = users.find(u => u.email === activationForm.email);
      if (!user) {
        toast.error('Utilisateur non trouvé');
        return;
      }

      const expiryDate = addMonths(new Date(), activationForm.duration);
      await updateUser(user.id, {
        isPremium: true,
        premiumExpiryDate: expiryDate.toISOString(),
        autoRenew: false
      });

      setShowActivationModal(false);
      setActivationForm({ email: '', duration: 1 });
      toast.success('Abonnement premium activé avec succès');
    } catch (error) {
      toast.error("Erreur lors de l'activation premium");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Retour
        </button>
        <button
          onClick={() => setShowActivationModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Activer Premium
        </button>
      </div>

      {showActivationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Activer un abonnement premium
            </h3>
            <form onSubmit={handleActivatePremium} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email de l'utilisateur
                </label>
                <input
                  type="email"
                  value={activationForm.email}
                  onChange={(e) => setActivationForm(prev => ({ ...prev, email: e.target.value }))}
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
                  min="1"
                  value={activationForm.duration}
                  onChange={(e) => setActivationForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowActivationModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Activer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">
            {premiumUsers.length}
          </p>
          <p className="text-sm text-gray-600">Utilisateurs Premium</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-green-100 rounded-full">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Actifs</span>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">
            {activeSubscriptions.length}
          </p>
          <p className="text-sm text-gray-600">Abonnements actifs</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">À renouveler</span>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">
            {expiringSubscriptions.length}
          </p>
          <p className="text-sm text-gray-600">Expirent dans 30 jours</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-100 rounded-full">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Revenus</span>
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">
            {totalRevenue.toLocaleString()} FCFA
          </p>
          <p className="text-sm text-gray-600">Total des abonnements</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Liste des abonnements
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'activation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'expiration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Renouvellement auto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {premiumUsers.map((user) => {
                  const isExpired = user.premiumExpiryDate && new Date(user.premiumExpiryDate) <= new Date();
                  const isExpiring = user.premiumExpiryDate && new Date(user.premiumExpiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                  
                  return (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                        {user.phone && (
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(user.createdAt), 'dd MMMM yyyy', { locale: fr })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.premiumExpiryDate && format(new Date(user.premiumExpiryDate), 'dd MMMM yyyy', { locale: fr })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleToggleAutoRenew(user.id, user.autoRenew || false)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.autoRenew
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.autoRenew ? 'Activé' : 'Désactivé'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isExpired
                            ? 'bg-red-100 text-red-800'
                            : isExpiring
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {isExpired ? 'Expiré' : isExpiring ? 'Expire bientôt' : 'Actif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleExtendSubscription(user.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Prolonger
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;