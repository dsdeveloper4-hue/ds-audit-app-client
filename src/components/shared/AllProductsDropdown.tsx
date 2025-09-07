"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { TProduct } from "@/types";

interface ProductSelectProps {
  products: TProduct[];
  selectedProductId: number | null;
  setSelectedProductId: (id: number) => void;
}

export default function ProductSelect({
  products,
  selectedProductId,
  setSelectedProductId,
}: ProductSelectProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sort products A-Z by default
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.item_name.localeCompare(b.item_name));
  }, [products]);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!search) return sortedProducts;
    const lowerSearch = search.toLowerCase();
    return sortedProducts.filter((p) =>
      p.item_name.toLowerCase().includes(lowerSearch)
    );
  }, [search, sortedProducts]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedProductName =
    selectedProductId &&
    products.find((p) => p.id === selectedProductId)?.item_name;

  return (
    <div className="w-72 flex flex-col gap-1" ref={containerRef}>
      <label className="text-sm font-medium text-muted-foreground">
        Select product
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
            onClick={() => setOpen(!open)}
          >
            {selectedProductName || "Select product"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search product..."
              className="w-full border p-2 rounded mb-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <ul className="max-h-60 overflow-y-auto">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <li
                    key={product.id}
                    className="p-2 cursor-pointer hover:bg-gray-100 rounded"
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setSearch(product.item_name);
                      setOpen(false);
                    }}
                  >
                    {product.item_name}
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500">No results found</li>
              )}
            </ul>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
