import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/useStore';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const UserGoals = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { users, salesGoals, transactions } = useStore();
  
  const user = users.find(u => u.id === userId);
  const userGoals = salesGoals.filter(g => g.sellerId === userId);

  const calculateProgress = (goal: typeof salesGoals[0]) => {
    const goalTransactions = transactions.filter(
      t => t.sellerId === userId &&
          new Date(t.date) >= new Date(goal.startDate) &&
          new Date(t.date) <= new Date(goal.endDate)
    );
    return goalTransactions.reduce((sum, t) => sum + t.amount, 0);
  };

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
          onClick={() => navigate(`/admin/users/${userId}`)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Retour
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          Objectifs de {user.name}
        </h1>
      </div>

      <div className="space-y-6">
        {userGoals.map((goal) => {
          const current = calculateProgress(goal);
          const progress = (current / goal.target) * 100;
          const isCompleted = current >= goal.target;
          const isActive = new Date(goal.endDate) >= new Date();

          return (
            <div
              key={goal.id}
              className={`bg-white p-6 rounded-lg shadow-sm border ${
                isActive ? 'border-blue-200' : 'border-gray-200'
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

        {userGoals.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
            Aucun objectif défini
          </div>
        )}
      </div>
    </div>
  );
};

export default UserGoals;