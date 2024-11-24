import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, LineChart, CircleDollarSign, CheckCircle2, Menu, X } from 'lucide-react';
import Logo from '../components/ui/Logo';

export default function Landing() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: CircleDollarSign,
      title: "Gestion financière simplifiée",
      description: "Suivez vos revenus et dépenses en temps réel avec des tableaux de bord intuitifs"
    },
    {
      icon: Zap,
      title: "Performance optimale",
      description: "Interface rapide et réactive pour une gestion efficace au quotidien"
    },
    {
      icon: LineChart,
      title: "Analyses détaillées",
      description: "Visualisez vos performances avec des graphiques interactifs et rapports personnalisés"
    },
    {
      icon: ShieldCheck,
      title: "Sécurité maximale",
      description: "Protection avancée de vos données avec un chiffrement de bout en bout"
    }
  ];

  const testimonials = [
    {
      name: "Aminata Diallo",
      role: "Entrepreneure",
      content: "G-Finance a transformé la gestion de mon entreprise. Je recommande vivement !",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=128&h=128&q=80"
    },
    {
      name: "Moussa Konaté",
      role: "Consultant",
      content: "Une solution complète qui répond parfaitement à mes besoins. Support excellent.",
      image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=128&h=128&q=80"
    },
    {
      name: "Fatou Sow",
      role: "Commerçante",
      content: "Interface intuitive et fonctionnalités puissantes. Un vrai gain de temps !",
      image: "https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?auto=format&fit=crop&w=128&h=128&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => navigate('/')} className="flex items-center">
              <Logo />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/features" className="text-gray-300 hover:text-white transition-colors">
                Fonctionnalités
              </Link>
              <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
                Tarifs
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                À propos
              </Link>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                Se connecter
              </Link>
              <Link to="/register" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                S'inscrire gratuitement
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-b border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/features"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Fonctionnalités
              </Link>
              <Link
                to="/pricing"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Tarifs
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"
                onClick={() => setIsMenuOpen(false)}
              >
                S'inscrire gratuitement
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-6">
              Gérez vos finances en toute simplicité
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8">
              La solution complète pour gérer vos revenus, dépenses et objectifs financiers en un seul endroit.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity text-lg font-medium"
              >
                Commencer gratuitement
              </Link>
              <Link
                to="/features"
                className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-lg font-medium"
              >
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Fonctionnalités principales
            </h2>
            <p className="text-gray-400 text-lg">
              Tout ce dont vous avez besoin pour gérer vos finances efficacement
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ce qu'en disent nos utilisateurs
            </h2>
            <p className="text-gray-400 text-lg">
              Découvrez les expériences de nos clients satisfaits
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-xl border border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-purple-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui font confiance à G-Finance pour gérer leurs finances.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium"
          >
            Créer un compte gratuit
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <Logo />
              <p className="mt-4 text-sm">
                Simplifiez la gestion de vos finances avec G-Finance, votre partenaire de confiance.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Produit</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/features" className="hover:text-white transition-colors">
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-white transition-colors">
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Entreprise</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">
                    À propos
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Légal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="hover:text-white transition-colors">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white transition-colors">
                    CGU
                  </Link>
                </li>
                <li>
                  <Link to="/legal" className="hover:text-white transition-colors">
                    Mentions légales
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © {new Date().getFullYear()} G-Finance. Tous droits réservés.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-sm">Propulsé par</span>
              <a
                href="https://www.gstartup.pro"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 ml-1"
              >
                www.gstartup.pro
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}