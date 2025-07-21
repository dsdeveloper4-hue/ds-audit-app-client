"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import CSV from "./CSV";
import Loading from "./Loading";
import ErrorPage from "./Error";
import ProductTable from "./ProductTable";
import { ProductType } from "@/type";



const fetchAllProducts = async (): Promise<ProductType[]> => {
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
    return <ErrorPage />;
  }

  return (
    <div className="px-4 py-2">
      <div className="bg-red-400 w-full h-[10vh] mb-5 flex items-center justify-between px-4">
        <CSV products={products} />
      </div>

      <ProductTable products={products} />
    </div>
  );
}
