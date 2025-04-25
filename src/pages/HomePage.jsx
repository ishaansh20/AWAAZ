import { Link } from 'react-router-dom';
import authService from '../services/authService';

const HomePage = () => {
  const isLoggedIn = authService.isLoggedIn();
  const user = isLoggedIn ? authService.getCurrentUser() : null;
  const isAdmin = user && user.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Awaaz Complaint Management</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A platform to report, track, and resolve complaints. Your voice matters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">About Awaaz</h2>
            <p className="text-gray-300 mb-6">
              Awaaz is a comprehensive complaint management system that allows users to submit, 
              track, and manage their complaints. The system includes user authentication, 
              complaint submission and tracking, admin dashboard, and more.
            </p>
            {!isLoggedIn && (
              <Link 
                to="/auth" 
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg"
              >
                Login / Register
              </Link>
            )}
          </div>

          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
            <ul className="space-y-3">
              {isLoggedIn && (
                <>
                  <li>
                    <Link 
                      to="/dashboard" 
                      className="text-purple-400 hover:text-purple-300 flex items-center"
                    >
                      <span className="mr-2">→</span> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/submit-complaint" 
                      className="text-purple-400 hover:text-purple-300 flex items-center"
                    >
                      <span className="mr-2">→</span> Submit Complaint
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/profile" 
                      className="text-purple-400 hover:text-purple-300 flex items-center"
                    >
                      <span className="mr-2">→</span> Profile
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link 
                        to="/admin/dashboard" 
                        className="text-purple-400 hover:text-purple-300 flex items-center"
                      >
                        <span className="mr-2">→</span> Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <button 
                      onClick={() => authService.logout()} 
                      className="text-purple-400 hover:text-purple-300 flex items-center"
                    >
                      <span className="mr-2">→</span> Logout
                    </button>
                  </li>
                </>
              )}
              {!isLoggedIn && (
                <li>
                  <Link 
                    to="/auth" 
                    className="text-purple-400 hover:text-purple-300 flex items-center"
                  >
                    <span className="mr-2">→</span> Login / Register
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 