import api from "./api";

// Get all conversations
export const getConversations = async () => {
  const response = await api.get('/messages');
  return response.data;
};

// Get conversation with a user
export const getConversation = async (userId) => {
  const response = await api.get(`/messages/${userId}`);
  return response.data;
};

// Send message
export const sendMessage = async (messageData) => {
  const formData = new FormData();
  
  // Add text fields
  formData.append('recipient', messageData.recipient);
  formData.append('content', messageData.content);
  
  // Add attachments if provided
  if (messageData.attachments && messageData.attachments.length > 0) {
    messageData.attachments.forEach((attachment) => {
      formData.append('attachments', attachment);
    });
  }
  
  const response = await api.post('/messages', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Mark message as read
export const markAsRead = async (messageId) => {
  const response = await api.put(`/messages/${messageId}/read`);
  return response.data;
};

// Delete message
export const deleteMessage = async (messageId) => {
  const response = await api.delete(`/messages/${messageId}`);
  return response.data;
};

export const shareStoryInMessage = async (thoughtId, userId) => {
   try {
      const response = await api.post("/messages/share-story", {
         thoughtId,
         userId,
      });

      return response.data;
   } catch (error) {
      console.error("Error sharing story:", error);
      throw error;
   }
};
