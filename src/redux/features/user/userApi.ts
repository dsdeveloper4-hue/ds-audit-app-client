import baseApi from "@/redux/api/baseApi";
import { TResponse, TUserWithRole } from "@/types";

interface TCreateUserPayload {
  name: string;
  mobile: string;
  password: string;
  role_id: string;
}

interface TUpdateUserPayload {
  name?: string;
  mobile?: string;
  password?: string;
  role_id?: string;
}

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users
    getAllUsers: builder.query<TResponse<TUserWithRole[]>, void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    // Get user by ID
    getUserById: builder.query<TResponse<TUserWithRole>, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Users", id }],
    }),

    // Create user
    createUser: builder.mutation<TResponse<TUserWithRole>, TCreateUserPayload>({
      query: (payload) => ({
        url: "/users",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),

    // Update user
    updateUser: builder.mutation<
      TResponse<TUserWithRole>,
      { id: string; payload: TUpdateUserPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Users", id },
        "Users",
      ],
    }),

    // Delete user
    deleteUser: builder.mutation<TResponse<TUserWithRole>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
