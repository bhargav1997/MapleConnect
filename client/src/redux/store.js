import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import groupReducer from "./slices/groupSlice";
import eventReducer from "./slices/eventSlice";
import marketplaceReducer from "./slices/marketplaceSlice";
import messageReducer from "./slices/messageSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
   reducer: {
      auth: authReducer,
      group: groupReducer,
      event: eventReducer,
      marketplace: marketplaceReducer,
      message: messageReducer,
      notification: notificationReducer,
   },
});
