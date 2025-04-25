import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { authenticated, loading, user, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show loading spinner or placeholder while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!authenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin()) {
    // Redirect to dashboard if not admin but trying to access admin route
    return <Navigate to="/dashboard" replace />;
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute; 