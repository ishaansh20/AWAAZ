import config from '../config/config';

/**
 * Authentication service for login, logout, and token management
 */
const authService = {
  /**
   * Get stored token
   * @returns {string|null} - The stored token or null
   */
  getToken: () => {
    return localStorage.getItem(config.auth.tokenKey);
  },

  /**
   * Store auth token
   * @param {string} token - The token to store
   */
  setToken: (token) => {
    localStorage.setItem(config.auth.tokenKey, token);
  },

  /**
   * Get stored user
   * @returns {object|null} - The stored user or null
   */
  getUser: () => {
    const userData = localStorage.getItem(config.auth.userKey);
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Store user data
   * @param {object} user - The user data to store
   */
  setUser: (user) => {
    localStorage.setItem(config.auth.userKey, JSON.stringify(user));
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - Whether user is authenticated
   */
  isAuthenticated: () => {
    return !!authService.getToken();
  },

  /**
   * Log in a user
   * @param {object} credentials - The user credentials
   * @returns {Promise<object>} - The response data
   */
  login: async (credentials) => {
    try {
      // This is where you'd make your actual API call
      // In a real app, replace this with a fetch call to your backend
      
      // Example API call
      // const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(credentials),
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Login failed');
      // }
      
      // const data = await response.json();
      
      // For demo, simulate successful login
      let data;
      
      // Check if this is an admin login
      if (credentials.emailOrPhone === 'admin@awaaz.com' && credentials.password === 'admin123') {
        data = {
          token: 'admin-token-12345',
          user: {
            id: 999,
            name: 'Admin User',
            email: 'admin@awaaz.com',
            role: 'admin',
          },
        };
      } else {
        // For phone number admin login
        if (credentials.emailOrPhone === '9876543210' && credentials.password === 'admin123') {
          data = {
            token: 'admin-token-12345',
            user: {
              id: 999,
              name: 'Admin User',
              email: 'admin@awaaz.com',
              phoneNumber: '9876543210',
              role: 'admin',
            },
          };
        } else {
          // Regular user login
          data = {
            token: 'demo-token-12345',
            user: {
              id: 1,
              name: 'Demo User',
              email: /^\d+$/.test(credentials.emailOrPhone) ? 'user@example.com' : credentials.emailOrPhone,
              phoneNumber: /^\d+$/.test(credentials.emailOrPhone) ? credentials.emailOrPhone : '1234567890',
              role: 'user',
            },
          };
        }
      }
      
      // Store token and user data
      authService.setToken(data.token);
      authService.setUser(data.user);
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register a new user
   * @param {object} userData - The user data to register
   * @returns {Promise<object>} - The response data
   */
  register: async (userData) => {
    try {
      // This is where you'd make your actual API call
      // In a real app, replace this with a fetch call to your backend
      
      // Example API call
      // const response = await fetch(`${config.apiBaseUrl}/auth/register`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(userData),
      // });
      
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || 'Registration failed');
      // }
      
      // const data = await response.json();
      
      // For demo, simulate successful registration
      const data = {
        success: true,
        message: 'Registration successful',
        user: {
          id: Math.floor(Math.random() * 1000),
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          role: 'user',
        },
      };
      
      // In a real application, you might also log the user in automatically
      // after registration, or redirect to a login page
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Log out a user
   */
  logout: () => {
    localStorage.removeItem(config.auth.tokenKey);
    localStorage.removeItem(config.auth.userKey);
    // Redirect to login page or refresh
    window.location.href = '/';
  },
};

export default authService; 