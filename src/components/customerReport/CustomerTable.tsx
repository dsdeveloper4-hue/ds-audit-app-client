"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TSales } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Wallet, Calendar, User, CreditCard, Receipt } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

type PropsType = {
  customers: TSales[];
  startDate: string;
  endDate: string;
};

const CustomerList: React.FC<PropsType> = ({
  customers,
  startDate,
  endDate,
}) => {
  const totals = React.useMemo(() => {
    const paidTotal = customers.reduce(
      (sum, c) => sum + (c.paid_amount ?? 0),
      0
    );
    return { paidTotal };
  }, [customers]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-1">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Customer Sales
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[40vh] px-6">
          <AnimatePresence mode="wait">
            {customers.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {customers.map((customer, index) => (
                  <motion.div
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Customer Info */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                          {index + 1}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">Customer:</span>
                            <span className="text-foreground truncate">
                              {customer.customer_name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">Sales Code:</span>
                            <span className="text-foreground font-mono truncate">
                              {customer.sales_code}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Receipt className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">Reference:</span>
                            <span className="text-foreground truncate">
                              {customer.reference_no}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {new Date(
                                customer.created_date
                              ).toLocaleDateString()}{" "}
                              • {customer.created_time}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status + Paid Amount + Download */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6 w-full lg:w-auto border-t pt-3 sm:border-0 sm:pt-0">
                        {/* Payment Status Badge */}
                        <Badge
                          variant={
                            customer.payment_status === "Paid"
                              ? "default"
                              : "destructive"
                          }
                          className="w-fit sm:w-auto px-3 py-1 text-xs sm:text-sm font-medium rounded-full"
                        >
                          {customer.payment_status}
                        </Badge>

                        {/* Paid Amount + Download */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 w-full sm:w-auto">
                          {/* Paid Amount */}
                          <div className="flex flex-col sm:items-end">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground">
                              Paid Amount
                            </span>
                            <span
                              className={`text-lg sm:text-xl font-semibold ${
                                customer.payment_status === "Paid"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              ৳{customer.paid_amount?.toLocaleString()}
                            </span>
                          </div>

                          {/* Download PDF Button */}
                          <div>
                            <Link href={`/customer-report/${customer.id}`}>
                              <Button variant="outline" className="w-full">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <Wallet className="w-16 h-16 text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No customer sales found
                </h3>
                <p className="text-sm text-muted-foreground">
                  Between <strong>{startDate}</strong> and{" "}
                  <strong>{endDate}</strong>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>

        {/* Summary */}
        {customers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t bg-muted/30 px-6 py-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h4 className="text-lg font-semibold">Summary</h4>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm">
                <div className="flex flex-col items-start sm:items-end">
                  <span className="text-muted-foreground">Total Paid</span>
                  <span className="text-lg font-bold text-green-600">
                    ৳{totals.paidTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerList;
