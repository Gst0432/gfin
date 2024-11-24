import { ApiResponse } from '../../types';

const API_URL = 'https://gfinances.pro/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'Une erreur est survenue';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      console.error('Failed to parse error response:', e);
    }
    throw new Error(errorMessage);
  }

  try {
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Une erreur est survenue');
    }
    return data;
  } catch (e) {
    console.error('Failed to parse response:', e);
    throw new Error('Réponse invalide du serveur');
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include'
    });

    return handleResponse<T>(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error instanceof Error ? error : new Error('Erreur de connexion au serveur');
  }
}

export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<ApiResponse<T>>(endpoint);
}

export async function apiPost<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
  return apiRequest<ApiResponse<T>>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function apiPut<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
  return apiRequest<ApiResponse<T>>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<ApiResponse<T>>(endpoint, {
    method: 'DELETE'
  });
}