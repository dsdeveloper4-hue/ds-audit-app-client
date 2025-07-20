"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef, useState } from "react";

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

type FetchProductsResponse = {
  products: Product[];
  nextPage: number | null;
};

export default function SalesPage() {
  const [limit, setLimit] = useState(5);

  const fetchProducts = async ({
    pageParam = 1,
  }: {
    pageParam?: number;
  }): Promise<FetchProductsResponse> => {
    const res = await api.get(
      `/api/product-dashboard?page=${pageParam}&limit=${limit}`
    );
    return res.data;
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["sales-products"],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const scrollArea = document.querySelector(
      ".scroll-container"
    ) as HTMLElement;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      {
        root: scrollArea,
        threshold: 1.0,
      }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        {[...Array(limit)].map((_, i) => (
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

  const products = data?.pages.flatMap((page) => page.products) ?? [];

  return (
    <ScrollArea className="scroll-container h-[calc(100dvh-100px)] px-4 py-6">
      <div className="border rounded-md overflow-x-auto">
        <table className="min-w-[640px] w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 sticky top-0 bg-gray-100 z-10">
                Product Name
              </th>
              <th className="px-4 py-3 sticky top-0 bg-gray-100 z-10">Price</th>
              <th className="px-4 py-3 sticky top-0 bg-gray-100 z-10">
                Sales Qty
              </th>
              <th className="px-4 py-3 sticky top-0 bg-gray-100 z-10">
                Total Sales
              </th>
              <th className="px-4 py-3 sticky top-0 bg-gray-100 z-10">Date</th>
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
        {hasNextPage && (
          <div
            ref={loadMoreRef}
            className="h-10 flex items-center justify-center"
          >
            {isFetchingNextPage ? (
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 animate-spin text-gray-500"
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
                <span>Loading more...</span>
              </div>
            ) : (
              <span>Scroll to load more</span>
            )}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
