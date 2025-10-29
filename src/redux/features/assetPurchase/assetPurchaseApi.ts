import baseApi from "@/redux/api/baseApi";
import {
  TResponse,
  TAssetPurchase,
  TCreateAssetPurchasePayload,
  TUpdateAssetPurchasePayload,
  TPurchaseSummary,
} from "@/types";

const assetPurchaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create asset purchase
    createAssetPurchase: builder.mutation<
      TResponse<TAssetPurchase>,
      TCreateAssetPurchasePayload
    >({
      query: (payload) => ({
        url: "/asset-purchases",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AssetPurchases", "History"],
    }),

    // Get all asset purchases
    getAllAssetPurchases: builder.query<
      TResponse<TAssetPurchase[]>,
      {
        room_id?: string;
        item_id?: string;
        start_date?: string;
        end_date?: string;
      } | void
    >({
      query: (params) => ({
        url: "/asset-purchases",
        params: params || undefined,
      }),
      providesTags: ["AssetPurchases"],
    }),

    // Get asset purchase by ID
    getAssetPurchaseById: builder.query<TResponse<TAssetPurchase>, string>({
      query: (id) => `/asset-purchases/${id}`,
      providesTags: (_result, _error, id) => [{ type: "AssetPurchases", id }],
    }),

    // Update asset purchase
    updateAssetPurchase: builder.mutation<
      TResponse<TAssetPurchase>,
      { id: string; payload: TUpdateAssetPurchasePayload }
    >({
      query: ({ id, payload }) => ({
        url: `/asset-purchases/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AssetPurchases", id },
        "AssetPurchases",
        "History",
      ],
    }),

    // Delete asset purchase
    deleteAssetPurchase: builder.mutation<TResponse<any>, string>({
      query: (id) => ({
        url: `/asset-purchases/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AssetPurchases", "History"],
    }),

    // Get purchase summary
    getPurchaseSummary: builder.query<
      TResponse<TPurchaseSummary>,
      { room_id?: string; start_date?: string; end_date?: string } | void
    >({
      query: (params) => ({
        url: "/asset-purchases/summary",
        params: params || undefined,
      }),
      providesTags: ["AssetPurchases"],
    }),
  }),
});

export const {
  useCreateAssetPurchaseMutation,
  useGetAllAssetPurchasesQuery,
  useGetAssetPurchaseByIdQuery,
  useUpdateAssetPurchaseMutation,
  useDeleteAssetPurchaseMutation,
  useGetPurchaseSummaryQuery,
} = assetPurchaseApi;
