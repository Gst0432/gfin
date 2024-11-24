import { User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://gfinances.pro/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Une erreur est survenue');
  }
  return response.json();
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return handleResponse<T>(response);
}

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, name: string) =>
    apiRequest<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
};