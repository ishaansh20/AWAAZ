import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../services/authService';
import Logo from '../components/Logo';

const UserDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      window.location.href = '/auth';
      return;
    }

    // Get user data
    const userData = authService.getUser();
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
            <h1 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">User Dashboard</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
            <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
            <Link to="/submit-complaint" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Submit Complaint</Link>
            <button 
              onClick={handleLogout}
              className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-md focus:outline-none flex items-center"
            >
              <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Welcome card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 col-span-full">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Welcome to Awaaz Portal, {user.name}!</h2>
            <p className="text-gray-600 dark:text-gray-400">This is your dashboard where you can manage your complaints and track their status.</p>
          </div>

          {/* Stats cards */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">My Complaints</h3>
              <svg className="h-6 w-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-4">5</p>
            <p className="text-sm text-green-500 flex items-center mt-2">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              New complaint added
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Resolved</h3>
              <svg className="h-6 w-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-4">3</p>
            <p className="text-sm text-green-500 flex items-center mt-2">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              1 resolved this week
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pending</h3>
              <svg className="h-6 w-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-4">2</p>
            <p className="text-sm text-yellow-500 flex items-center mt-2">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              Processing
            </p>
          </div>
        </div>

        {/* New Complaint Button */}
        <div className="mt-8 mb-6">
          <Link 
            to="/submit-complaint" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Submit New Complaint
          </Link>
        </div>

        {/* Recent complaints */}
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">My Recent Complaints</h3>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {[
                { id: 1, title: "Water supply issue in Block B", status: "Resolved", date: "2023-07-15" },
                { id: 2, title: "Electricity fluctuation in my apartment", status: "In Progress", date: "2023-07-20" },
                { id: 3, title: "Lift not working properly", status: "Pending", date: "2023-07-25" },
                { id: 4, title: "Garbage collection issue", status: "Resolved", date: "2023-07-30" },
                { id: 5, title: "Stray dogs in the complex", status: "In Progress", date: "2023-08-05" }
              ].map((complaint) => (
                <li key={complaint.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out">
                  <Link to={`/complaint/${complaint.id}`} className="block">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{complaint.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Submitted on {complaint.date}</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          complaint.status === 'Resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                          complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {complaint.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard; 