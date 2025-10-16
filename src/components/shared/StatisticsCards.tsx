"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface StatisticCard {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: "green" | "red" | "blue" | "gray" | "yellow" | "purple";
  description?: string;
}

interface StatisticsCardsProps {
  cards: StatisticCard[];
  className?: string;
}

const colorClasses = {
  green: {
    text: "text-green-600",
    bg: "bg-green-100",
    iconText: "text-green-600",
  },
  red: {
    text: "text-red-600",
    bg: "bg-red-100",
    iconText: "text-red-600",
  },
  blue: {
    text: "text-blue-600",
    bg: "bg-blue-100",
    iconText: "text-blue-600",
  },
  gray: {
    text: "text-gray-600",
    bg: "bg-gray-100",
    iconText: "text-gray-600",
  },
  yellow: {
    text: "text-yellow-600",
    bg: "bg-yellow-100",
    iconText: "text-yellow-600",
  },
  purple: {
    text: "text-purple-600",
    bg: "bg-purple-100",
    iconText: "text-purple-600",
  },
};

export function StatisticsCards({ cards, className }: StatisticsCardsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className || ""}`}
    >
      {cards.map((card, index) => {
        const colors = colorClasses[card.color];
        return (
          <motion.div key={index} variants={itemVariants}>
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className={`text-2xl font-bold ${colors.text}`}>
                    {card.value}
                  </p>
                  {card.description && (
                    <p className="text-xs text-gray-400 mt-1">
                      {card.description}
                    </p>
                  )}
                </div>
                <div className={`h-8 w-8 ${colors.bg} rounded-full flex items-center justify-center`}>
                  <div className={colors.iconText}>
                    {card.icon}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
