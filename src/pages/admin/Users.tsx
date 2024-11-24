import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, TrendingUp, Ban, CheckCircle, Eye, Plus, Crown } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

const Users = () => {
  const navigate = useNavigate();
  const { users, toggleUserPremium, toggleUserStatus } = useStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showInactiveUsers, setShowInactiveUsers] = React.useState(false);
  const [showNewUserModal, setShowNewUserModal] = React.useState(false);
  const [premiumDuration, setPremiumDuration] = React.useState(1);

  const regularUsers = users.filter(user => 
    user.role === 'user' &&
    (showInactiveUsers || user.isActive) &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (user.phone && user.phone.includes(searchTerm)))
  );

  const handleTogglePremium = async (userId: string) => {
    try {
      await toggleUserPremium(userId, premiumDuration);
      const user = users.find(u => u.id === userId);
      toast.success(`Premium ${user?.isPremium ? 'désactivé' : 'activé'} avec succès`);
    } catch (error) {
      toast.error('Erreur lors de la modification du statut premium');
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      await toggleUserStatus(userId);
      const user = users.find(u => u.id === userId);
      toast.success(`Compte ${user?.isActive ? 'activé' : 'désactivé'} avec succès`);
    } catch (error) {
      toast.error('Erreur lors de la modification du statut du compte');
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
        <h1 className="text-2xl font-semibold text-gray-900">
          Gestion des utilisateurs
        </h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un utilisateur..."
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showInactive"
              checked={showInactiveUsers}
              onChange={(e) => setShowInactiveUsers(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showInactive" className="text-sm text-gray-600">
              Afficher les utilisateurs inactifs
            </label>
          </div>
        </div>

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
                  Inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut Premium
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {regularUsers.map((user) => (
                <tr key={user.id} className={!user.isActive ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        {user.companyInfo?.name && (
                          <div className="text-sm text-gray-500">
                            {user.companyInfo.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    {user.phone && (
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(user.createdAt), 'dd MMMM yyyy', { locale: fr })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isPremium ? (
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Premium
                        </span>
                        {user.premiumExpiryDate && (
                          <p className="text-xs text-gray-500 mt-1">
                            Expire le {format(new Date(user.premiumExpiryDate), 'dd/MM/yyyy')}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Standard
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir les détails"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/users/${user.id}/subscriptions`)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Abonnements"
                      >
                        <CreditCard className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/users/${user.id}/sales`)}
                        className="text-green-600 hover:text-green-900"
                        title="Ventes"
                      >
                        <TrendingUp className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleTogglePremium(user.id)}
                        className={`${
                          user.isPremium
                            ? 'text-yellow-600 hover:text-yellow-900'
                            : 'text-blue-600 hover:text-blue-900'
                        }`}
                        title={user.isPremium ? 'Désactiver Premium' : 'Activer Premium'}
                      >
                        <Crown className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`${
                          user.isActive
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                        title={user.isActive ? 'Désactiver' : 'Activer'}
                      >
                        {user.isActive ? (
                          <Ban className="h-5 w-5" />
                        ) : (
                          <CheckCircle className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {regularUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Aucun utilisateur trouvé
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

export default Users;