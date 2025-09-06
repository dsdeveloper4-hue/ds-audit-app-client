import { TUser } from "@/types/user";
import { createSlice } from "@reduxjs/toolkit";

type TAuthState = {
  user: null | TUser;
  token: null | string;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, { type, payload }) => {
      state.user = payload.user;
      state.token = payload.token;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
