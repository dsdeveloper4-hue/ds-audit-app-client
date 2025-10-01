"use client";

import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetCustomerRecordsQuery } from "@/redux/features/customer/customerApi";
import CustomerTable from "./CustomerTable";
import DateRangePicker from "../shared/DateRangePicker";
import ErrorPage from "../shared/Error";
import Pagination from "../shared/Pagination";
import RowsPerPage from "../shared/RowPerPage";

const today = format(new Date(), "yyyy-MM-dd");

export default function CustomerReportPage() {
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input for 500ms
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch customers dynamically
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetCustomerRecordsQuery({
    search: debouncedSearch || undefined,
    startDate,
    endDate,
    page,
    limit,
  });

  const customers = useMemo(() => response?.data || [], [response]);
  const total = response?.pagination?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <motion.div
      className="px-4 py-6 mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Filters */}
      <Card className="mb-6 shadow-md border border-muted rounded-2xl">
        <CardContent className="px-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Date Range */}
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />

            {/* Search */}
            <div className="flex flex-col w-[200px]">
              <Input
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 border-blue-200 focus:border-blue-400"
              />
            </div>

            {/* Limit Selector */}
            <RowsPerPage limit={limit} setLimit={setLimit} setPage={setPage} />
          </div>
        </CardContent>
      </Card>

      {/* Table / Loading / Error */}
      {isLoading && (
        <p className="text-center text-gray-500 animate-pulse">Loading...</p>
      )}

      {isError && (
        <ErrorPage
          title="Failed to load customers"
          message="We couldn’t fetch the customer report. Please try again later."
          onRetry={() => refetch()}
          retryLabel="Try Again"
        />
      )}

      {!isLoading && !isError && (
        <>
          <CustomerTable
            customers={customers}
            startDate={startDate}
            endDate={endDate}
          />

          <div className="mt-6 flex justify-end">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </motion.div>
  );
}
