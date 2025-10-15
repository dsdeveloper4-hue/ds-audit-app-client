import baseApi from "@/redux/api/baseApi";
import {
  TResponse,
  TPermission,
} from "@/types";

const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all permissions
    getAllPermissions: builder.query<TResponse<TPermission[]>, void>({
      query: () => "/permissions",
      providesTags: ["Permissions"],
    }),

    // Get single permission
    getPermissionById: builder.query<TResponse<TPermission>, string>({
      query: (id) => `/permissions/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Permissions", id }],
    }),

    // Create permission
    createPermission: builder.mutation<
      TResponse<TPermission>,
      { name: string; resource: string; action: string }
    >({
      query: (payload) => ({
        url: "/permissions",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Permissions"],
    }),

    // Update permission
    updatePermission: builder.mutation<
      TResponse<TPermission>,
      {
        id: string;
        payload: { name?: string; resource?: string; action?: string };
      }
    >({
      query: ({ id, payload }) => ({
        url: `/permissions/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Permissions", id },
        "Permissions",
      ],
    }),

    // Delete permission
    deletePermission: builder.mutation<TResponse<TPermission>, string>({
      query: (id) => ({
        url: `/permissions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Permissions"],
    }),
  }),
});

export const {
  useGetAllPermissionsQuery,
  useGetPermissionByIdQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} = permissionApi;
