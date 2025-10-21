import React from "react";
import { Button } from "../ui/button";
import { TAuditWithDetails } from "@/types";
import months from "@/constants/months";

interface DownloadPDFProps {
  children: React.ReactNode;
  className?: string;
  audit: TAuditWithDetails;
}

const DownloadPDF = ({ children, className, audit }: DownloadPDFProps) => {
  const handleDownload = () => {
    const monthName = months.find((m) => m.value === audit.month)?.label || "Unknown";
    
    // Create printable HTML content
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Room-wise Inventory - ${monthName} ${audit.year}</title>
          <style>
            body { font-family: Arial; margin: 20px; }
            h1 { color: #2c3e50; text-align: center; }
            h2 { color: #3498db; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background-color: #3498db; color: white; padding: 8px; text-align: left; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            @media print {
              body { padding: 20px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Room-wise Inventory - ${monthName} ${audit.year}</h1>
    `);
    
    // Add room-wise data
    audit.detailsByRoom?.forEach(roomData => {
      const roomName = roomData.room?.name || "Unknown Room";
      printWindow.document.write(`
        <h2>${roomName.toUpperCase()}</h2>
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Active</th>
              <th>Broken</th>
              <th>Inactive</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
      `);
      
      roomData.items.forEach(item => {
        const total = (item.active_quantity || 0) + (item.broken_quantity || 0) + (item.inactive_quantity || 0);
        printWindow.document.write(`
          <tr>
            <td>${item.item?.name || "Unknown Item"}</td>
            <td>${item.active_quantity || 0}</td>
            <td>${item.broken_quantity || 0}</td>
            <td>${item.inactive_quantity || 0}</td>
            <td>${total}</td>
          </tr>
        `);
      });
      
      printWindow.document.write(`
          </tbody>
        </table>
      `);
    });
    
    printWindow.document.write(`
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1000);
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <Button className={className} onClick={handleDownload}>
      {children}
    </Button>
  );
};

export default DownloadPDF;
