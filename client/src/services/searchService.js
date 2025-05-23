import api from "./api";

export const searchUsers = async (query) => {
   try {
      const response = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
      return response.data;
   } catch (error) {
      console.error("Error searching users:", error);
      throw error;
   }
};

export const searchPosts = async (query) => {
   try {
      const response = await api.get(`/posts/search?q=${encodeURIComponent(query)}`);
      return response.data;
   } catch (error) {
      console.error("Error searching posts:", error);
      throw error;
   }
};

export const searchGroups = async (query) => {
   try {
      const response = await api.get(`/groups/search?q=${encodeURIComponent(query)}`);
      return response.data;
   } catch (error) {
      console.error("Error searching groups:", error);
      throw error;
   }
};

export const searchEvents = async (query) => {
   try {
      const response = await api.get(`/events/search?q=${encodeURIComponent(query)}`);
      return response.data;
   } catch (error) {
      console.error("Error searching events:", error);
      throw error;
   }
};

export const searchMarketplace = async (query) => {
   try {
      const response = await api.get(`/marketplace/search?q=${encodeURIComponent(query)}`);
      return response.data;
   } catch (error) {
      console.error("Error searching marketplace:", error);
      throw error;
   }
};
