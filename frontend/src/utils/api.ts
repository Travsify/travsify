export const getApiUrl = () => {
  let finalUrl = '';
  if (process.env.NEXT_PUBLIC_API_URL) {
    let url = process.env.NEXT_PUBLIC_API_URL;
    // Fix missing protocol if user provided just the hostname in Render env vars
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    // Fix missing domain if user provided just the service name (e.g. "travsify-backend")
    if (url.includes('onrender') && !url.includes('.')) {
        // This case is rare but let's be safe
    } else if (!url.includes('.') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
      url = `${url}.onrender.com`;
    }
    // Remove trailing slash to prevent double slashes in paths
    finalUrl = url.replace(/\/$/, '');
  } else if (typeof window !== 'undefined') {
    // If on Render, try to intelligently find the backend
    if (window.location.hostname.includes('onrender.com')) {
      // 1. Try explicit backend subdomain
      if (window.location.hostname.includes('-frontend.')) {
        finalUrl = `https://${window.location.hostname.replace('-frontend.', '-backend.')}`;
      } else if (window.location.hostname.includes('paypee')) {
        // 2. Check for paypee (legacy) if it's in the browser context
        finalUrl = 'https://paypee-1.onrender.com';
      } else {
        // 3. Fallback to common conventions
        finalUrl = 'https://travsify-backend.onrender.com';
      }
    } else {
      // For local development on Windows, 127.0.0.1 is more reliable than localhost
      if (window.location.hostname === 'localhost') {
        finalUrl = 'http://127.0.0.1:3001';
      } else {
        const protocol = window.location.protocol;
        finalUrl = `${protocol}//${window.location.hostname}:3001`;
      }
    }
  } else {
    finalUrl = 'http://127.0.0.1:3001';
  }

  // Debug log for production connectivity
  if (typeof window !== 'undefined') {
    console.log('[API_URL_RESOLVER] Resolved to:', finalUrl);
  }
  
  return finalUrl;
};

export const API_URL = getApiUrl();

export const SHERPA_URL = "https://apply.joinsherpa.com/explore?affiliateId=pickpadiglobalinclusivelimited";
