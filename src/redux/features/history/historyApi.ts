import baseApi from "@/redux/api/baseApi";

const historyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecentActivity: builder.query({
      query: (params) => ({
        url: "/history",
        method: "GET",
        params,
      }),
    }),
    getActivityStats: builder.query({
      query: () => ({
        url: "/history/stats",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetRecentActivityQuery, useGetActivityStatsQuery } = historyApi;
