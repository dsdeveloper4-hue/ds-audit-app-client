"use client";

import { useParams } from "next/navigation";
import { useGetCustomerSalesReportByIDQuery } from "@/redux/features/customer/customerApi";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, User, Calendar, FileText, Wallet } from "lucide-react";
import DownloadPDF from "./DownloadPDF";
import { TSales } from "@/types";

export default function SingleSale() {
  const { id } = useParams();
  const customerId = Number(id);

  const { data, isLoading, error } = useGetCustomerSalesReportByIDQuery({
    customerId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        No sales record found.
      </div>
    );
  }

  const sale: TSales = data.data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto px-4 py-8 "
    >
      <Card className="shadow-lg border rounded-xl">
        {/* Header */}
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold">
                Sale #{sale.sales_code}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {sale.customer_name}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(sale.sales_date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Ref: {sale.reference_no}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant={
                  sale.payment_status === "Paid" ? "default" : "destructive"
                }
                className="px-3 py-1 text-sm"
              >
                {sale.payment_status}
              </Badge>
              <DownloadPDF sale={sale} />
            </div>
          </div>
        </CardHeader>

        {/* Table */}
        <CardContent className="space-y-6">
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-semibold">Item</TableHead>
                  <TableHead className="font-semibold text-center">
                    Quantity
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    Price
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    Discount
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sale.items?.map((item) => (
                  <TableRow
                    key={item.sales_item_id}
                    className="hover:bg-muted/20"
                  >
                    <TableCell className="font-medium">
                      {item.item_name}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.sales_qty}
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.price_per_unit.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.discount_amt.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${item.total_cost.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="flex flex-col md:flex-row justify-between items-center gap-4 border-t">
          <div className="text-sm text-muted-foreground">
            <p>
              <span className="font-medium">Created By:</span> {sale.created_by}
            </p>
            <p>
              <span className="font-medium">Date:</span>{" "}
              {new Date(sale.created_date).toLocaleDateString()} at{" "}
              {sale.created_time}
            </p>
          </div>

          <div className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
            <Wallet className="h-5 w-5 text-muted-foreground" />
            Total: ${sale.subtotal.toFixed(2)}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
