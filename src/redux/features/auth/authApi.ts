import baseApi from "@/redux/api/baseApi";
import { TResponse, TAuthRes } from "@/types";
import { LoginFormData } from "@/schemas/loginSchema"; // adjust path

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<TResponse<TAuthRes>, LoginFormData>({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
        credentials: "include",
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
