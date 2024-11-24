import { User, LoginResponse, RegisterResponse } from '../../types';
import { supabase } from '../../config/supabase';
import { validatePassword, validateEmail, validateName } from '../../utils/validation';
import { defaultAdmins } from '../../config/defaultAdmin';

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const emailError = validateEmail(email);
      if (emailError) throw new Error(emailError);

      const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;
      if (!session) throw new Error('Erreur de connexion');

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userError) throw userError;

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', session.user.id);

      return {
        success: true,
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          isPremium: userData.is_premium,
          premiumExpiryDate: userData.premium_expiry_date,
          createdAt: userData.created_at,
          isActive: userData.is_active,
          companyInfo: userData.company_info
        },
        token: session.access_token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error instanceof Error ? error : new Error('Erreur de connexion');
    }
  },

  register: async (email: string, password: string, name: string): Promise<RegisterResponse> => {
    try {
      const emailError = validateEmail(email);
      if (emailError) throw new Error(emailError);

      const passwordError = validatePassword(password);
      if (passwordError) throw new Error(passwordError);

      const nameError = validateName(name);
      if (nameError) throw new Error(nameError);

      const { data: { user: authUser }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: defaultAdmins.some(admin => admin.email === email) ? 'admin' : 'user'
          },
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (signUpError) throw signUpError;
      if (!authUser) throw new Error('Erreur lors de l\'inscription');

      const isAdmin = defaultAdmins.some(admin => admin.email === email);
      const adminData = defaultAdmins.find(admin => admin.email === email);

      const { data: userData, error: insertError } = await supabase
        .from('users')
        .insert([{
          id: authUser.id,
          name,
          email,
          role: isAdmin ? 'admin' : 'user',
          is_premium: isAdmin,
          is_active: true,
          company_info: isAdmin ? adminData?.companyInfo : null
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      const { data: { session } } = await supabase.auth.getSession();

      return {
        success: true,
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          isPremium: userData.is_premium,
          createdAt: userData.created_at,
          isActive: userData.is_active,
          companyInfo: userData.company_info
        },
        token: session?.access_token || ''
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error instanceof Error ? error : new Error('Erreur lors de l\'inscription');
    }
  },

  resetPassword: async (email: string): Promise<void> => {
    try {
      const emailError = validateEmail(email);
      if (emailError) throw new Error(emailError);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
        captchaToken: undefined
      });

      if (error) {
        console.error('Reset password error:', error);
        throw new Error('Erreur lors de l\'envoi du mail de réinitialisation');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error instanceof Error ? error : new Error('Erreur lors de la réinitialisation du mot de passe');
    }
  },

  updatePassword: async (newPassword: string): Promise<void> => {
    try {
      const passwordError = validatePassword(newPassword);
      if (passwordError) throw new Error(passwordError);

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
    } catch (error) {
      console.error('Password update error:', error);
      throw error instanceof Error ? error : new Error('Erreur lors de la mise à jour du mot de passe');
    }
  },

  logout: async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem('supabase.auth.token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error instanceof Error ? error : new Error('Erreur lors de la déconnexion');
    }
  },

  validateToken: async (): Promise<User> => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      if (!session) throw new Error('Session invalide');

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userError) throw userError;

      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        isPremium: userData.is_premium,
        premiumExpiryDate: userData.premium_expiry_date,
        createdAt: userData.created_at,
        isActive: userData.is_active,
        companyInfo: userData.company_info
      };
    } catch (error) {
      console.error('Token validation error:', error);
      throw error instanceof Error ? error : new Error('Session invalide');
    }
  }
};