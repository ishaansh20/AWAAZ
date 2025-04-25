import { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import authService from '../services/authService';

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [topComplaints, setTopComplaints] = useState([]);
  const [topAnonymousComplaints, setTopAnonymousComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const loggedIn = authService.isAuthenticated();
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        const user = authService.getUser();
        setIsAdmin(user && user.role === 'admin');
      }
    };
    
    checkAuth();
    
    // Fetch top complaints (this would be replaced with actual API call)
    const fetchTopComplaints = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockTopComplaints = [
          { id: 1, title: 'Poor road conditions in Sector 15', category: 'Infrastructure', upvotes: 128, createdAt: '2023-06-15', status: 'In Progress' },
          { id: 2, title: 'Irregular water supply in West Block', category: 'Utilities', upvotes: 96, createdAt: '2023-06-20', status: 'Pending' },
          { id: 3, title: 'Improper waste management near Central Market', category: 'Sanitation', upvotes: 87, createdAt: '2023-06-18', status: 'Resolved' },
          { id: 4, title: 'Streetlights not working on Main Road', category: 'Infrastructure', upvotes: 74, createdAt: '2023-06-19', status: 'In Progress' },
          { id: 5, title: 'Noise pollution from construction site', category: 'Environment', upvotes: 65, createdAt: '2023-06-22', status: 'Pending' },
        ];
        
        const mockAnonymousComplaints = [
          { id: 6, title: 'Illegal parking issues near Shopping Complex', category: 'Traffic', upvotes: 112, createdAt: '2023-06-17', status: 'In Progress', isAnonymous: true },
          { id: 7, title: 'Corruption in local office', category: 'Governance', upvotes: 89, createdAt: '2023-06-14', status: 'Under Investigation', isAnonymous: true },
          { id: 8, title: 'Unauthorized construction in Green Zone', category: 'Environment', upvotes: 76, createdAt: '2023-06-16', status: 'Pending', isAnonymous: true },
          { id: 9, title: 'Public property damage in Central Park', category: 'Infrastructure', upvotes: 65, createdAt: '2023-06-21', status: 'In Progress', isAnonymous: true },
          { id: 10, title: 'Stray animal concerns in Residential Area', category: 'Health & Safety', upvotes: 58, createdAt: '2023-06-19', status: 'Assigned', isAnonymous: true },
        ];
        
        setTopComplaints(mockTopComplaints);
        setTopAnonymousComplaints(mockAnonymousComplaints);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopComplaints();
  }, []);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Generate status badge based on status
  const StatusBadge = ({ status }) => {
    let badgeClass = '';
    
    switch (status.toLowerCase()) {
      case 'resolved':
        badgeClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        break;
      case 'in progress':
        badgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        break;
      case 'pending':
        badgeClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        break;
      case 'under investigation':
        badgeClass = 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
        break;
      case 'assigned':
        badgeClass = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
        break;
      default:
        badgeClass = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
        {status}
      </span>
    );
  };

  // Complaint card component
  const ComplaintCard = ({ complaint }) => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all duration-200 hover:shadow-lg">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{complaint.title}</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
              </svg>
              <span>{complaint.upvotes}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {complaint.category}
            </span>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Submitted: {formatDate(complaint.createdAt)}
            </div>
          </div>
          <StatusBadge status={complaint.status} />
        </div>
        
        <div className="mt-4 flex justify-end">
          <a 
            href={`/complaints/${complaint.id}`} 
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium flex items-center transition-colors duration-200"
          >
            View Details
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Logo size="sm" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white hidden sm:block">Portal</h1>
            </div>
            
            <nav className="flex items-center space-x-4">
              <a href="/" className="text-indigo-600 dark:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Home</a>
              <a href="/submit-complaint" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Submit Complaint</a>
              {isLoggedIn && (
                <a href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
              )}
              {isLoggedIn && (
                <a href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Profile</a>
              )}
              {isAdmin && (
                <a href="/admin/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Admin</a>
              )}
              
              {isLoggedIn ? (
                <button 
                  onClick={() => authService.logout()} 
                  className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Logout
                </button>
              ) : (
                <a 
                  href="/auth" 
                  className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Login
                </a>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Speak up, Be heard!
            </h1>
            <p className="mt-4 text-lg text-indigo-100 max-w-2xl">
              Awaaz Portal empowers citizens to voice their concerns and track resolutions. Submit a complaint, track its status, and be part of the change.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a 
                href="/submit-complaint" 
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
              >
                Submit Complaint
              </a>
              {isLoggedIn ? (
                <a 
                  href="/dashboard" 
                  className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-500"
                >
                  My Dashboard
                </a>
              ) : (
                <a 
                  href="/auth" 
                  className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-500"
                >
                  Sign Up / Login
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Complaints Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Complaints</h2>
                  <a 
                    href="/complaints" 
                    className="text-indigo-600 hover:text-indigo-500 text-sm font-medium flex items-center"
                  >
                    View All
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
                <div className="grid gap-4">
                  {topComplaints.map((complaint) => (
                    <ComplaintCard key={complaint.id} complaint={complaint} />
                  ))}
                </div>
              </section>

              {/* Top Anonymous Complaints Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Anonymous Complaints</h2>
                  <a 
                    href="/complaints/anonymous" 
                    className="text-indigo-600 hover:text-indigo-500 text-sm font-medium flex items-center"
                  >
                    View All
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
                <div className="grid gap-4">
                  {topAnonymousComplaints.map((complaint) => (
                    <ComplaintCard key={complaint.id} complaint={complaint} />
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      {/* Statistics Section */}
      <section className="bg-indigo-50 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Making a Difference Together</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">1,250+</div>
              <div className="mt-1 text-gray-600 dark:text-gray-300">Complaints Submitted</div>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">85%</div>
              <div className="mt-1 text-gray-600 dark:text-gray-300">Resolution Rate</div>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">750+</div>
              <div className="mt-1 text-gray-600 dark:text-gray-300">Active Users</div>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">48 hrs</div>
              <div className="mt-1 text-gray-600 dark:text-gray-300">Avg. Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Logo size="sm" />
              <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
                Awaaz Portal empowers citizens to voice their concerns and track resolutions to make a positive impact in our community.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Quick Links</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="/about" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">About Us</a>
                </li>
                <li>
                  <a href="/faqs" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">FAQs</a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">Contact Us</a>
                </li>
                <li>
                  <a href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">Blog</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">Terms of Service</a>
                </li>
                <li>
                  <a href="/accessibility" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">Accessibility</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
              &copy; {new Date().getFullYear()} Awaaz Portal. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 