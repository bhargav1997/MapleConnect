import api from "./api";

// Get all notifications
export const getNotifications = async (page = 1, limit = 20) => {
   return await api.get(`/notifications?page=${page}&limit=${limit}`);
};

// Mark notification as read
export const markAsRead = async (id) => {
   return await api.put(`/notifications/${id}/read`);
};

// Mark all notifications as read
export const markAllAsRead = async () => {
   return await api.put("/notifications/read-all");
};

// Delete notification
export const deleteNotification = async (id) => {
   return await api.delete(`/notifications/${id}`);
};

// Delete all notifications
export const deleteAllNotifications = async () => {
   return await api.delete("/notifications");
};
