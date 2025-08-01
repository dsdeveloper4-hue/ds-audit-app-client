import React from "react";
import { Button } from "../ui/button";
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
      "Qty",
      "Total Cost",
      "Total Sales",
      "Total Revenue",
      "Sales Date",
    ];

    // Helper: calculate total cost
    const totalCost = products.reduce(
      (acc, product) => acc + product.item.purchase_price * product.total_qty,
      0
    );

    const rows = products.map((product) => {
      const cost = product.item.purchase_price * product.total_qty;
      const revenue = product.total_amount - cost;

      return [
        product.item?.item_name ?? "Unnamed",
        product.item?.sales_price ?? 0,
        product.total_qty ?? 0,
        cost,
        product.total_amount ?? 0,
        revenue,
        product.sales_date
          ? new Date(product.sales_date).toLocaleDateString()
          : "N/A",
      ];
    });

    // Add blank row (optional)
    rows.push([]);

    // Add total row aligned with the header
    rows.push([
      "Total",
      "",
      totalQty,
      totalCost,
      totalAmount,
      totalAmount - totalCost,
      "", // empty date column
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => {
            if (typeof cell === "string" && cell.includes(",")) {
              return `"${cell}"`; // wrap in quotes if contains comma
            }
            return cell;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `sales-products_${startDate}_to_${endDate}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return <Button onClick={downloadCSV}>Download CSV</Button>;
};

export default CSV;
