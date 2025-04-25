import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkAuth = () => {
      try {
        if (authService.isLoggedIn()) {
          setUser(authService.getCurrentUser());
          setAuthenticated(true);
        } else {
          setUser(null);
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setUser(null);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Update context when user logs in or out
  const updateAuthState = () => {
    if (authService.isLoggedIn()) {
      setUser(authService.getCurrentUser());
      setAuthenticated(true);
    } else {
      setUser(null);
      setAuthenticated(false);
    }
  };

  const value = {
    user,
    loading,
    authenticated,
    updateAuthState,
    isAdmin: () => authService.isAdmin(),
    userRole: () => authService.getUserRole()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 