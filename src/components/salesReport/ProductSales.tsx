"use client";

import CSV from "./CSV";
import ErrorPage from "../shared/Error";
import ProductTable from "./ProductTable";
import ProductSorting from "./ProductSorting";
import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useGetProductsQuery } from "@/redux/features/product/productApi";

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
    data: products = [],
    isLoading,
    error,
  } = useGetProductsQuery({
    startDate,
    endDate,
  });

  useEffect(() => {
    if (products.length) {
      const qty = products.reduce((sum, p) => sum + p.total_qty, 0);
      const amount = products.reduce((sum, p) => sum + p.total_amount, 0);
      setTotalQty(qty);
      setTotalAmount(amount);
    } else {
      setTotalQty(0);
      setTotalAmount(0);
    }
  }, [products]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "name")
      return a.item.item_name.localeCompare(b.item.item_name);
    if (sortBy === "reversedName")
      return b.item.item_name.localeCompare(a.item.item_name);
    if (sortBy === "qty") return b.total_qty - a.total_qty;
    if (sortBy === "minQty") return a.total_qty - b.total_qty;
    if (sortBy === "mostSales") return b.total_amount - a.total_amount;
    if (sortBy === "minSales") return a.total_amount - b.total_amount;
    return 0;
  });

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
            {/* From Date Picker */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-muted-foreground">
                From Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[200px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(parseISO(startDate), "PPP")
                    ) : (
                      <span>Select date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate ? parseISO(startDate) : undefined}
                    onSelect={(date) =>
                      setStartDate(date ? format(date, "yyyy-MM-dd") : "")
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* To Date Picker */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-muted-foreground">
                To Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[200px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(parseISO(endDate), "PPP")
                    ) : (
                      <span>Select date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate ? parseISO(endDate) : undefined}
                    onSelect={(date) =>
                      setEndDate(date ? format(date, "yyyy-MM-dd") : "")
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

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
