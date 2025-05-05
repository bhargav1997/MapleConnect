import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  listings: [],
  listing: null,
  isLoading: false,
  error: null,
};

export const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    getListingsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getListingsSuccess: (state, action) => {
      state.isLoading = false;
      state.listings = action.payload;
      state.error = null;
    },
    getListingsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    getListingStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getListingSuccess: (state, action) => {
      state.isLoading = false;
      state.listing = action.payload;
      state.error = null;
    },
    getListingFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    createListingStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createListingSuccess: (state, action) => {
      state.isLoading = false;
      state.listings.push(action.payload);
      state.error = null;
    },
    createListingFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateListingStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateListingSuccess: (state, action) => {
      state.isLoading = false;
      state.listing = action.payload;
      state.listings = state.listings.map((listing) =>
        listing._id === action.payload._id ? action.payload : listing
      );
      state.error = null;
    },
    updateListingFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    deleteListingStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteListingSuccess: (state, action) => {
      state.isLoading = false;
      state.listings = state.listings.filter((listing) => listing._id !== action.payload);
      state.error = null;
    },
    deleteListingFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateStatusStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateStatusSuccess: (state, action) => {
      state.isLoading = false;
      state.listing = action.payload;
      state.listings = state.listings.map((listing) =>
        listing._id === action.payload._id ? action.payload : listing
      );
      state.error = null;
    },
    updateStatusFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearMarketplaceError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getListingsStart,
  getListingsSuccess,
  getListingsFailure,
  getListingStart,
  getListingSuccess,
  getListingFailure,
  createListingStart,
  createListingSuccess,
  createListingFailure,
  updateListingStart,
  updateListingSuccess,
  updateListingFailure,
  deleteListingStart,
  deleteListingSuccess,
  deleteListingFailure,
  updateStatusStart,
  updateStatusSuccess,
  updateStatusFailure,
  clearMarketplaceError,
} = marketplaceSlice.actions;

export default marketplaceSlice.reducer;
