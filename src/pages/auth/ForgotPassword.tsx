import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '../../components/ui/Logo';
import { useAuthContext } from '../../contexts/AuthContext';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { resetPassword } = useAuthContext();
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPassword(email);
      toast.success('Instructions de réinitialisation envoyées par email');
      navigate('/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de l\'envoi des instructions';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-b from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-white">
          Réinitialisation du mot de passe
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Entrez votre adresse email pour recevoir les instructions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Adresse email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Envoi...' : 'Envoyer les instructions'}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Retour à la connexion
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}