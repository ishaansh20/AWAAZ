import { useEffect, useState } from 'react';
import authService from '../services/authService';
import Logo from '../components/Logo';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      window.location.href = '/auth';
      return;
    }

    // Get user data
    const userData = authService.getUser();
    
    // Check if user has admin role
    if (userData && userData.role !== 'admin') {
      window.location.href = '/dashboard';
      return;
    }
    
    setUser(userData);
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="p-4 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Logo size="sm" />
            <h1 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          </div>
          <div className="flex items-center">
            <div className="relative mr-4">
              <button className="flex items-center text-gray-700 dark:text-gray-300 focus:outline-none">
                <img 
                  className="h-8 w-8 rounded-full border-2 border-indigo-500"
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`} 
                  alt={user.name} 
                />
                <span className="ml-2 font-medium">{user.name}</span>
                <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
            <button 
              onClick={handleLogout}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 focus:outline-none flex items-center"
            >
              <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Welcome card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 col-span-full">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Welcome to Awaaz Portal Admin Dashboard, {user.name}!</h2>
            <p className="text-gray-600 dark:text-gray-400">This is your admin dashboard where you can manage user complaints, view statistics, and handle administrative tasks.</p>
          </div>

          {/* Stats cards */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Views</h3>
              <svg className="h-6 w-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-4">1,254</p>
            <p className="text-sm text-green-500 flex items-center mt-2">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              7.2% increase
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Sessions</h3>
              <svg className="h-6 w-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-4">3</p>
            <p className="text-sm text-yellow-500 flex items-center mt-2">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              Same as yesterday
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Posts</h3>
              <svg className="h-6 w-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-4">28</p>
            <p className="text-sm text-green-500 flex items-center mt-2">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              12.5% increase
            </p>
          </div>
        </div>

        {/* Recent activity */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {[1, 2, 3, 4, 5].map((i) => (
                <li key={i} className="px-6 py-4 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    i % 3 === 0 ? 'bg-green-100 text-green-500' : 
                    i % 3 === 1 ? 'bg-blue-100 text-blue-500' : 'bg-purple-100 text-purple-500'
                  }`}>
                    {i % 3 === 0 ? (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      </svg>
                    ) : i % 3 === 1 ? (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {i % 3 === 0 ? 'New post created' : i % 3 === 1 ? 'Profile viewed' : 'Account updated'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {i % 3 === 0 ? 'You created a new post titled "Getting Started"' : 
                       i % 3 === 1 ? 'Your profile was viewed by 12 people' : 
                       'You updated your account settings'}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{`${i}h ago`}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 