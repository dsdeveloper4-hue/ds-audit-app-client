"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  useGetAllAuditsQuery,
  useGetAuditByIdQuery,
  useGetLatestAuditQuery,
  useGetItemSummaryByAuditIdQuery,
} from "@/redux/features/audit/auditApi";
import { PageHeader } from "@/components/shared/PageHeader";
import { ListPageSkeleton } from "@/components/shared/Skeletons";
import Error from "@/components/shared/Error";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Doughnut } from "react-chartjs-2";
import "@/lib/chartSetup";
import {
  LayoutDashboard,
  Package,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronDown,
  Loader2,
  FileText,
  BarChart3,
  Table as TableIcon,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import months from "@/constants/months";
import DownloadPDF from "@/components/shared/DownloadPDF";

const COLORS = {
  active: "#059669", // Darker green, professional & modern
  broken: "#B91C1C", // Dark red, serious tone
  inactive: "#374151", // Dark gray, sleek & muted
  total: "#1D4ED8", // Deep blue, professional highlight
};

const STATUS_SUMMARY_COLORS = [
  "#10B981", // Active light
  "#EF4444", // Broken light
  "#9CA3AF", // Inactive light
];

const DashboardPage = () => {
  const {
    data: latestAuditResponse,
    isLoading: isLatestLoading,
    error: latestError,
  } = useGetLatestAuditQuery();
  const {
    data: auditsResponse,
    isLoading: isAuditsLoading,
    error: auditsError,
  } = useGetAllAuditsQuery();
  const [selectedAuditId, setSelectedAuditId] = React.useState<string | null>(
    null
  );
  const [viewMode, setViewMode] = React.useState<"table" | "graph">("table");
  const {
    data: selectedAuditResponse,
    isFetching: isSelectedAuditFetching,
    error: selectedAuditError,
  } = useGetAuditByIdQuery(selectedAuditId ?? "", {
    skip: !selectedAuditId,
  });

  const auditOptions = React.useMemo(
    () =>
      (auditsResponse?.data ?? []).map((auditOption) => {
        // find month name by matching value
        const monthName =
          months.find((m) => m.value === auditOption.month)?.label ?? "Unknown";

        return {
          id: auditOption.id,
          label: `Audit ${monthName} ${auditOption.year}`,
          status: auditOption.status,
        };
      }),
    [auditsResponse]
  );

  const audit = React.useMemo(() => {
    if (selectedAuditId) {
      if (selectedAuditId === latestAuditResponse?.data?.id) {
        return latestAuditResponse?.data ?? null;
      }
      return selectedAuditResponse?.data ?? null;
    }
    return latestAuditResponse?.data ?? null;
  }, [selectedAuditId, selectedAuditResponse, latestAuditResponse]);

  // Determine current audit ID in a stable way
  const currentAuditId = React.useMemo(() => {
    return audit?.id ?? "";
  }, [audit?.id]);

  // Fetch item summary for the current audit
  const {
    data: itemSummaryResponse,
    isLoading: isItemSummaryLoading,
    error: itemSummaryError,
  } = useGetItemSummaryByAuditIdQuery(currentAuditId, {
    skip: !currentAuditId,
  });

  const roomItemData = React.useMemo(
    () =>
      (audit?.detailsByRoom ?? []).map((roomData: any) => ({
        room: roomData.room.name,
        itemCount: roomData.items.length,
      })),
    [audit]
  );

  const {
    totalActive,
    totalBroken,
    totalInactive,
    totalStatusItems,
    statusSummaryData,
  } = React.useMemo(() => {
    const itemDetails = audit?.itemDetails ?? [];

    const totalActiveCount = itemDetails.reduce(
      (sum: number, detail: any) => sum + detail.active_quantity,
      0
    );
    const totalBrokenCount = itemDetails.reduce(
      (sum: number, detail: any) => sum + detail.broken_quantity,
      0
    );
    const totalInactiveCount = itemDetails.reduce(
      (sum: number, detail: any) => sum + detail.inactive_quantity,
      0
    );

    const summaryData = [
      {
        name: "Active",
        value: totalActiveCount,
        color: STATUS_SUMMARY_COLORS[0],
      },
      {
        name: "Broken",
        value: totalBrokenCount,
        color: STATUS_SUMMARY_COLORS[1],
      },
      {
        name: "Inactive",
        value: totalInactiveCount,
        color: STATUS_SUMMARY_COLORS[2],
      },
    ];

    const totalItems = summaryData.reduce(
      (sum, status) => sum + status.value,
      0
    );

    return {
      totalActive: totalActiveCount,
      totalBroken: totalBrokenCount,
      totalInactive: totalInactiveCount,
      totalStatusItems: totalItems,
      statusSummaryData: summaryData,
    };
  }, [audit]);

  const statusSummaryChartData = React.useMemo(
    () => ({
      labels: statusSummaryData.map((status) => status.name),
      datasets: [
        {
          data: statusSummaryData.map((status) => status.value),
          backgroundColor: STATUS_SUMMARY_COLORS,
          borderColor: STATUS_SUMMARY_COLORS,
          borderWidth: 2,
          hoverOffset: 12,
          cutout: "68%",
          borderRadius: 18,
        },
      ],
    }),
    [statusSummaryData]
  );

  const statusSummaryChartOptions = React.useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const value = context.parsed;
              const percentage = totalStatusItems
                ? ((value / totalStatusItems) * 100).toFixed(1)
                : "0.0";
              return `${context.label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
      animation: {
        duration: 900,
        easing: "easeOutQuart" as const,
      },
    }),
    [totalStatusItems]
  );

  // Transform data for Item Breakdown using aggregated summary
  const itemBreakdownData = React.useMemo(() => {
    console.log("🔍 Item Summary Response:", itemSummaryResponse);
    console.log("🔍 Current Audit ID:", currentAuditId);
    console.log("🔍 Is Loading:", isItemSummaryLoading);
    console.log("🔍 Error:", itemSummaryError);

    // If summary API fails or returns no data, fallback to aggregating from audit.itemDetails
    if (
      !itemSummaryResponse?.data?.summary ||
      itemSummaryResponse.data.summary.length === 0
    ) {
      console.log("⚠️ No summary data from API, using fallback aggregation");

      if (!audit?.itemDetails || audit.itemDetails.length === 0) {
        console.log("⚠️ No item details available in audit");
        return [];
      }

      // Aggregate item details manually
      const itemMap = new Map<string, any>();

      audit.itemDetails.forEach((detail: any) => {
        const itemName = detail.item?.name || "Unknown";

        if (!itemMap.has(itemName)) {
          itemMap.set(itemName, {
            item: itemName,
            active: 0,
            broken: 0,
            inactive: 0,
            total: 0,
          });
        }

        const item = itemMap.get(itemName);
        item.active += detail.active_quantity || 0;
        item.broken += detail.broken_quantity || 0;
        item.inactive += detail.inactive_quantity || 0;
        item.total +=
          (detail.active_quantity || 0) +
          (detail.broken_quantity || 0) +
          (detail.inactive_quantity || 0);
      });

      const fallbackData = Array.from(itemMap.values()).sort((a, b) =>
        a.item.localeCompare(b.item)
      );

      console.log("✅ Fallback Data:", fallbackData);
      return fallbackData;
    }

    const transformedData = itemSummaryResponse.data.summary.map((item) => ({
      item: item.item_name,
      active: item.active,
      broken: item.damage,
      inactive: item.inactive,
      total: item.total,
    }));

    console.log("✅ Transformed Data from API:", transformedData);
    return transformedData;
  }, [
    itemSummaryResponse,
    currentAuditId,
    isItemSummaryLoading,
    itemSummaryError,
    audit?.itemDetails,
  ]);

  // PDF Download Function
  const downloadItemBreakdownPDF = React.useCallback(() => {
    if (!itemBreakdownData || itemBreakdownData.length === 0) {
      alert("No data available to download");
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Add title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Item Breakdown by Status — Summary Report", 148, 20, {
      align: "center",
    });

    // Add date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Generated on: ${currentDate}`, 148, 28, { align: "center" });

    // Add audit info
    if (audit) {
      const monthName =
        months.find((m) => m.value === audit.month)?.label ?? "Unknown";
      doc.text(
        `Audit Period: ${monthName} ${audit.year} | Status: ${audit.status}`,
        148,
        35,
        { align: "center" }
      );
    }

    // Prepare table data
    const tableData = itemBreakdownData.map((item) => [
      item.item,
      item.active.toString(),
      item.inactive.toString(),
      item.broken.toString(),
      item.total.toString(),
    ]);

    // Add table
    autoTable(doc, {
      startY: 45,
      head: [["Item Name", "Active", "Inactive", "Damage", "Total"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [59, 130, 246], // Blue
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        halign: "center",
      },
      columnStyles: {
        0: { halign: "left", cellWidth: 80 }, // Item Name
        1: { halign: "center", cellWidth: 40 }, // Active
        2: { halign: "center", cellWidth: 40 }, // Inactive
        3: { halign: "center", cellWidth: 40 }, // Damage
        4: { halign: "center", cellWidth: 40 }, // Total
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      didParseCell: (data) => {
        // Highlight rows with damage > 0
        if (data.section === "body" && data.column.index === 3) {
          const damageValue = parseInt(data.cell.text[0]);
          if (damageValue > 0) {
            data.row.cells[3].styles.fillColor = [254, 226, 226]; // Light red
            data.row.cells[3].styles.textColor = [185, 28, 28]; // Dark red
            data.row.cells[3].styles.fontStyle = "bold";
          }
        }
      },
    });

    // Add footer
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Page ${i} of ${pageCount}`,
        148,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      );
    }

    // Save the PDF
    doc.save("item_breakdown_summary.pdf");
  }, [itemBreakdownData, audit]);

  const combinedError = latestError || auditsError || selectedAuditError;
  const isInitialLoading = isLatestLoading || isAuditsLoading;
  const isSwitchingAudit = selectedAuditId
    ? selectedAuditId !== latestAuditResponse?.data?.id &&
      isSelectedAuditFetching &&
      !selectedAuditResponse?.data
    : false;

  // Check if error is specifically "no audits found" (404 from getLatestAudit)
  const extractStatus = (error: unknown): number | undefined => {
    if (typeof error === "object" && error !== null && "status" in error) {
      return (error as { status?: number }).status;
    }
    return undefined;
  };

  const isNoAuditsError = (error: unknown) => extractStatus(error) === 404;

  const isNoAuditsFound =
    isNoAuditsError(latestError) && !auditsError && !selectedAuditError;

  if (combinedError && !isNoAuditsFound) return <Error />;
  if (isInitialLoading || isSwitchingAudit) return <ListPageSkeleton />;

  if (isNoAuditsFound) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No audits found</p>
          <p className="text-sm text-gray-400">
            Create your first audit to get started
          </p>
        </div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No audit data available</p>
        </div>
      </div>
    );
  }

  const selectedAuditOption = auditOptions.find(
    (option) => option.id === selectedAuditId
  );

  const dropdownLabel =
    selectedAuditOption?.label ??
    (latestAuditResponse?.data
      ? (() => {
          const monthName =
            months.find((m) => m.value === latestAuditResponse.data.month)
              ?.label ?? "Unknown";
          return `Audit ${monthName} ${latestAuditResponse.data.year}`;
        })()
      : "Select audit");
  const isAuditSelectorDisabled = auditOptions.length === 0;
  const isAuditSwitcherBusy =
    isAuditsLoading || (selectedAuditId ? isSelectedAuditFetching : false);

  const auditSwitcher = (
    <>
      <DownloadPDF
        audit={audit}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 dark:from-blue-950 dark:to-indigo-950 dark:border-blue-800 dark:text-blue-300 dark:hover:text-blue-200 transition-all duration-200"
      >
        <FileText className="h-4 w-4 mr-2" />
        Download PDF
      </DownloadPDF>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isAuditSelectorDisabled || isInitialLoading}
            className="justify-start"
          >
            {isAuditSwitcherBusy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LayoutDashboard className="h-4 w-4 text-primary" />
            )}
            <span className="text-sm font-medium">{dropdownLabel}</span>
            <ChevronDown className="h-4 w-4 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60">
          <DropdownMenuLabel>Switch audit</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {auditOptions.length > 0 ? (
            auditOptions.map((option) => {
              const isCurrent = selectedAuditId
                ? option.id === selectedAuditId
                : option.id === latestAuditResponse?.data?.id;
              return (
                <DropdownMenuItem
                  key={option.id}
                  onSelect={() =>
                    setSelectedAuditId((current) => {
                      // If currently selected audit is the latest one, deselect it
                      // Otherwise, select the clicked audit
                      return current === latestAuditResponse?.data?.id
                        ? null
                        : option.id;
                    })
                  }
                  className={isCurrent ? "font-semibold" : undefined}
                >
                  <div className="flex w-full items-center justify-between">
                    <span>{option.label}</span>
                    <Badge
                      variant={
                        option.status === "COMPLETED" ? "default" : "secondary"
                      }
                    >
                      {option.status.replace("_", " ")}
                    </Badge>
                  </div>
                </DropdownMenuItem>
              );
            })
          ) : (
            <DropdownMenuItem disabled>No audits available</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <PageHeader
        title="Dashboard"
        description={
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm">
              Latest Audit:{" "}
              {(() => {
                const monthName =
                  months.find((m) => m.value === audit.month)?.label ??
                  "Unknown";
                return `${monthName} ${audit.year}`;
              })()}
            </span>
            <Badge
              variant={audit.status === "COMPLETED" ? "default" : "secondary"}
            >
              {audit.status}
            </Badge>
          </div>
        }
        icon={<LayoutDashboard className="h-8 w-8" />}
        actions={auditSwitcher}
      />

      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={itemVariants}
      >
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Active Items
              </p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                {totalActive}
              </p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-500 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Broken Items
              </p>
              <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                {totalBroken}
              </p>
            </div>
            <XCircle className="h-12 w-12 text-red-500 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Inactive Items
              </p>
              <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">
                {totalInactive}
              </p>
            </div>
            <AlertCircle className="h-12 w-12 text-gray-500 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Total Items
              </p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {totalActive + totalBroken + totalInactive}
              </p>
            </div>
            <Package className="h-12 w-12 text-blue-500 opacity-80" />
          </div>
        </Card>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Room-Item Count Chart */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="p-6 h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Items per Room
            </h3>
            <div className="mt-4 flex-1 min-h-[16rem]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roomItemData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="room"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="itemCount"
                    fill={COLORS.total}
                    name="Item Count"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Status Summary Donut Chart */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="p-6 h-full flex flex-col">
            <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:items-center">
              <div className="lg:w-1/2">
                <figure
                  role="figure"
                  aria-labelledby="item-status-summary-heading"
                  aria-describedby="item-status-summary-description"
                  className="relative mx-auto h-64 w-full max-w-xs"
                >
                  <Doughnut
                    data={statusSummaryChartData}
                    options={statusSummaryChartOptions}
                    role="img"
                    aria-label="Donut chart showing item status distribution"
                  />
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Total Items
                    </span>
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {totalStatusItems}
                    </span>
                  </div>
                  <figcaption
                    id="item-status-summary-description"
                    className="sr-only"
                  >
                    {statusSummaryData
                      .map((status) => `${status.name}: ${status.value}`)
                      .join(", ")}
                  </figcaption>
                </figure>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3
                    id="item-status-summary-heading"
                    className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                  >
                    Item Status Summary
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Track how assets are distributed across status states and
                    their share of the total inventory.
                  </p>
                </div>
                <div className="space-y-3">
                  {statusSummaryData.map((status, index) => {
                    const percentage = totalStatusItems
                      ? ((status.value / totalStatusItems) * 100).toFixed(1)
                      : "0.0";

                    return (
                      <div
                        key={status.name}
                        className="flex items-center justify-between rounded-xl border border-gray-200/70 bg-gray-50/70 p-3 shadow-sm backdrop-blur-sm transition-colors dark:border-gray-800/60 dark:bg-gray-900/50"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{
                              backgroundColor: STATUS_SUMMARY_COLORS[index],
                            }}
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {status.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {status.value}
                          </span>
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                            ({percentage}%)
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Item Breakdown - Table/Graph View */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Item Breakdown by Status
            </h3>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={downloadItemBreakdownPDF}
                className="gap-2 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200 hover:border-green-300 text-green-700 hover:text-green-800 dark:from-green-950 dark:to-emerald-950 dark:border-green-800 dark:text-green-300 dark:hover:text-green-200"
                disabled={!itemBreakdownData || itemBreakdownData.length === 0}
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button
                size="sm"
                variant={viewMode === "table" ? "default" : "outline"}
                onClick={() => setViewMode("table")}
                className="gap-2"
              >
                <TableIcon className="h-4 w-4" />
                Table
              </Button>
              <Button
                size="sm"
                variant={viewMode === "graph" ? "default" : "outline"}
                onClick={() => setViewMode("graph")}
                className="gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Graph
              </Button>
            </div>
          </div>

          {viewMode === "table" ? (
            <div className="rounded-md border">
              {isItemSummaryLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3 text-gray-600 dark:text-gray-400">
                    Loading item breakdown...
                  </span>
                </div>
              ) : itemSummaryError && itemBreakdownData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
                  <p className="text-red-600 dark:text-red-400 font-medium">
                    Error loading item breakdown from API
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {itemSummaryError &&
                    typeof itemSummaryError === "object" &&
                    "status" in itemSummaryError
                      ? `Error ${itemSummaryError.status}: ${
                          "data" in itemSummaryError &&
                          itemSummaryError.data &&
                          typeof itemSummaryError.data === "object" &&
                          "message" in itemSummaryError.data
                            ? String(itemSummaryError.data.message)
                            : "Failed to fetch data"
                        }`
                      : "Failed to fetch data"}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Using fallback data aggregation
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold">Item Name</TableHead>
                      <TableHead className="text-center font-semibold">
                        Active
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        Inactive
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        Broken
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itemBreakdownData.length > 0 ? (
                      itemBreakdownData.map((item, index) => (
                        <TableRow
                          key={index}
                          className={
                            item.broken > 0
                              ? "bg-red-50/50 dark:bg-red-900/10 hover:bg-red-100/50 dark:hover:bg-red-900/20"
                              : ""
                          }
                        >
                          <TableCell className="font-medium">
                            {item.item}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              {item.active}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300">
                              {item.inactive}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium ${
                                item.broken > 0
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 font-semibold"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300"
                              }`}
                            >
                              {item.broken}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              {item.total}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-gray-500 py-8"
                        >
                          No item data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          ) : isItemSummaryLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Loading chart data...
              </span>
            </div>
          ) : itemSummaryError && itemBreakdownData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px]">
              <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
              <p className="text-red-600 dark:text-red-400 font-medium">
                Error loading chart data from API
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Using fallback data aggregation
              </p>
            </div>
          ) : itemBreakdownData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px]">
              <Package className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No data available for chart</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={itemBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="item"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  style={{ fontSize: "11px" }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="natural"
                  dataKey="active"
                  stroke={COLORS.active}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Active Trend"
                />
                <Line
                  type="natural"
                  dataKey="broken"
                  stroke={COLORS.broken}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Broken Trend"
                />
                <Line
                  type="natural"
                  dataKey="inactive"
                  stroke={COLORS.inactive}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Inactive Trend"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>
          </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
