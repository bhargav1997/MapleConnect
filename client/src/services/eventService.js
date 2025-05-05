import api from './api';

// Get all events
export const getEvents = async (params) => {
  const response = await api.get('/events', { params });
  return response.data;
};

// Get event by ID
export const getEventById = async (eventId) => {
  const response = await api.get(`/events/${eventId}`);
  return response.data;
};

// Create event
export const createEvent = async (eventData) => {
  const formData = new FormData();
  
  // Add text fields
  formData.append('title', eventData.title);
  formData.append('description', eventData.description);
  formData.append('location', eventData.location);
  formData.append('startDate', eventData.startDate);
  formData.append('endDate', eventData.endDate);
  
  if (eventData.group) {
    formData.append('group', eventData.group);
  }
  
  if (eventData.isPrivate !== undefined) {
    formData.append('isPrivate', eventData.isPrivate);
  }
  
  // Add image if provided
  if (eventData.image) {
    formData.append('image', eventData.image);
  }
  
  const response = await api.post('/events', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Update event
export const updateEvent = async (eventId, eventData) => {
  const formData = new FormData();
  
  // Add text fields
  if (eventData.title) {
    formData.append('title', eventData.title);
  }
  
  if (eventData.description) {
    formData.append('description', eventData.description);
  }
  
  if (eventData.location) {
    formData.append('location', eventData.location);
  }
  
  if (eventData.startDate) {
    formData.append('startDate', eventData.startDate);
  }
  
  if (eventData.endDate) {
    formData.append('endDate', eventData.endDate);
  }
  
  if (eventData.isPrivate !== undefined) {
    formData.append('isPrivate', eventData.isPrivate);
  }
  
  // Add image if provided
  if (eventData.image) {
    formData.append('image', eventData.image);
  }
  
  const response = await api.put(`/events/${eventId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Delete event
export const deleteEvent = async (eventId) => {
  const response = await api.delete(`/events/${eventId}`);
  return response.data;
};

// Update attendance status
export const updateAttendance = async (eventId, status) => {
  const response = await api.put(`/events/${eventId}/attend`, { status });
  return response.data;
};

// Get events for a group
export const getGroupEvents = async (groupId) => {
  const response = await api.get(`/groups/${groupId}/events`);
  return response.data;
};
