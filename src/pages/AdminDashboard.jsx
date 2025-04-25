import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import Logo from '../components/Logo';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!authService.isAuthenticated()) {
      navigate('/auth');
      return;
    }

    const userData = authService.getUser();
    if (!userData || userData.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    setUser(userData);

    // Fetch complaints (mock data for now)
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        // This would be replaced with an actual API call in a real application
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        // Mock data for complaints
        const mockComplaints = [
          {
            id: 1,
            title: "Water supply issue in Block B",
            category: "Utilities",
            status: "In Progress",
            submittedAt: "2023-07-15T09:30:00Z",
            name: "John Doe",
            phoneNumber: "9876543210",
            email: "john.doe@example.com",
            isAnonymous: false,
            referenceNumber: "CP-000001",
            priority: "High"
          },
          {
            id: 2,
            title: "Electricity fluctuation in Sector 10",
            category: "Utilities",
            status: "Pending",
            submittedAt: "2023-07-16T14:45:00Z",
            name: "Jane Smith",
            phoneNumber: "9876543211",
            email: "jane.smith@example.com",
            isAnonymous: false,
            referenceNumber: "CP-000002",
            priority: "Medium"
          },
          {
            id: 3,
            title: "Corruption in local office",
            category: "Governance",
            status: "Under Investigation",
            submittedAt: "2023-07-14T11:20:00Z",
            name: null,
            phoneNumber: null,
            email: null,
            isAnonymous: true,
            referenceNumber: "CP-000003",
            priority: "High"
          },
          {
            id: 4,
            title: "Poor road conditions in West Block",
            category: "Infrastructure",
            status: "Resolved",
            submittedAt: "2023-07-10T08:15:00Z",
            name: "Robert Johnson",
            phoneNumber: "9876543212",
            email: "robert.j@example.com",
            isAnonymous: false,
            referenceNumber: "CP-000004",
            priority: "Low"
          },
          {
            id: 5,
            title: "Garbage not collected for a week",
            category: "Sanitation",
            status: "Assigned",
            submittedAt: "2023-07-13T16:40:00Z",
            name: "Emily Wilson",
            phoneNumber: "9876543213",
            email: "emily.w@example.com",
            isAnonymous: false,
            referenceNumber: "CP-000005",
            priority: "Medium"
          },
          {
            id: 6,
            title: "Noise pollution from construction site",
            category: "Environment",
            status: "Pending",
            submittedAt: "2023-07-17T13:10:00Z",
            name: null,
            phoneNumber: null,
            email: null,
            isAnonymous: true,
            referenceNumber: "CP-000006",
            priority: "Low"
          },
          {
            id: 7,
            title: "Stray dogs in residential area",
            category: "Public Safety",
            status: "In Progress",
            submittedAt: "2023-07-12T10:25:00Z",
            name: "Michael Brown",
            phoneNumber: "9876543214",
            email: "michael.b@example.com",
            isAnonymous: false,
            referenceNumber: "CP-000007",
            priority: "Medium"
          },
          {
            id: 8,
            title: "Street lights not working",
            category: "Infrastructure",
            status: "Resolved",
            submittedAt: "2023-07-08T17:50:00Z",
            name: "Sarah Davis",
            phoneNumber: "9876543215",
            email: "sarah.d@example.com",
            isAnonymous: false,
            referenceNumber: "CP-000008",
            priority: "Medium"
          }
        ];
        
        setComplaints(mockComplaints);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchComplaints();
  }, [navigate]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter and sort complaints
  const getFilteredComplaints = () => {
    let filtered = [...complaints];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(complaint => 
        complaint.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(complaint => 
        complaint.title.toLowerCase().includes(search) ||
        complaint.referenceNumber.toLowerCase().includes(search) ||
        (complaint.name && complaint.name.toLowerCase().includes(search)) ||
        (complaint.email && complaint.email.toLowerCase().includes(search)) ||
        (complaint.phoneNumber && complaint.phoneNumber.includes(search))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'date':
          valueA = new Date(a.submittedAt);
          valueB = new Date(b.submittedAt);
          break;
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          valueA = priorityOrder[a.priority] || 0;
          valueB = priorityOrder[b.priority] || 0;
          break;
        case 'status':
          valueA = a.status;
          valueB = b.status;
          break;
        default:
          valueA = a[sortBy];
          valueB = b[sortBy];
      }
      
      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    
    return filtered;
  };

  const getStatusBadgeClass = (status) => {
    switch(status.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'under investigation':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'assigned':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch(priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="p-4 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
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
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=6366f1&color=fff`} 
                  alt={user?.name || 'Admin'} 
                />
                <span className="ml-2 font-medium">{user?.name || 'Admin'}</span>
              </button>
            </div>
            <button 
              onClick={() => authService.logout()}
              className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-md focus:outline-none flex items-center"
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Complaint Management</h2>
          
          {/* Filter and search controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                placeholder="Search by title, name, email, phone, ref#"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status Filter
              </label>
              <select
                id="status-filter"
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="under investigation">Under Investigation</option>
                <option value="assigned">Assigned</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <div className="flex">
                <select
                  id="sort-by"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-l-md"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setSortOrder('asc');
                  }}
                >
                  <option value="date">Date</option>
                  <option value="priority">Priority</option>
                  <option value="status">Status</option>
                  <option value="title">Title</option>
                </select>
                <button
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-r-md hover:bg-gray-100 dark:hover:bg-gray-500"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? (
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints table */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('referenceNumber')}
                  >
                    <div className="flex items-center">
                      Ref. No.
                      {sortBy === 'referenceNumber' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      Title
                      {sortBy === 'title' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Submitter
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortBy === 'status' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('priority')}
                  >
                    <div className="flex items-center">
                      Priority
                      {sortBy === 'priority' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Date
                      {sortBy === 'date' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {getFilteredComplaints().map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {complaint.referenceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {complaint.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {complaint.isAnonymous ? (
                        <span className="italic text-gray-500 dark:text-gray-400">Anonymous</span>
                      ) : (
                        <div>
                          <div>{complaint.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{complaint.email}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{complaint.phoneNumber}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeClass(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(complaint.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href={`/complaint/${complaint.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4">
                        View
                      </a>
                      <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {getFilteredComplaints().length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No complaints found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 