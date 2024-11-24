import React from 'react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const Analytics = () => {
  const navigate = useNavigate();
  const { transactions, users } = useStore();

  // Calculate analytics data
  const analyticsData = React.useMemo(() => {
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleString('fr-FR', { month: 'short' }),
        users: 0,
        revenue: 0,
        transactions: 0
      };
    }).reverse();

    // Add real data
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthIndex = last12Months.findIndex(
        d => d.month === date.toLocaleString('fr-FR', { month: 'short' })
      );
      if (monthIndex !== -1) {
        last12Months[monthIndex].revenue += t.amount;
        last12Months[monthIndex].transactions += 1;
      }
    });

    // Add user registration data
    users.forEach(u => {
      const date = new Date(u.createdAt);
      const monthIndex = last12Months.findIndex(
        d => d.month === date.toLocaleString('fr-FR', { month: 'short' })
      );
      if (monthIndex !== -1) {
        last12Months[monthIndex].users += 1;
      }
    });

    return last12Months;
  }, [transactions, users]);

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
          Analyses
        </h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Évolution sur 12 mois
        </h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="revenue" 
                name="Revenus (FCFA)" 
                fill="#3B82F6" 
              />
              <Bar 
                yAxisId="right"
                dataKey="users" 
                name="Nouveaux utilisateurs" 
                fill="#10B981" 
              />
              <Bar 
                yAxisId="right"
                dataKey="transactions" 
                name="Transactions" 
                fill="#F59E0B" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;