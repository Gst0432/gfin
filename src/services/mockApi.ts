import { User, LoginResponse, RegisterResponse } from '../types';

// Mock database
const users: User[] = [
  {
    id: '1',
    name: 'Administrateur',
    email: '227makemoney@gmail.com',
    role: 'admin',
    isPremium: true,
    createdAt: new Date().toISOString(),
    isActive: true,
    companyInfo: {
      name: 'G-Finance',
      address: 'Niamey, Niger',
      phone: '+227 XX XX XX XX',
      email: 'contact@g-finance.com'
    }
  }
];

// Mock tokens storage
const STORAGE_KEY = 'mock_auth_tokens';

const getStoredTokens = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

const setStoredTokens = (tokens: Record<string, string>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
};

export const mockApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const token = Math.random().toString(36).substring(2);
    const tokens = getStoredTokens();
    tokens[user.id] = token;
    setStoredTokens(tokens);

    return {
      success: true,
      user,
      token
    };
  },

  register: async (email: string, password: string, name: string): Promise<RegisterResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (users.some(u => u.email === email)) {
      throw new Error('Cet email est déjà utilisé');
    }

    const newUser: User = {
      id: (users.length + 1).toString(),
      name,
      email,
      role: email === '227makemoney@gmail.com' ? 'admin' : 'user',
      isPremium: email === '227makemoney@gmail.com',
      createdAt: new Date().toISOString(),
      isActive: true
    };

    users.push(newUser);

    const token = Math.random().toString(36).substring(2);
    const tokens = getStoredTokens();
    tokens[newUser.id] = token;
    setStoredTokens(tokens);

    return {
      success: true,
      user: newUser,
      token
    };
  },

  validateToken: async (token: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 200));

    const tokens = getStoredTokens();
    const userId = Object.entries(tokens).find(([_, t]) => t === token)?.[0];
    const user = users.find(u => u.id === userId);

    if (!user) {
      throw new Error('Token invalide');
    }

    return user;
  }
};