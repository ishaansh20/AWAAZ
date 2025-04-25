import api from './api';

// Get all complaints with optional filters
export const getAllComplaints = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add filters to query parameters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const response = await api.get(`/complaints${queryString}`);
    
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to get complaints');
  }
};

// Get complaint by ID
export const getComplaintById = async (complaintId) => {
  try {
    const response = await api.get(`/complaints/${complaintId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to get complaint');
  }
};

// Create a new complaint
export const createComplaint = async (complaintData) => {
  try {
    const response = await api.post('/complaints', complaintData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to create complaint');
  }
};

// Update complaint
export const updateComplaint = async (complaintId, complaintData) => {
  try {
    const response = await api.patch(`/complaints/${complaintId}`, complaintData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update complaint');
  }
};

// Delete complaint
export const deleteComplaint = async (complaintId) => {
  try {
    const response = await api.delete(`/complaints/${complaintId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to delete complaint');
  }
};

// Add a comment to a complaint
export const addComment = async (complaintId, comment) => {
  try {
    const response = await api.post(`/complaints/${complaintId}/comments`, { comment });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to add comment');
  }
};

// Vote for a complaint
export const voteComplaint = async (complaintId) => {
  try {
    const response = await api.patch(`/complaints/${complaintId}/vote`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to vote on complaint');
  }
};

// Assign complaint to admin/staff (admin only)
export const assignComplaint = async (complaintId, userId) => {
  try {
    const response = await api.patch(`/complaints/${complaintId}/assign`, { assignedTo: userId });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to assign complaint');
  }
};

// Update complaint status (admin only)
export const updateComplaintStatus = async (complaintId, status) => {
  try {
    const response = await api.patch(`/complaints/${complaintId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update complaint status');
  }
}; 