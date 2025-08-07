import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  userId: string;
  name: string;
  role: number;
  // add other fields if needed
}

interface AuthState {
  user: User | null;
  isAuth: boolean;
}

const initialState: AuthState = {
  user:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,
  isAuth:
    typeof window !== "undefined" ? !!localStorage.getItem("user") : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuth = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuth = false;
      localStorage.removeItem("user");
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
