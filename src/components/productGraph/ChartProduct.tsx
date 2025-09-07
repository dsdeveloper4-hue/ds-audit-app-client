"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import "@/lib/chartSetup";
import ProductSelect from "../shared/AllProductsDropdown";
import { SALES } from "@/constants/ProductConst";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { TProduct } from "@/types";

export default function ProductChartPage() {
  const {
    data: productsResponse,
    isLoading,
    isError,
  } = useGetAllProductsQuery();
  const products: TProduct[] = productsResponse?.data || [];

  // ✅ Use number for product IDs
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  // Set default selected product when products are loaded
  useEffect(() => {
    if (products.length && selectedProductId === null) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  // Find selected product
  const selectedProduct = products.find((p) => p.id === selectedProductId);
  console.log(selectedProduct)
  // Find sales for selected product (still using static SALES)
  const selectedSales = SALES.find((s) => s.productId === selectedProductId);

  // Prepare chart data
  const chartData = {
    labels: selectedSales?.monthlySales?.map((s) => s.month) || [],
    datasets: [
      {
        label: "Sales",
        data: selectedSales?.monthlySales?.map((s) => s.value) || [],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
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

  return (
    <main className="p-4 ">
      <h1 className="text-3xl font-bold mb-6">📊 Product Sales Analytics</h1>

      {/* Product Select Dropdown */}
      <ProductSelect
        products={products}
        selectedProductId={selectedProductId}
        setSelectedProductId={(value) => setSelectedProductId(Number(value))}
      />

      {/* Chart */}
      <motion.div
        key={selectedProductId}
        initial={{ opacity: 0, y: 30 }}
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
              <div className="w-full h-[300px] md:h-[350px]">
                <Bar data={chartData} options={chartOptions} />
              </div>
            ) : (
              <p className="text-center py-20 text-gray-500">
                No sales data available.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
