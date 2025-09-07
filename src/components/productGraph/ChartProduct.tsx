"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import "@/lib/chartSetup";
import ProductSelect from "../shared/AllProductsDropdown";
import DateRangePicker from "../shared/DateRangePicker";
import {
  useGetAllProductsQuery,
  useGetProductSalesReportByIDQuery,
} from "@/redux/features/product/productApi";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

const today = format(new Date(), "yyyy-MM-dd");
const may10 = format(new Date(new Date().getFullYear(), 4, 10), "yyyy-MM-dd");

export default function ProductChartPage() {
  // Fetch products
  const {
    data: productsResponse,
    isLoading,
    isError,
  } = useGetAllProductsQuery();

  // Memoize products to avoid unnecessary useEffect triggers
  const products = useMemo(
    () => productsResponse?.data || [],
    [productsResponse]
  );
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (products.length && selectedProductId === null) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  // Date range
  const [startDate, setStartDate] = useState<string>(may10);
  const [endDate, setEndDate] = useState<string>(today);

  // View mode: "qty" or "amount"
  const [viewMode, setViewMode] = useState<"qty" | "amount">("qty");

  // Fetch sales data
  const { data: salesResponse } = useGetProductSalesReportByIDQuery(
    selectedProductId && startDate && endDate
      ? { productId: selectedProductId, startDate, endDate }
      : { productId: 0, startDate, endDate },
    { skip: !selectedProductId }
  );

  // Memoize salesData to avoid unnecessary recalculations
  const salesData = useMemo(() => salesResponse?.data || [], [salesResponse]);

  // Totals
  const totalQty = useMemo(
    () => salesData.reduce((sum, d) => sum + (d.totalQty || 0), 0),
    [salesData]
  );
  const totalAmount = useMemo(
    () => salesData.reduce((sum, d) => sum + (d.totalAmount || 0), 0),
    [salesData]
  );

  // Chart configuration
  const chartData = useMemo(
    () => ({
      labels: salesData.map((d) => format(new Date(d.date), "dd/MM")),
      datasets: [
        {
          label: viewMode === "qty" ? "Quantity" : "Amount (৳)",
          data: salesData.map((d) =>
            viewMode === "qty" ? d.totalQty : d.totalAmount
          ),
          backgroundColor:
            viewMode === "qty"
              ? "rgba(29, 78, 216, 0.9)" // Blue
              : "rgba(5, 150, 105, 0.9)", // Green
          borderColor:
            viewMode === "qty"
              ? "rgb(29, 78, 216)" // Blue
              : "rgb(5, 150, 105)", // Green
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    }),
    [salesData, viewMode]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, title: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true },
      },
    }),
    []
  );

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Failed to load products.</p>;

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <main className="flex flex-col p-6 md:p-10 bg-gray-50 min-h-[80vh] w-[80vw] overflow-hidden">
      <h1 className="text-3xl font-bold mb-6 flex-shrink-0">
        📊 Product Sales Analytics
      </h1>

      {/* Filters + Toggle */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between flex-shrink-0">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <ProductSelect
            products={products}
            selectedProductId={selectedProductId}
            setSelectedProductId={(value) =>
              setSelectedProductId(Number(value))
            }
          />
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        </div>

        <Button
          onClick={() => setViewMode(viewMode === "qty" ? "amount" : "qty")}
          className="bg-gray-800 text-white hover:bg-gray-900 transition-colors flex-shrink-0"
        >
          View: {viewMode === "qty" ? "Total Quantity" : "Total Amount"}
        </Button>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 flex-shrink-0">
        <Card className="shadow-md rounded-2xl border border-gray-200">
          <CardContent>
            <h2 className="text-gray-500 font-medium mb-2">
              {viewMode === "qty" ? "Total Quantity" : "Total Amount"}
            </h2>
            <p className="text-2xl font-bold">
              {viewMode === "qty"
                ? totalQty
                : `৳ ${totalAmount.toLocaleString()}`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <motion.div
        key={`${selectedProductId}-${startDate}-${endDate}-${viewMode}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex-1 overflow-hidden"
      >
        <Card className="shadow-lg rounded-2xl h-full">
          <CardHeader>
            <CardTitle>
              {selectedProduct?.item_name || "Product"} Sales
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[32vh]">
            {chartData.labels.length > 0 ? (
              <div className="w-full h-full">
                <Bar data={chartData} options={chartOptions} />
              </div>
            ) : (
              <p className="text-center py-20 text-gray-400">
                No sales data available for this date range.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
