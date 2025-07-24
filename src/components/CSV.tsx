import React from "react";
import { Button } from "./ui/button";
import { ProductType } from "@/type";

type PropsType = {
  products: ProductType[];
  totalQty: number;
  totalAmount: number;
  startDate: string;
  endDate: string;
};

const CSV = ({
  products,
  totalQty,
  totalAmount,
  startDate,
  endDate,
}: PropsType) => {
  const downloadCSV = () => {
    if (products.length === 0) return;

    const headers = [
      "Product Name",
      "Price",
      "Sales Qty",
      "Total Sales",
    ];

    const rows = products.map((product) => [
      product.item?.item_name ?? "Unnamed",
      product.item?.sales_price ?? 0,
      product.total_qty ?? 0,
      product.total_amount ?? 0,
    ]);

    // Add a blank row before total for clarity (optional)
    rows.push([]);

    // Add the total row — align with columns:
    // For example: ["Total:", "", totalQty, totalAmount, ""]
    rows.push([
      "Total:",
      "",
      totalQty,
      totalAmount,
      "", // no date for total
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) =>
            typeof cell === "string" && cell.includes(",") ? `"${cell}"` : cell
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sales-products ${startDate} ${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return <Button onClick={downloadCSV}>Download CSV</Button>;
};

export default CSV;
