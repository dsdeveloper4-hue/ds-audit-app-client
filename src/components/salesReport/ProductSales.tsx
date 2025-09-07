"use client";

import CSV from "./CSV";
import ErrorPage from "../shared/Error";
import ProductTable from "./ProductTable";
import ProductSorting from "./ProductSorting";
import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useGetProductsRecordsQuery } from "@/redux/features/product/productApi";
import { TProductSalesRecord } from "@/types";
import DateRangePicker from "../shared/DateRangePicker"; // ✅ new reusable component

const today = format(new Date(), "yyyy-MM-dd");
const may10 = format(new Date(new Date().getFullYear(), 4, 10), "yyyy-MM-dd");

export default function SalesPage() {
  const [startDate, setStartDate] = useState<string>(may10);
  const [endDate, setEndDate] = useState<string>(today);
  const [totalQty, setTotalQty] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const [sortBy, setSortBy] = useState<
    "name" | "reversedName" | "qty" | "minQty" | "mostSales" | "minSales"
  >("mostSales");

  // ✅ Fetch products with RTK Query
  const {
    data: response,
    isLoading,
    error,
  } = useGetProductsRecordsQuery({ startDate, endDate });
  const products: TProductSalesRecord[] = response?.data || [];

  // Calculate totals whenever products change
  useEffect(() => {
    if (products.length) {
      setTotalQty(products.reduce((sum, p) => sum + p.total_qty, 0));
      setTotalAmount(products.reduce((sum, p) => sum + p.total_amount, 0));
    } else {
      setTotalQty(0);
      setTotalAmount(0);
    }
  }, [products]);

  // Sort products based on selected criteria
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.item.item_name.localeCompare(b.item.item_name);
        case "reversedName":
          return b.item.item_name.localeCompare(a.item.item_name);
        case "qty":
          return b.total_qty - a.total_qty;
        case "minQty":
          return a.total_qty - b.total_qty;
        case "mostSales":
          return b.total_amount - a.total_amount;
        case "minSales":
          return a.total_amount - b.total_amount;
        default:
          return 0;
      }
    });
  }, [products, sortBy]);

  return (
    <motion.div
      className="px-4 py-6 mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Search & Export Card */}
      <Card className="mb-6 shadow-md border border-muted rounded-2xl">
        <CardContent className="px-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* ✅ Reusable DateRangePicker */}
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />

            {/* Sorting Dropdown */}
            <ProductSorting sortBy={sortBy} setSortBy={setSortBy} />
          </div>

          {/* CSV Button */}
          <div className="mt-2 md:mt-0">
            <CSV
              products={sortedProducts}
              endDate={endDate}
              startDate={startDate}
              totalAmount={totalAmount}
              totalQty={totalQty}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table / Loading / Error */}
      {isLoading && <p>Loading...</p>}
      {error && <ErrorPage />}
      {!isLoading && !error && (
        <ProductTable
          products={sortedProducts}
          totalAmount={totalAmount}
          totalQty={totalQty}
          startDate={startDate}
          endDate={endDate}
        />
      )}
    </motion.div>
  );
}
