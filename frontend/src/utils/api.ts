export const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    let url = process.env.NEXT_PUBLIC_API_URL;
    // Fix missing protocol if user provided just the hostname in Render env vars
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    // Remove trailing slash to prevent double slashes in paths
    return url.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    // If on Render, try to intelligently find the backend
    if (window.location.hostname.includes('onrender.com')) {
      // 1. Try explicit backend subdomain
      if (window.location.hostname.includes('-frontend.')) {
        return `https://${window.location.hostname.replace('-frontend.', '-backend.')}`;
      }
      // 2. Check for paypee (legacy) if it's in the browser context
      if (window.location.hostname.includes('paypee')) {
        return 'https://paypee.onrender.com';
      }
      // 3. Fallback to common conventions
      return 'https://travsify-backend.onrender.com';
    }
    // For local development on Windows, 127.0.0.1 is more reliable than localhost
    if (window.location.hostname === 'localhost') {
      return 'http://127.0.0.1:3001';
    }
    const protocol = window.location.protocol;
    return `${protocol}//${window.location.hostname}:3001`;
  }
  return 'http://127.0.0.1:3001';
};

export const API_URL = getApiUrl();
