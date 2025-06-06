import api from "./api";

// Get all thoughts
export const getThoughts = async (topic = "") => {
   try {
      const response = await api.get(`/thoughts${topic ? `?topic=${topic}` : ""}`);
      return response.data;
   } catch (error) {
      throw error.response?.data || { message: "Failed to fetch thoughts" };
   }
};

// Get trending topics
export const getTrendingTopics = async () => {
   try {
      const response = await api.get("/thoughts/trending");
      return response.data;
   } catch (error) {
      throw error.response?.data || { message: "Failed to fetch trending topics" };
   }
};

// Create a new thought
export const createThought = async (thoughtData) => {
   try {
      const response = await api.post("/thoughts", thoughtData);
      return response.data;
   } catch (error) {
      throw error.response?.data || { message: "Failed to create thought" };
   }
};

// Like/unlike a thought
export const toggleLike = async (thoughtId) => {
   try {
      const response = await api.post(`/thoughts/${thoughtId}/like`);
      return response.data;
   } catch (error) {
      throw error.response?.data || { message: "Failed to update like" };
   }
};

// Add a comment
export const addComment = async (thoughtId, content) => {
   try {
      const response = await api.post(`/thoughts/${thoughtId}/comments`, { content });
      return response.data;
   } catch (error) {
      throw error.response?.data || { message: "Failed to add comment" };
   }
};

// Save to highlights
export const saveToHighlights = async (thoughtId) => {
   try {
      const response = await api.post(`/thoughts/${thoughtId}/highlight`);
      return response.data;
   } catch (error) {
      throw error.response?.data || { message: "Failed to save to highlights" };
   }
};

// Get user's highlights
export const getHighlights = async () => {
   try {
      const response = await api.get("/thoughts/highlights");
      return response.data;
   } catch (error) {
      throw error.response?.data || { message: "Failed to fetch highlights" };
   }
};

// Delete a thought
export const deleteThought = async (thoughtId) => {
   try {
      console.log("Deleting thought:", thoughtId);
      const token = localStorage.getItem("token");
      console.log("Using token:", token);

      const response = await api.delete(`/thoughts/${thoughtId}`, {
         headers: {
            Authorization: `Bearer ${token}`,
         },
      });

      console.log("Delete response:", response.data);
      return response.data;
   } catch (error) {
      console.error("Delete thought error:", {
         status: error.response?.status,
         data: error.response?.data,
         message: error.message,
      });
      throw error.response?.data || { message: "Failed to delete thought" };
   }
};
