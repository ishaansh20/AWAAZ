import { useState, useEffect } from 'react';
import { validateLoginForm } from '../utils/validation';
import authService from '../services/authService';
import config from '../config/config';
import Logo from '../components/Logo';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [animatedBg, setAnimatedBg] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    name: '',
    phoneNumber: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  // Add subtle background animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedBg(prev => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear errors when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    if (isLogin) {
      if (!formData.emailOrPhone) {
        newErrors.emailOrPhone = 'Email or phone number is required';
      }
    } else {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }

      if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await authService.login({
          emailOrPhone: formData.emailOrPhone,
          password: formData.password,
        });
        
        // Check user role and redirect accordingly
        const user = authService.getUser();
        if (user && user.role === 'admin') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        // Register using auth service
        const result = await authService.register({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        });
        
        // Show success message
        alert(result.message || 'Registration successful! You can now login.');
        
        // Switch to login view
        setIsLogin(true);
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: '',
        }));
      }
    } catch (err) {
      setErrors({ form: err.message || `${isLogin ? 'Login' : 'Registration'} failed. Please try again.` });
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center ${animatedBg ? 'bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-600' : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-700'} transition-all duration-1000 ease-in-out`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-5 rounded-full mix-blend-overlay animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white opacity-5 rounded-full mix-blend-overlay animate-float-medium"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-white opacity-5 rounded-full mix-blend-overlay animate-float-fast"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-pink-500 opacity-5 rounded-full mix-blend-overlay animate-float-medium"></div>
      </div>

      <div className="w-full max-w-md transform transition-all duration-500 ease-in-out px-4">
        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
          {/* Color gradient border */}
          <div className="absolute inset-0 rounded-3xl p-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 -z-10"></div>
          
          {/* Card content */}
          <div className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-md p-8 rounded-3xl relative z-10 space-y-6">
            <div className="flex flex-col items-center justify-center">
              <div className="transform transition-all duration-300 hover:scale-110">
                <Logo size="lg" />
              </div>
              <h2 className="mt-6 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500 tracking-tight">
                {isLogin ? 'Welcome Back' : 'Join Us'}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? 'Sign in to your account' : 'Create your account'}
              </p>
            </div>

            {/* Toggle between login and register */}
            <div className="flex justify-center">
              <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-1 inline-flex shadow-inner">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    isLogin
                      ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                    !isLogin
                      ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-md'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>
            
            {errors.form && (
              <div className="rounded-lg bg-red-50/80 dark:bg-red-900/30 p-4 animate-shake">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{errors.form}</h3>
                  </div>
                </div>
              </div>
            )}
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name field - only shown for registration */}
              {!isLogin && (
                <div className="group">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-500 transition-colors duration-200">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`pl-10 pr-3 py-3 w-full border ${
                        errors.name ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-700'
                      } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800/40 dark:text-white transition-all duration-200 backdrop-blur-sm bg-white/80`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                      </svg>
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              {/* Phone Number field - only shown for registration */}
              {!isLogin && (
                <div className="group">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-500 transition-colors duration-200">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className={`pl-10 pr-3 py-3 w-full border ${
                        errors.phoneNumber ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-700'
                      } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800/40 dark:text-white transition-all duration-200 backdrop-blur-sm bg-white/80`}
                      placeholder="1234567890"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                      </svg>
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
              )}

              {/* Email or Phone field - only shown for login */}
              {isLogin && (
                <div className="group">
                  <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-500 transition-colors duration-200">
                    Email Address / Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      id="emailOrPhone"
                      name="emailOrPhone"
                      type="text"
                      autoComplete="email tel"
                      value={formData.emailOrPhone}
                      onChange={handleChange}
                      className={`pl-10 pr-3 py-3 w-full border ${
                        errors.emailOrPhone ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-700'
                      } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800/40 dark:text-white transition-all duration-200 backdrop-blur-sm bg-white/80`}
                      placeholder="you@example.com or 1234567890"
                    />
                  </div>
                  {errors.emailOrPhone && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                      </svg>
                      {errors.emailOrPhone}
                    </p>
                  )}
                </div>
              )}
              
              {/* Email field - only shown for registration */}
              {!isLogin && (
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-500 transition-colors duration-200">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 pr-3 py-3 w-full border ${
                        errors.email ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-700'
                      } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800/40 dark:text-white transition-all duration-200 backdrop-blur-sm bg-white/80`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>
              )}
              
              {/* Password field */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-500 transition-colors duration-200">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-10 py-3 w-full border ${
                      errors.password ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-700'
                    } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800/40 dark:text-white transition-all duration-200 backdrop-blur-sm bg-white/80`}
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>
              
              {/* Confirm Password field - only shown for registration */}
              {!isLogin && (
                <div className="group">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-focus-within:text-indigo-500 transition-colors duration-200">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`pl-10 pr-3 py-3 w-full border ${
                        errors.confirmPassword ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-700'
                      } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800/40 dark:text-white transition-all duration-200 backdrop-blur-sm bg-white/80`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                      </svg>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer transition-colors duration-200"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isLogin ? 'Signing in...' : 'Creating account...'}
                    </div>
                  ) : (
                    isLogin ? 'Sign in' : 'Create account'
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button 
                  type="button"
                  onClick={toggleAuthMode} 
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 hover:underline"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth; 