import React from 'react';
import { useStore } from '../store/useStore';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Target, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface NewGoalState {
  target: number;
  startDate: string;
  endDate: string;
  type: 'monthly' | 'yearly';
}

export default function SalesGoals() {
  const { salesGoals, addSalesGoal, transactions, user } = useStore();
  const [showNewGoalForm, setShowNewGoalForm] = React.useState(false);
  const [newGoal, setNewGoal] = React.useState<NewGoalState>({
    target: 0,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
    type: 'monthly'
  });

  const calculateProgress = (goal: typeof salesGoals[0]) => {
    const goalTransactions = transactions.filter(
      t => new Date(t.date) >= new Date(goal.startDate) &&
          new Date(t.date) <= new Date(goal.endDate)
    );
    return goalTransactions.reduce((sum, t) => sum + t.amount, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const goal = {
        id: crypto.randomUUID(),
        sellerId: user?.id || '',
        current: 0,
        ...newGoal
      };
      
      addSalesGoal(goal);
      setShowNewGoalForm(false);
      setNewGoal({
        target: 0,
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        type: 'monthly'
      });
      toast.success('Objectif créé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la création de l\'objectif');
    }
  };

  const handleTypeChange = (type: 'monthly' | 'yearly') => {
    const startDate = new Date();
    let endDate = new Date();
    
    if (type === 'monthly') {
      endDate = endOfMonth(startDate);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
      endDate.setDate(endDate.getDate() - 1);
    }

    setNewGoal({
      target: newGoal.target,
      type,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Objectifs de vente</h2>
            <p className="text-sm text-gray-500">
              Définissez et suivez vos objectifs de vente
            </p>
          </div>
          <button
            onClick={() => setShowNewGoalForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Target className="h-5 w-5" />
            Nouvel Objectif
          </button>
        </div>

        {showNewGoalForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Créer un nouvel objectif
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type d'objectif
                  </label>
                  <select
                    value={newGoal.type}
                    onChange={(e) => handleTypeChange(e.target.value as 'monthly' | 'yearly')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="monthly">Mensuel</option>
                    <option value="yearly">Annuel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Objectif (FCFA)
                  </label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, target: Number(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={newGoal.startDate}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, startDate: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={newGoal.endDate}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, endDate: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowNewGoalForm(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Créer l'objectif
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {salesGoals.map((goal) => {
            const current = calculateProgress(goal);
            const progress = (current / goal.target) * 100;
            const isCompleted = current >= goal.target;
            const isActive = new Date(goal.endDate) >= new Date();

            return (
              <div
                key={goal.id}
                className={`border rounded-lg p-6 ${
                  isActive ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Objectif {goal.type === 'monthly' ? 'Mensuel' : 'Annuel'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {format(new Date(goal.startDate), 'dd MMMM yyyy', { locale: fr })} - {' '}
                      {format(new Date(goal.endDate), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                  <div className={`rounded-full p-2 ${
                    isCompleted ? 'bg-green-100' : isActive ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <TrendingUp className={`h-5 w-5 ${
                      isCompleted ? 'text-green-600' : isActive ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progression</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        isCompleted ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Actuel: {current.toLocaleString()} FCFA
                    </span>
                    <span className="text-gray-600">
                      Objectif: {goal.target.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>

                {isCompleted && (
                  <div className="mt-4 py-2 px-3 bg-green-100 text-green-800 rounded-md text-sm">
                    Objectif atteint ! 🎉
                  </div>
                )}
              </div>
            );
          })}

          {salesGoals.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Aucun objectif défini
            </div>
          )}
        </div>
      </div>
    </div>
  );
}