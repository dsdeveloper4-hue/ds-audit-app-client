// customerApi.ts
import baseApi from "@/redux/api/baseApi";
import { TResponse, TSalesReport } from "@/types";

const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerRecords: builder.query<
      TResponse<TSalesReport>,
      Record<string, any> | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              if (Array.isArray(value)) {
                value.forEach((v) => queryParams.append(key, String(v)));
              } else {
                queryParams.append(key, String(value));
              }
            }
          });
        }

        return {
          url: `sales/report?${queryParams.toString()}`,
        };
      },
      providesTags: ["Customers"],
    }),

    // // ✅ Fetch sales report for a specific customer by ID
    // getCustomerSalesReportByID: builder.query<
    //   TResponse<{ date: string; totalQty: number; totalAmount: number }[]>,
    //   { customerId: number; startDate: string; endDate: string }
    // >({
    //   query: ({ customerId, startDate, endDate }) => ({
    //     url: `reports/customer/${customerId}`,
    //     params: { startDate, endDate }, // ✅ send as query params
    //   }),
    //   providesTags: (_result, _error, { customerId }) => [
    //     { type: "Customers", id: customerId },
    //   ],
    // }),
  }),
});

export const {
  useGetCustomerRecordsQuery,
} = customerApi;

export default customerApi;
