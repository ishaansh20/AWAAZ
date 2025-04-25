import { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import authService from '../services/authService';
import { images } from '../assets/images';

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [topComplaints, setTopComplaints] = useState([]);
  const [topAnonymousComplaints, setTopAnonymousComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Added for the fade-in animations
  const [isVisible, setIsVisible] = useState(false);

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
        // Trigger fade-in animation after data is loaded
        setTimeout(() => setIsVisible(true), 300);
      }
    };
    
    fetchTopComplaints();
  }, []);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get category icon based on category name
  const getCategoryIcon = (category) => {
    switch(category.toLowerCase()) {
      case 'infrastructure': return images.iconInfrastructure;
      case 'utilities': return images.iconUtilities;
      case 'sanitation': return images.iconSanitation;
      case 'environment': return images.iconEnvironment;
      case 'traffic': return images.iconTraffic;
      case 'governance': return images.iconGovernance;
      case 'health & safety': return images.iconHealth;
      default: return 'https://img.icons8.com/fluency/96/document.png';
    }
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

  // Complaint card component with improved UI
  const ComplaintCard = ({ complaint }) => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 border-l-4 border-indigo-500">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 flex-shrink-0">
              <img src={getCategoryIcon(complaint.category)} alt={complaint.category} className="w-full h-full" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{complaint.title}</h3>
              <div className="mt-1 flex items-center">
                <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {complaint.category}
                </span>
                {complaint.isAnonymous && (
                  <span className="ml-2 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Anonymous
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"></path>
              </svg>
              <span>{complaint.upvotes}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Submitted: {formatDate(complaint.createdAt)}
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
              <div className="py-2">
                <Logo size="md" variant="blue" showText={true} />
              </div>
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

      {/* Hero Section with Background Image */}
      <div className="relative min-h-[500px] flex items-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={images.heroImage} 
            alt="People raising their voices" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-indigo-900 opacity-70"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-white">
                <span className="block">Your Voice Matters,</span>
                <span className="block text-indigo-200">Your Identity is Protected</span>
              </h1>
              <p className="mt-4 text-lg text-indigo-100 max-w-2xl">
                Awaaz Portal empowers citizens to voice their concerns anonymously and track resolutions. 
                Speak freely without fear, and be part of the change.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a 
                  href="/submit-complaint" 
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 transition duration-200"
                >
                  Submit Complaint
                </a>
                {isLoggedIn ? (
                  <a 
                    href="/dashboard" 
                    className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-500 transition duration-200"
                  >
                    My Dashboard
                  </a>
                ) : (
                  <a 
                    href="/auth" 
                    className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-500 transition duration-200"
                  >
                    Sign Up / Login
                  </a>
                )}
              </div>
            </div>
            
            <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 border-l-4 border-indigo-500">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">Anonymous Reporting</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  Your identity remains protected when you submit anonymous complaints. 
                  Speak truth to power without fear of repercussions.
                </p>
                <div className="mt-6 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">1</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Submit your concern anonymously</p>
                </div>
                <div className="mt-2 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">2</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Track with private access code</p>
                </div>
                <div className="mt-2 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">3</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Get resolution without revealing identity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Why Choose Awaaz?</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Empowering citizens with anonymous reporting, transparent tracking, and effective resolutions.</p>
          </div>
          
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Anonymous Reporting */}
            <div className={`rounded-lg overflow-hidden shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img 
                  src={images.featureAnonymous} 
                  alt="Anonymous Reporting" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 bg-white dark:bg-gray-800">
                <div className="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">Anonymous Reporting</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Submit complaints without revealing your identity. Your privacy is our priority, 
                  allowing you to report sensitive issues without fear.
                </p>
              </div>
            </div>
            
            {/* Feature 2: Transparent Tracking */}
            <div className={`rounded-lg overflow-hidden shadow-md transition-all duration-500 delay-200 transform hover:-translate-y-1 hover:shadow-lg ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img 
                  src={images.featureTracking} 
                  alt="Transparent Tracking" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 bg-white dark:bg-gray-800">
                <div className="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">Transparent Tracking</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Monitor the progress of your complaint in real-time. Stay informed at every step
                  while maintaining your anonymity if you choose.
                </p>
              </div>
            </div>
            
            {/* Feature 3: Effective Resolution */}
            <div className={`rounded-lg overflow-hidden shadow-md transition-all duration-700 delay-300 transform hover:-translate-y-1 hover:shadow-lg ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <div className="h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <img 
                  src={images.featureResolution} 
                  alt="Effective Resolution" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 bg-white dark:bg-gray-800">
                <div className="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">Effective Resolution</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Our platform ensures your voice leads to action. With an 85% resolution rate, 
                  we connect citizens and authorities for real change.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Anonymity Feature Banner */}
      <section className="bg-indigo-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className={`rounded-lg overflow-hidden shadow-lg ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
              <img 
                src={images.anonymityIllustration} 
                alt="Anonymity and Protection" 
                className="w-full h-auto"
              />
            </div>
            <div className={`transition-all duration-700 delay-300 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Voice, Your Power, Your Protection</h2>
              <div className="mt-4 space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Complete Anonymity</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Submit complaints without revealing any personal information. We never track or store identifying data.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Encrypted Communication</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">End-to-end encryption ensures your report details remain confidential and secure.</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Whistleblower Protection</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">Our platform is designed with built-in protections for reporting sensitive or corruption-related issues.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <a 
                  href="/learn-more-anonymity" 
                  className="text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
                >
                  Learn more about our anonymity features
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Complaints */}
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Top Complaints Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Top Public Complaints
                  </h2>
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
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Top Anonymous Complaints
                  </h2>
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

      {/* Statistics Section with Background */}
      <section className="relative py-16">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={images.communityAwareness}
            alt="Community awareness" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-indigo-900 opacity-80"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-center items-center mb-8">
            <Logo size="xl" variant="white" showText={true} />
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-12">Making a Difference Together</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 transform transition duration-300 hover:scale-105">
              <div className="text-3xl font-bold text-white">1,250+</div>
              <div className="mt-1 text-indigo-200">Complaints Submitted</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 transform transition duration-300 hover:scale-105">
              <div className="text-3xl font-bold text-white">85%</div>
              <div className="mt-1 text-indigo-200">Resolution Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 transform transition duration-300 hover:scale-105">
              <div className="text-3xl font-bold text-white">750+</div>
              <div className="mt-1 text-indigo-200">Active Users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 transform transition duration-300 hover:scale-105">
              <div className="text-3xl font-bold text-white">48 hrs</div>
              <div className="mt-1 text-indigo-200">Avg. Response Time</div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <a 
              href="/success-stories" 
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 transition duration-200"
            >
              Read Success Stories
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Speak Up?</h2>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
            Join thousands of citizens making a difference. Your voice matters, and your identity is protected.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/submit-complaint" 
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 shadow-lg transition duration-200"
            >
              Submit Anonymous Complaint
            </a>
            <a 
              href="/learn-more" 
              className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-indigo-500 transition duration-200"
            >
              Learn How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-2">
                <Logo size="xl" variant="blue" showText={true} />
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                Awaaz Portal empowers citizens to voice their concerns anonymously and track resolutions to make a positive impact in our community.
              </p>
              <div className="mt-4 flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
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
                <li>
                  <a href="/success-stories" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">Success Stories</a>
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
                  <a href="/anonymity-policy" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">Anonymity Policy</a>
                </li>
                <li>
                  <a href="/accessibility" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">Accessibility</a>
                </li>
                <li>
                  <a href="/whistleblower" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm">Whistleblower Protection</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
              &copy; {new Date().getFullYear()} Awaaz Portal. All rights reserved. Your voice matters, your identity is protected.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 