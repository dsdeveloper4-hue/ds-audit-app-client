"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";

// ✅ Ensure registration runs before <Bar />
import "@/lib/chartSetup";

interface ReusableBarChartProps {
  title: string;
  labels: string[];
  data: number[];
  viewMode?: "qty" | "amount" | string;
  colors?: {
    background: string;
    border: string;
  };
  height?: string | number; // can pass "45vh", "300px", 400, etc.
  emptyMessage?: string;
}

function ReusableBarChart({
  title,
  labels,
  data,
  viewMode = "qty",
  colors,
  height = "45vh",
  emptyMessage = "No data available.",
}: ReusableBarChartProps) {
  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label:
            viewMode === "qty"
              ? "Quantity"
              : viewMode === "amount"
              ? "Amount (৳)"
              : viewMode,
          data,
          backgroundColor:
            colors?.background ||
            (viewMode === "qty"
              ? "rgba(29, 78, 216, 0.9)" // Blue
              : "rgba(5, 150, 105, 0.9)"), // Green
          borderColor:
            colors?.border ||
            (viewMode === "qty" ? "rgb(29, 78, 216)" : "rgb(5, 150, 105)"),
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    }),
    [labels, data, viewMode, colors]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, title: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true },
      },
    }),
    []
  );

  return (
    <motion.div
      key={`${title}-${viewMode}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 overflow-hidden"
    >
      {/* ✅ Apply dynamic height via inline style */}
      <Card className="shadow-lg rounded-2xl" style={{ height }}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          {labels.length > 0 ? (
            <div className="w-full h-full">
              <Bar data={chartData} options={chartOptions} />
            </div>
          ) : (
            <p className="text-center py-20 text-gray-400">{emptyMessage}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default memo(ReusableBarChart);
