import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';

export default function Legal() {
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
          <Building2 className="h-8 w-8 text-purple-500 mr-3" />
          <h1 className="text-3xl font-bold">Mentions Légales</h1>
        </div>

        <div className="space-y-8 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Éditeur du Site</h2>
            <p className="space-y-2">
              <strong className="block text-white">G-Finance SARL</strong>
              <span className="block">Capital social : 10 000 000 FCFA</span>
              <span className="block">RCCM : NE-NIA-2024-B-001</span>
              <span className="block">Siège social : Niamey, Niger</span>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Direction de la Publication</h2>
            <p>
              Directeur de la publication : M. Ibrahim Mahamadou
              <br />
              Responsable de la rédaction : Mme Aïcha Souleymane
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Hébergement</h2>
            <p>
              Le site G-Finance est hébergé par :
              <br />
              Firebase (Google Cloud Platform)
              <br />
              Google LLC
              <br />
              1600 Amphitheatre Parkway
              <br />
              Mountain View, CA 94043
              <br />
              États-Unis
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Propriété Intellectuelle</h2>
            <p className="mb-4">
              L'ensemble du contenu du site G-Finance (logos, textes, éléments graphiques, vidéos, etc.) est protégé par le droit d'auteur et le droit des marques.
            </p>
            <p>
              Toute reproduction ou représentation, totale ou partielle, du site ou de l'un de ses éléments, sans l'autorisation expresse de G-Finance, est interdite et constituerait une contrefaçon sanctionnée par le Code de la propriété intellectuelle.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Protection des Données</h2>
            <p>
              Conformément à la loi n°2017-28 du 03 mai 2017 relative à la protection des données à caractère personnel, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Cookies</h2>
            <p>
              Le site utilise des cookies pour améliorer l'expérience utilisateur. En naviguant sur le site, vous acceptez l'utilisation de cookies conformément à notre politique de confidentialité.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Contact</h2>
            <p className="space-y-2">
              <strong className="block text-white">Adresse :</strong>
              <span className="block">123 Avenue de la République</span>
              <span className="block">BP 11111 Niamey, Niger</span>
              <span className="block">Tél : +227 70 13 80 31</span>
              <a href="mailto:contact@g-finance.com" className="text-purple-400 hover:text-purple-300">
                contact@g-finance.com
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