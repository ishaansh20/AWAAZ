import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import Logo from '../components/Logo';

const ComplaintFormPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    useCurrentLocation: false,
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // Categories for complaints
  const categories = [
    'Sanitation',
    'Infrastructure',
    'Traffic',
    'Utilities',
    'Environment',
    'Public Safety',
    'Corruption',
    'Harassment',
    'Education',
    'Healthcare',
    'Other'
  ];

  useEffect(() => {
    // Check if user is authenticated
    if (authService.isAuthenticated()) {
      const userData = authService.getUser();
      setUser(userData);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          setFormData(prev => ({
            ...prev,
            location: `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`
          }));
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationLoading(false);
          alert('Could not get your current location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser. Please enter location manually.');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    
    try {
      // This would be replaced with an actual API call in a real application
      console.log('Submitting complaint with data:', {
        ...formData,
        isAnonymous,
        userId: isAnonymous ? null : user?.id,
        files: files.map(file => file.name), // In a real app, you'd upload these files
        submittedAt: new Date().toISOString()
      });
      
      // Simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to success page or dashboard
      alert('Complaint submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setErrors({ form: 'Failed to submit complaint. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Logo size="sm" />
            <h1 className="ml-4 text-xl font-bold text-gray-900 dark:text-white">Submit Complaint</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Home</a>
            <a href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
            <a href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-medium">Profile</a>
            
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
      <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:py-10 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Complaint Form</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Fill in the details to submit your complaint
            </p>
          </div>

          {/* Anonymous Mode Toggle */}
          <div className="px-4 py-4 sm:px-6 bg-indigo-50 dark:bg-indigo-900/30 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-indigo-800 dark:text-indigo-200">Anonymous Mode</h4>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                  When enabled, your personal information won't be associated with this complaint
                </p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  name="anonymous" 
                  id="anonymous" 
                  checked={isAnonymous}
                  onChange={() => setIsAnonymous(prev => !prev)}
                  className="sr-only"
                />
                <label 
                  htmlFor="anonymous" 
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${isAnonymous ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <span 
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${isAnonymous ? 'translate-x-6' : 'translate-x-0'}`} 
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Alert if not logged in */}
          {!user && !isAnonymous && (
            <div className="px-4 py-4 sm:px-6 bg-yellow-50 dark:bg-yellow-900/30 border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Attention</h3>
                  <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                    <p>You are not logged in. To track your complaint's status later, please <a href="/auth" className="font-medium underline">login</a> or <a href="/auth" className="font-medium underline">create an account</a> before submitting. Alternatively, enable Anonymous Mode.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="px-4 py-5 sm:p-6">
            {errors.form && (
              <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/30 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{errors.form}</h3>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Title */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Complaint Title *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.title ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                  } dark:bg-gray-700 dark:text-white sm:text-sm`}
                  placeholder="Brief title of your complaint"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                )}
              </div>

              {/* Category */}
              <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.category ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                  } dark:bg-gray-700 dark:text-white sm:text-sm`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.description ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                  } dark:bg-gray-700 dark:text-white sm:text-sm`}
                  placeholder="Provide detailed information about your complaint"
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                )}
              </div>

              {/* Location */}
              <div className="mb-6">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location *
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`flex-1 rounded-none rounded-l-md ${
                      errors.location ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                    } dark:bg-gray-700 dark:text-white sm:text-sm`}
                    placeholder="Enter location of the issue"
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-200 sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {locationLoading ? (
                      <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    )}
                    Use my location
                  </button>
                </div>
                {errors.location && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.location}</p>
                )}
                <div className="mt-2 h-32 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Map placeholder - would be integrated with Google Maps or similar service</p>
                </div>
              </div>

              {/* File uploads */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Upload Images or Videos (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload files</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          multiple
                          accept="image/*,video/*"
                          className="sr-only" 
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF, or MP4 up to 10MB
                    </p>
                  </div>
                </div>
                
                {/* Preview uploaded files */}
                {files.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {files.map((file, index) => (
                      <div key={index} className="relative">
                        <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden">
                          {file.type.startsWith('image/') ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="object-cover pointer-events-none"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 shadow-lg transform translate-x-1/3 -translate-y-1/3"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">{file.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit button */}
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Complaint'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComplaintFormPage; 