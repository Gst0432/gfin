import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, ArrowRight } from 'lucide-react';

export default function Blog() {
  const navigate = useNavigate();

  const articles = [
    {
      id: 1,
      title: "Les Meilleures Pratiques de Gestion Financière pour les PME",
      excerpt: "Découvrez comment optimiser la gestion financière de votre entreprise avec des conseils pratiques et des stratégies éprouvées.",
      author: "Ibrahim Mahamadou",
      date: "2024-03-15",
      readTime: "5 min",
      category: "Gestion Financière",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      title: "L'Impact de la Digitalisation sur les Finances en Afrique",
      excerpt: "Analyse approfondie de la transformation digitale du secteur financier africain et ses perspectives d'avenir.",
      author: "Aïcha Souleymane",
      date: "2024-03-10",
      readTime: "8 min",
      category: "Tendances",
      image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      title: "Guide Complet du Suivi des Dépenses",
      excerpt: "Apprenez à suivre efficacement vos dépenses professionnelles pour une meilleure rentabilité.",
      author: "Mamadou Diallo",
      date: "2024-03-05",
      readTime: "6 min",
      category: "Guide Pratique",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Blog G-Finance</h1>
          <p className="text-xl text-gray-400">
            Actualités, conseils et tendances de la gestion financière
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-colors"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-purple-400">{article.category}</span>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {article.readTime}
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold mb-3">
                  {article.title}
                </h2>
                
                <p className="text-gray-400 mb-4">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center text-sm text-gray-400">
                    <User className="h-4 w-4 mr-2" />
                    {article.author}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(article.date).toLocaleDateString()}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/blog/${article.id}`)}
                  className="flex items-center justify-center w-full mt-6 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Lire l'article
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/blog/archive')}
            className="inline-flex items-center text-purple-400 hover:text-purple-300"
          >
            Voir tous les articles
            <ArrowRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}