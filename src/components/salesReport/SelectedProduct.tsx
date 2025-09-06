import React, { Dispatch, SetStateAction } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { TProductSalesRecord } from "@/types";

type PropType = {
  selectedFilters: string[];
  setSelectedFilters: Dispatch<SetStateAction<string[]>>;
  products: TProductSalesRecord[];
};
const SelectedProduct = ({
  selectedFilters,
  setSelectedFilters,
  products,
}: PropType) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-muted-foreground">
        Filter Products
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[200px] justify-start text-left font-normal"
          >
            Select Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-2 space-y-1" align="start">
          {/* Simulate multi-select items here. In real case, you can fetch categories or statuses from API */}
          {products.map((item) => (
            <label
              key={item.item_id}
              className="flex items-center gap-2 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                value={item.item.item_name}
                // You can manage selected items using useState
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedFilters((prev) =>
                    prev.includes(value)
                      ? prev.filter((f) => f !== value)
                      : [...prev, value]
                  );
                }}
                checked={selectedFilters.includes(item.item.item_name)}
              />
              {item.item.item_name}
            </label>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SelectedProduct;
