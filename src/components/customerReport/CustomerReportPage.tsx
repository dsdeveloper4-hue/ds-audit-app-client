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
import { Search } from "lucide-react";

const today = format(new Date(), "yyyy-MM-dd");
const defaultStartDate = format(new Date(2025, 0, 1), "yyyy-MM-dd");

export default function CustomerReportPage() {
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(today);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input for 1 second (1000ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      // Reset to page 1 when search changes
      if (search !== debouncedSearch) {
        setPage(1);
      }
    }, 500);

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

  const customers = useMemo(() => response?.data?.data || [], [response]);
  const total = response?.data?.pagination?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  // Show searching indicator
  const isSearching = search !== debouncedSearch;

  return (
    <motion.div
      className="container mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Filters Card */}
      <Card className="mb-6 shadow-sm border-muted/50 rounded-xl">
        <CardContent className="px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-end justify-between">
            {/* Left Section: Date Range */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">
                  Date Range
                </label>
                <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                />
              </div>
            </div>

            {/* Right Section: Search and Rows */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end w-full lg:w-auto">
              {/* Search Input */}
              <div className="flex flex-col gap-2 w-full sm:w-64">
                <label className="text-sm font-medium text-foreground">
                  Search Customers
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by Sales Code"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-10 pl-10 border-muted-foreground/25 focus:border-primary/50 transition-colors"
                  />
                  {/* Searching Indicator */}
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    </div>
                  )}
                </div>
                {isSearching && (
                  <p className="text-xs text-muted-foreground">Searching...</p>
                )}
              </div>

              {/* Rows Per Page */}
              <div className="flex flex-col gap-2">
                <RowsPerPage
                  limit={limit}
                  setLimit={setLimit}
                  setPage={setPage}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {!isLoading && !isError && customers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 flex items-center justify-between"
        >
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {(page - 1) * limit + 1}-{Math.min(page * limit, total)}
            </span>{" "}
            of <span className="font-medium text-foreground">{total}</span>{" "}
            customers
          </p>
          <p className="text-sm text-muted-foreground">
            Page <span className="font-medium text-foreground">{page}</span> of{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
          </p>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-lg font-medium text-foreground">
            Loading customer data...
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Please wait while we fetch the latest records
          </p>
        </motion.div>
      )}

      {/* Error State */}
      {isError && (
        <ErrorPage
          title="Failed to load customer data"
          message="We encountered an issue while fetching the customer report. This might be due to network issues or server problems."
          onRetry={() => refetch()}
          retryLabel="Retry Loading"
        />
      )}

      {/* Success State */}
      {!isLoading && !isError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <CustomerTable
            customers={customers}
            startDate={startDate}
            endDate={endDate}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Total {total} customer{total !== 1 ? "s" : ""} found
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </motion.div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && customers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-muted-foreground/60" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No customers found
          </h3>
          <p className="text-muted-foreground max-w-md">
            No customer records match your current filters. Try adjusting your
            search criteria, date range, or check back later for new data.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
