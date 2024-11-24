import React from 'react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Search,
  UserPlus,
  AlertCircle,
  ArrowUpRight,
  Ban
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { users, transactions } = useStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showInactiveUsers, setShowInactiveUsers] = React.useState(false);

  const filteredUsers = users.filter(user => 
    user.role === 'user' &&
    (showInactiveUsers || user.isActive) &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (user.phone && user.phone.includes(searchTerm)))
  );

  // Calculer uniquement les revenus des ventes premium
  const premiumTransactions = transactions.filter(t => t.type === 'premium');
  const currentMonthPremiumRevenue = premiumTransactions
    .filter(t => new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    {
      title: "Utilisateurs Actifs",
      value: users.filter(u => u.isActive).length,
      icon: Users,
      color: "text-blue-600 bg-blue-100"
    },
    {
      title: "Abonnements Premium",
      value: users.filter(u => u.isPremium).length,
      icon: CreditCard,
      color: "text-purple-600 bg-purple-100"
    },
    {
      title: "Revenus Premium du Mois",
      value: `${currentMonthPremiumRevenue.toLocaleString()} FCFA`,
      icon: TrendingUp,
      color: "text-green-600 bg-green-100"
    },
    {
      title: "Nouveaux Utilisateurs",
      value: users.filter(u => 
        new Date(u.createdAt).getMonth() === new Date().getMonth()
      ).length,
      icon: UserPlus,
      color: "text-orange-600 bg-orange-100"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`rounded-full p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* User Search and List */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un utilisateur..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className={!user.isActive ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    {user.isPremium && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Premium
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    {user.phone && (
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <TrendingUp className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/users/${user.id}/subscriptions`)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        <CreditCard className="h-5 w-5" />
                      </button>
                      <button
                        className={`${
                          user.isActive
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {user.isActive ? (
                          <Ban className="h-5 w-5" />
                        ) : (
                          <AlertCircle className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}