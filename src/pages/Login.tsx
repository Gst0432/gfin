import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthContext } from '../contexts/AuthContext';
import Logo from '../components/ui/Logo';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!email || !password) {
      setError('Email et mot de passe requis');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);
      
      // Clear form
      setEmail('');
      setPassword('');
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/app');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Email ou mot de passe incorrect';
      setError(message);
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
          Connexion à votre compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Ou{' '}
          <Link
            to="/register"
            className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            créez un nouveau compte gratuitement
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 flex items-center text-sm text-red-400 bg-red-100/10 p-3 rounded">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

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
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                Mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-200">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-400 hover:text-blue-300"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}