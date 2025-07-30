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

type PropsType = {
  sortBy: "name" | "qty" | "amount";
  setSortBy: React.Dispatch<React.SetStateAction<"name" | "qty" | "amount">>;
};

const ProductSorting = ({ sortBy, setSortBy }: PropsType) => {
  return (
    <div className="flex flex-col gap-2 w-[250px]">
      <Label className="text-sm font-medium text-muted-foreground">
        Sort By
      </Label>
      <Select
        value={sortBy}
        onValueChange={(value: "name" | "qty" | "amount") => setSortBy(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select sorting option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">A-Z (Name)</SelectItem>
          <SelectItem value="qty">Most Quantity</SelectItem>
          <SelectItem value="amount">Most Sales</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductSorting;
