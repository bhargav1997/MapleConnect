import api from "./api";

// Get auth header with admin token
const getAuthHeader = () => {
   const adminToken = localStorage.getItem("adminToken");
   return {
      Authorization: `Bearer ${adminToken}`,
   };
};

// Get dashboard stats
export const getAdminStats = async () => {
   const response = await api.get("/admin/stats", {
      headers: getAuthHeader(),
   });
   return response.data;
};

// Get all users
export const getAllUsers = async () => {
   const response = await api.get("/admin/users", {
      headers: getAuthHeader(),
   });
   return response.data;
};

// Delete user
export const deleteUser = async (userId) => {
   const response = await api.delete(`/admin/users/${userId}`, {
      headers: getAuthHeader(),
   });
   return response.data;
};

// Get reported posts
export const getReportedPosts = async () => {
   const response = await api.get("/admin/posts/reported", {
      headers: getAuthHeader(),
   });
   return response.data;
};

// Delete post
export const deletePost = async (postId) => {
   const response = await api.delete(`/admin/posts/${postId}`, {
      headers: getAuthHeader(),
   });
   return response.data;
};

// Send broadcast notification
export const sendBroadcast = async (data) => {
   const response = await api.post("/admin/notifications/broadcast", data, {
      headers: getAuthHeader(),
   });
   return response.data;
};
