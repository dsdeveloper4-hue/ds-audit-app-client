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
    const cmToMm = (cm: number) => cm * 10;

    // Page size (14cm × 22.3cm)
    const pageWidth = cmToMm(14);
    const pageHeight = cmToMm(22.3);
    const headerHeight = 25;
    const footerHeight = 20;
    const marginX = 8;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [pageWidth, pageHeight],
    });

    /* ---------------- HEADER ---------------- */
    doc.setFillColor(180, 225, 200);
    doc.rect(0, 0, pageWidth, headerHeight, "F");

    // Logo ellipse
    doc.setFillColor(255, 255, 255);
    doc.ellipse(20, 12, 10, 5, "F");
    doc.setDrawColor(80, 80, 80);
    doc.ellipse(20, 12, 10, 5, "S");

    // Logo text
    doc.setTextColor(108, 0, 150);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Index", 20, 13, { align: "center" });

    // Voucher title
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(14);
    doc.text("VOUCHER", pageWidth - marginX, 10, { align: "right" });

    // Info lines
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.text("Date:", marginX, 19);
    doc.line(marginX + 10, 19.5, marginX + 40, 19.5);
    doc.text("Phone No:", marginX + 50, 19);
    doc.line(marginX + 70, 19.5, pageWidth - marginX, 19.5);

    doc.text("Name:", marginX, 23.5);
    doc.line(marginX + 12, 24, pageWidth - marginX, 24);
    doc.text("Address:", marginX, 28);
    doc.line(marginX + 18, 28.5, pageWidth - marginX, 28.5);

    /* ---------------- TABLE ---------------- */
    const tableStartY = headerHeight + 3;

    const tableHeaders = [
      ["NO.", "ITEM DESCRIPTION", "RATE", "QUANTITY", "AMOUNT"],
    ];
    const tableRows: string[][] = [];

    if (sale?.items?.length) {
      sale.items.forEach((item, index) => {
        const rate = item.price_per_unit?.toFixed(2) || "";
        const qty = item.sales_qty?.toString() || "";
        const amount = item.total_cost?.toFixed(2) || "";
        tableRows.push([
          (index + 1).toString(),
          item.item_name || "",
          rate,
          qty,
          amount,
        ]);
      });
    }

    // Fill remaining rows
    for (let i = (sale?.items?.length || 0) + 1; i <= 12; i++) {
      tableRows.push([i.toString(), "", "", "", ""]);
    }

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
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 10 },
        1: { halign: "left", cellWidth: 54 },
        2: { halign: "center", cellWidth: 20 },
        3: { halign: "center", cellWidth: 20 },
        4: { halign: "center", cellWidth: 20 },
      },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.1,
      margin: { left: marginX, right: marginX },
      styles: { cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.1 },
    });

    const finalTableY = (doc as any).lastAutoTable.finalY;

    /* ---------------- TOTAL ROW ---------------- */
    const totalAmount =
      sale?.items?.reduce((sum, i) => sum + (i.total_cost || 0), 0) || 0;

    const totalLabelX = pageWidth - marginX - 40;
    const totalLabelY = finalTableY;
    const cellH = 8;
    const cellW = 20; // ✅ set width to 20mm each

    // Label cell
    doc.setFillColor(230, 230, 230);
    doc.rect(totalLabelX, totalLabelY, cellW, cellH, "FD");
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Total", totalLabelX + cellW / 2, totalLabelY + 5, {
      align: "center",
    });

    // Amount cell
    doc.setFillColor(255, 255, 255);
    doc.rect(totalLabelX + cellW, totalLabelY, cellW, cellH, "S");
    doc.text(
      totalAmount.toFixed(2),
      totalLabelX + cellW + cellW / 2,
      totalLabelY + 5,
      {
        align: "center",
      }
    );

    /* ---------------- FOOTER ---------------- */
    const footerStartY = pageHeight - footerHeight;
    doc.setFillColor(180, 225, 200);
    doc.rect(0, footerStartY, pageWidth, footerHeight, "F");

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Index Laboratories (Ayu) Ltd.", marginX, footerStartY + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(
      [
        "Head Office: Colombia Super Market (6th Floor), 31 Mohakhali C/A, Dhaka-1212",
        "Phone: 01629-612189 | E-mail: indexayu7@gmail.com",
        "Web: www.indexlaboratories.com",
      ],
      marginX,
      footerStartY + 12
    );

    // Save PDF
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
