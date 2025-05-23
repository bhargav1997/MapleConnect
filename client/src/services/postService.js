import api from "./api";

// Get all posts
export const getPosts = async (page = 1, limit = 10) => {
   try {
      const response = await api.get(`/posts?page=${page}&limit=${limit}`);
      return response.data;
   } catch (error) {
      throw error.response?.data || error;
   }
};

// Get post by ID
export const getPostById = async (id) => {
   const response = await api.get(`/posts/${id}`);
   return response;
};

// Create post
export const createPost = async (formData) => {
   const response = await api.post("/posts", formData, {
      headers: {
         "Content-Type": "multipart/form-data",
      },
   });
   return response;
};

// Update post
export const updatePost = async (id, data) => {
   const response = await api.put(`/posts/${id}`, data);
   return response;
};

// Delete post
export const deletePost = async (id) => {
   try {
      const response = await api.delete(`/posts/${id}`);
      return response.data;
   } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
   }
};

// Like post
export const likePost = async (id) => {
   const response = await api.put(`/posts/${id}/like`);
   return response;
};

// Unlike post
export const unlikePost = async (id) => {
   const response = await api.put(`/posts/${id}/unlike`);
   return response;
};

// Add comment to post
export const commentOnPost = async (id, commentData) => {
   const response = await api.post(`/posts/${id}/comments`, commentData);
   return response;
};

// Delete comment from post
export const deleteComment = async (postId, commentId) => {
   const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
   return response;
};

export const reportPost = async (id) => {
   try {
      const response = await api.post(`/posts/${id}/report`);
      return response.data;
   } catch (error) {
      console.error("Error reporting post:", error);
      throw error;
   }
};
