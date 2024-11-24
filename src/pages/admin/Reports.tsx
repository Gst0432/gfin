import React from 'react';
import { useStore } from '../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function AdminReports() {
  const navigate = useNavigate();
  const { transactions } = useStore();

  // Données pour le graphique des revenus
  const revenueData = React.useMemo(() => {
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleString('fr-FR', { month: 'short' }),
        year: date.getFullYear(),
        subscriptions: 0,
        sales: 0,
        ads: 0,
      };
    }).reverse();

    // Add real transaction data
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthIndex = last12Months.findIndex(
        d => d.month === date.toLocaleString('fr-FR', { month: 'short' }) &&
            d.year === date.getFullYear()
      );
      if (monthIndex !== -1) {
        if (t.type === 'premium') {
          last12Months[monthIndex].subscriptions += t.amount;
        } else {
          last12Months[monthIndex].sales += t.amount;
        }
      }
    });

    return last12Months;
  }, [transactions]);

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
          Rapports Administrateur
        </h1>
      </div>

      {/* Graphique des revenus */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Revenus des 12 derniers mois
        </h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="subscriptions" name="Abonnements" fill="#3B82F6" />
              <Bar dataKey="sales" name="Ventes" fill="#10B981" />
              <Bar dataKey="ads" name="Publicités" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">
            Total des revenus
          </h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()} FCFA
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">
            Abonnements actifs
          </h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {transactions.filter(t => t.type === 'premium').length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">
            Revenus publicitaires
          </h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            0 FCFA
          </p>
        </div>
      </div>
    </div>
  );
}