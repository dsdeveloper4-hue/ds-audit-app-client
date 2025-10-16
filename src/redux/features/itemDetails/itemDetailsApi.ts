import baseApi from "@/redux/api/baseApi";
import {
  TResponse,
  TItemDetail,
  TCreateItemDetailPayload,
  TUpdateItemDetailPayload,
} from "@/types";

const itemDetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new item detail
    createItemDetail: builder.mutation<TResponse<TItemDetail>, TCreateItemDetailPayload & { audit_id: string }>({
      query: (payload) => ({
        url: "/item-details",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ItemDetails"],
    }),

    // Get all item details
    getAllItemDetails: builder.query<TResponse<TItemDetail[]>, void>({
      query: () => "/item-details",
      providesTags: ["ItemDetails"],
    }),

    // Get item details by room and item
    getItemDetailsByRoomAndItem: builder.query<
      TResponse<TItemDetail[]>,
      { room_id: string; item_id: string }
    >({
      query: ({ room_id, item_id }) => `/item-details/room/${room_id}/item/${item_id}`,
      providesTags: (_result, _error, { room_id, item_id }) => [
        { type: "ItemDetails", id: `${room_id}-${item_id}` },
      ],
    }),

    // Get single item detail by ID
    getItemDetailById: builder.query<TResponse<TItemDetail>, string>({
      query: (id) => `/item-details/${id}`,
      providesTags: (_result, _error, id) => [{ type: "ItemDetails", id }],
    }),

    // Update item detail
    updateItemDetail: builder.mutation<
      TResponse<TItemDetail>,
      { id: string; payload: TUpdateItemDetailPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/item-details/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ItemDetails", id },
        "ItemDetails",
      ],
    }),

    // Delete item detail
    deleteItemDetail: builder.mutation<TResponse<TItemDetail>, string>({
      query: (id) => ({
        url: `/item-details/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ItemDetails"],
    }),
  }),
});

export const {
  useCreateItemDetailMutation: useCreateItemDetailDirectMutation,
  useGetAllItemDetailsQuery,
  useGetItemDetailsByRoomAndItemQuery,
  useGetItemDetailByIdQuery,
  useUpdateItemDetailMutation: useUpdateItemDetailDirectMutation,
  useDeleteItemDetailMutation: useDeleteItemDetailDirectMutation,
} = itemDetailsApi;
