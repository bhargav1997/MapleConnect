import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [],
  currentConversation: {
    user: null,
    messages: [],
  },
  isLoading: false,
  error: null,
};

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    getConversationsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getConversationsSuccess: (state, action) => {
      state.isLoading = false;
      state.conversations = action.payload;
      state.error = null;
    },
    getConversationsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    getConversationStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getConversationSuccess: (state, action) => {
      state.isLoading = false;
      state.currentConversation = {
        user: action.payload.user,
        messages: action.payload.messages,
      };
      state.error = null;
    },
    getConversationFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    sendMessageStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    sendMessageSuccess: (state, action) => {
      state.isLoading = false;
      state.currentConversation.messages.push(action.payload);
      state.error = null;
    },
    sendMessageFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    markAsReadStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    markAsReadSuccess: (state, action) => {
      state.isLoading = false;
      state.currentConversation.messages = state.currentConversation.messages.map(
        (message) => (message._id === action.payload._id ? action.payload : message)
      );
      state.error = null;
    },
    markAsReadFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteMessageStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteMessageSuccess: (state, action) => {
      state.isLoading = false;
      state.currentConversation.messages = state.currentConversation.messages.filter(
        (message) => message._id !== action.payload
      );
      state.error = null;
    },
    deleteMessageFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearMessageError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getConversationsStart,
  getConversationsSuccess,
  getConversationsFailure,
  getConversationStart,
  getConversationSuccess,
  getConversationFailure,
  sendMessageStart,
  sendMessageSuccess,
  sendMessageFailure,
  markAsReadStart,
  markAsReadSuccess,
  markAsReadFailure,
  deleteMessageStart,
  deleteMessageSuccess,
  deleteMessageFailure,
  clearMessageError,
} = messageSlice.actions;

export default messageSlice.reducer;
