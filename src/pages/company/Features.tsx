import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Layers,
  BarChart2,
  Shield,
  Smartphone,
  Cloud,
  Users,
  Settings,
  Clock,
  FileText,
  CreditCard,
  Link,
  Target
} from 'lucide-react';

export default function Features() {
  const navigate = useNavigate();

  const features = [
    {
      icon: BarChart2,
      title: "Tableau de Bord Intuitif",
      description: "Visualisez vos finances en un coup d'œil avec des graphiques clairs et des indicateurs pertinents."
    },
    {
      icon: FileText,
      title: "Gestion des Factures",
      description: "Créez et gérez facilement vos factures professionnelles avec notre générateur intégré."
    },
    {
      icon: Target,
      title: "Objectifs Financiers",
      description: "Définissez et suivez vos objectifs de vente avec des indicateurs de progression en temps réel."
    },
    {
      icon: CreditCard,
      title: "Gestion des Abonnements",
      description: "Suivez vos revenus récurrents et gérez vos abonnements clients efficacement."
    },
    {
      icon: Link,
      title: "Liens Numériques",
      description: "Organisez et partagez vos ressources numériques avec vos clients en toute sécurité."
    },
    {
      icon: Cloud,
      title: "Sauvegarde Cloud",
      description: "Vos données sont automatiquement sauvegardées et accessibles depuis n'importe où."
    },
    {
      icon: Shield,
      title: "Sécurité Avancée",
      description: "Protection de vos données avec chiffrement de bout en bout et authentification forte."
    },
    {
      icon: Smartphone,
      title: "Application Responsive",
      description: "Accédez à vos données depuis n'importe quel appareil avec notre interface adaptative."
    },
    {
      icon: Users,
      title: "Gestion des Clients",
      description: "Base de données clients intégrée avec historique des transactions et préférences."
    },
    {
      icon: Clock,
      title: "Rapports Automatisés",
      description: "Générez des rapports détaillés automatiquement à la fréquence de votre choix."
    },
    {
      icon: Settings,
      title: "Personnalisation",
      description: "Adaptez l'interface et les rapports selon vos besoins spécifiques."
    },
    {
      icon: Layers,
      title: "Multi-Devises",
      description: "Gérez vos transactions dans différentes devises avec conversion automatique."
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
          <h1 className="text-4xl font-bold mb-4">Fonctionnalités</h1>
          <p className="text-xl text-gray-400">
            Découvrez tous les outils disponibles pour gérer vos finances efficacement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-colors"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <feature.icon className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Prêt à commencer ?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Essayer gratuitement
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Voir les tarifs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}