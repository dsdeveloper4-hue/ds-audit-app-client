"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import CSV from "./CSV";
import Loading from "./Loading";
import ErrorPage from "./Error";

type ItemInfo = {
  item_name: string;
  sales_price: number;
};

interface Product {
  id: number;
  sales_qty: number;
  total_cost: number;
  created_date: string;
  item_info: ItemInfo;
}

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

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
    <ErrorPage />
    );
  }

  return (
    <div className="px-4 py-2">
      <div className="bg-red-400 w-full h-[35vh] mb-5 flex items-center justify-between px-4">
        <CSV products={products} />
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
