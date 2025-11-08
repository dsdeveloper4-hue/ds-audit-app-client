"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  useGetLatestAuditQuery,
  useGetItemSummaryByAuditIdQuery,
} from "@/redux/features/audit/auditApi";
import { PageHeader } from "@/components/shared/PageHeader";
import { ListPageSkeleton } from "@/components/shared/Skeletons";
import Error from "@/components/shared/Error";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, CheckCircle } from "lucide-react";

const ActiveItemsPage = () => {
  const {
    data: latestAuditResponse,
    isLoading: isLatestLoading,
    error: latestError,
  } = useGetLatestAuditQuery();

  const audit = latestAuditResponse?.data ?? null;
  const currentAuditId = audit?.id ?? "";

  const {
    data: itemSummaryResponse,
    isLoading: isItemSummaryLoading,
    error: itemSummaryError,
  } = useGetItemSummaryByAuditIdQuery(currentAuditId, {
    skip: !currentAuditId,
  });

  // Transform data for Item Breakdown
  const itemBreakdownData = React.useMemo(() => {
    if (
      !itemSummaryResponse?.data?.summary ||
      itemSummaryResponse.data.summary.length === 0
    ) {
      if (!audit?.itemDetails || audit.itemDetails.length === 0) {
        return [];
      }

      const itemMap = new Map<string, any>();

      audit.itemDetails.forEach((detail: any) => {
        const itemName = detail.item?.name || "Unknown";
        const totalPrice = Number(detail.total_price) || 0;

        if (!itemMap.has(itemName)) {
          itemMap.set(itemName, {
            item: itemName,
            active: 0,
            broken: 0,
            inactive: 0,
            total: 0,
            total_price: 0,
          });
        }

        const item = itemMap.get(itemName);
        item.active += detail.active_quantity || 0;
        item.broken += detail.broken_quantity || 0;
        item.inactive += detail.inactive_quantity || 0;
        const qty =
          (detail.active_quantity || 0) +
          (detail.broken_quantity || 0) +
          (detail.inactive_quantity || 0);
        item.total += qty;
        item.total_price += totalPrice;
      });

      return Array.from(itemMap.values()).sort((a, b) =>
        a.item.localeCompare(b.item)
      );
    }

    return itemSummaryResponse.data.summary.map((item) => ({
      item: item.item_name,
      active: item.active,
      broken: item.damage,
      inactive: item.inactive,
      total: item.total,
      total_price: Number(item.total_price) || 0,
    }));
  }, [itemSummaryResponse, audit?.itemDetails]);

  // Calculate totals
  const { totalActive, totalActiveValue } = React.useMemo(() => {
    const itemDetails = audit?.itemDetails ?? [];

    let totalActiveCount = 0;
    const itemGroups = new Map<
      string,
      {
        totalPrice: number;
        activeQty: number;
        brokenQty: number;
        inactiveQty: number;
      }
    >();

    itemDetails.forEach((detail: any) => {
      const itemName = detail.item?.name || "Unknown";
      const activeQty = detail.active_quantity || 0;
      const brokenQty = detail.broken_quantity || 0;
      const inactiveQty = detail.inactive_quantity || 0;
      const totalPrice = Number(detail.total_price) || 0;

      totalActiveCount += activeQty;

      if (itemGroups.has(itemName)) {
        const existing = itemGroups.get(itemName)!;
        itemGroups.set(itemName, {
          totalPrice: existing.totalPrice + totalPrice,
          activeQty: existing.activeQty + activeQty,
          brokenQty: existing.brokenQty + brokenQty,
          inactiveQty: existing.inactiveQty + inactiveQty,
        });
      } else {
        itemGroups.set(itemName, {
          totalPrice,
          activeQty,
          brokenQty,
          inactiveQty,
        });
      }
    });

    let totalActiveVal = 0;

    itemGroups.forEach((group) => {
      const totalQty = group.activeQty + group.brokenQty + group.inactiveQty;

      if (totalQty > 0) {
        const pricePerUnit = group.totalPrice / totalQty;
        totalActiveVal += group.activeQty * pricePerUnit;
      }
    });

    return {
      totalActive: totalActiveCount,
      totalActiveValue: totalActiveVal,
    };
  }, [audit]);

  // Active items data
  const activeItemsData = React.useMemo(() => {
    return itemBreakdownData
      .filter((item) => item.active > 0)
      .map((item) => {
        const totalQty = item.active + item.broken + item.inactive;
        const pricePerUnit = totalQty > 0 ? item.total_price / totalQty : 0;
        return {
          ...item,
          quantity: item.active,
          value: pricePerUnit * item.active,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [itemBreakdownData]);

  if (isLatestLoading || isItemSummaryLoading) return <ListPageSkeleton />;
  if (latestError || itemSummaryError) return <Error />;

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
        title="Active Items"
        description="Items currently in use"
        icon={<CheckCircle className="h-8 w-8 text-green-600" />}
      />

      {/* Summary Card */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Total Active Items
              </p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                {totalActive}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Total Value: ৳
                {totalActiveValue.toLocaleString("en-BD", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <CheckCircle className="h-16 w-16 text-green-500 opacity-80" />
          </div>
        </Card>
      </motion.div>

      {/* Active Items Table */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Active Items List
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {activeItemsData.length} items currently in use
              </p>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Item Name</TableHead>
                  <TableHead className="text-center font-semibold">
                    Quantity
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Total Value
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeItemsData.length > 0 ? (
                  activeItemsData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.item}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          {item.quantity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                        ৳
                        {item.value.toLocaleString("en-BD", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-gray-500 py-8"
                    >
                      No active items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ActiveItemsPage;
