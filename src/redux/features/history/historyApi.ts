import baseApi from "@/redux/api/baseApi";

const historyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecentActivity: builder.query({
      query: (params) => ({
        url: "/history",
        method: "GET",
        params,
      }),
      providesTags: ["History"],
    }),
    getActivityStats: builder.query({
      query: () => ({
        url: "/history/stats",
        method: "GET",
      }),
      providesTags: ["History"],
    }),
  }),
});

export const { useGetRecentActivityQuery, useGetActivityStatsQuery } = historyApi;
