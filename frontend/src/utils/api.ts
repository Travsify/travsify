export const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    // If on Render, point to the known backend subdomain
    if (window.location.hostname.includes('onrender.com')) {
      return 'https://travsify-backend.onrender.com';
    }
    // Fallback for local development
    const protocol = window.location.protocol;
    return `${protocol}//${window.location.hostname}:3001`;
  }
  return 'http://localhost:3001';
};

export const API_URL = getApiUrl();
