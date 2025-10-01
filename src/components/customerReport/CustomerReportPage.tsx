"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useGetCustomerRecordsQuery } from "@/redux/features/customer/customerApi";
import { TSalesReport } from "@/types";

import ErrorPage from "../shared/Error";
import CustomerTable from "./CustomerTable";
import DateRangePicker from "../shared/DateRangePicker";

const today = format(new Date(), "yyyy-MM-dd");

export default function CustomerReportPage() {
  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(today);

  // Fetch customer sales with RTK Query
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetCustomerRecordsQuery(
    { startDate, endDate },
    { refetchOnMountOrArgChange: true }
  );

  // Memoize customers
  const customers = useMemo<TSalesReport[]>(
    () => response?.data || [],
    [response]
  );

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
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
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
        <CustomerTable
          customers={customers}
          startDate={startDate}
          endDate={endDate}
        />
      )}
    </motion.div>
  );
}
