import api from './api';

// Get all groups
export const getGroups = async () => {
  const response = await api.get('/groups');
  return response.data;
};

// Get group by ID
export const getGroupById = async (groupId) => {
  const response = await api.get(`/groups/${groupId}`);
  return response.data;
};

// Create group
export const createGroup = async (groupData) => {
  const formData = new FormData();
  
  // Add text fields
  formData.append('name', groupData.name);
  formData.append('description', groupData.description);
  
  if (groupData.location) {
    formData.append('location', groupData.location);
  }
  
  if (groupData.isPrivate !== undefined) {
    formData.append('isPrivate', groupData.isPrivate);
  }
  
  // Add image if provided
  if (groupData.image) {
    formData.append('image', groupData.image);
  }
  
  const response = await api.post('/groups', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Update group
export const updateGroup = async (groupId, groupData) => {
  const formData = new FormData();
  
  // Add text fields
  if (groupData.name) {
    formData.append('name', groupData.name);
  }
  
  if (groupData.description) {
    formData.append('description', groupData.description);
  }
  
  if (groupData.location) {
    formData.append('location', groupData.location);
  }
  
  if (groupData.isPrivate !== undefined) {
    formData.append('isPrivate', groupData.isPrivate);
  }
  
  // Add image if provided
  if (groupData.image) {
    formData.append('image', groupData.image);
  }
  
  const response = await api.put(`/groups/${groupId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Delete group
export const deleteGroup = async (groupId) => {
  const response = await api.delete(`/groups/${groupId}`);
  return response.data;
};

// Join group
export const joinGroup = async (groupId) => {
  const response = await api.put(`/groups/${groupId}/join`);
  return response.data;
};

// Leave group
export const leaveGroup = async (groupId) => {
  const response = await api.put(`/groups/${groupId}/leave`);
  return response.data;
};

// Add admin to group
export const addAdmin = async (groupId, userId) => {
  const response = await api.put(`/groups/${groupId}/admins/${userId}`);
  return response.data;
};

// Remove admin from group
export const removeAdmin = async (groupId, userId) => {
  const response = await api.delete(`/groups/${groupId}/admins/${userId}`);
  return response.data;
};
