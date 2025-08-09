"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortOption =
  | "name"
  | "reversedName"
  | "qty"
  | "minQty"
  | "mostSales"
  | "minSales";

type PropsType = {
  sortBy: SortOption;
  setSortBy: React.Dispatch<React.SetStateAction<SortOption>>;
};

const ProductSorting = ({ sortBy, setSortBy }: PropsType) => {
  return (
    <div className="flex flex-col gap-2 w-[250px]">
      <Label className="text-sm font-medium text-muted-foreground">
        Sort By
      </Label>
      <Select
        value={sortBy}
        onValueChange={(value: SortOption) => setSortBy(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select sorting option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">A-Z (Name)</SelectItem>
          <SelectItem value="reversedName">Z-A (Name)</SelectItem>
          <SelectItem value="qty">Most Quantity</SelectItem>
          <SelectItem value="minQty">Min Quantity</SelectItem>
          <SelectItem value="mostSales">Most Sales</SelectItem>
          <SelectItem value="minSales">Min Sales</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductSorting;
