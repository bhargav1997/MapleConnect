import api from "./api";

// Get all groups
export const getAllGroups = async () => {
   const response = await api.get("/groups");
   return response.data;
};

// Get a single group by ID
export const getGroupById = async (groupId) => {
   const response = await api.get(`/groups/${groupId}`);
   return response.data;
};

// Create a new group
export const createGroup = async (groupData) => {
   const response = await api.post("/groups", groupData);
   return response.data;
};

// Update a group
export const updateGroup = async (groupId, groupData) => {
   const response = await api.put(`/groups/${groupId}`, groupData);
   return response.data;
};

// Delete a group
export const deleteGroup = async (groupId) => {
   const response = await api.delete(`/groups/${groupId}`);
   return response.data;
};

// Join a group
export const joinGroup = async (groupId) => {
   const response = await api.post(`/groups/${groupId}/join`);
   return response.data;
};

// Leave a group
export const leaveGroup = async (groupId) => {
   const response = await api.post(`/groups/${groupId}/leave`);
   return response.data;
};

// Get group members
export const getGroupMembers = async (groupId) => {
   const response = await api.get(`/groups/${groupId}/members`);
   return response.data;
};

// Add admin to group
export const addGroupAdmin = async (groupId, userId) => {
   const response = await api.post(`/groups/${groupId}/admins`, { userId });
   return response.data;
};

// Remove admin from group
export const removeGroupAdmin = async (groupId, userId) => {
   const response = await api.delete(`/groups/${groupId}/admins/${userId}`);
   return response.data;
};

// Get user's groups
export const getUserGroups = async () => {
   const response = await api.get("/groups/user/groups");
   return response.data;
};

// Get user's admin groups
export const getUserAdminGroups = async () => {
   const response = await api.get("/groups/user/admin-groups");
   return response.data;
};
