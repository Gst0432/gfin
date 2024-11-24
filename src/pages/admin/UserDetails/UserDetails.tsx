import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { 
  ArrowLeft, 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  FileText,
  Link as LinkIcon,
  DollarSign,
  Target,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { users, transactions = [], salesGoals = [], digitalProductTables = [] } = useStore();
  
  const user = users.find(u => u.id === userId);
  const userTransactions = transactions.filter(t => t.sellerId === userId) || [];
  const userGoals = salesGoals.filter(g => g.sellerId === userId) || [];
  const userDigitalTables = digitalProductTables.filter(t => t.sellerId === userId) || [];

  const stats = [
    {
      title: "Ventes totales",
      value: userTransactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.amount, 0).toLocaleString() + ' FCFA',
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
      link: `/admin/users/${userId}/sales`
    },
    {
      title: "Objectifs actifs",
      value: userGoals.filter(g => new Date(g.endDate) > new Date()).length,
      icon: Target,
      color: "bg-blue-100 text-blue-600",
      link: `/admin/users/${userId}/goals`
    },
    {
      title: "Liens numériques",
      value: userDigitalTables.reduce((sum, t) => sum + (t.products?.length || 0), 0),
      icon: LinkIcon,
      color: "bg-purple-100 text-purple-600",
      link: `/admin/users/${userId}/digital-links`
    }
  ];

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
          Compte de {user.name}
        </h1>
      </div>

      {/* Menu de navigation rapide */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <nav className="flex space-x-4">
          {[
            { name: 'Ventes', icon: TrendingUp, href: `/admin/users/${userId}/sales` },
            { name: 'Abonnements', icon: CreditCard, href: `/admin/users/${userId}/subscriptions` },
            { name: 'Liens numériques', icon: LinkIcon, href: `/admin/users/${userId}/digital-links` },
            { name: 'Objectifs', icon: Target, href: `/admin/users/${userId}/goals` },
            { name: 'Paramètres', icon: Settings, href: `/admin/users/${userId}/settings` }
          ].map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <item.icon className="h-5 w-5 mr-2" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </Link>
        ))}
      </div>

      {/* Informations utilisateur */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Informations personnelles
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <span>{user.phone}</span>
              </div>
            )}
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <span>Inscrit le {format(new Date(user.createdAt), 'dd MMMM yyyy', { locale: fr })}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Informations entreprise
          </h2>
          {user.companyInfo ? (
            <div className="space-y-4">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                <span>{user.companyInfo.name}</span>
              </div>
              <div className="pl-7">
                <p className="text-gray-600">{user.companyInfo.address}</p>
                {user.companyInfo.phone && (
                  <p className="text-gray-600">{user.companyInfo.phone}</p>
                )}
                {user.companyInfo.email && (
                  <p className="text-gray-600">{user.companyInfo.email}</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Aucune information entreprise renseignée</p>
          )}
        </div>
      </div>

      {/* Dernières activités */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Dernières activités
        </h2>
        <div className="space-y-4">
          {userTransactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {transaction.type === 'sale' ? 'Vente' : 'Abonnement'}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(transaction.date), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {transaction.amount.toLocaleString()} FCFA
              </span>
            </div>
          ))}
          {userTransactions.length === 0 && (
            <p className="text-gray-500 text-center">Aucune activité récente</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;