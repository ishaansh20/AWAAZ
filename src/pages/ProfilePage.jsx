import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import Logo from '../components/Logo';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [userComplaints, setUserComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate('/auth');
      return;
    }

    // Get user data
    const userData = authService.getUser();
    setUser(userData);

    // Fetch user complaints (mock data for now)
    const fetchUserComplaints = async () => {
      setLoading(true);
      try {
        // This would be replaced with an actual API call in a real application
        const mockComplaints = [
          { id: 1, title: "Water supply issue in Block B", category: "Utilities", status: "Resolved", date: "2023-07-15", description: "No water supply for the past 2 days" },
          { id: 2, title: "Electricity fluctuation in my apartment", category: "Utilities", status: "In Progress", date: "2023-07-20", description: "Frequent power cuts in the evening" },
          { id: 3, title: "Lift not working properly", category: "Infrastructure", status: "Pending", date: "2023-07-25", description: "Elevator stops working between floors" },
          { id: 4, title: "Garbage collection issue", category: "Sanitation", status: "Resolved", date: "2023-07-30", description: "Garbage not collected for a week" },
          { id: 5, title: "Stray dogs in the complex", category: "Health & Safety", status: "In Progress", date: "2023-08-05", description: "Aggressive stray dogs around Block C" }
        ];
        
        setUserComplaints(mockComplaints);
      } catch (error) {
        console.error('Error fetching user complaints:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserComplaints();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
  };

  // Function to get status badge styling
  const getStatusBadgeClass = (status) => {
    switch(status.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'pending':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (!user || loading) {
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
            <h1 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">User Profile</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Home</a>
            <a href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
            <a href="/submit-complaint" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Submit Complaint</a>
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
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          {/* Profile Section */}
          <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100 border-4 border-indigo-500">
                <img 
                  className="h-full w-full object-cover"
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&size=128`} 
                  alt={user.name} 
                />
              </div>
              <div className="ml-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">User profile details</p>
              </div>
            </div>
            <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
              </svg>
              Edit Profile
            </button>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700">
            <dl>
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{user.name}</dd>
              </div>
              <div className="bg-white dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{user.email}</dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone number</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{user.phoneNumber}</dd>
              </div>
              <div className="bg-white dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 capitalize">{user.role}</dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total complaints</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{userComplaints.length}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Complaints Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Complaints</h2>
            <a 
              href="/submit-complaint" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              New Complaint
            </a>
          </div>

          {/* Complaint cards */}
          <div className="grid gap-6 lg:grid-cols-2">
            {userComplaints.map((complaint) => (
              <div key={complaint.id} className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{complaint.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {complaint.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                        {complaint.category}
                      </span>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Submitted on {complaint.date}
                      </p>
                    </div>
                    <a 
                      href={`/complaint/${complaint.id}`}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Details
                      <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage; 