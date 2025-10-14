import baseApi from "@/redux/api/baseApi";
import {
  TResponse,
  TInventory,
  TCreateInventoryPayload,
  TCreateBulkInventoryPayload,
  TUpdateInventoryPayload,
} from "@/types";

const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new inventory
    createInventory: builder.mutation<
      TResponse<TInventory>,
      TCreateInventoryPayload
    >({
      query: (payload) => ({
        url: "/inventories",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Inventories"],
    }),

    // Create bulk inventories
    createBulkInventory: builder.mutation<
      TResponse<{ count: number }>,
      TCreateBulkInventoryPayload
    >({
      query: (payload) => ({
        url: "/inventories/bulk",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Inventories"],
    }),

    // Get all inventories
    getAllInventories: builder.query<TResponse<TInventory[]>, void>({
      query: () => "/inventories",
      providesTags: ["Inventories"],
    }),

    // Get inventories by room ID
    getInventoriesByRoom: builder.query<TResponse<TInventory[]>, string>({
      query: (roomId) => `/inventories/room/${roomId}`,
      providesTags: (_result, _error, roomId) => [
        { type: "Inventories", id: `room-${roomId}` },
      ],
    }),

    // Get single inventory by ID
    getInventoryById: builder.query<TResponse<TInventory>, string>({
      query: (id) => `/inventories/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Inventories", id }],
    }),

    // Update inventory
    updateInventory: builder.mutation<
      TResponse<TInventory>,
      { id: string; payload: TUpdateInventoryPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/inventories/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Inventories", id },
        "Inventories",
      ],
    }),

    // Delete inventory
    deleteInventory: builder.mutation<TResponse<TInventory>, string>({
      query: (id) => ({
        url: `/inventories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inventories"],
    }),
  }),
});

export const {
  useCreateInventoryMutation,
  useCreateBulkInventoryMutation,
  useGetAllInventoriesQuery,
  useGetInventoriesByRoomQuery,
  useGetInventoryByIdQuery,
  useUpdateInventoryMutation,
  useDeleteInventoryMutation,
} = inventoryApi;
