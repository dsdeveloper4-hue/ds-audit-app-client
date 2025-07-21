import React from "react";
import { Button } from "./ui/button";

type ItemInfo = {
  item_name: string;
  sales_price: number;
};

interface Product {
  id: number;
  sales_qty: number;
  total_cost: number;
  created_date: string;
  item_info: ItemInfo;
};

interface PropsType {
  products: Product[]
}

const CSV = ({products}: PropsType) => {
  const downloadCSV = () => {
    if (products.length === 0) return;

    const headers = [
      "Product Name",
      "Price",
      "Sales Qty",
      "Total Sales",
      "Date",
    ];

    const rows = products.map((product) => [
      product.item_info?.item_name ?? "Unnamed",
      product.item_info?.sales_price ?? 0,
      product.sales_qty,
      product.total_cost,
      product.created_date
        ? new Date(product.created_date).toLocaleDateString()
        : "N/A",
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
    link.setAttribute("download", "sales-products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return <Button onClick={downloadCSV}> Download CSV</Button>;
};

export default CSV;
