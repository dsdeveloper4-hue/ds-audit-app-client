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
import { Package, AlertCircle } from "lucide-react";

const InactiveItemsPage = () => {
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
  const { totalInactive, totalInactiveValue } = React.useMemo(() => {
    const itemDetails = audit?.itemDetails ?? [];

    let totalInactiveCount = 0;
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

      totalInactiveCount += inactiveQty;

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

    let totalInactiveVal = 0;

    itemGroups.forEach((group) => {
      const totalQty = group.activeQty + group.brokenQty + group.inactiveQty;

      if (totalQty > 0) {
        const pricePerUnit = group.totalPrice / totalQty;
        totalInactiveVal += group.inactiveQty * pricePerUnit;
      }
    });

    return {
      totalInactive: totalInactiveCount,
      totalInactiveValue: totalInactiveVal,
    };
  }, [audit]);

  // Inactive items data
  const inactiveItemsData = React.useMemo(() => {
    return itemBreakdownData
      .filter((item) => item.inactive > 0)
      .map((item) => {
        const totalQty = item.active + item.broken + item.inactive;
        const pricePerUnit = totalQty > 0 ? item.total_price / totalQty : 0;
        return {
          ...item,
          quantity: item.inactive,
          value: pricePerUnit * item.inactive,
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
        title="Inactive Items"
        description="Items not currently in use"
        icon={<AlertCircle className="h-8 w-8 text-gray-600" />}
      />

      {/* Summary Card */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Inactive Items
              </p>
              <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">
                {totalInactive}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Total Value: ৳
                {totalInactiveValue.toLocaleString("en-BD", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <AlertCircle className="h-16 w-16 text-gray-500 opacity-80" />
          </div>
        </Card>
      </motion.div>

      {/* Inactive Items Table */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-gray-600" />
                Inactive Items List
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {inactiveItemsData.length} items not currently in use
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
                {inactiveItemsData.length > 0 ? (
                  inactiveItemsData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.item}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className="bg-gray-50 text-gray-700 border-gray-200"
                        >
                          {item.quantity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-gray-600 dark:text-gray-400">
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
                      No inactive items found
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

export default InactiveItemsPage;
