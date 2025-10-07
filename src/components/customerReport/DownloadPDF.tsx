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
    // Convert cm to mm for jsPDF
    const cmToMm = (cm: number) => cm * 10;

    // Page setup (exactly as specified)
    const pageWidth = cmToMm(14.1); // 141 mm
    const pageHeight = cmToMm(22.4); // 224 mm
    const headerHeight = cmToMm(3.8); // 38 mm
    const footerHeight = cmToMm(1.3); // 13 mm
    const marginX = 8;
    const marginY = 5;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [pageWidth, pageHeight],
    });

    // --- HEADER SECTION ---
    // Light green/teal background (RGB: 177, 232, 207)
    doc.setFillColor(177, 232, 207);
    doc.rect(0, 0, pageWidth, headerHeight, "F");

    // Index logo (oval shape)
    doc.setFillColor(255, 255, 255);
    doc.ellipse(20, 12, 12, 6, "F");
    doc.setDrawColor(128, 128, 128);
    doc.ellipse(20, 12, 12, 6, "S");

    // Index text inside oval
    doc.setTextColor(128, 0, 128);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Index", 20, 13, { align: "center" });

    // VOUCHER text (right side, purple/gray)
    doc.setTextColor(128, 128, 128);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("VOUCHER", pageWidth - marginX, 12, { align: "right" });

    // Date field
    doc.setTextColor(128, 128, 128);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Date:", pageWidth - 50, 20);
    doc.setDrawColor(200, 200, 200);
    doc.line(pageWidth - 35, 21, pageWidth - marginX, 21);

    // Phone No field
    doc.text("Phone No:", pageWidth - 50, 26);
    doc.line(pageWidth - 30, 27, pageWidth - marginX, 27);

    // Name field (spans width)
    doc.setTextColor(128, 128, 128);
    doc.text("Name", marginX, 30);
    doc.line(marginX + 15, 31, pageWidth - marginX, 31);

    // Address field (spans width)
    doc.text("Address", marginX, 36);
    doc.line(marginX + 20, 37, pageWidth - marginX, 37);

    // --- MAIN TABLE SECTION ---
    const tableStartY = headerHeight + 2;

    // Table headers with green background (RGB: 76, 175, 80)
    const tableHeaders = [
      ["NO.", "ITEM DESCRIPTION", "RATE", "QUANTITY", "AMOUNT"],
    ];

    // Create rows - Choose between empty voucher or actual sale data
    const tableRows: string[][] = [];

    // OPTION 1: Empty voucher template (current behavior)
    for (let i = 1; i <= 12; i++) {
      tableRows.push([i.toString(), "", "", "", ""]);
    }

    // OPTION 2: If you want to show actual sale data, uncomment this instead:
    if (sale?.items && sale.items.length > 0) {
      sale.items.forEach((item, index) => {
        tableRows.push([
          (index + 1).toString(),
          item.item_name || "",
          item.price_per_unit?.toFixed(2) || "",
          item.sales_qty?.toString() || "",
          item.total_cost?.toFixed(2) || ""
        ]);
      });
      // Add empty rows to fill up to 12 rows
      for (let i = sale.items.length + 1; i <= 12; i++) {
        tableRows.push([i.toString(), "", "", "", ""]);
      }
    } else {
      for (let i = 1; i <= 12; i++) {
        tableRows.push([i.toString(), "", "", "", ""]);
      }
    }

    // Generate main table with EQUAL WIDTHS for RATE, QUANTITY, AMOUNT
    autoTable(doc, {
      startY: tableStartY,
      head: tableHeaders,
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [76, 175, 80],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 12 }, // NO. - slightly smaller
        1: { halign: "left", cellWidth: 75 }, // ITEM DESCRIPTION - larger
        2: { halign: "center", cellWidth: 18 }, // RATE - equal width
        3: { halign: "center", cellWidth: 18 }, // QUANTITY - equal width
        4: { halign: "center", cellWidth: 18 }, // AMOUNT - equal width
      },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.1,
      margin: { left: marginX, right: marginX },
      styles: {
        cellPadding: 2,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
      },
    });

    // Get the final Y position after the table
    const finalTableY = (doc as any).lastAutoTable.finalY;

    // Add "Total" cell at bottom right
    const totalCellX = pageWidth - marginX - 18;
    const totalCellY = finalTableY;
    const totalCellWidth = 18;
    const totalCellHeight = 8;

    doc.setFillColor(220, 220, 220);
    doc.rect(totalCellX, totalCellY, totalCellWidth, totalCellHeight, "FD");

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Total", totalCellX + totalCellWidth / 2, totalCellY + 5, {
      align: "center",
    });

    // --- FOOTER SECTION ---
    const footerStartY = pageHeight - footerHeight;

    // Footer background (same green as header)
    doc.setFillColor(177, 232, 207);
    doc.rect(0, footerStartY, pageWidth, footerHeight, "F");

    // Company name
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Index Laboratories (Ayu) Ltd.", marginX, footerStartY + 4);

    // Head Office details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(
      "Head Office: Colombia Super Marcket (6th Floor)31,",
      marginX + 80,
      footerStartY + 3
    );
    doc.text(
      "Mohakhali C/A, Dhaka-1212, Phone: 01629-612189",
      marginX + 80,
      footerStartY + 7
    );
    doc.text(
      "E-mail: indexayu7@gmail.com, Web: www.indexlaboratories.com",
      marginX + 80,
      footerStartY + 11
    );

    // Save the PDF
    doc.save(`voucher-${sale?.sales_code || "blank"}.pdf`);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={handleDownload}
    >
      <FileDown className="h-4 w-4" />
      Download Voucher
    </Button>
  );
}
