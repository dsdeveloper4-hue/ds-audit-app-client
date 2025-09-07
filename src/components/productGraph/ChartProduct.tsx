"use client";

import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductSelect from "../shared/AllProductsDropdown";
import DateRangePicker from "../shared/DateRangePicker";
import ReusableBarChart from "../shared/ReusableBarChart";
import {
  useGetAllProductsQuery,
  useGetProductSalesReportByIDQuery,
} from "@/redux/features/product/productApi";

// Default dates
const today = format(new Date(), "yyyy-MM-dd");

export default function ProductChartPage() {
  // Fetch products
  const {
    data: productsResponse,
    isLoading,
    isError,
  } = useGetAllProductsQuery();

  // Memoize products
  const products = useMemo(
    () => productsResponse?.data || [],
    [productsResponse]
  );

  // Selected product
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (products.length && selectedProductId === null) {
      // ✅ Try to set product with id = 9 as default
      const defaultProduct = products.find((p) => p.id === 9);
      if (defaultProduct) {
        setSelectedProductId(defaultProduct.id);
      } else {
        // fallback to first product
        setSelectedProductId(products[0].id);
      }
    }
  }, [products, selectedProductId]);

  // Date range
  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(today);

  // View mode
  const [viewMode, setViewMode] = useState<"qty" | "amount">("qty");

  // Fetch sales data
  const { data: salesResponse } = useGetProductSalesReportByIDQuery(
    selectedProductId && startDate && endDate
      ? { productId: selectedProductId, startDate, endDate }
      : { productId: 0, startDate, endDate },
    { skip: !selectedProductId }
  );

  // Memoize sales data
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

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Failed to load products.</p>;

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <main className="flex flex-col  bg-gray-50 max-h-[90vh] w-[75vw] overflow-x-hidden">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 flex-shrink-0">
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

      {/* Chart Section */}
      <ReusableBarChart
        title={`${selectedProduct?.item_name || "Product"} Sales`}
        labels={salesData.map((d) => format(new Date(d.date), "dd/MM"))}
        data={salesData.map((d) =>
          viewMode === "qty" ? d.totalQty : d.totalAmount
        )}
        viewMode={viewMode}
      />
    </main>
  );
}
