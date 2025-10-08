"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { TSales } from "@/types";
import logoUrl from "../../../public/index.jpeg";

interface DownloadPDFProps {
  sale: TSales;
}

export default function DownloadPDF({ sale }: DownloadPDFProps) {
  const handleDownload = async () => {
    const cmToMm = (cm: number) => cm * 10;

    const pageWidth = cmToMm(14);
    const pageHeight = cmToMm(22.3);
    const marginX = 8;

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [pageWidth, pageHeight],
    });

    /* ---------------- HEADER ---------------- */

    // Prepare address
    const address = "";
    const splitAddress = doc.splitTextToSize(
      address,
      pageWidth - marginX * 2 - 15
    ); // 15mm indent
    const addressLines = splitAddress.length;

    // Dynamic header height: logo + info + name + address + padding
    const headerHeight = 5 + 10 + 10 + addressLines * 5 + 5; // mm

    // Draw header background
    doc.setFillColor(180, 225, 200);
    doc.rect(0, 0, pageWidth, headerHeight, "F");

    // Logo image
    const img = new Image();
    img.src = logoUrl.src;
    await new Promise((res) => {
      img.onload = res;
    });
    doc.addImage(img, "JPEG", marginX, 5, 20, 10);

    // Voucher title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text("VOUCHER", pageWidth - marginX, 10, { align: "right" });

    // Info lines with dotted underline
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);

    const drawDotsLine = (x: number, y: number, width: number) => {
      const dotWidth = 0.7;
      let currX = x;
      while (currX < x + width) {
        doc.circle(currX, y, dotWidth / 2, "F");
        currX += dotWidth * 2; // space between dots
      }
    };

    // Date
    doc.text("Date:", marginX, 19);
    drawDotsLine(marginX + 10, 19, 30);

    // Phone
    doc.text("Phone No:", marginX + 50, 19);
    drawDotsLine(marginX + 70, 19, pageWidth - marginX - 70);

    // Name
    doc.text("Name:", marginX, 23.5);
    drawDotsLine(marginX + 12, 23.5, pageWidth - marginX - 12);

    // Address
    const addressStartY = 28;
    doc.text("Address:", marginX, addressStartY);

    // Draw dotted line for each address line
    const addressLineYSpacing = 5;
    splitAddress.forEach((line, i) => {
      doc.text(line, marginX + 15, addressStartY + i * addressLineYSpacing); // indent 15
      drawDotsLine(
        marginX + 15,
        addressStartY + i * addressLineYSpacing + 1,
        pageWidth - marginX * 2 - 15
      );
    });

    /* ---------------- TABLE ---------------- */
    const tableStartY = headerHeight + 3;

    const tableHeaders = [
      ["NO.", "ITEM DESCRIPTION", "RATE", "QUANTITY", "AMOUNT"],
    ];
    const tableRows: string[][] = [];

    if (sale?.items?.length) {
      sale.items.forEach((item, index) => {
        tableRows.push([
          (index + 1).toString(),
          item.item_name || "",
          item.price_per_unit?.toFixed(2) || "",
          item.sales_qty?.toString() || "",
          item.total_cost?.toFixed(2) || "",
        ]);
      });
    }

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
      margin: { left: marginX, right: marginX },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.1,
      styles: { cellPadding: 2 },
    });

    const finalTableY = (doc as any).lastAutoTable.finalY;

    /* ---------------- TOTAL ROW ---------------- */
    const totalAmount =
      sale?.items?.reduce((sum, i) => sum + (i.total_cost || 0), 0) || 0;

    const totalLabelX = pageWidth - marginX - 40;
    const totalLabelY = finalTableY;
    const cellH = 8;
    const cellW = 20;

    doc.setFillColor(230, 230, 230);
    doc.rect(totalLabelX, totalLabelY, cellW, cellH, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Total", totalLabelX + cellW / 2, totalLabelY + 5, {
      align: "center",
    });

    doc.setFillColor(255, 255, 255);
    doc.rect(totalLabelX + cellW, totalLabelY, cellW, cellH, "S");
    doc.text(
      totalAmount.toFixed(2),
      totalLabelX + cellW + cellW / 2,
      totalLabelY + 5,
      { align: "center" }
    );

    /* ---------------- FOOTER ---------------- */
    const footerStartY = pageHeight - 25;
    doc.setFillColor(180, 225, 200);
    doc.rect(0, footerStartY, pageWidth, 25, "F");

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Index Laboratories (Ayu) Ltd.", marginX, footerStartY + 7);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    const footerText = [
      "Head Office: Colombia Super Market (6th Floor), 31 Mohakhali C/A, Dhaka-1212",
      "Phone: 01629-612189 | E-mail: indexayu7@gmail.com",
      "Web: www.indexlaboratories.com",
    ];
    doc.text(footerText, marginX, footerStartY + 12);

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
