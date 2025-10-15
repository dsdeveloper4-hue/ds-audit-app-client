import baseApi from "@/redux/api/baseApi";
import {
  TResponse,
  TItem,
  TCreateItemPayload,
  TUpdateItemPayload,
} from "@/types";

const itemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new item
    createItem: builder.mutation<TResponse<TItem>, TCreateItemPayload>({
      query: (payload) => ({
        url: "/items",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Items"],
    }),

    // Get all items
    getAllItems: builder.query<TResponse<TItem[]>, void>({
      query: () => "/items",
      providesTags: ["Items"],
    }),

    // Get single item by ID
    getItemById: builder.query<TResponse<TItem>, string>({
      query: (id) => `/items/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Items", id }],
    }),

    // Update item
    updateItem: builder.mutation<
      TResponse<TItem>,
      { id: string; payload: TUpdateItemPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/items/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Items", id },
        "Items",
      ],
    }),

    // Delete item
    deleteItem: builder.mutation<TResponse<TItem>, string>({
      query: (id) => ({
        url: `/items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Items",],
    }),
  }),
});

export const {
  useCreateItemMutation,
  useGetAllItemsQuery,
  useGetItemByIdQuery,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = itemApi;
