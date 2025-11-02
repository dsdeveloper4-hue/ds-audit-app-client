import baseApi from "@/redux/api/baseApi";
import {
  TResponse,
  TAudit,
  TCreateAuditPayload,
  TUpdateAuditPayload,
  TAuditWithDetails,
  TCreateItemDetailPayload,
  TUpdateItemDetailPayload,
  TItemDetail,
} from "@/types";

const auditApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new audit
    createAudit: builder.mutation<TResponse<TAudit>, TCreateAuditPayload>({
      query: (payload) => ({
        url: "/audits",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Audits", "History"],
    }),

    // Get all audits
    getAllAudits: builder.query<TResponse<TAudit[]>, void>({
      query: () => "/audits",
      providesTags: ["Audits"],
    }),

    // Get latest audit
    getLatestAudit: builder.query<TResponse<TAuditWithDetails>, void>({
      query: () => "/audits/latest",
      providesTags: ["Audits"],
    }),

    // Get single audit by ID
    getAuditById: builder.query<TResponse<TAuditWithDetails>, string>({
      query: (id) => `/audits/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Audits", id }],
    }),

    // Update audit
    updateAudit: builder.mutation<
      TResponse<TAudit>,
      { id: string; payload: TUpdateAuditPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/audits/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Audits", id },
        "Audits",
        "History",
      ],
    }),

    // Add item detail to audit
    addItemDetailToAudit: builder.mutation<
      TResponse<TItemDetail>,
      { audit_id: string; payload: TCreateItemDetailPayload }
    >({
      query: ({ audit_id, payload }) => ({
        url: `/audits/${audit_id}/items`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { audit_id }) => [
        { type: "Audits", id: audit_id },
        "Audits",
        "History",
      ],
    }),

    // Update item detail
    updateItemDetail: builder.mutation<
      TResponse<TItemDetail>,
      { detail_id: string; payload: TUpdateItemDetailPayload }
    >({
      query: ({ detail_id, payload }) => ({
        url: `/audits/items/${detail_id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Audits", "History"],
    }),

    // Delete item detail
    deleteItemDetail: builder.mutation<TResponse<TItemDetail>, string>({
      query: (detail_id) => ({
        url: `/audits/items/${detail_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Audits", "History"],
    }),

    // Delete audit
    deleteAudit: builder.mutation<TResponse<TAudit>, string>({
      query: (id) => ({
        url: `/audits/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Audits", "History"],
    }),

    // Get item summary by audit ID
    getItemSummaryByAuditId: builder.query<
      TResponse<{
        audit: { id: string; month: number; year: number; status: string };
        summary: Array<{
          item_id: string;
          item_name: string;
          category: string | null;
          unit: string | null;
          active: number;
          inactive: number;
          damage: number;
          total: number;
          unit_price: number;
          total_price: number;
        }>;
      }>,
      string
    >({
      query: (id) => `/audits/${id}/summary`,
      providesTags: (_result, _error, id) => [{ type: "Audits", id }],
    }),

    // Update adjustment percentage
    updateAdjustment: builder.mutation<
      TResponse<
        TAuditWithDetails & {
          total_asset_value: number;
          adjusted_asset_value: number;
          reduction_amount: number;
        }
      >,
      { id: string; reduction_percentage: number }
    >({
      query: ({ id, reduction_percentage }) => ({
        url: `/audits/${id}/adjustment`,
        method: "PATCH",
        body: { reduction_percentage },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Audits", id },
        "Audits",
      ],
    }),
  }),
});

export const {
  useCreateAuditMutation,
  useGetAllAuditsQuery,
  useGetAuditByIdQuery,
  useGetLatestAuditQuery,
  useUpdateAuditMutation,
  useAddItemDetailToAuditMutation,
  useUpdateItemDetailMutation,
  useDeleteItemDetailMutation,
  useDeleteAuditMutation,
  useGetItemSummaryByAuditIdQuery,
  useUpdateAdjustmentMutation,
} = auditApi;
