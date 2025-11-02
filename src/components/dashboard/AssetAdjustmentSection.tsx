"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingDown, Calculator, Loader2 } from "lucide-react";
import { TAudit } from "@/types";
import { useUpdateAdjustmentMutation } from "@/redux/features/audit/auditApi";
import { toast } from "sonner";
import { useRole } from "@/hooks/useRole";
import months from "@/constants/months";

interface AssetAdjustmentSectionProps {
  audits: TAudit[];
}

interface AdjustmentState {
  [auditId: string]: {
    percentage: number;
    isSaving: boolean;
  };
}

export function AssetAdjustmentSection({
  audits,
}: AssetAdjustmentSectionProps) {
  const { canManageUsers } = useRole();
  const [updateAdjustment] = useUpdateAdjustmentMutation();
  const [adjustments, setAdjustments] = useState<AdjustmentState>({});
  const [debounceTimers, setDebounceTimers] = useState<{
    [key: string]: NodeJS.Timeout;
  }>({});

  // Calculate total asset value for an audit
  const calculateTotalAssetValue = useCallback((audit: TAudit): number => {
    const itemDetails = audit.itemDetails ?? [];
    let totalValue = 0;

    itemDetails.forEach((detail: any) => {
      const activeQty = detail.active_quantity || 0;
      const brokenQty = detail.broken_quantity || 0;
      const inactiveQty = detail.inactive_quantity || 0;
      const totalQty = activeQty + brokenQty + inactiveQty;

      const itemTotalPrice = detail.total_price || 0;

      if (totalQty > 0) {
        const pricePerUnit = Number(itemTotalPrice) / totalQty;

        // Active and Inactive: full price
        totalValue += activeQty * pricePerUnit;
        totalValue += inactiveQty * pricePerUnit;

        // Broken: 95% of price (5% depreciation)
        totalValue += brokenQty * pricePerUnit * 0.95;
      }
    });

    return totalValue;
  }, []);

  // Calculate adjusted value
  const calculateAdjustedValue = useCallback(
    (totalValue: number, reductionPercentage: number) => {
      const reductionAmount = totalValue * (reductionPercentage / 100);
      const adjustedValue = totalValue - reductionAmount;

      return {
        adjustedValue: Math.round(adjustedValue * 100) / 100,
        reductionAmount: Math.round(reductionAmount * 100) / 100,
      };
    },
    []
  );

  // Format currency
  const formatCurrency = useCallback((amount: number): string => {
    return `৳${amount.toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }, []);

  // Get month/year display
  const getMonthYear = useCallback((audit: TAudit): string => {
    const monthName =
      months.find((m) => m.value === audit.month)?.label ?? "Unknown";
    return `${monthName} ${audit.year}`;
  }, []);

  // Handle reduction percentage change
  const handleReductionChange = useCallback(
    (auditId: string, value: string) => {
      const numValue = parseFloat(value) || 0;

      // Validate range
      if (numValue < 0 || numValue > 100) {
        toast.error("Reduction percentage must be between 0 and 100");
        return;
      }

      // Update local state immediately (optimistic update)
      setAdjustments((prev) => ({
        ...prev,
        [auditId]: {
          percentage: numValue,
          isSaving: false,
        },
      }));

      // Clear existing timer
      if (debounceTimers[auditId]) {
        clearTimeout(debounceTimers[auditId]);
      }

      // Set new debounce timer
      const timer = setTimeout(async () => {
        setAdjustments((prev) => ({
          ...prev,
          [auditId]: {
            ...prev[auditId],
            isSaving: true,
          },
        }));

        try {
          await updateAdjustment({
            id: auditId,
            reduction_percentage: numValue,
          }).unwrap();

          setAdjustments((prev) => ({
            ...prev,
            [auditId]: {
              ...prev[auditId],
              isSaving: false,
            },
          }));

          toast.success("Adjustment saved successfully");
        } catch (error: any) {
          setAdjustments((prev) => ({
            ...prev,
            [auditId]: {
              ...prev[auditId],
              isSaving: false,
            },
          }));

          toast.error(
            error?.data?.message ||
              "Failed to save adjustment. Please try again."
          );
        }
      }, 500);

      setDebounceTimers((prev) => ({
        ...prev,
        [auditId]: timer,
      }));
    },
    [debounceTimers, updateAdjustment]
  );

  // Get current reduction percentage
  const getReductionPercentage = useCallback(
    (audit: TAudit): number => {
      return (
        adjustments[audit.id]?.percentage ??
        Number(audit.reduction_percentage) ??
        0
      );
    },
    [adjustments]
  );

  // Check if saving
  const isSaving = useCallback(
    (auditId: string): boolean => {
      return adjustments[auditId]?.isSaving ?? false;
    },
    [adjustments]
  );

  if (!audits || audits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <Calculator className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Audits Available
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create your first audit to see asset adjustments here.
            </p>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <TrendingDown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Month-wise Asset Adjustment
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Apply reduction percentages to adjust monthly asset values
          </p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Month/Year</TableHead>
                <TableHead className="text-center font-semibold">
                  Total Assets
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Reduction (%)
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Adjusted Total
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audits.map((audit, index) => {
                const totalValue = calculateTotalAssetValue(audit);
                const reductionPercentage = getReductionPercentage(audit);
                const { adjustedValue, reductionAmount } =
                  calculateAdjustedValue(totalValue, reductionPercentage);
                const saving = isSaving(audit.id);

                return (
                  <motion.tr
                    key={audit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getMonthYear(audit)}
                        <Badge
                          variant={
                            audit.status === "COMPLETED"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {audit.status}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {formatCurrency(totalValue)}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={reductionPercentage}
                          onChange={(e) =>
                            handleReductionChange(audit.id, e.target.value)
                          }
                          disabled={!canManageUsers || saving}
                          className="w-20 text-center"
                          aria-label={`Reduction percentage for ${getMonthYear(
                            audit
                          )}`}
                        />
                        <span className="text-sm text-gray-500">%</span>
                        {saving && (
                          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        )}
                      </div>
                      {!canManageUsers && (
                        <p className="text-xs text-gray-400 mt-1">
                          🔒 Admin only
                        </p>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(adjustedValue)}
                        </div>
                        {reductionPercentage > 0 && (
                          <div className="text-xs text-red-600 dark:text-red-400">
                            ↓ -{formatCurrency(reductionAmount)}
                          </div>
                        )}
                        {reductionPercentage === 0 && (
                          <div className="text-xs text-gray-400">No change</div>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {!canManageUsers && (
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
          💡 Only administrators can modify reduction percentages
        </div>
      )}
    </motion.div>
  );
}
