import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Plus, Minus } from 'lucide-react';

export default function FAQ() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = React.useState<number | null>(null);

  const faqs = [
    {
      question: "Qu'est-ce que G-Finance ?",
      answer: "G-Finance est une solution de gestion financière développée par G-STARTUP, conçue pour aider les entreprises et les particuliers à gérer efficacement leurs finances. Notre plateforme offre des outils pour le suivi des revenus, des dépenses, la génération de rapports et bien plus encore."
    },
    {
      question: "Comment puis-je m'inscrire ?",
      answer: "L'inscription est simple et gratuite. Cliquez sur le bouton 'S'inscrire' en haut de la page, remplissez le formulaire avec vos informations et commencez à utiliser G-Finance immédiatement."
    },
    {
      question: "Quels sont les différents forfaits disponibles ?",
      answer: "Nous proposons deux formules : une version gratuite avec les fonctionnalités essentielles, et un abonnement Premium (500 FCFA/mois ou 5000 FCFA/an) qui débloque toutes les fonctionnalités avancées."
    },
    {
      question: "Mes données sont-elles sécurisées ?",
      answer: "Absolument. Nous utilisons un chiffrement de bout en bout et les meilleures pratiques de sécurité pour protéger vos données. Nos serveurs sont sécurisés et nous effectuons des sauvegardes régulières."
    },
    {
      question: "Puis-je exporter mes données ?",
      answer: "Oui, les utilisateurs Premium peuvent exporter leurs données dans différents formats (PDF, CSV) pour une utilisation externe ou des sauvegardes personnelles."
    },
    {
      question: "Comment fonctionne le support client ?",
      answer: "Notre équipe de support est disponible par email et WhatsApp. Les utilisateurs Premium bénéficient d'un support prioritaire avec des temps de réponse garantis."
    },
    {
      question: "Puis-je utiliser G-Finance sur mobile ?",
      answer: "Oui, G-Finance est entièrement responsive et fonctionne sur tous les appareils : ordinateurs, tablettes et smartphones."
    },
    {
      question: "Comment annuler mon abonnement ?",
      answer: "Vous pouvez annuler votre abonnement à tout moment depuis les paramètres de votre compte. L'annulation prendra effet à la fin de la période de facturation en cours."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>

        <div className="flex items-center mb-12">
          <HelpCircle className="h-8 w-8 text-purple-500 mr-3" />
          <h1 className="text-3xl font-bold">Questions Fréquentes</h1>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors"
                onClick={() => setOpenSection(openSection === index ? null : index)}
              >
                <span className="font-medium text-white">{faq.question}</span>
                {openSection === index ? (
                  <Minus className="h-5 w-5 text-purple-400" />
                ) : (
                  <Plus className="h-5 w-5 text-purple-400" />
                )}
              </button>
              {openSection === index && (
                <div className="px-6 py-4 border-t border-gray-700 bg-gray-800/50">
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400">
            Vous ne trouvez pas la réponse à votre question ?
          </p>
          <a
            href="mailto:support@g-finance.com"
            className="mt-4 inline-flex items-center text-purple-400 hover:text-purple-300"
          >
            Contactez notre support
            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
          </a>
        </div>
      </div>
    </div>
  );
}