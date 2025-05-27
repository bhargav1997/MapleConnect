import axios from "axios";

import api from '../services/api';


// Get all conversations
export const getConversations = async () => {
   try {
      const response = await api.get(`/chats/conversations`, {
         withCredentials: true,
      });
      return response.data;
   } catch (error) {
      throw error.response?.data || { message: "Failed to get conversations" };
   }
};

// Get messages between two users
export const getMessages = async (userId) => {
   try {
      const response = await api.get(`/chats/messages/${userId}`, {
         withCredentials: true,
      });
      return response.data;
   } catch (error) {
      throw error.response?.data || { message: "Failed to get messages" };
   }
};

// Delete a specific message
export const deleteMessage = async (messageId) => {
   try {
      const response = await api.delete(`/chats/messages/${messageId}`, {
         withCredentials: true,
      });
      return response.data;
   } catch (error) {
      throw error.response?.data || { message: "Failed to delete message" };
   }
};

// Delete entire conversation with a user
export const deleteConversation = async (userId) => {
   try {
      const response = await api.delete(`/chats/conversations/${userId}`, {
         withCredentials: true,
      });
      return response.data;
   } catch (error) {
      throw error.response?.data || { message: "Failed to delete conversation" };
   }
};
