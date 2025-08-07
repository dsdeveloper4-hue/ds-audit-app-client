"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import CSV from "./CSV";
import Loading from "../Loading";
import ErrorPage from "../Error";
import ProductTable from "./ProductTable";
import { ProductType } from "@/type";
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
import ProductSorting from "./ProductSorting";

const fetchAllProducts = async ({
  queryKey,
}: {
  queryKey: [string, { startDate: string; endDate: string }];
}): Promise<ProductType[]> => {
  const [, { startDate, endDate }] = queryKey;
  const res = await api.get(`/api/product-dashboard`, {
    params: { startDate, endDate },
  });
  return res.data.products;
};

const today = format(new Date(), "yyyy-MM-dd");
// const july15 = format(new Date(2025, 6, 15), "yyyy-MM-dd");
export default function SalesPage() {
  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(today);
  const [totalQty, setTotalQty] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const [sortBy, setSortBy] = useState<
    "name" | "reversedName" | "qty" | "minQty" | "amount" | "minSales"
  >("name");

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sales-products", { startDate, endDate }],
    queryFn: fetchAllProducts,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!startDate && !!endDate,
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
    if (sortBy === "amount") return b.total_amount - a.total_amount;
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

            {/* <SelectedProduct
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              products={sortedProducts}
            /> */}
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
      {isLoading && <Loading />}
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
