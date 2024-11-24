import React from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';

export default function Expenses() {
  const { expenses = [], addExpense, user } = useStore();
  const [newExpense, setNewExpense] = React.useState({
    amount: 0,
    description: '',
    category: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const expense = {
        sellerId: user?.id || '',
        ...newExpense,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      addExpense(expense);
      setNewExpense({
        amount: 0,
        description: '',
        category: '',
        date: format(new Date(), 'yyyy-MM-dd'),
      });
      toast.success('Dépense enregistrée avec succès');
    } catch (error) {
      console.error('Expense error:', error);
      toast.error('Erreur lors de l\'enregistrement de la dépense');
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const userExpenses = expenses.filter(e => e.sellerId === user?.id);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Ajouter une dépense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Montant (FCFA)
              </label>
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense(prev => ({ ...prev, amount: Number(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Catégorie
              </label>
              <input
                type="text"
                value={newExpense.category}
                onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense(prev => ({ ...prev, date: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                value={newExpense.description}
                onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Ajouter la dépense
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Liste des dépenses</h2>
          <p className="text-lg font-medium">
            Total: <span className="text-blue-600">{totalExpenses.toLocaleString()} FCFA</span>
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {userExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(expense.date), 'dd MMMM yyyy', { locale: fr })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {expense.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {expense.amount.toLocaleString()} FCFA
                  </td>
                </tr>
              ))}
              {userExpenses.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Aucune dépense enregistrée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}