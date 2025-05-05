import api from './api';

// Get all marketplace listings
export const getListings = async (params) => {
  const response = await api.get('/marketplace', { params });
  return response.data;
};

// Get listing by ID
export const getListingById = async (listingId) => {
  const response = await api.get(`/marketplace/${listingId}`);
  return response.data;
};

// Create listing
export const createListing = async (listingData) => {
  const formData = new FormData();
  
  // Add text fields
  formData.append('title', listingData.title);
  formData.append('description', listingData.description);
  formData.append('price', listingData.price);
  formData.append('category', listingData.category);
  formData.append('condition', listingData.condition);
  formData.append('location', listingData.location);
  
  if (listingData.isDeliveryAvailable !== undefined) {
    formData.append('isDeliveryAvailable', listingData.isDeliveryAvailable);
  }
  
  // Add images if provided
  if (listingData.images && listingData.images.length > 0) {
    listingData.images.forEach((image) => {
      formData.append('images', image);
    });
  }
  
  const response = await api.post('/marketplace', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Update listing
export const updateListing = async (listingId, listingData) => {
  const formData = new FormData();
  
  // Add text fields
  if (listingData.title) {
    formData.append('title', listingData.title);
  }
  
  if (listingData.description) {
    formData.append('description', listingData.description);
  }
  
  if (listingData.price) {
    formData.append('price', listingData.price);
  }
  
  if (listingData.category) {
    formData.append('category', listingData.category);
  }
  
  if (listingData.condition) {
    formData.append('condition', listingData.condition);
  }
  
  if (listingData.location) {
    formData.append('location', listingData.location);
  }
  
  if (listingData.isDeliveryAvailable !== undefined) {
    formData.append('isDeliveryAvailable', listingData.isDeliveryAvailable);
  }
  
  // Add images if provided
  if (listingData.images && listingData.images.length > 0) {
    listingData.images.forEach((image) => {
      formData.append('images', image);
    });
  }
  
  const response = await api.put(`/marketplace/${listingId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Delete listing
export const deleteListing = async (listingId) => {
  const response = await api.delete(`/marketplace/${listingId}`);
  return response.data;
};

// Update listing status
export const updateStatus = async (listingId, status) => {
  const response = await api.put(`/marketplace/${listingId}/status`, { status });
  return response.data;
};

// Get listings by seller
export const getSellerListings = async (userId) => {
  const response = await api.get(`/users/${userId}/marketplace`);
  return response.data;
};
