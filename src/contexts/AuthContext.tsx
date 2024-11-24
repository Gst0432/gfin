import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authApi } from '../services/api/auth';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string) => Promise<User>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        try {
          const userData = await authApi.validateToken();
          setUser(userData);
        } catch (error) {
          console.error('Auth state change error:', error);
          setUser(null);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const userData = await authApi.validateToken();
          setUser(userData);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
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

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.register(email, password, name);
      setUser(response.user);
      toast.success('Compte créé avec succès');
      return response.user;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'inscription';
      setError(new Error(message));
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await authApi.resetPassword(email);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la réinitialisation';
      setError(new Error(message));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      await authApi.updatePassword(newPassword);
      toast.success('Mot de passe mis à jour avec succès');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise à jour';
      setError(new Error(message));
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
      setError(new Error(message));
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        login, 
        register, 
        resetPassword,
        updatePassword,
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}