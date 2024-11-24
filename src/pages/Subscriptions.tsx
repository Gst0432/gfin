import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthContext } from '../contexts/AuthContext';

export default function Subscriptions() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [loading, setLoading] = React.useState(false);

  const plans = [
    {
      id: 'monthly',
      name: 'Abonnement Mensuel',
      price: 500,
      duration: 'mois',
      features: [
        'Suppression des publicités',
        'Accès à toutes les fonctionnalités',
        'Support prioritaire',
        'Statistiques avancées'
      ]
    },
    {
      id: 'yearly',
      name: 'Abonnement Annuel',
      price: 5000,
      duration: 'an',
      features: [
        'Suppression des publicités',
        'Accès à toutes les fonctionnalités',
        'Support prioritaire',
        'Statistiques avancées',
        'Économisez 1000 FCFA',
        'Rapports personnalisés'
      ]
    }
  ];

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour souscrire à un abonnement');
      navigate('/login', { state: { from: '/subscriptions' } });
      return;
    }

    try {
      setLoading(true);
      window.location.href = 'https://vente.paiementpro.net/g-startup/1936';
    } catch (error) {
      toast.error("Erreur lors de l'activation de l'abonnement");
    } finally {
      setLoading(false);
    }
  };

  if (user?.isPremium) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Vous êtes déjà abonné Premium !
          </h2>
          {user.premiumExpiryDate && (
            <p className="text-gray-600">
              Votre abonnement est valide jusqu'au{' '}
              {new Date(user.premiumExpiryDate).toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Choisissez votre plan Premium
        </h2>
        <p className="text-lg text-gray-600">
          Profitez d'une expérience sans publicité et accédez à toutes les fonctionnalités
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
              <div className="p-2 bg-blue-100 rounded-full">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-gray-600 ml-2">FCFA/{plan.duration}</span>
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-md py-3 hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Chargement...' : "S'abonner maintenant"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}