import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  event: null,
  isLoading: false,
  error: null,
};

export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    getEventsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getEventsSuccess: (state, action) => {
      state.isLoading = false;
      state.events = action.payload;
      state.error = null;
    },
    getEventsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    getEventStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getEventSuccess: (state, action) => {
      state.isLoading = false;
      state.event = action.payload;
      state.error = null;
    },
    getEventFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createEventStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createEventSuccess: (state, action) => {
      state.isLoading = false;
      state.events.push(action.payload);
      state.error = null;
    },
    createEventFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateEventStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateEventSuccess: (state, action) => {
      state.isLoading = false;
      state.event = action.payload;
      state.events = state.events.map((event) =>
        event._id === action.payload._id ? action.payload : event
      );
      state.error = null;
    },
    updateEventFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteEventStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteEventSuccess: (state, action) => {
      state.isLoading = false;
      state.events = state.events.filter((event) => event._id !== action.payload);
      state.error = null;
    },
    deleteEventFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateAttendanceStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateAttendanceSuccess: (state, action) => {
      state.isLoading = false;
      state.event = action.payload;
      state.events = state.events.map((event) =>
        event._id === action.payload._id ? action.payload : event
      );
      state.error = null;
    },
    updateAttendanceFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearEventError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getEventsStart,
  getEventsSuccess,
  getEventsFailure,
  getEventStart,
  getEventSuccess,
  getEventFailure,
  createEventStart,
  createEventSuccess,
  createEventFailure,
  updateEventStart,
  updateEventSuccess,
  updateEventFailure,
  deleteEventStart,
  deleteEventSuccess,
  deleteEventFailure,
  updateAttendanceStart,
  updateAttendanceSuccess,
  updateAttendanceFailure,
  clearEventError,
} = eventSlice.actions;

export default eventSlice.reducer;
