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
import { Package, XCircle } from "lucide-react";

const BrokenItemsPage = () => {
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
  const { totalBroken, totalBrokenValue } = React.useMemo(() => {
    const itemDetails = audit?.itemDetails ?? [];

    let totalBrokenCount = 0;
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

      totalBrokenCount += brokenQty;

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

    let totalBrokenVal = 0;

    itemGroups.forEach((group) => {
      const totalQty = group.activeQty + group.brokenQty + group.inactiveQty;

      if (totalQty > 0) {
        const pricePerUnit = group.totalPrice / totalQty;
        totalBrokenVal += group.brokenQty * pricePerUnit;
      }
    });

    return {
      totalBroken: totalBrokenCount,
      totalBrokenValue: totalBrokenVal,
    };
  }, [audit]);

  // Broken items data
  const brokenItemsData = React.useMemo(() => {
    return itemBreakdownData
      .filter((item) => item.broken > 0)
      .map((item) => {
        const totalQty = item.active + item.broken + item.inactive;
        const pricePerUnit = totalQty > 0 ? item.total_price / totalQty : 0;
        return {
          ...item,
          quantity: item.broken,
          value: pricePerUnit * item.broken,
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
        title="Broken Items"
        description="Items that need repair or replacement"
        icon={<XCircle className="h-8 w-8 text-red-600" />}
      />

      {/* Summary Card */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Total Broken Items
              </p>
              <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                {totalBroken}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Total Value: ৳
                {totalBrokenValue.toLocaleString("en-BD", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <XCircle className="h-16 w-16 text-red-500 opacity-80" />
          </div>
        </Card>
      </motion.div>

      {/* Broken Items Table */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                Broken Items List
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {brokenItemsData.length} items need repair or replacement
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
                {brokenItemsData.length > 0 ? (
                  brokenItemsData.map((item, index) => (
                    <TableRow
                      key={index}
                      className="bg-red-50/50 dark:bg-red-900/10"
                    >
                      <TableCell className="font-medium">{item.item}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-700 border-red-200"
                        >
                          {item.quantity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-red-600 dark:text-red-400">
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
                      No broken items found
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

export default BrokenItemsPage;
