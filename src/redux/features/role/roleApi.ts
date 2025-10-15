import baseApi from "@/redux/api/baseApi";
import {
  TResponse,
  TRole,
} from "@/types";

const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all roles
    getAllRoles: builder.query<TResponse<TRole[]>, void>({
      query: () => "/roles",
      providesTags: ["Roles"],
    }),

    // Get single role
    getRoleById: builder.query<TResponse<TRole>, string>({
      query: (id) => `/roles/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Roles", id }],
    }),

    // Create role
    createRole: builder.mutation<
      TResponse<TRole>,
      { name: string; description?: string }
    >({
      query: (payload) => ({
        url: "/roles",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Roles"],
    }),

    // Update role
    updateRole: builder.mutation<
      TResponse<TRole>,
      { id: string; payload: { name?: string; description?: string } }
    >({
      query: ({ id, payload }) => ({
        url: `/roles/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Roles", id },
        "Roles",
      ],
    }),

    // Assign permissions to role
    assignPermissions: builder.mutation<
      TResponse<TRole>,
      { id: string; permission_ids: string[] }
    >({
      query: ({ id, permission_ids }) => ({
        url: `/roles/${id}/permissions`,
        method: "POST",
        body: { permission_ids },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Roles", id },
        "Roles",
      ],
    }),

    // Remove permission from role
    removePermission: builder.mutation<
      TResponse<TRole>,
      { id: string; permissionId: string }
    >({
      query: ({ id, permissionId }) => ({
        url: `/roles/${id}/permissions/${permissionId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Roles", id },
        "Roles",
      ],
    }),

    // Delete role
    deleteRole: builder.mutation<TResponse<TRole>, string>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Roles"],
    }),
  }),
});

export const {
  useGetAllRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useAssignPermissionsMutation,
  useRemovePermissionMutation,
  useDeleteRoleMutation,
} = roleApi;
