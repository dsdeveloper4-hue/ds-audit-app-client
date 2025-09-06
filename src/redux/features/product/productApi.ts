import baseApi from "@/redux/api/baseApi";
import { TProductSalesRecord, TResponse } from "@/types";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Fetch products within a date range
    getProducts: builder.query<
      TResponse<TProductSalesRecord[]>,
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: "reports/products/sales-report",
        params: { startDate, endDate },
      }),

      providesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
export default productApi;
