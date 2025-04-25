import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import Logo from '../components/Logo';

const ComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    if (authService.isAuthenticated()) {
      const userData = authService.getUser();
      setUser(userData);
    }

    // Fetch complaint details (mock data for now)
    const fetchComplaintDetails = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock complaint data
        const mockComplaint = {
          id: parseInt(id),
          title: "Water supply issue in Block B",
          description: "There has been no water supply in Block B for the past 2 days. This is affecting all residents in the building. We have contacted the local water department but have not received any response yet. This is a critical issue that needs immediate attention.",
          category: "Utilities",
          location: "Block B, Sector 15, New Delhi",
          coordinates: { lat: 28.644800, lng: 77.216721 },
          status: "In Progress",
          statusHistory: [
            { status: "Submitted", date: "2023-07-15T09:30:00Z", note: "Complaint registered" },
            { status: "Under Review", date: "2023-07-16T10:15:00Z", note: "Assigned to local water department" },
            { status: "In Progress", date: "2023-07-17T14:20:00Z", note: "Technicians dispatched to investigate" }
          ],
          submittedBy: "Demo User",
          isAnonymous: false,
          submittedAt: "2023-07-15T09:30:00Z",
          assignedTo: "Water Department",
          images: [
            "https://placehold.co/600x400?text=Water+Supply+Issue",
            "https://placehold.co/600x400?text=Affected+Area"
          ],
          upvotes: 42,
          comments: [
            { id: 1, user: "Local Official", text: "We have received your complaint and are working on it.", date: "2023-07-16T11:45:00Z" },
            { id: 2, user: "Resident", text: "I'm also facing the same issue. Please resolve soon.", date: "2023-07-16T13:20:00Z" }
          ]
        };
        
        setComplaint(mockComplaint);
      } catch (error) {
        console.error("Error fetching complaint details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchComplaintDetails();
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    let badgeClass = '';
    
    switch (status.toLowerCase()) {
      case 'resolved':
        badgeClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        break;
      case 'in progress':
        badgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        break;
      case 'under review':
        badgeClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        break;
      case 'submitted':
        badgeClass = 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="p-4 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="p-4 text-center">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Complaint Not Found</h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">The complaint you're looking for doesn't exist or you don't have permission to view it.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go Back
          </button>
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
            <h1 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">Complaint Details</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Home</a>
            <a href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
            <a href="/submit-complaint" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Submit Complaint</a>
            
            {user ? (
              <button 
                onClick={() => authService.logout()}
                className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-md focus:outline-none flex items-center"
              >
                <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Logout
              </button>
            ) : (
              <a 
                href="/auth" 
                className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-md focus:outline-none flex items-center"
              >
                Login
              </a>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Back button and reference number */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500"
          >
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">
            Reference Number: <span className="font-mono font-medium text-gray-700 dark:text-gray-300">CP-{complaint.id.toString().padStart(6, '0')}</span>
          </p>
        </div>

        {/* Complaint details card */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">{complaint.title}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                Submitted on {formatDate(complaint.submittedAt)}
              </p>
            </div>
            <div className="mt-3 sm:mt-0">
              <StatusBadge status={complaint.status} />
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <dl>
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{complaint.category}</dd>
              </div>
              <div className="bg-white dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{complaint.description}</dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {complaint.location}
                  <div className="mt-2 h-40 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Map placeholder - would show location at coordinates {complaint.coordinates.lat}, {complaint.coordinates.lng}</p>
                  </div>
                </dd>
              </div>
              <div className="bg-white dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Registered by</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {complaint.isAnonymous ? 'Anonymous' : complaint.submittedBy}
                </dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned to</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">{complaint.assignedTo || 'Not yet assigned'}</dd>
              </div>
              <div className="bg-white dark:bg-gray-700 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Attachments</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {complaint.images && complaint.images.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      {complaint.images.map((image, index) => (
                        <div key={index} className="overflow-hidden rounded-lg">
                          <img src={image} alt={`Attachment ${index + 1}`} className="w-full h-auto" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No attachments</p>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Complaint Timeline</h3>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {complaint.statusHistory.map((item, index) => (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index !== complaint.statusHistory.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></span>
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                            {index === 0 ? (
                              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : index === complaint.statusHistory.length - 1 ? (
                              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                            )}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {item.note} <span className="font-medium text-gray-900 dark:text-white">{item.status}</span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                            {formatDate(item.date)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {complaint.comments && complaint.comments.length > 0 && (
          <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Comments</h3>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {complaint.comments.map((comment) => (
                  <li key={comment.id} className="px-4 py-4">
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                          {comment.user.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {comment.user}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(comment.date)}
                        </p>
                        <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                          <p>{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ComplaintDetailPage; 