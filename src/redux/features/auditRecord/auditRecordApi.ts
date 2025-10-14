import baseApi from "@/redux/api/baseApi";
import {
  TResponse,
  TAuditRecord,
  TUpdateAuditRecordPayload,
  TBulkUpdateAuditRecordsPayload,
  TAddParticipantPayload,
} from "@/types";

const auditRecordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get audit record by ID
    getAuditRecordById: builder.query<TResponse<TAuditRecord>, string>({
      query: (id) => `/audit-records/${id}`,
      providesTags: (_result, _error, id) => [{ type: "AuditRecords", id }],
    }),

    // Get all audit records by audit ID
    getAuditRecordsByAuditId: builder.query<TResponse<TAuditRecord[]>, string>({
      query: (auditId) => `/audit-records/audit/${auditId}`,
      providesTags: (_result, _error, auditId) => [
        { type: "AuditRecords", id: `audit-${auditId}` },
      ],
    }),

    // Update single audit record
    updateAuditRecord: builder.mutation<
      TResponse<TAuditRecord>,
      { id: string; payload: TUpdateAuditRecordPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/audit-records/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AuditRecords", id },
        "AuditRecords",
      ],
    }),

    // Bulk update audit records
    bulkUpdateAuditRecords: builder.mutation<
      TResponse<{ updatedCount: number }>,
      TBulkUpdateAuditRecordsPayload
    >({
      query: (payload) => ({
        url: "/audit-records/bulk",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["AuditRecords", "Audits"],
    }),

    // Add participant to audit record
    addParticipant: builder.mutation<
      TResponse<TAuditRecord>,
      { id: string; payload: TAddParticipantPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/audit-records/${id}/participant`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AuditRecords", id },
      ],
    }),

    // Remove participant from audit record
    removeParticipant: builder.mutation<
      TResponse<TAuditRecord>,
      { id: string; userId: string }
    >({
      query: ({ id, userId }) => ({
        url: `/audit-records/${id}/participant/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AuditRecords", id },
      ],
    }),
  }),
});

export const {
  useGetAuditRecordByIdQuery,
  useGetAuditRecordsByAuditIdQuery,
  useUpdateAuditRecordMutation,
  useBulkUpdateAuditRecordsMutation,
  useAddParticipantMutation,
  useRemoveParticipantMutation,
} = auditRecordApi;
