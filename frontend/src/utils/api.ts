export const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (typeof window !== 'undefined') {
    // If on Render, try to intelligently find the backend
    if (window.location.hostname.includes('onrender.com')) {
      // Convention: travsify-frontend.onrender.com -> travsify-backend.onrender.com
      if (window.location.hostname.includes('-frontend.')) {
        return `https://${window.location.hostname.replace('-frontend.', '-backend.')}`;
      }
      return 'https://travsify-backend.onrender.com';
    }
    const protocol = window.location.protocol;
    return `${protocol}//${window.location.hostname}:3001`;
  }
  return 'http://localhost:3001';
};

export const API_URL = getApiUrl();
