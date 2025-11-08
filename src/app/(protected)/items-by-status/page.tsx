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
import { Package, AlertCircle, CheckCircle, XCircle } from "lucide-react";

const ItemsByStatusPage = () => {
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
  const {
    totalActive,
    totalBroken,
    totalInactive,
    totalActiveValue,
    totalBrokenValue,
    totalInactiveValue,
  } = React.useMemo(() => {
    const itemDetails = audit?.itemDetails ?? [];

    let totalActiveCount = 0;
    let totalBrokenCount = 0;
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

      totalActiveCount += activeQty;
      totalBrokenCount += brokenQty;
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

    let totalActiveVal = 0;
    let totalBrokenVal = 0;
    let totalInactiveVal = 0;

    itemGroups.forEach((group) => {
      const totalQty = group.activeQty + group.brokenQty + group.inactiveQty;

      if (totalQty > 0) {
        const pricePerUnit = group.totalPrice / totalQty;

        totalActiveVal += group.activeQty * pricePerUnit;
        totalBrokenVal += group.brokenQty * pricePerUnit;
        totalInactiveVal += group.inactiveQty * pricePerUnit;
      }
    });

    return {
      totalActive: totalActiveCount,
      totalBroken: totalBrokenCount,
      totalInactive: totalInactiveCount,
      totalActiveValue: totalActiveVal,
      totalBrokenValue: totalBrokenVal,
      totalInactiveValue: totalInactiveVal,
    };
  }, [audit]);

  // Status-specific item lists
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
        title="Items by Status"
        description="View all items categorized by their current status"
        icon={<Package className="h-8 w-8" />}
      />

      {/* Summary Cards - Clickable */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={itemVariants}
      >
        <Card
          className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
          onClick={() =>
            document
              .getElementById("active-items-section")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Active Items
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
            <CheckCircle className="h-12 w-12 text-green-500 opacity-80" />
          </div>
        </Card>

        <Card
          className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
          onClick={() =>
            document
              .getElementById("broken-items-section")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Broken Items
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
            <XCircle className="h-12 w-12 text-red-500 opacity-80" />
          </div>
        </Card>

        <Card
          className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-800 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
          onClick={() =>
            document
              .getElementById("inactive-items-section")
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Inactive Items
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
            <AlertCircle className="h-12 w-12 text-gray-500 opacity-80" />
          </div>
        </Card>
      </motion.div>

      {/* Active Items Section */}
      <motion.div
        variants={itemVariants}
        id="active-items-section"
        className="scroll-mt-6"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Active Items
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Items currently in use - {activeItemsData.length} items
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              Total: {totalActive} items | ৳
              {totalActiveValue.toLocaleString("en-BD", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Badge>
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

      {/* Broken Items Section */}
      <motion.div
        variants={itemVariants}
        id="broken-items-section"
        className="scroll-mt-6"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                Broken Items
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Items that need repair or replacement - {brokenItemsData.length}{" "}
                items
              </p>
            </div>
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
              Total: {totalBroken} items | ৳
              {totalBrokenValue.toLocaleString("en-BD", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Badge>
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

      {/* Inactive Items Section */}
      <motion.div
        variants={itemVariants}
        id="inactive-items-section"
        className="scroll-mt-6"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-gray-600" />
                Inactive Items
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Items not currently in use - {inactiveItemsData.length} items
              </p>
            </div>
            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">
              Total: {totalInactive} items | ৳
              {totalInactiveValue.toLocaleString("en-BD", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Badge>
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

export default ItemsByStatusPage;
