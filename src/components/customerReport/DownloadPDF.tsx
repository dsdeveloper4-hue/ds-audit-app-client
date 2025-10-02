"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { TSales } from "@/types";

interface DownloadPDFProps {
  sale: TSales;
}

export default function DownloadPDF({ sale }: DownloadPDFProps) {
  const handleDownload = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4", // Full A4 page
    });

    let y = 20; // Initial Y position

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Sale Invoice", 105, y, { align: "center" });
    y += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Function to safely add text if value exists
    const addText = (label: string, value: string | number | undefined) => {
      if (value !== undefined && value !== null && value !== "") {
        doc.text(`${label}: ${value}`, 10, y);
        y += 6;
      }
    };

    // Sale info
    addText("Invoice Code", sale.sales_code);
    addText("Reference No", sale.reference_no);
    addText("Customer", sale.customer_name);
    addText("Payment Status", sale.payment_status);
    addText("Created By", sale.created_by);
    addText("Sale Date", sale.sales_date);
    addText("Created Time", sale.created_time);

    y += 4; // small spacing before table

    // Table of items
    if (sale.items && sale.items.length > 0) {
      const tableColumn = ["Item", "Qty", "Price", "Discount", "Total"];
      const tableRows = sale.items.map((item) => [
        item.item_name || "-",
        item.sales_qty?.toString() || "0",
        item.price_per_unit?.toFixed(2) || "0.00",
        item.discount_amt?.toFixed(2) || "0.00",
        item.total_cost?.toFixed(2) || "0.00",
      ]);

      autoTable(doc, {
        startY: y,
        head: [tableColumn],
        body: tableRows,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185], halign: "center" },
        bodyStyles: { fontSize: 10 },
        columnStyles: {
          1: { halign: "center" },
          2: { halign: "right" },
          3: { halign: "right" },
          4: { halign: "right" },
        },
      });

      // Update Y position after table
      y = (doc as any).lastAutoTable?.finalY + 8;
    }

    // Totals section
    if (sale.subtotal !== undefined) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Subtotal: ${sale.subtotal.toFixed(2)}`, 140, y, {
        align: "right",
      });
      y += 6;
    }

    if (sale.paid_amount !== undefined) {
      doc.text(`Paid Amount: ${sale.paid_amount.toFixed(2)}`, 140, y, {
        align: "right",
      });
      y += 6;
    }

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Thank you for your business!", 105, 290, { align: "center" });

    // Save PDF
    doc.save(`sale-${sale.sales_code}.pdf`);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={handleDownload}
    >
      <FileDown className="h-4 w-4" /> Download PDF
    </Button>
  );
}
