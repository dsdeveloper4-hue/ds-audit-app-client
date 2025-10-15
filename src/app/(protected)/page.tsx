"use client";

import { useGetAllAuditsQuery } from "@/redux/features/audit/auditApi";
import { useGetAllRoomsQuery } from "@/redux/features/room/roomApi";
import { useGetAllItemsQuery } from "@/redux/features/item/itemApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { Card } from "@/components/ui/card";
import { ClipboardCheck, DoorOpen, Package, Users, TrendingUp } from "lucide-react";
import { DashboardSkeleton } from "@/components/shared/Skeletons";
import { motion } from "framer-motion";

export default function Home() {
  const { data: auditsData, isLoading: auditsLoading } = useGetAllAuditsQuery();
  const { data: roomsData, isLoading: roomsLoading } = useGetAllRoomsQuery();
  const { data: itemsData, isLoading: itemsLoading } = useGetAllItemsQuery();
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();

  const isLoading = auditsLoading || roomsLoading || itemsLoading || usersLoading;

  if (isLoading) return <DashboardSkeleton />;

  const audits = auditsData?.data || [];
  const rooms = roomsData?.data || [];
  const items = itemsData?.data || [];
  const users = usersData?.data || [];

  const inProgressAudits = audits.filter((a: any) => a.status === "IN_PROGRESS").length;
  const completedAudits = audits.filter((a: any) => a.status === "COMPLETED").length;

  // Calculate total audit records from all audits
  const totalAuditRecords = audits.reduce((sum: number, audit: any) => {
    return sum + (audit.itemDetails?.length || 0);
  }, 0);

  const stats = [
    {
      title: "Total Audits",
      value: audits.length,
      icon: ClipboardCheck,
      description: `${inProgressAudits} in progress, ${completedAudits} completed`,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Rooms",
      value: rooms.length,
      icon: DoorOpen,
      description: "Registered locations",
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Items",
      value: items.length,
      icon: Package,
      description: "Unique items tracked",
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Users",
      value: users.length,
      icon: Users,
      description: "Active system users",
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome to Digital Seba Audit Management System
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <motion.p
                      className="text-3xl font-bold mt-2 text-gray-900 dark:text-white"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <motion.div
                    className={`p-3 rounded-lg ${stat.bg}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Quick Overview
            </h2>
          </div>
          <div className="space-y-3">
            <motion.div
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
              whileHover={{ scale: 1.02, x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  In-Progress Audits
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Currently being conducted
                </p>
              </div>
              <motion.span
                className="text-2xl font-bold text-blue-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              >
                {inProgressAudits}
              </motion.span>
            </motion.div>
            <motion.div
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
              whileHover={{ scale: 1.02, x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Total Audit Records
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Item details across all audits
                </p>
              </div>
              <motion.span
                className="text-2xl font-bold text-green-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
              >
                {totalAuditRecords}
              </motion.span>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
