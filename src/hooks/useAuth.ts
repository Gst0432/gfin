import { useState, useEffect } from 'react';
import { User } from '../types';
import { authApi } from '../services/api/auth';
import toast from 'react-hot-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setLoading(false);
          return;
        }

        const user = await authApi.validateToken();
        setUser(user);
      } catch (err) {
        console.error('Auth check error:', err);
        localStorage.removeItem('auth_token');
        setError(err instanceof Error ? err : new Error('Erreur d\'authentification'));
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authApi.login(email, password);
      setUser(response.user);
      toast.success('Connexion réussie');
      return response.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(new Error(message));
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authApi.logout();
      setUser(null);
      toast.success('Déconnexion réussie');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la déconnexion';
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, login, logout };
}