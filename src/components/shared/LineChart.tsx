"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import "@/lib/chartSetup";

interface LineChartProps {
  title: string;
  labels: string[];
  data: number[];
  colors?: {
    background: string;
    border: string;
  };
  height?: string | number;
  emptyMessage?: string;
}

function LineChart({
  title,
  labels,
  data,
  colors = {
    background: "rgba(59, 130, 246, 0.1)",
    border: "#3B82F6",
  },
  height = "45vh",
  emptyMessage = "No data available.",
}: LineChartProps) {
  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Trend",
          data,
          fill: true,
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: 3,
          pointBackgroundColor: colors.border,
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          tension: 0.4,
        },
      ],
    }),
    [labels, data, colors]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: "index" as const,
          intersect: false,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#ffffff",
          bodyColor: "#ffffff",
          borderColor: colors.border,
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#6B7280" },
        },
        y: {
          beginAtZero: true,
          grid: { color: "#E5E7EB", drawBorder: false },
          ticks: { color: "#6B7280" },
        },
      },
      interaction: {
        intersect: false,
        mode: "nearest" as const,
      },
    }),
    [colors]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex-1 overflow-hidden"
    >
      <Card className="shadow-lg rounded-2xl" style={{ height }}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          {labels.length > 0 ? (
            <div className="w-full h-full">
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <p className="text-center py-20 text-gray-400">{emptyMessage}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default memo(LineChart);
