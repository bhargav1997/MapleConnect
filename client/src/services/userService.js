import api from "./api";

// Get all users
export const getUsers = async () => {
   const response = await api.get("/users");
   return response.data;
};

// Get user by ID
export const getUserById = async (userId) => {
   const response = await api.get(`/users/${userId}`);
   return response.data;
};

// Update user profile
export const updateUser = async (userId, userData) => {
   const response = await api.put(`/users/${userId}`, userData);
   return response.data;
};

// Update profile image
export const updateProfileImage = async (userId, imageFile) => {
   const formData = new FormData();
   formData.append("profileImage", imageFile);

   const response = await api.put(`/users/${userId}/profile-image`, formData, {
      headers: {
         "Content-Type": "multipart/form-data",
      },
   });

   return response.data;
};

// Follow user
export const followUser = async (userId) => {
   const response = await api.put(`/users/${userId}/follow`);
   return response.data;
};

// Unfollow user
export const unfollowUser = async (userId) => {
   const response = await api.put(`/users/${userId}/unfollow`);
   return response.data;
};

// Get user posts
export const getUserPosts = async (userId) => {
   const response = await api.get(`/users/${userId}/posts`);
   return response.data;
};

// Search users
export const searchUsers = async (query) => {
   const response = await api.get(`/users/search?query=${encodeURIComponent(query)}`);
   return response.data;
};
