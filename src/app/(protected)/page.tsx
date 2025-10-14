"use client";

import { useGetAllAuditsQuery } from "@/redux/features/audit/auditApi";
import { useGetAllRoomsQuery } from "@/redux/features/room/roomApi";
import { useGetAllItemsQuery } from "@/redux/features/item/itemApi";
import { useGetAllInventoriesQuery } from "@/redux/features/inventory/inventoryApi";
import { Card } from "@/components/ui/card";
import { ClipboardCheck, DoorOpen, Package, Warehouse, TrendingUp } from "lucide-react";
import Loading from "@/components/shared/Loading";

export default function Home() {
  const { data: auditsData, isLoading: auditsLoading } = useGetAllAuditsQuery();
  const { data: roomsData, isLoading: roomsLoading } = useGetAllRoomsQuery();
  const { data: itemsData, isLoading: itemsLoading } = useGetAllItemsQuery();
  const { data: inventoriesData, isLoading: inventoriesLoading } = useGetAllInventoriesQuery();

  const isLoading = auditsLoading || roomsLoading || itemsLoading || inventoriesLoading;

  if (isLoading) return <Loading />;

  const audits = auditsData?.data || [];
  const rooms = roomsData?.data || [];
  const items = itemsData?.data || [];
  const inventories = inventoriesData?.data || [];

  const inProgressAudits = audits.filter((a: any) => a.status === "in_progress").length;
  const completedAudits = audits.filter((a: any) => a.status === "completed").length;

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
      title: "Inventory Records",
      value: inventories.length,
      icon: Warehouse,
      description: "Room-item combinations",
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome to Digital Seba Audit Management System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Quick Overview
          </h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                In-Progress Audits
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Currently being conducted
              </p>
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {inProgressAudits}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Total Inventory Items
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Across all rooms
              </p>
            </div>
            <span className="text-2xl font-bold text-green-600">
              {inventories.reduce((sum: number, inv: any) => sum + inv.current_quantity, 0)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
