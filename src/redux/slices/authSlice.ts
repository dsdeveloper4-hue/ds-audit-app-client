import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserType = {
  userId: string;
  role: number;
  name: string;
};

interface AuthState {
  user: UserType | null;
}

const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
