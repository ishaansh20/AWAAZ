/**
 * Application configuration
 */
const config = {
  // API base URL - change this to your API endpoint
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  
  // App name
  appName: 'Awaaz Portal',
  
  // Authentication
  auth: {
    tokenKey: 'awaaz_auth_token',
    userKey: 'awaaz_user',
  },
  
  // App theme colors
  theme: {
    primary: '#4f46e5', // indigo-600
    secondary: '#6366f1', // indigo-500 
    accent: '#7c3aed', // purple-600
    background: '#f9fafb', // gray-50
  }
};

export default config; 