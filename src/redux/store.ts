import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { saveState } from "./helpers/localStorage";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

store.subscribe(() => {
  saveState({
    auth: store.getState().auth,
  });
});

// Types for use throughout your app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
