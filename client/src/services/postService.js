import api from "./api";

// Get all posts
export const getPosts = async () => {
   const response = await api.get("/posts");
   return response.data;
};

// Get post by ID
export const getPostById = async (postId) => {
   const response = await api.get(`/posts/${postId}`);
   return response.data;
};

// Create post
export const createPost = async (postData) => {
   const formData = new FormData();

   // Add text content
   formData.append("content", postData.content);

   // Add location if provided
   if (postData.location) {
      formData.append("location", postData.location);
   }

   // Add media files if provided
   if (postData.media && postData.media.length > 0) {
      postData.media.forEach((file) => {
         formData.append("media", file);
      });
   }

   // Add feeling if provided
   if (postData.feeling) {
      formData.append("feeling", postData.feeling);
   }

   // Add activity if provided
   if (postData.activity) {
      formData.append("activity", postData.activity);
   }

   // Add visibility if provided
   if (postData.visibility) {
      formData.append("visibility", postData.visibility);
   }

   // Add tagged users if provided
   if (postData.taggedUserIds && postData.taggedUserIds.length > 0) {
      postData.taggedUserIds.forEach((userId) => {
         formData.append("taggedUserIds", userId);
      });
   }

   // Add poll if provided
   if (postData.poll) {
      if (postData.poll.question) {
         formData.append("pollQuestion", postData.poll.question);
      }

      if (postData.poll.options && postData.poll.options.length > 0) {
         postData.poll.options.forEach((option) => {
            formData.append("pollOptions", option);
         });
      }

      if (postData.poll.expiresAt) {
         formData.append("pollExpiration", postData.poll.expiresAt);
      }
   }

   const response = await api.post("/posts", formData, {
      headers: {
         "Content-Type": "multipart/form-data",
      },
   });

   return response.data;
};

// Update post
export const updatePost = async (postId, postData) => {
   const formData = new FormData();

   // Add text content
   formData.append("content", postData.content);

   // Add location if provided
   if (postData.location) {
      formData.append("location", postData.location);
   }

   // Add media files if provided
   if (postData.media && postData.media.length > 0) {
      postData.media.forEach((file) => {
         formData.append("media", file);
      });
   }

   const response = await api.put(`/posts/${postId}`, formData, {
      headers: {
         "Content-Type": "multipart/form-data",
      },
   });

   return response.data;
};

// Delete post
export const deletePost = async (postId) => {
   const response = await api.delete(`/posts/${postId}`);
   return response.data;
};

// Like post
export const likePost = async (postId) => {
   const response = await api.put(`/posts/${postId}/like`);
   return response.data;
};

// Unlike post
export const unlikePost = async (postId) => {
   const response = await api.put(`/posts/${postId}/unlike`);
   return response.data;
};

// Add comment to post
export const addComment = async (postId, commentText) => {
   const response = await api.post(`/posts/${postId}/comments`, {
      text: commentText,
   });
   return response.data;
};

// Delete comment from post
export const deleteComment = async (postId, commentId) => {
   const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
   return response.data;
};
