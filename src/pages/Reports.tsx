import React from 'react';
import { useStore } from '../store/useStore';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Download } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { exportToCSV } from '../utils/csvExport';
import toast from 'react-hot-toast';

const Reports = () => {
  const { transactions = [], expenses = [], user } = useStore();
  const [period, setPeriod] = React.useState('month');

  const getDateRange = () => {
    const end = new Date();
    const start = period === 'month' 
      ? startOfMonth(end)
      : startOfMonth(subMonths(end, 11));
    return { start, end };
  };

  const { start, end } = getDateRange();

  const filteredTransactions = transactions.filter(
    (t) => new Date(t.date) >= start && new Date(t.date) <= end
  );

  const filteredExpenses = expenses.filter(
    (e) => new Date(e.date) >= start && new Date(e.date) <= end
  );

  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const chartData = React.useMemo(() => {
    const data = [];
    let currentDate = start;
    while (currentDate <= end) {
      const monthKey = format(currentDate, 'yyyy-MM');
      const monthRevenue = filteredTransactions
        .filter(t => format(new Date(t.date), 'yyyy-MM') === monthKey)
        .reduce((sum, t) => sum + t.amount, 0);
      const monthExpenses = filteredExpenses
        .filter(e => format(new Date(e.date), 'yyyy-MM') === monthKey)
        .reduce((sum, e) => sum + e.amount, 0);
      
      data.push({
        month: format(currentDate, 'MMM yyyy', { locale: fr }),
        revenue: monthRevenue,
        expenses: monthExpenses,
        profit: monthRevenue - monthExpenses,
      });
      
      currentDate = endOfMonth(currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
  }, [filteredTransactions, filteredExpenses, start, end]);

  const handleExportCSV = (type: 'transactions' | 'expenses' | 'summary') => {
    if (!user?.isPremium) {
      toast.error('Cette fonctionnalité est réservée aux utilisateurs premium');
      window.location.href = 'https://vente.paiementpro.net/g-startup/1936';
      return;
    }

    try {
      switch (type) {
        case 'transactions':
          const transactionData = filteredTransactions.map(t => ({
            Date: format(new Date(t.date), 'dd/MM/yyyy'),
            Type: t.type,
            Montant: t.amount,
            Client: t.buyerDetails?.name || 'N/A',
            Email: t.buyerDetails?.email || 'N/A',
            'Mode de paiement': t.paymentMethod || 'N/A'
          }));
          exportToCSV(transactionData, `transactions_${format(new Date(), 'yyyy-MM-dd')}`);
          break;

        case 'expenses':
          const expenseData = filteredExpenses.map(e => ({
            Date: format(new Date(e.date), 'dd/MM/yyyy'),
            Description: e.description,
            Catégorie: e.category,
            Montant: e.amount
          }));
          exportToCSV(expenseData, `depenses_${format(new Date(), 'yyyy-MM-dd')}`);
          break;

        case 'summary':
          const summaryData = chartData.map(d => ({
            Période: d.month,
            Revenus: d.revenue,
            Dépenses: d.expenses,
            'Bénéfice net': d.profit
          }));
          exportToCSV(summaryData, `resume_${format(new Date(), 'yyyy-MM-dd')}`);
          break;
      }
      toast.success('Rapport exporté avec succès');
    } catch (error) {
      toast.error("Erreur lors de l'export du rapport");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Rapport Financier</h2>
          <div className="flex items-center gap-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
            </select>
            {user?.isPremium && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleExportCSV('transactions')}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" />
                  Transactions
                </button>
                <button
                  onClick={() => handleExportCSV('expenses')}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" />
                  Dépenses
                </button>
                <button
                  onClick={() => handleExportCSV('summary')}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" />
                  Résumé
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-green-600">Revenus Totaux</p>
            <p className="text-2xl font-bold text-green-900">
              {totalRevenue.toLocaleString()} FCFA
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-red-600">Dépenses Totales</p>
            <p className="text-2xl font-bold text-red-900">
              {totalExpenses.toLocaleString()} FCFA
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-600">Bénéfice Net</p>
            <p className="text-2xl font-bold text-blue-900">
              {netProfit.toLocaleString()} FCFA
            </p>
          </div>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" name="Revenus" fill="#10B981" />
              <Bar dataKey="expenses" name="Dépenses" fill="#EF4444" />
              <Bar dataKey="profit" name="Bénéfice" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;