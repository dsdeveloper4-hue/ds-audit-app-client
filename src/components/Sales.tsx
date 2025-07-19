"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

type Product = {
  id: number;
  item_name: string;
  price: number;
  quantity: number;
};

const fetchProducts = async (): Promise<Product[]> => {
  const res = await api.get("/salesitems?limit=10");
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
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">❌ Failed to load products</div>;
  }

  return (
    <ScrollArea className="h-[80vh] p-4">
      <div className="grid gap-4">
        {data?.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4 space-y-1">
              <p className="text-lg font-semibold">{product.item_name}</p>
              <p className="text-sm text-muted-foreground">
                Price: ${product.price} | Quantity: {product.quantity}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
