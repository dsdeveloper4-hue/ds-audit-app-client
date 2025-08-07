"use client";

import React from "react";
import { Button } from "../ui/button";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ProductType } from "@/type";

type PropsType = {
  products: ProductType[];
  totalQty: number;
  totalAmount: number;
  startDate: string;
  endDate: string;
};

const StyledExcelExport = ({
  products,
  totalQty,
  totalAmount,
  startDate,
  endDate,
}: PropsType) => {
  const downloadExcel = async () => {
    if (products.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Sales Report");

    // 🔹 Title Row (merged)
    const title = `Sales Report (${startDate} to ${endDate})`;
    sheet.mergeCells("A1", "F1");
    const titleCell = sheet.getCell("A1");
    titleCell.value = title;
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };

    // 🔹 Header Row
    sheet.addRow([
      "Product Name",
      "Price",
      "Qty",
      "Total Cost",
      "Total Sales",
      "Total Revenue",
    ]);
    const headerRow = sheet.getRow(2);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1E3A8A" }, // Indigo-800
      };
      cell.font = { color: { argb: "FFFFFF" }, bold: true };
      cell.alignment = { horizontal: "center" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // 🔹 Data Rows
    products.forEach((product) => {
      const cost = product.item.purchase_price * product.total_qty;
      const revenue = product.total_amount - cost;

      const row = sheet.addRow([
        product.item?.item_name ?? "Unnamed",
        product.item?.sales_price ?? 0,
        product.total_qty ?? 0,
        cost,
        product.total_amount ?? 0,
        revenue,
      ]);

      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // 🔹 Blank Row
    sheet.addRow([]);

    // 🔹 Totals Row
    const totalCost = products.reduce(
      (acc, p) => acc + p.item.purchase_price * p.total_qty,
      0
    );
    const totalRevenue = totalAmount - totalCost;

    const totalRow = sheet.addRow([
      "Total",
      "",
      totalQty,
      totalCost,
      totalAmount,
      totalRevenue,
    ]);

    totalRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FDE68A" }, // Amber-300
      };
      cell.alignment = { horizontal: "center" };
      cell.border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
    });

    sheet.columns?.forEach((column) => {
      let maxLength = 10;

      if (column.eachCell) {
        column.eachCell({ includeEmpty: true }, (cell) => {
          const val = cell.value ? cell.value.toString() : "";
          maxLength = Math.max(maxLength, val.length);
        });
      }

      column.width = maxLength + 2;
    });

    // 🔹 Export the file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Sales_Report_${startDate}_to_${endDate}.xlsx`);
  };

  return <Button onClick={downloadExcel}>📄 Download Excel</Button>;
};

export default StyledExcelExport;
