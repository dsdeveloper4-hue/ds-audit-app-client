"use client";

import { useState, useEffect, useMemo } from "react";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  eachMonthOfInterval,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductSelect from "../shared/AllProductsDropdown";
import DateRangePicker from "../shared/DateRangePicker";
import ReusableBarChart from "../shared/ReusableBarChart";
import {
  useGetAllProductsQuery,
  useGetProductSalesReportByIDQuery,
} from "@/redux/features/product/productApi";
import ErrorPage from "../shared/Error";

// Default date helpers
const today = new Date();
const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

export default function ProductChartPage() {
  // Products
  const {
    data: productsResponse,
    isLoading,
    isError,
  } = useGetAllProductsQuery();
  const products = useMemo(
    () => productsResponse?.data || [],
    [productsResponse]
  );

  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  useEffect(() => {
    if (products.length && selectedProductId === null) {
      const defaultProduct = products.find((p) => p.id === 9);
      setSelectedProductId(defaultProduct ? defaultProduct.id : products[0].id);
    }
  }, [products, selectedProductId]);

  // Daily / Monthly toggle
  const [timeMode, setTimeMode] = useState<"daily" | "monthly">("daily");

  // Daily range
  const [startDate, setStartDate] = useState<string>(formatDate(today));
  const [endDate, setEndDate] = useState<string>(formatDate(today));

  // Monthly range
  const [fromMonth, setFromMonth] = useState<Date>(today);
  const [toMonth, setToMonth] = useState<Date>(today);

  // View mode (quantity / amount)
  const [viewMode, setViewMode] = useState<"qty" | "amount">("qty");

  // Fetch sales for daily mode
  const { data: dailyRes } = useGetProductSalesReportByIDQuery(
    selectedProductId && startDate && endDate
      ? { productId: selectedProductId, startDate, endDate }
      : { productId: 0, startDate, endDate },
    { skip: !selectedProductId || timeMode !== "daily" }
  );

  // Fetch sales for monthly mode
  const monthStart = formatDate(startOfMonth(fromMonth));
  const monthEnd = formatDate(endOfMonth(toMonth));

  const { data: monthlyRes } = useGetProductSalesReportByIDQuery(
    selectedProductId
      ? {
          productId: selectedProductId,
          startDate: monthStart,
          endDate: monthEnd,
        }
      : { productId: 0, startDate: monthStart, endDate: monthEnd },
    { skip: !selectedProductId || timeMode !== "monthly" }
  );

  // Fill missing daily data
  const filledDailyData = useMemo(() => {
    if (!dailyRes?.data) return [];

    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const allDays = eachDayOfInterval({ start, end });

    const salesMap = Object.fromEntries(
      dailyRes.data.map((d) => [format(new Date(d.date), "yyyy-MM-dd"), d])
    );

    return allDays.map((day) => {
      const key = format(day, "yyyy-MM-dd");
      const existing = salesMap[key];
      return {
        date: key,
        totalQty: existing?.totalQty || 0,
        totalAmount: existing?.totalAmount || 0,
      };
    });
  }, [dailyRes, startDate, endDate]);

  // Fill missing monthly data (AGGREGATED!)
  const filledMonthlyData = useMemo(() => {
    if (!monthlyRes?.data) return [];

    const start = startOfMonth(fromMonth);
    const end = endOfMonth(toMonth);
    const allMonths = eachMonthOfInterval({ start, end });

    // Aggregate monthly data
    const salesMap: Record<string, { totalQty: number; totalAmount: number }> =
      {};

    for (const d of monthlyRes.data) {
      const monthLabel = format(new Date(d.date), "MMM yyyy");
      if (!salesMap[monthLabel]) {
        salesMap[monthLabel] = { totalQty: 0, totalAmount: 0 };
      }
      salesMap[monthLabel].totalQty += d.totalQty || 0;
      salesMap[monthLabel].totalAmount += d.totalAmount || 0;
    }

    return allMonths.map((month) => {
      const key = format(month, "MMM yyyy");
      const existing = salesMap[key];
      return {
        date: key,
        totalQty: existing?.totalQty || 0,
        totalAmount: existing?.totalAmount || 0,
      };
    });
  }, [monthlyRes, fromMonth, toMonth]);

  // Use filled data for chart
  const chartData = timeMode === "daily" ? filledDailyData : filledMonthlyData;

  // Totals
  const totalQty = chartData.reduce((sum, d) => sum + (d.totalQty || 0), 0);
  const totalAmount = chartData.reduce(
    (sum, d) => sum + (d.totalAmount || 0),
    0
  );

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return (
    <ErrorPage
      title="Failed to load products"
      message="We couldn’t fetch the product list. Please try again later."
      retryLabel="Try Again"
    />
  );

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <main className="flex flex-col bg-gray-50 w-[75vw] min-h-[90vh] overflow-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Product Sales Analytics</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-6 mb-6 justify-between">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <ProductSelect
            products={products}
            selectedProductId={selectedProductId}
            setSelectedProductId={(value) =>
              setSelectedProductId(Number(value))
            }
          />

          {timeMode === "daily" ? (
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
          ) : (
            <div className="flex gap-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">From Month</label>
                <input
                  type="month"
                  value={format(fromMonth, "yyyy-MM")}
                  onChange={(e) =>
                    setFromMonth(
                      e.target.value ? new Date(e.target.value) : today
                    )
                  }
                  className="border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">To Month</label>
                <input
                  type="month"
                  value={format(toMonth, "yyyy-MM")}
                  onChange={(e) =>
                    setToMonth(
                      e.target.value ? new Date(e.target.value) : today
                    )
                  }
                  className="border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
              </div>
            </div>
          )}
        </div>

        {/* Toggle Buttons */}
        <div className="flex flex-col justify-end gap-2 mt-4 md:mt-0 ml-auto">
          <Button
            onClick={() =>
              setTimeMode(timeMode === "daily" ? "monthly" : "daily")
            }
            className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all flex items-center gap-2"
          >
            {timeMode === "daily" ? "Switch to Monthly" : "Switch to Daily"}
          </Button>
          <Button
            onClick={() => setViewMode(viewMode === "qty" ? "amount" : "qty")}
            className="bg-gray-800 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg transition-all flex items-center gap-2"
          >
            Switch to {viewMode === "qty" ? "Total Amount" : "Total Quantity"}
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="shadow-lg rounded-2xl border border-gray-200 hover:shadow-xl transition-all">
          <CardContent>
            <h2 className="text-gray-500 font-medium mb-2">
              {timeMode === "daily"
                ? `Daily Summary`
                : `Monthly Summary (${format(fromMonth, "MMM yyyy")} - ${format(
                    toMonth,
                    "MMM yyyy"
                  )})`}
            </h2>
            <p className="text-2xl font-bold text-gray-900">
              {viewMode === "qty"
                ? totalQty
                : `৳ ${totalAmount.toLocaleString()}`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <ReusableBarChart
        title={`${selectedProduct?.item_name || "Product"} Sales`}
        labels={chartData.map((d) =>
          timeMode === "daily" ? format(new Date(d.date), "dd/MM") : d.date
        )}
        data={chartData.map((d) =>
          viewMode === "qty" ? d.totalQty : d.totalAmount
        )}
        viewMode={viewMode}
        height="50vh"
      />
    </main>
  );
}
