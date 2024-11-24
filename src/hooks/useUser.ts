import { useState, useEffect } from 'react';
import { User } from '../types';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch user data from your API
    const fetchUser = async () => {
      try {
        // Replace with actual API call
        const response = await fetch('/api/user');
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
}