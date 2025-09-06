import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL as string,
    credentials: "include",
  }),
  endpoints: (builder) => ({}),
  tagTypes: ["Products"],
});

export default baseApi;
