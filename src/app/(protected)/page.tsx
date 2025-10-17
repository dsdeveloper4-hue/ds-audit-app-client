"use client";

import { useGetAllAuditsQuery } from "@/redux/features/audit/auditApi";
import { useGetAllRoomsQuery } from "@/redux/features/room/roomApi";
import { useGetAllItemsQuery } from "@/redux/features/item/itemApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { Activity as ActivityType } from "@/types";
import { Card } from "@/components/ui/card";
import { ClipboardCheck, DoorOpen, Package, Users, TrendingUp, BarChart3, Layers } from "lucide-react";
import { DashboardSkeleton } from "@/components/shared/Skeletons";
import { motion } from "framer-motion";
import ReusableBarChart from "@/components/shared/ReusableBarChart";
import PieChart from "@/components/shared/PieChart";
import LineChart from "@/components/shared/LineChart";
import DoughnutChart from "@/components/shared/DoughnutChart";

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
  const canceledAudits = audits.filter((a: any) => a.status === "CANCELED").length;

  // Calculate total audit records from all audits
  const totalAuditRecords = audits.reduce((sum: number, audit: any) => {
    return sum + (audit.itemDetails?.length || 0);
  }, 0);

  // Calculate total quantities across all audits
  const totalQuantities = audits.reduce((sum: number, audit: any) => {
    return sum + (audit.itemDetails?.reduce((itemSum: number, item: any) => {
      return itemSum + (item.active_quantity || 0) + (item.broken_quantity || 0) + (item.inactive_quantity || 0);
    }, 0) || 0);
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

  // Prepare chart data
  const auditStatusData = {
    labels: ["In Progress", "Completed", "Canceled"],
    data: [inProgressAudits, completedAudits, canceledAudits],
  };

  // Monthly audit trends (last 12 months)
  const currentDate = new Date();
  const monthlyData = [];
  const monthlyLabels = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    monthlyLabels.push(monthName);

    const auditsInMonth = audits.filter((audit: any) => {
      return audit.month === date.getMonth() + 1 && audit.year === date.getFullYear();
    }).length;

    monthlyData.push(auditsInMonth);
  }

  // Room distribution data
  const roomDistribution = rooms.map((room: any) => {
    const itemsInRoom = audits.reduce((sum: number, audit: any) => {
      return sum + (audit.itemDetails?.filter((item: any) => item.room_id === room.id).length || 0);
    }, 0);
    return {
      room: room.name,
      items: itemsInRoom,
    };
  }).filter(room => room.items > 0).slice(0, 10); // Top 10 rooms

  const roomLabels = roomDistribution.map(room => room.room);
  const roomData = roomDistribution.map(room => room.items);

  // User participation data
  const userParticipation = users.map((user: any) => {
    const participations = audits.filter((audit: any) =>
      audit.participants?.some((p: any) => p.id === user.id)
    ).length;
    return {
      user: user.name,
      audits: participations,
    };
  }).filter(user => user.audits > 0).slice(0, 8); // Top 8 users

  const userLabels = userParticipation.map(user => user.user);
  const userData = userParticipation.map(user => user.audits);

  // Quantity breakdown
  const quantityBreakdown = audits.reduce(
    (acc: any, audit: any) => {
      audit.itemDetails?.forEach((item: any) => {
        acc.active += item.active_quantity || 0;
        acc.broken += item.broken_quantity || 0;
        acc.inactive += item.inactive_quantity || 0;
      });
      return acc;
    },
    { active: 0, broken: 0, inactive: 0 }
  );

  const quantityLabels = ["Active", "Broken", "Inactive"];
  const quantityData = [quantityBreakdown.active, quantityBreakdown.broken, quantityBreakdown.inactive];

  // Recent Activity Data
  const recentActivities: ActivityType[] = [];

  // Add audit creation activities
  audits.slice(0, 10).forEach((audit: any) => {
    if (audit.created_at) {
      const createdDate = new Date(audit.created_at);
      recentActivities.push({
        id: `audit-created-${audit.id}`,
        type: "audit_created",
        title: "Audit Created",
        description: `Audit for ${audit.month}/${audit.year} was created`,
        user: audit.participants?.[0]?.name || "System",
        timestamp: createdDate,
        icon: ClipboardCheck,
        color: "text-blue-600",
        bg: "bg-blue-50 dark:bg-blue-950",
      });
    }

    // Add audit completion activities
    if (audit.status === "COMPLETED" && audit.updated_at) {
      const completedDate = new Date(audit.updated_at);
      recentActivities.push({
        id: `audit-completed-${audit.id}`,
        type: "audit_completed",
        title: "Audit Completed",
        description: `Audit for ${audit.month}/${audit.year} was completed`,
        user: audit.participants?.[0]?.name || "System",
        timestamp: completedDate,
        icon: ClipboardCheck,
        color: "text-green-600",
        bg: "bg-green-50 dark:bg-green-950",
      });
    }

    // Add participant activities
    audit.participants?.forEach((participant: any) => {
      recentActivities.push({
        id: `user-participated-${audit.id}-${participant.id}`,
        type: "user_participated",
        title: "User Participated",
        description: `${participant.name} participated in audit for ${audit.month}/${audit.year}`,
        user: participant.name,
        timestamp: audit.created_at ? new Date(audit.created_at) : new Date(),
        icon: Users,
        color: "text-purple-600",
        bg: "bg-purple-50 dark:bg-purple-950",
      });
    });

    // Add item audit activities
    audit.itemDetails?.slice(0, 3).forEach((item: any) => {
      recentActivities.push({
        id: `item-audited-${audit.id}-${item.id}`,
        type: "item_audited",
        title: "Item Audited",
        description: `${item.name || 'Item'} was audited with ${item.active_quantity || 0} active, ${item.broken_quantity || 0} broken, ${item.inactive_quantity || 0} inactive`,
        user: audit.participants?.[0]?.name || "System",
        timestamp: audit.created_at ? new Date(audit.created_at) : new Date(),
        icon: Package,
        color: "text-orange-600",
        bg: "bg-orange-50 dark:bg-orange-950",
      });
    });
  });

  const sortedActivities = recentActivities
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 15);

  // Helper function to format time ago
  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return timestamp.toLocaleDateString();
  };

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
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
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
              <Card className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {stat.title}
                    </p>
                    <motion.p
                      className="text-3xl font-bold mt-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
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
                    className={`p-3 rounded-xl ${stat.bg} shadow-lg`}
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Audit Status Distribution */}
        <motion.div variants={itemVariants}>
          <DoughnutChart
            title="Audit Status Distribution"
            labels={auditStatusData.labels}
            data={auditStatusData.data}
            height="400px"
          />
        </motion.div>

        {/* Monthly Audit Trends */}
        <motion.div variants={itemVariants}>
          <LineChart
            title="Monthly Audit Trends"
            labels={monthlyLabels}
            data={monthlyData}
            height="400px"
          />
        </motion.div>

        {/* Room Distribution */}
        <motion.div variants={itemVariants}>
          <ReusableBarChart
            title="Top Rooms by Item Count"
            labels={roomLabels}
            data={roomData}
            height="400px"
          />
        </motion.div>

        {/* User Participation */}
        <motion.div variants={itemVariants}>
          <ReusableBarChart
            title="User Participation in Audits"
            labels={userLabels}
            data={userData}
            height="400px"
          />
        </motion.div>

        {/* Quantity Status Breakdown */}
        <motion.div variants={itemVariants}>
          <PieChart
            title="Quantity Status Breakdown"
            labels={quantityLabels}
            data={quantityData}
            height="400px"
          />
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 dark:from-blue-950 dark:via-purple-950 dark:to-green-950 border-0">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                System Overview
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalAuditRecords}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Audit Records</p>
              </motion.div>
              <motion.div
                className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Layers className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalQuantities}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Items Tracked</p>
              </motion.div>
              <motion.div
                className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(totalQuantities / Math.max(totalAuditRecords, 1))}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Items per Audit</p>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-0">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Start New Audit", desc: "Begin inventory audit", color: "bg-blue-500" },
              { title: "View Reports", desc: "Generate reports", color: "bg-green-500" },
              { title: "Manage Items", desc: "Add/Edit items", color: "bg-purple-500" },
              { title: "User Management", desc: "Manage users", color: "bg-orange-500" },
            ].map((action, index) => (
              <motion.div
                key={action.title}
                className={`${action.color} text-white p-4 rounded-xl cursor-pointer hover:opacity-90 transition-opacity`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <h3 className="font-semibold">{action.title}</h3>
                <p className="text-sm opacity-90">{action.desc}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
