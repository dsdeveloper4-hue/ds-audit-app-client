"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "@/lib/chartSetup";

interface AreaChartProps {
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
  height?: string | number;
  emptyMessage?: string;
}

function AreaChart({
  title,
  labels,
  datasets,
  height = "45vh",
  emptyMessage = "No data available.",
}: AreaChartProps) {
  // const chartData = useMemo(
  //   () => ({
  //     labels,
  //     datasets,
  //   }),
  //   [labels, datasets]
  // );

  // const chartOptions = useMemo(
  //   () => ({
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     plugins: {
  //       legend: {
  //         position: "top" as const,
  //         labels: {
  //           padding: 20,
  //           usePointStyle: true,
  //           font: {
  //             size: 12,
  //           },
  //         },
  //       },
  //       tooltip: {
  //         mode: "index" as const,
  //         intersect: false,
  //         backgroundColor: "rgba(0, 0, 0, 0.8)",
  //         titleColor: "#ffffff",
  //         bodyColor: "#ffffff",
  //       },
  //     },
  //     scales: {
  //       x: {
  //         grid: { display: false },
  //         ticks: { color: "#6B7280" },
  //       },
  //       y: {
  //         beginAtZero: true,
  //         grid: { color: "#E5E7EB", drawBorder: false },
  //         ticks: { color: "#6B7280" },
  //       },
  //     },
  //     interaction: {
  //       intersect: false,
  //       mode: "nearest" as const,
  //     },
  //     elements: {
  //       point: {
  //         radius: 4,
  //         hoverRadius: 6,
  //       },
  //       line: {
  //         tension: 0.4,
  //       },
  //     },
  //   }),
  //   []
  // );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex-1 overflow-hidden"
    >
      <Card className="shadow-lg rounded-2xl" style={{ height }}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          {labels.length > 0 ? (
            <div className="w-full h-full">
              {/* We'll use Line chart with fill for area effect */}
              <div className="w-full h-full">
                {/* Custom area chart implementation would go here */}
                {/* For now, using a placeholder */}
                <div className="flex items-center justify-center h-full text-gray-400">
                  Area Chart Component (Line with Fill)
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center py-20 text-gray-400">{emptyMessage}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default memo(AreaChart);
