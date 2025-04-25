import api from './api';

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to get users');
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to get user');
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const response = await api.patch('/users/update-profile', userData);
    
    // Update user in localStorage
    if (response.data.data.user) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...storedUser, ...response.data.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update profile');
  }
};

// Make a user admin (admin only)
export const makeAdmin = async (userId) => {
  try {
    const response = await api.patch(`/users/${userId}/make-admin`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to make user admin');
  }
};

// Delete user (admin only)
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to delete user');
  }
}; 