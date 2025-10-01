"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TSalesReport } from "@/types";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Wallet, Calendar, User, CreditCard } from "lucide-react";

type PropsType = {
  customers: TSalesReport[];
  startDate: string;
  endDate: string;
};

const CustomerList: React.FC<PropsType> = ({
  customers,
  startDate,
  endDate,
}) => {
  return (
    <Card className="p-4 border shadow-sm rounded-2xl">
      <ScrollArea className="h-[70vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800"
        >
          <AnimatePresence>
            {customers.length > 0 ? (
              customers.map((customer, index) => {
                const dueAmount =
                  (customer.grand_total ?? 0) - (customer.paid_amount ?? 0);

                return (
                  <motion.div
                    key={customer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 py-4 px-2 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition rounded-xl"
                  >
                    {/* Left Side: Customer Info */}
                    <div className="flex items-start md:items-center gap-4 w-full md:w-2/3">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center text-blue-900 font-semibold shadow-inner">
                        {index + 1}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <User className="w-4 h-4" /> ID:{" "}
                          <span className="font-medium text-gray-900">
                            {customer.customer_id}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <CreditCard className="w-4 h-4" /> Sales Code:{" "}
                          <span className="font-semibold">
                            {customer.sales_code}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />{" "}
                          {new Date(customer.sales_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Right Side: Amounts & Status */}
                    <div className="flex flex-wrap gap-3 items-center md:justify-end w-full md:w-auto">
                      <Badge
                        variant="outline"
                        className={`px-3 py-1 text-sm ${
                          customer.payment_status === "Paid"
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-red-50 text-red-600 border-red-200"
                        }`}
                      >
                        {customer.payment_status}
                      </Badge>

                      <div className="flex flex-col text-right">
                        <span className="text-blue-700 font-bold text-sm">
                          ৳ {customer.grand_total?.toLocaleString()}
                        </span>
                        <span className="text-green-600 font-semibold text-sm">
                          Paid: ৳ {customer.paid_amount?.toLocaleString()}
                        </span>
                        <span className="text-red-600 font-semibold text-sm">
                          Due: ৳ {dueAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-10 text-gray-500"
              >
                <Wallet className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-lg font-medium">No customer sales found</p>
                <p className="text-sm">
                  Between <strong>{startDate}</strong> and{" "}
                  <strong>{endDate}</strong>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Totals Summary */}
        {customers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 bg-blue-50 dark:bg-blue-900 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-inner"
          >
            <p className="text-lg font-semibold text-blue-700 dark:text-blue-200">
              Totals:
            </p>
            <div className="flex flex-wrap gap-6 md:gap-10">
              <span className="text-blue-800 dark:text-blue-100 font-bold">
                Grand Total: ৳{" "}
                {customers
                  .reduce((sum, c) => sum + (c.grand_total ?? 0), 0)
                  .toLocaleString()}
              </span>
              <span className="text-green-700 dark:text-green-300 font-bold">
                Paid: ৳{" "}
                {customers
                  .reduce((sum, c) => sum + (c.paid_amount ?? 0), 0)
                  .toLocaleString()}
              </span>
              <span className="text-red-600 dark:text-red-400 font-bold">
                Due: ৳{" "}
                {customers
                  .reduce(
                    (sum, c) =>
                      sum + ((c.grand_total ?? 0) - (c.paid_amount ?? 0)),
                    0
                  )
                  .toLocaleString()}
              </span>
            </div>
          </motion.div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default CustomerList;
