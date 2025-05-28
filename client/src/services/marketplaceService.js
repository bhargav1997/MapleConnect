import api from "./api";

// Get all marketplace listings
export const getListings = async (params) => {
   const response = await api.get("/marketplace", { params });
   return response.data;
};

// Get listing by ID
export const getListingById = async (listingId) => {
   const response = await api.get(`/marketplace/${listingId}`);
   return response.data;
};

// Create listing
export const createListing = async (listingData) => {
   const response = await api.post("/marketplace", listingData);
   return response.data;
};

// Update listing
export const updateListing = async (listingId, listingData) => {
   const response = await api.put(`/marketplace/${listingId}`, listingData);
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
