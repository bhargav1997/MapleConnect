import api from "./api";

// Get all posts
export const getPosts = async (type = "all") => {
   try {
      const response = await api.get(`/posts${type === "trending" ? "?type=trending" : ""}`);
      return response;
   } catch (error) {
      console.error("Error in getPosts:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch posts");
   }
};

// Get post by ID
export const getPostById = async (id) => {
   const response = await api.get(`/posts/${id}`);
   return response;
};

// Create post
export const createPost = async (postData) => {
   try {
      const response = await api.post("/posts", postData);

      // Check if we have a response and data
      if (!response || !response.data) {
         throw new Error("No response received from server");
      }

      // Return the response data directly
      return response;
   } catch (error) {
      console.error("Error in createPost:", error);
      // If it's a server response error, throw the error message
      if (error.response?.data?.error) {
         throw new Error(error.response.data.error);
      }
      // Otherwise throw a generic error
      throw new Error("Failed to create post");
   }
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

export const reportPost = async (id, { reason }) => {
   try {
      const response = await api.post(`/posts/${id}/report`, { reason });
      return response.data;
   } catch (error) {
      console.error("Error reporting post:", error);
      throw error;
   }
};

export const getFilteredFollowingPosts = async (userId) => {
   try {
      const response = await api.get(`/posts/following/${userId}`);
      return response.data;
   } catch (error) {
      console.error("Error fetching filtered following posts:", error);
      throw error;
   }
};

// Vote on poll option
export const voteOnPoll = async (postId, optionIndex) => {
   try {
      const response = await api.post(`/posts/${postId}/vote`, { optionIndex });
      return response;
   } catch (error) {
      console.error("Error voting on poll:", error);
      throw error;
   }
};
