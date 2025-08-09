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
  const exelSheetName =
    startDate === endDate ? `${startDate}` : `${startDate}_to_${endDate}`;
  const downloadExcel = async () => {
    if (products.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Sales Report");

    // ✅ Professional table column definitions
    sheet.columns = [
      { header: "Product Name", key: "name", width: 20 },
      { header: "Price", key: "price", width: 12 },
      { header: "Qty", key: "qty", width: 10 },
      { header: "Total Cost", key: "cost", width: 14 },
      { header: "Total Sales", key: "sales", width: 14 },
      { header: "Total Revenue", key: "revenue", width: 16 },
    ];

    // 🔹 Title Row
    // 🔹 Title Row
    const title = `Sales Report ${exelSheetName}`;
    sheet.mergeCells("A1", "F1");
    const titleCell = sheet.getCell("A1");
    titleCell.value = title;
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    sheet.getRow(1).height = 25;

    // ✅ Add the actual header row values (Row 2)
    const headerRow = sheet.addRow([
      "Product Name",
      "Price",
      "Qty",
      "Total Cost",
      "Total Sales",
      "Total Revenue",
    ]);
    headerRow.height = 22;

    // 🔹 Style the header row
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1E3A8A" }, // Indigo
      };
      cell.font = { color: { argb: "FFFFFF" }, bold: true, size: 12 };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // 🔹 Data Rows with zebra striping
    products.forEach((product, index) => {
      const cost = product.item.purchase_price * product.total_qty;
      const revenue = product.total_amount - cost;

      const row = sheet.addRow({
        name: product.item?.item_name ?? "Unnamed",
        price: product.item?.sales_price ?? 0,
        qty: product.total_qty ?? 0,
        cost,
        sales: product.total_amount ?? 0,
        revenue,
      });

      row.height = 20;
      row.eachCell((cell, colNumber) => {
        cell.alignment = {
          horizontal: colNumber === 1 ? "left" : "center",
          vertical: "middle",
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        if (index % 2 === 0) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "E5E7EB" }, // medium-light gray
          };
        }
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

    const totalRow = sheet.addRow({
      name: "Total",
      price: "",
      qty: totalQty,
      cost: totalCost,
      sales: totalAmount,
      revenue: totalRevenue,
    });

    totalRow.height = 22;
    totalRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FDE68A" }, // Amber
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.border = {
        top: { style: "medium" },
        left: { style: "medium" },
        bottom: { style: "medium" },
        right: { style: "medium" },
      };
    });

    // ✅ Auto-adjust widths based on content (min 12, max 30)
    sheet.columns.forEach((column) => {
      let maxLength = column.header?.toString().length ?? 10;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const val = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, val.length);
      });
      column.width = Math.min(Math.max(maxLength + 2, 12), 30);
    });

    // 🔹 Export
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Sales_Report_${exelSheetName}.xlsx`);
  };

  return <Button onClick={downloadExcel}>📄 Download Excel</Button>;
};

export default StyledExcelExport;
