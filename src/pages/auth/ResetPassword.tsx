import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from '../../components/ui/Logo';
import { useAuthContext } from '../../contexts/AuthContext';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updatePassword } = useAuthContext();
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Get token from URL
  const token = searchParams.get('token');

  React.useEffect(() => {
    if (!token) {
      toast.error('Lien de réinitialisation invalide');
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      await updatePassword(password);
      toast.success('Mot de passe réinitialisé avec succès');
      navigate('/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la réinitialisation';
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
          Nouveau mot de passe
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Choisissez un nouveau mot de passe sécurisé
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                Nouveau mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-200">
                Confirmer le mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}