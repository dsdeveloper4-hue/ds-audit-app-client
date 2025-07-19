"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

type Product = {
  id: number;
  item_id: number;
  price_per_unit: number;
  purchase_price: number;
  sales_qty: number;
  total_cost: number;
};

const fetchProducts = async (): Promise<Product[]> => {
  const res = await api.get("/api/product-dashboard");
  return res.data.products;
};

export default function SalesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sales-products"],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">❌ Failed to load products</div>;
  }

  return (
    <ScrollArea className="h-[80vh] p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((product) => (
          <Card key={product.id} className="shadow-sm border border-muted">
            <CardHeader>
              <CardTitle className="text-base">
                🧾 Product #{product.item_id}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Unit Price</span>
                <Badge variant="outline">${product.price_per_unit}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Total Sold</span>
                <Badge variant="outline">{product.sales_qty}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Total Cost</span>
                <Badge variant="default">${product.total_cost}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">
                  Purchase Price
                </span>
                <Badge variant="outline">${product.purchase_price}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
