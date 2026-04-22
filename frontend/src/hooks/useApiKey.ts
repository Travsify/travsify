import { useState, useEffect } from 'react';
import { API_URL } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

export function useApiKey() {
  const { token } = useAuth();
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    
    // Check if we already have it cached to avoid duplicate requests
    const cachedKey = localStorage.getItem('tenant_api_key');
    if (cachedKey) {
      setApiKey(cachedKey);
      return;
    }

    fetch(`${API_URL}/tenant/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.apiKey) {
          setApiKey(data.apiKey);
          localStorage.setItem('tenant_api_key', data.apiKey);
        }
      })
      .catch(err => console.error('Failed to fetch API key', err));
  }, [token]);

  return apiKey;
}
