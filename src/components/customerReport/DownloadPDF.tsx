"use client";

import React from "react";
import jsPDF from "jspdf";
import { TSales } from "@/types";
import { Download } from "lucide-react";
import { Button } from "../ui/button";

type Props = {
  customer: TSales;
};

const DownloadPDF: React.FC<Props> = ({ customer }) => {
  const handleDownload = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.setTextColor("#1F2937"); // dark color
    doc.text("Customer Sales Report", 14, 20);

    // Divider
    doc.setLineWidth(0.5);
    doc.line(14, 25, 196, 25);

    // Customer Info
    doc.setFontSize(12);
    doc.setTextColor("#111827"); // slightly darker
    doc.text(`Customer Name: ${customer.customer_name}`, 14, 40);
    doc.text(`Sales Code: ${customer.sales_code}`, 14, 50);
    doc.text(`Reference No: ${customer.reference_no}`, 14, 60);
    doc.text(
      `Date: ${new Date(customer.created_date).toLocaleDateString()} • ${
        customer.created_time
      }`,
      14,
      70
    );
    doc.text(`Paid Amount: ৳${customer.paid_amount?.toLocaleString()}`, 14, 80);
    doc.text(`Payment Status: ${customer.payment_status}`, 14, 90);


    // Save PDF with sales code as filename
    doc.save(`${customer.sales_code}_sales.pdf`);
  };

  return (
    <Button
      onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
    >
      <Download className="w-4 h-4" />
      Download PDF
    </Button>
  );
};

export default DownloadPDF;
