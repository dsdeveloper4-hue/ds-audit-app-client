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
    const monthName =
      months.find((m) => m.value === audit.month)?.label || "Unknown";

    // Calculate totals
    let totalActive = 0;
    let totalBroken = 0;
    let totalInactive = 0;

    audit.detailsByRoom?.forEach((roomData) => {
      roomData.items.forEach((item) => {
        totalActive += item.active_quantity || 0;
        totalBroken += item.broken_quantity || 0;
        totalInactive += item.inactive_quantity || 0;
      });
    });

    const grandTotal = totalActive + totalBroken + totalInactive;

    const printWindow = window.open("", "", "width=950,height=800");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Room-wise Inventory - ${monthName} ${audit.year}</title>
          <style>
            :root {
              --primary: #1d4ed8;
              --secondary: #0f172a;
              --accent: #2563eb;
              --bg-light: #ffffff;
              --border-color: #cbd5e1;
              --text-dark: #0f172a;
              --active-color: #047857;
              --broken-color: #b91c1c;
              --inactive-color: #92400e;
              --summary-bg: #f1f5f9;
            }

            body {
              font-family: "Inter", "Segoe UI", Arial, sans-serif;
              background-color: var(--bg-light);
              margin: 0;
              padding: 40px 50px;
              color: var(--text-dark);
            }

            header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid var(--accent);
              padding-bottom: 10px;
            }

            h1 {
              font-size: 32px;
              font-weight: 900;
              color: var(--secondary);
              margin-bottom: 6px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }

            p.subtitle {
              font-size: 20px;
              font-weight: 600;
              color: var(--primary);
              margin: 0;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            section.room {
              border: 1px solid var(--border-color);
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 50px;
              background: var(--bg-light);
              box-shadow: 0 2px 6px rgba(0,0,0,0.05);
              page-break-after: always;
            }

            h2 {
              font-size: 20px;
              font-weight: 700;
              color: var(--secondary);
              margin-bottom: 15px;
              border-left: 5px solid var(--accent);
              padding-left: 10px;
              text-transform: uppercase;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 15px;
              border: 1px solid var(--border-color);
              background: #f8fafc;
            }

            th, td {
              border: 1px solid var(--border-color);
              padding: 10px 12px;
              text-align: left;
            }

            th {
              background: #e2e8f0;
              color: var(--secondary);
              font-weight: 700;
              text-transform: uppercase;
              font-size: 14px;
            }

            td {
              color: var(--text-dark);
              font-weight: 500;
            }

            tr:nth-child(even) td {
              background: #f9fafb;
            }

            tr:hover td {
              background: #f1f5f9;
            }

            td.active {
              color: var(--active-color);
              font-weight: 700;
            }

            td.broken {
              color: var(--broken-color);
              font-weight: 700;
            }

            td.inactive {
              color: var(--inactive-color);
              font-weight: 700;
            }

            td.total {
              color: var(--secondary);
              font-weight: 800;
            }

            /* Total Summary Section - medium width and centered */
            .summary {
              width: 70%;
              margin: 70px auto;
              border: 1px solid var(--border-color);
              border-radius: 10px;
              padding: 25px;
              background: var(--summary-bg);
              box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            }

            .summary h3 {
              font-size: 22px;
              font-weight: 800;
              color: var(--secondary);
              text-align: center;
              text-transform: uppercase;
              margin-bottom: 20px;
              letter-spacing: 0.5px;
            }

            .summary table {
              width: 100%;
              border-collapse: collapse;
              font-size: 16px;
              border: 1px solid var(--border-color);
              background: white;
            }

            .summary th, .summary td {
              border: 1px solid var(--border-color);
              padding: 12px;
              text-align: center;
            }

            .summary th {
              background: #e2e8f0;
              color: var(--secondary);
              font-weight: 700;
              text-transform: uppercase;
            }

            .summary td:first-child { color: var(--active-color); font-weight: 700; }
            .summary td:nth-child(2) { color: var(--broken-color); font-weight: 700; }
            .summary td:nth-child(3) { color: var(--inactive-color); font-weight: 700; }
            .summary td:last-child { color: var(--secondary); font-weight: 800; }

            footer {
              text-align: center;
              font-size: 13px;
              color: #475569;
              margin-top: 50px;
            }

            @media print {
              body {
                padding: 20px;
                background: white;
              }
              section, .summary {
                box-shadow: none;
              }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <header>
            <h1>Room-wise Inventory Report</h1>
            <p class="subtitle">${monthName} ${audit.year}</p>
          </header>
    `);

    audit.detailsByRoom?.forEach((roomData) => {
      const roomName = roomData.room?.name || "Unknown Room";
      printWindow.document.write(`
        <section class="room">
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

      roomData.items.forEach((item) => {
        const total =
          (item.active_quantity || 0) +
          (item.broken_quantity || 0) +
          (item.inactive_quantity || 0);
        printWindow.document.write(`
          <tr>
            <td>${item.item?.name || "Unknown Item"}</td>
            <td class="active">${item.active_quantity || 0}</td>
            <td class="broken">${item.broken_quantity || 0}</td>
            <td class="inactive">${item.inactive_quantity || 0}</td>
            <td class="total">${total}</td>
          </tr>
        `);
      });

      printWindow.document.write(`
            </tbody>
          </table>
        </section>
      `);
    });

    printWindow.document.write(`
        <div class="summary">
          <h3>Overall Total Summary</h3>
          <table>
            <thead>
              <tr>
                <th>Active</th>
                <th>Broken</th>
                <th>Inactive</th>
                <th>Grand Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${totalActive}</td>
                <td>${totalBroken}</td>
                <td>${totalInactive}</td>
                <td>${grandTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>
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
