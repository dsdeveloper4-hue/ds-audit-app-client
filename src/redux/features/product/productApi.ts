import baseApi from "@/redux/api/baseApi";
import { TProductSalesRecord } from "@/types";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Fetch products within a date range
    getProducts: builder.query<
      TProductSalesRecord[],
      { startDate: string; endDate: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: "reports/products/sales-report",
        params: { startDate, endDate },
      }),
      transformResponse: (response: { products: TProductSalesRecord[] }) =>
        response.products,
      providesTags: ["Products"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductsQuery } = productApi;
export default productApi;
