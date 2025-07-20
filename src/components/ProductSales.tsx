"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";

type ItemInfo = {
  item_name: string;
  sales_price: number;
};

type Product = {
  id: number;
  sales_qty: number;
  total_cost: number;
  created_date: string;
  item_info: ItemInfo;
};

const fetchAllProducts = async (): Promise<Product[]> => {
  const res = await api.get(`/api/product-dashboard`);
  return res.data.products;
};

export default function SalesPage() {
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sales-products"],
    queryFn: fetchAllProducts,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const downloadCSV = () => {
    if (products.length === 0) return;

    const headers = [
      "Product Name",
      "Price",
      "Sales Qty",
      "Total Sales",
      "Date",
    ];

    const rows = products.map((product) => [
      product.item_info?.item_name ?? "Unnamed",
      product.item_info?.sales_price ?? 0,
      product.sales_qty,
      product.total_cost,
      product.created_date
        ? new Date(product.created_date).toLocaleDateString()
        : "N/A",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) =>
            typeof cell === "string" && cell.includes(",") ? `"${cell}"` : cell
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sales-products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        {[...Array(50)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center p-6 space-y-4 text-red-600">
        <svg
          className="w-12 h-12 animate-spin text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p className="text-lg font-semibold">❌ Failed to load products.</p>
        <p className="text-center text-sm text-red-400">
          Please check your internet connection or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
      <div className="bg-red-400 w-full h-[35vh] mb-5 flex items-center justify-between px-4">
        <Button onClick={downloadCSV}> Download CSV</Button>
      </div>

      <div className="border rounded-md overflow-hidden">
        <div className="h-[calc(50vh-10px)] overflow-auto scroll-container">
          <table className="min-w-[640px] w-full text-sm text-left border-collapse">
            <thead className="bg-blue-800 text-white uppercase text-sm">
              <tr>
                <th className="px-4 py-3 sticky top-0 bg-blue-800 z-10">
                  Product Name
                </th>
                <th className="px-4 py-3 sticky top-0 bg-blue-800 z-10">
                  Price
                </th>
                <th className="px-4 py-3 sticky top-0 bg-blue-800 z-10">
                  Sales Qty
                </th>
                <th className="px-4 py-3 sticky top-0 bg-blue-800 z-10">
                  Total Sales
                </th>
                <th className="px-4 py-3 sticky top-0 bg-blue-800 z-10">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {product.item_info?.item_name ?? "Unnamed"}
                  </td>
                  <td className="px-4 py-3">
                    ৳ {product.item_info?.sales_price}
                  </td>
                  <td className="px-4 py-3">{product.sales_qty}</td>
                  <td className="px-4 py-3">৳ {product.total_cost}</td>
                  <td className="px-4 py-3">
                    {product.created_date
                      ? new Date(product.created_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
