"use client";

import { useState, useMemo, useRef, useEffect } from "react";
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

  // Filter and prioritize search matches
  const filteredProducts = useMemo(() => {
    if (!search) return sortedProducts;
    const lowerSearch = search.toLowerCase();
    return [...sortedProducts].sort((a, b) => {
      const aMatch = a.item_name.toLowerCase().includes(lowerSearch) ? 0 : 1;
      const bMatch = b.item_name.toLowerCase().includes(lowerSearch) ? 0 : 1;
      return aMatch - bMatch;
    });
  }, [search, sortedProducts]);

  // Close dropdown on click outside
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

  return (
    <div className="mb-6 w-72 relative" ref={containerRef}>
      <input
        type="text"
        className="w-full border p-2 rounded"
        placeholder="Search product..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />

      {open && filteredProducts.length > 0 && (
        <ul className="absolute z-10 w-full max-h-60 overflow-y-auto bg-white border rounded shadow">
          {filteredProducts.map((product) => (
            <li
              key={product.id}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setSelectedProductId(product.id);
                setSearch(product.item_name);
                setOpen(false);
              }}
            >
              {product.item_name}
            </li>
          ))}
        </ul>
      )}

      {open && filteredProducts.length === 0 && (
        <div className="absolute z-10 w-full p-2 bg-white border rounded text-gray-500">
          No results found
        </div>
      )}
    </div>
  );
}
