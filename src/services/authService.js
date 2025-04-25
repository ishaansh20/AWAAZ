import api from './api';

// Mock user data for testing when backend is not available
const MOCK_ENABLED = true; // Set to false when backend is properly connected

// Initialize mock users from localStorage or use defaults
const getInitialMockUsers = () => {
  const storedUsers = localStorage.getItem('mockUsers');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  
  // Default mock users
  const defaultUsers = [
    {
      id: 'admin-123',
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
      name: 'Admin User',
      password: 'admin123' // Store password for mock auth
    },
    {
      id: 'user-123',
      username: 'user1',
      email: 'user1@example.com',
      role: 'user',
      name: 'Regular User',
      password: 'password123' // Store password for mock auth
    }
  ];
  
  // Store default users in localStorage
  localStorage.setItem('mockUsers', JSON.stringify(defaultUsers));
  return defaultUsers;
};

let MOCK_USERS = getInitialMockUsers();

// Function to save mock users to localStorage
const saveMockUsers = () => {
  localStorage.setItem('mockUsers', JSON.stringify(MOCK_USERS));
};

const authService = {
  // Register a new user
  register: async (userData) => {
    // For testing without backend
    if (MOCK_ENABLED) {
      // Check if user exists in mock users
      const existingUser = MOCK_USERS.find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }
      
      // Create mock user
      const newUser = {
        id: `user-${Date.now()}`,
        username: userData.username || userData.email.split('@')[0],
        email: userData.email,
        role: 'user',
        name: userData.name || 'New User',
        password: userData.password // Store password for mock auth
      };
      
      // Add the new user to MOCK_USERS array
      MOCK_USERS.push(newUser);
      
      // Save updated users to localStorage
      saveMockUsers();
      
      // Store in localStorage to simulate persistence
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify({...newUser, password: undefined})); // Don't store password in user session
      
      return { success: true, message: 'Registration successful!', data: { user: {...newUser, password: undefined} } };
    }
    
    // Real implementation
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Registration failed');
    }
  },

  // Login an existing user
  login: async (credentials) => {
    // For testing without backend
    if (MOCK_ENABLED) {
      // Refresh mock users from localStorage in case they were updated in another tab
      MOCK_USERS = getInitialMockUsers();
      
      // Check credentials against mock users
      const user = MOCK_USERS.find(user => 
        user.email === credentials.emailOrPhone || 
        user.email === credentials.email
      );
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Check password (real implementation would use bcrypt comparison)
      if (user.password !== credentials.password) {
        throw new Error('Incorrect password');
      }
      
      // Store auth data (remove password for security)
      const userWithoutPassword = {...user, password: undefined};
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      return { success: true, token: 'mock-token', data: { user: userWithoutPassword } };
    }
    
    // Real implementation
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Login failed');
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  // Get current user data
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Add an alias for getCurrentUser for compatibility
  getUser: () => {
    return authService.getCurrentUser();
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },

  // Add an alias for isLoggedIn for compatibility
  isAuthenticated: () => {
    return authService.isLoggedIn();
  },

  // Get user role
  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user ? user.role : null;
  },

  // Check if user is admin
  isAdmin: () => {
    return authService.getUserRole() === 'admin';
  },

  // Update user password
  updatePassword: async (passwordData) => {
    // For testing without backend
    if (MOCK_ENABLED) {
      // Find the current user
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Not logged in');
      }
      
      // Find user in MOCK_USERS array
      const userIndex = MOCK_USERS.findIndex(user => user.id === currentUser.id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }
      
      // Update password
      MOCK_USERS[userIndex].password = passwordData.newPassword;
      saveMockUsers();
      
      return { success: true, message: 'Password updated successfully' };
    }
    
    try {
      const response = await api.patch('/auth/update-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Password update failed');
    }
  },

  // Get user profile
  getProfile: async () => {
    // For testing without backend
    if (MOCK_ENABLED) {
      const user = authService.getCurrentUser();
      return { success: true, data: { user } };
    }
    
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Failed to get profile');
    }
  }
};

export default authService; 