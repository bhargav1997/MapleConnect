import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  groups: [],
  group: null,
  isLoading: false,
  error: null,
};

export const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    getGroupsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getGroupsSuccess: (state, action) => {
      state.isLoading = false;
      state.groups = action.payload;
      state.error = null;
    },
    getGroupsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    getGroupStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getGroupSuccess: (state, action) => {
      state.isLoading = false;
      state.group = action.payload;
      state.error = null;
    },
    getGroupFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createGroupStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createGroupSuccess: (state, action) => {
      state.isLoading = false;
      state.groups.push(action.payload);
      state.error = null;
    },
    createGroupFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateGroupStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateGroupSuccess: (state, action) => {
      state.isLoading = false;
      state.group = action.payload;
      state.groups = state.groups.map((group) =>
        group._id === action.payload._id ? action.payload : group
      );
      state.error = null;
    },
    updateGroupFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteGroupStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteGroupSuccess: (state, action) => {
      state.isLoading = false;
      state.groups = state.groups.filter((group) => group._id !== action.payload);
      state.error = null;
    },
    deleteGroupFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    joinGroupStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    joinGroupSuccess: (state, action) => {
      state.isLoading = false;
      state.group = action.payload;
      state.groups = state.groups.map((group) =>
        group._id === action.payload._id ? action.payload : group
      );
      state.error = null;
    },
    joinGroupFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    leaveGroupStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    leaveGroupSuccess: (state, action) => {
      state.isLoading = false;
      state.group = action.payload;
      state.groups = state.groups.map((group) =>
        group._id === action.payload._id ? action.payload : group
      );
      state.error = null;
    },
    leaveGroupFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearGroupError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getGroupsStart,
  getGroupsSuccess,
  getGroupsFailure,
  getGroupStart,
  getGroupSuccess,
  getGroupFailure,
  createGroupStart,
  createGroupSuccess,
  createGroupFailure,
  updateGroupStart,
  updateGroupSuccess,
  updateGroupFailure,
  deleteGroupStart,
  deleteGroupSuccess,
  deleteGroupFailure,
  joinGroupStart,
  joinGroupSuccess,
  joinGroupFailure,
  leaveGroupStart,
  leaveGroupSuccess,
  leaveGroupFailure,
  clearGroupError,
} = groupSlice.actions;

export default groupSlice.reducer;
