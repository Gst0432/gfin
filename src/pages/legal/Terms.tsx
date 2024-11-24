import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';

export default function Terms() {
  const navigate = useNavigate();

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

        <div className="flex items-center mb-8">
          <Scale className="h-8 w-8 text-purple-500 mr-3" />
          <h1 className="text-3xl font-bold">Conditions Générales d'Utilisation</h1>
        </div>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Objet</h2>
            <p>
              Les présentes CGU définissent les modalités d'utilisation de la plateforme G-Finance, service de gestion financière en ligne. En utilisant nos services, vous acceptez d'être lié par ces conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Services Proposés</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Gestion des finances personnelles et professionnelles</li>
              <li>Suivi des revenus et dépenses</li>
              <li>Génération de rapports financiers</li>
              <li>Services premium avec fonctionnalités avancées</li>
              <li>Outils d'analyse et de visualisation</li>
              <li>Support technique et assistance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Conditions d'Accès</h2>
            <p className="mb-4">Pour utiliser nos services, vous devez :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Être majeur ou avoir l'autorisation d'un représentant légal</li>
              <li>Créer un compte avec des informations exactes</li>
              <li>Maintenir la confidentialité de vos identifiants</li>
              <li>Disposer d'un appareil compatible et d'une connexion internet</li>
              <li>Respecter les lois en vigueur et nos conditions d'utilisation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Responsabilités</h2>
            <div className="space-y-4">
              <p>
                <strong className="text-white">4.1 Nos Responsabilités</strong>
                <br />
                Nous nous engageons à fournir un service sécurisé et performant, tout en assurant la protection de vos données.
              </p>
              <p>
                <strong className="text-white">4.2 Vos Responsabilités</strong>
                <br />
                Vous êtes responsable de l'exactitude des informations fournies et de l'utilisation conforme de nos services.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Tarification</h2>
            <p className="mb-4">Nos services sont proposés selon les modalités suivantes :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Version gratuite avec fonctionnalités de base</li>
              <li>Abonnements premium avec options avancées</li>
              <li>Facturation mensuelle ou annuelle</li>
              <li>Période d'essai gratuite pour les nouveaux utilisateurs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Propriété Intellectuelle</h2>
            <p>
              Tous les droits de propriété intellectuelle liés à G-Finance (logos, marques, logiciels) sont notre propriété exclusive. Toute reproduction non autorisée est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Résiliation</h2>
            <p className="mb-4">Le contrat peut être résilié :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>À tout moment par l'utilisateur</li>
              <li>En cas de violation des CGU</li>
              <li>En cas de non-paiement des services premium</li>
              <li>En cas de force majeure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Contact</h2>
            <p>
              Pour toute question concernant ces CGU, contactez-nous à :{' '}
              <a href="mailto:legal@g-finance.com" className="text-purple-400 hover:text-purple-300">
                legal@g-finance.com
              </a>
            </p>
          </section>

          <section className="border-t border-gray-800 pt-8 mt-8">
            <p className="text-sm text-gray-400">
              Dernière mise à jour : {new Date().toLocaleDateString()}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}