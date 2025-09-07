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

    // ✅ Fetch all products
    getAllProducts: builder.query<TResponse<TProduct[]>, void>({
      query: () => ({
        url: "reports/products",
      }),
      providesTags: ["Products"],
    }),

    getProductSalesReportByID: builder.query<
      TResponse<{ date: string; totalQty: number; totalAmount: number }[]>,
      { productId: number; startDate: string; endDate: string }
    >({
      query: ({ productId, startDate, endDate }) => ({
        url: `reports/product/${productId}`,
        params: { startDate, endDate }, // ✅ send as query params
      }),
      providesTags: (_result, _error, { productId }) => [
        { type: "Products", id: productId },
      ],
    }),
  }),
});

export const {
  useGetProductsRecordsQuery,
  useGetAllProductsQuery,
  useGetProductSalesReportByIDQuery, // ✅ new hook
} = productApi;

export default productApi;
