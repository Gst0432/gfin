import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthContext } from '../contexts/AuthContext';
import Logo from '../components/ui/Logo';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuthContext();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const validatePassword = (value: string) => {
    if (value.length < 8) {
      return 'Au moins 8 caractères';
    }
    if (!/[A-Z]/.test(value)) {
      return 'Au moins une majuscule';
    }
    if (!/[a-z]/.test(value)) {
      return 'Au moins une minuscule';
    }
    if (!/[0-9]/.test(value)) {
      return 'Au moins un chiffre';
    }
    return '';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setError(validatePassword(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await register(email, password, name);
      
      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/app');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'inscription';
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
          Créer un compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Ou{' '}
          <Link
            to="/login"
            className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            connectez-vous à votre compte existant
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                Nom complet
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mt-1 text-xs text-gray-400">
                Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre.
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
                {loading ? 'Création en cours...' : 'Créer un compte'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}