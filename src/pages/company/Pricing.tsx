import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard } from 'lucide-react';

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Gratuit",
      price: "0",
      period: "toujours",
      description: "Pour commencer avec les fonctionnalités essentielles",
      features: [
        "Tableau de bord basique",
        "Suivi des revenus et dépenses",
        "Gestion des clients limitée",
        "1 utilisateur",
        "Support par email"
      ],
      cta: "Commencer gratuitement",
      highlighted: false
    },
    {
      name: "Premium Mensuel",
      price: "500",
      period: "mois",
      description: "Pour les professionnels qui veulent plus",
      features: [
        "Toutes les fonctionnalités gratuites",
        "Tableau de bord avancé",
        "Rapports détaillés",
        "Export des données",
        "Gestion des clients illimitée",
        "Support prioritaire",
        "Pas de publicités"
      ],
      cta: "Essayer Premium",
      highlighted: true
    },
    {
      name: "Premium Annuel",
      price: "5000",
      period: "an",
      description: "La meilleure valeur pour votre entreprise",
      features: [
        "Toutes les fonctionnalités Premium",
        "2 mois gratuits",
        "Support VIP",
        "Formation personnalisée",
        "API access",
        "Backup quotidien"
      ],
      cta: "Économiser avec l'annuel",
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Tarifs Simples et Transparents</h1>
          <p className="text-xl text-gray-400">
            Choisissez le plan qui correspond à vos besoins
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-gray-800 rounded-xl p-8 border ${
                plan.highlighted
                  ? 'border-purple-500 ring-2 ring-purple-500 ring-opacity-50'
                  : 'border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                {plan.highlighted && (
                  <span className="px-3 py-1 text-xs font-medium text-purple-400 bg-purple-400/10 rounded-full">
                    Populaire
                  </span>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="ml-2 text-gray-400">FCFA/{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-gray-400">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm">
                    <Check className="h-5 w-5 text-green-400 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => window.location.href = 'https://vente.paiementpro.net/g-startup/1936'}
                className={`w-full flex items-center justify-center px-6 py-3 rounded-lg transition-colors ${
                  plan.highlighted
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Des questions ?</h2>
          <p className="text-gray-400 mb-6">
            Notre équipe est là pour vous aider à choisir le meilleur plan
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Contactez-nous
          </button>
        </div>
      </div>
    </div>
  );
}