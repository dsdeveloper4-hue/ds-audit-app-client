"use client";

import React from "react";
import { motion } from "framer-motion";
import { useGetLatestAuditQuery } from "@/redux/features/audit/auditApi";
import { PageHeader } from "@/components/shared/PageHeader";
import { ListPageSkeleton } from "@/components/shared/Skeletons";
import Error from "@/components/shared/Error";
import { Card } from "@/components/ui/card";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const COLORS = {
  active: "#10b981",
  broken: "#ef4444",
  inactive: "#6b7280",
  total: "#3b82f6",
};

const STATUS_SUMMARY_COLORS = ["#14b8a6", "#f97316", "#94a3b8"];

const DashboardPage = () => {
  const { data, isLoading, error } = useGetLatestAuditQuery();
  const audit = data?.data;

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
      { name: "Active", value: totalActiveCount, color: STATUS_SUMMARY_COLORS[0] },
      { name: "Broken", value: totalBrokenCount, color: STATUS_SUMMARY_COLORS[1] },
      {
        name: "Inactive",
        value: totalInactiveCount,
        color: STATUS_SUMMARY_COLORS[2],
      },
    ];

    const totalItems = summaryData.reduce((sum, status) => sum + status.value, 0);

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

  if (isLoading) return <ListPageSkeleton />;
  if (error) return <Error />;

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

  // Transform data for Room-Item Count Chart (Bar Chart)

  // Transform data for Item Breakdown (Area Chart)
  const itemBreakdownData =
    audit.itemDetails?.map((detail: any) => ({
      item: detail.item?.name || "Unknown",
      active: detail.active_quantity,
      broken: detail.broken_quantity,
      inactive: detail.inactive_quantity,
      total:
        detail.active_quantity +
        detail.broken_quantity +
        detail.inactive_quantity,
    })) || [];

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
              Latest Audit: {audit.month}/{audit.year}
            </span>
            <Badge
              variant={audit.status === "COMPLETED" ? "default" : "secondary"}
            >
              {audit.status}
            </Badge>
          </div>
        }
        icon={<LayoutDashboard className="h-8 w-8" />}
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
                  <Bar dataKey="itemCount" fill={COLORS.total} name="Item Count" />
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
                  <figcaption id="item-status-summary-description" className="sr-only">
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
                    Track how assets are distributed across status states and their share of the
                    total inventory.
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
                            style={{ backgroundColor: STATUS_SUMMARY_COLORS[index] }}
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

      {/* Item Breakdown Area Chart - Full Width */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Item Breakdown by Status
          </h3>
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
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;