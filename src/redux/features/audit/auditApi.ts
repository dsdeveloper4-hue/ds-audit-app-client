import baseApi from "@/redux/api/baseApi";
import {
  TResponse,
  TAudit,
  TCreateAuditPayload,
  TUpdateAuditPayload,
  TAuditWithRecords,
} from "@/types";

const auditApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new audit
    createAudit: builder.mutation<
      TResponse<{ audit: TAudit; totalRecords: number }>,
      TCreateAuditPayload
    >({
      query: (payload) => ({
        url: "/audits",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Audits", "AuditRecords"],
    }),

    // Get all audits
    getAllAudits: builder.query<TResponse<TAudit[]>, void>({
      query: () => "/audits",
      providesTags: ["Audits"],
    }),

    // Get single audit by ID
    getAuditById: builder.query<TResponse<TAuditWithRecords>, string>({
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
      ],
    }),

    // Complete audit
    completeAudit: builder.mutation<TResponse<TAudit>, string>({
      query: (id) => ({
        url: `/audits/${id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Audits", id },
        "Audits",
        "Inventories",
      ],
    }),

    // Delete audit
    deleteAudit: builder.mutation<TResponse<TAudit>, string>({
      query: (id) => ({
        url: `/audits/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Audits", "AuditRecords"],
    }),
  }),
});

export const {
  useCreateAuditMutation,
  useGetAllAuditsQuery,
  useGetAuditByIdQuery,
  useUpdateAuditMutation,
  useCompleteAuditMutation,
  useDeleteAuditMutation,
} = auditApi;
