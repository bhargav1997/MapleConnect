import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    hasMore: false
  }
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    getNotificationsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getNotificationsSuccess: (state, action) => {
      state.isLoading = false;
      state.notifications = action.payload.data;
      state.unreadCount = action.payload.unreadCount;
      state.pagination = {
        ...state.pagination,
        hasMore: !!action.payload.pagination.next
      };
    },
    getNotificationsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    markAsReadStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    markAsReadSuccess: (state, action) => {
      state.isLoading = false;
      state.notifications = state.notifications.map(notification => 
        notification._id === action.payload._id 
          ? { ...notification, read: true } 
          : notification
      );
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    markAsReadFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    markAllAsReadStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    markAllAsReadSuccess: (state) => {
      state.isLoading = false;
      state.notifications = state.notifications.map(notification => ({
        ...notification,
        read: true
      }));
      state.unreadCount = 0;
    },
    markAllAsReadFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteNotificationStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteNotificationSuccess: (state, action) => {
      state.isLoading = false;
      const deletedNotification = state.notifications.find(
        notification => notification._id === action.payload
      );
      state.notifications = state.notifications.filter(
        notification => notification._id !== action.payload
      );
      if (deletedNotification && !deletedNotification.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    deleteNotificationFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteAllNotificationsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteAllNotificationsSuccess: (state) => {
      state.isLoading = false;
      state.notifications = [];
      state.unreadCount = 0;
    },
    deleteAllNotificationsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications = [action.payload, ...state.notifications];
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    resetNotifications: (state) => {
      return initialState;
    }
  }
});

export const {
  getNotificationsStart,
  getNotificationsSuccess,
  getNotificationsFailure,
  markAsReadStart,
  markAsReadSuccess,
  markAsReadFailure,
  markAllAsReadStart,
  markAllAsReadSuccess,
  markAllAsReadFailure,
  deleteNotificationStart,
  deleteNotificationSuccess,
  deleteNotificationFailure,
  deleteAllNotificationsStart,
  deleteAllNotificationsSuccess,
  deleteAllNotificationsFailure,
  addNotification,
  resetNotifications
} = notificationSlice.actions;

export default notificationSlice.reducer;
