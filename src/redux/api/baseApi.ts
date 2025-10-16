import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logout, setUser } from "../features/auth/authSlice";
import { verifyToken } from "@/utils/verifyToken";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Use `unknown` instead of `{}` for extraOptions
const baseQueryWithRefreshToken = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: unknown
) => {
  let result = await baseQuery(args, api, extraOptions as any); // cast to any for fetchBaseQuery

  if (result?.error?.status == 401 || result?.error?.status == 500) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await res.json();
    const accessToken = data?.data?.accessToken;

    if (accessToken) {
      api.dispatch(
        setUser({
          user: verifyToken(accessToken),
          token: accessToken,
        })
      );

      result = await baseQuery(args, api, extraOptions as any);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  endpoints: () => ({}),
  tagTypes: ["Audits", "Rooms", "Items", "ItemDetails", "Users", "Roles", "Permissions"],
});

export default baseApi;
