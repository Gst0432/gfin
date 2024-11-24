import { createClient } from '@supabase/supabase-js';
import { User, LoginResponse, RegisterResponse } from '../types';

const supabaseUrl = 'https://puqlgwxpirfrqvjknhbn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1cWxnd3hwaXJmcnF2amtuaGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzMDczMjMsImV4cCI6MjA0Nzg4MzMyM30.AGUcFj0C_vDDmJzouIuAYPgMp5A53WLqZmQyRcmRRSI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize admin user if not exists
const initializeAdmin = async () => {
  const { data: existingAdmin } = await supabase
    .from('users')
    .select()
    .eq('email', '227makemoney@gmail.com')
    .single();

  if (!existingAdmin) {
    const { data: { user: authUser }, error: signUpError } = await supabase.auth.signUp({
      email: '227makemoney@gmail.com',
      password: 'admin123'
    });

    if (authUser) {
      await supabase.from('users').insert([{
        id: authUser.id,
        name: 'Administrateur',
        email: '227makemoney@gmail.com',
        role: 'admin',
        is_premium: true,
        is_active: true,
        company_info: {
          name: 'G-Finance',
          address: 'Niamey, Niger',
          phone: '+227 XX XX XX XX',
          email: 'contact@g-finance.com'
        }
      }]);
    }
  }
};

// Call initialization
initializeAdmin().catch(console.error);

export const auth = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) throw new Error(authError.message);
    if (!session) throw new Error('Erreur de connexion');

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userError) throw new Error(userError.message);

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
  },

  register: async (email: string, password: string, name: string): Promise<RegisterResponse> => {
    const { data: { session }, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) throw new Error(authError.message);
    if (!session) throw new Error('Erreur lors de l\'inscription');

    const isAdmin = email === '227makemoney@gmail.com';

    const { data: userData, error: insertError } = await supabase
      .from('users')
      .insert([{
        id: session.user.id,
        name,
        email,
        role: isAdmin ? 'admin' : 'user',
        is_premium: isAdmin,
        is_active: true,
        company_info: isAdmin ? {
          name: 'G-Finance',
          address: 'Niamey, Niger',
          phone: '+227 XX XX XX XX',
          email: 'contact@g-finance.com'
        } : null
      }])
      .select()
      .single();

    if (insertError) throw new Error(insertError.message);

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
      token: session.access_token
    };
  },

  validateToken: async (): Promise<User> => {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) throw new Error('Session invalide');

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userError) throw new Error(userError.message);

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
  }
};