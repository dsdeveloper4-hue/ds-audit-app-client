"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doughnut } from "react-chartjs-2";
import "@/lib/chartSetup";

interface DoughnutChartProps {
  title: string;
  labels: string[];
  data: number[];
  colors?: string[];
  height?: string | number;
  emptyMessage?: string;
  showCenterText?: boolean;
  centerText?: string;
}

function DoughnutChart({
  title,
  labels,
  data,
  colors = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
    "#84CC16", // Lime
    "#F97316", // Orange
  ],
  height = "45vh",
  emptyMessage = "No data available.",
  showCenterText = false,
  centerText,
}: DoughnutChartProps) {
  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.slice(0, labels.length).map(color => color + "CC"),
          borderWidth: 2,
          hoverOffset: 8,
          cutout: showCenterText ? "60%" : "0%",
        },
      ],
    }),
    [labels, data, colors, showCenterText]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom" as const,
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = ((context.parsed * 100) / total).toFixed(1);
              return `${context.label}: ${context.parsed} (${percentage}%)`;
            },
          },
        },
      },
    }),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex-1 overflow-hidden"
    >
      <Card className="shadow-lg rounded-2xl relative" style={{ height }}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-full flex items-center justify-center">
          {labels.length > 0 ? (
            <div className="w-full h-full relative">
              <Doughnut data={chartData} options={chartOptions} />
              {showCenterText && centerText && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {centerText}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center py-20 text-gray-400">{emptyMessage}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default memo(DoughnutChart);
