import baseApi from "@/redux/api/baseApi";
import { TProduct, TProductSalesRecord, TResponse } from "@/types";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Fetch products within a date range
    getProductsRecords: builder.query<
      TResponse<TProductSalesRecord[]>,
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: "reports/products/sales-report",
        params: { startDate, endDate },
      }),

      providesTags: ["Products"],
    }),

    getAllProducts: builder.query<TResponse<TProduct[]>, void>({
      query: () => ({
        url: "reports/products",
      }),
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsRecordsQuery, useGetAllProductsQuery } = productApi;
export default productApi;
