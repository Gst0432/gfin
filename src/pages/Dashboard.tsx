import React from 'react';
import { useStore } from '../store/useStore';
import { 
  DollarSign, 
  Users, 
  ShoppingBag, 
  TrendingUp,
  ArrowLeft,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, transactions, products, salesGoals } = useStore();

  // Calcul des statistiques
  const today = new Date();
  const startOfCurrentMonth = startOfMonth(today);
  const endOfCurrentMonth = endOfMonth(today);

  const monthlyTransactions = transactions.filter(
    t => new Date(t.date) >= startOfCurrentMonth && new Date(t.date) <= endOfCurrentMonth
  );

  const dailyTransactions = transactions.filter(
    t => format(new Date(t.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  );

  const stats = [
    {
      title: "Ventes du jour",
      value: `${dailyTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()} FCFA`,
      subtext: `${dailyTransactions.length} transactions`,
      icon: DollarSign,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: "Ventes du mois",
      value: `${monthlyTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()} FCFA`,
      subtext: `${monthlyTransactions.length} transactions`,
      icon: Calendar,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: "Produits actifs",
      value: products.length,
      subtext: 'produits en vente',
      icon: ShoppingBag,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: "Clients uniques",
      value: new Set(monthlyTransactions.map(t => t.buyerDetails?.email)).size,
      subtext: 'ce mois-ci',
      icon: Users,
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  // Données pour le graphique
  const chartData = React.useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: format(date, 'dd MMM', { locale: fr }),
        ventes: 0
      };
    }).reverse();

    transactions.forEach(t => {
      const transactionDate = format(new Date(t.date), 'dd MMM', { locale: fr });
      const dayData = last7Days.find(d => d.date === transactionDate);
      if (dayData) {
        dayData.ventes += t.amount;
      }
    });

    return last7Days;
  }, [transactions]);

  // Objectifs de vente actuels
  const currentGoals = salesGoals.filter(
    goal => new Date(goal.endDate) >= today
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Retour
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          Bienvenue, {user?.name}
        </h1>
      </div>

      {!user?.isPremium && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-blue-400" />
            <p className="ml-3 text-sm text-blue-700">
              Passez à la version Premium pour supprimer les publicités et accéder à toutes les fonctionnalités.{' '}
              <button
                onClick={() => navigate('/subscriptions')}
                className="font-medium underline"
              >
                En savoir plus
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Statistiques principales */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`rounded-full p-3 ${stat.color}`}>
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="text-xs sm:text-sm text-gray-500">
                {format(today, 'dd MMMM yyyy', { locale: fr })}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
              <p className="mt-2 text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">{stat.value}</p>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">{stat.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Graphique des ventes */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Évolution des ventes (7 derniers jours)
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ventes" name="Ventes (FCFA)" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Objectifs en cours */}
      {currentGoals.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Objectifs en cours
          </h2>
          <div className="space-y-4">
            {currentGoals.map((goal) => (
              <div key={goal.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900">
                    Objectif {goal.type === 'monthly' ? 'Mensuel' : 'Annuel'}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {format(new Date(goal.endDate), 'dd MMMM yyyy', { locale: fr })}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progression</span>
                    <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Actuel: {goal.current.toLocaleString()} FCFA</span>
                  <span>Objectif: {goal.target.toLocaleString()} FCFA</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dernières transactions */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Dernières transactions
        </h2>
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
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.slice(0, 5).map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(transaction.date), 'dd MMMM yyyy', { locale: fr })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.buyerDetails?.name || 'Client anonyme'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.amount.toLocaleString()} FCFA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.type === 'premium'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {transaction.type === 'premium' ? 'Abonnement' : 'Vente'}
                    </span>
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