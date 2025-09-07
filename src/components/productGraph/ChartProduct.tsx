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
import { TProduct } from "@/types";
import { format } from "date-fns";

const today = format(new Date(), "yyyy-MM-dd");
const may10 = format(new Date(new Date().getFullYear(), 4, 10), "yyyy-MM-dd");

export default function ProductChartPage() {
  // Products
  const {
    data: productsResponse,
    isLoading,
    isError,
  } = useGetAllProductsQuery();
  const products: TProduct[] = productsResponse?.data || [];
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

  // Fetch sales data
  const { data: salesResponse } = useGetProductSalesReportByIDQuery(
    selectedProductId && startDate && endDate
      ? { productId: selectedProductId, startDate, endDate }
      : { productId: 0, startDate, endDate },
    { skip: !selectedProductId }
  );

  const salesData = salesResponse?.data || [];

  // Totals
  const totalQty = useMemo(
    () => salesData.reduce((sum, d) => sum + (d.totalQty || 0), 0),
    [salesData]
  );
  const totalAmount = useMemo(
    () => salesData.reduce((sum, d) => sum + (d.totalAmount || 0), 0),
    [salesData]
  );

  // Chart
  const chartData = {
    labels: salesData.map((d) => format(new Date(d.date), "dd MMM yyyy")), // ✅ show each day
    datasets: [
      {
        label: "Sales Amount",
        data: salesData.map((d) => d.totalAmount),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, title: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Failed to load products.</p>;

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <main className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📊 Product Sales Analytics</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start  md:items-start">
        <ProductSelect
          products={products}
          selectedProductId={selectedProductId}
          setSelectedProductId={(value) => setSelectedProductId(Number(value))}
        />
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="shadow-md rounded-2xl border border-gray-200">
          <CardContent>
            <h2 className="text-gray-500 font-medium mb-2">Total Quantity</h2>
            <p className="text-2xl font-bold">{totalQty}</p>
          </CardContent>
        </Card>
        <Card className="shadow-md rounded-2xl border border-gray-200">
          <CardContent>
            <h2 className="text-gray-500 font-medium mb-2">Total Amount</h2>
            <p className="text-2xl font-bold">
              ৳ {totalAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <motion.div
        key={`${selectedProductId}-${startDate}-${endDate}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>
              {selectedProduct?.item_name || "Product"} Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.labels.length > 0 ? (
              <div className="w-full h-[350px] md:h-[400px]">
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
