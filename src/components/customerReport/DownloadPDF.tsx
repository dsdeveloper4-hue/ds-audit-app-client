"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { TSales } from "@/types";

interface DownloadPDFProps {
  sale: TSales;
}

export default function DownloadPDF({ sale }: DownloadPDFProps) {
  const handleDownload = () => {
    // Implement actual PDF logic later
    console.log("Download PDF for sale:", sale.id);
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
