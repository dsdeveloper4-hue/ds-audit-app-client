"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { ProductType } from "@/type";

export default function SalesTable({ products }: { products: ProductType[] }) {
  const totalQty = products.reduce((sum, p) => sum + p.total_qty, 0);
  const totalAmount = products.reduce((sum, p) => sum + p.total_amount, 0);

  return (
    <Card className="p-4 border shadow-sm rounded-2xl">
      <ScrollArea className="h-[60vh]">
        <div className="min-w-[720px]">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-blue-800 text-white uppercase text-lg">
                <th className="px-4 py-3 sticky top-0 bg-blue-500 z-10">#</th>
                <th className="px-4 py-3 sticky top-0 bg-blue-500 z-10">
                  Product Name
                </th>
                <th className="px-4 py-3 sticky top-0 bg-blue-500 z-10">
                  Price
                </th>
                <th className="px-4 py-3 sticky top-0 bg-blue-500 z-10">Qty</th>
                <th className="px-4 py-3 sticky top-0 bg-blue-500 z-10">
                  Total Sales
                </th>
                <th className="px-4 py-3 sticky top-0 bg-blue-500 z-10">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-muted-foreground bg-gray-50"
                  >
                    No sales data found.
                  </td>
                </tr>
              ) : (
                <>
                  {products.map((product, idx) => (
                    <tr
                      key={product.item_id}
                      className={`border-t ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <td className="px-4 py-3 text-gray-600 font-medium">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {product.item.item_name ?? "Unnamed"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        ৳ {product.item.sales_price?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {product.total_qty}
                      </td>
                      <td className="px-4 py-3 font-bold text-green-600">
                        ৳ {product.total_amount?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {product.sales_date
                          ? new Date(product.sales_date).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}

                  {/* Footer Row for Totals */}
                  <tr className="bg-blue-100  text-xl font-bold border-t-2 h-16 border-blue-300">
                    <td colSpan={3} className="px-4  text-2xl ">
                      Total:
                    </td>
                    <td className="px-4 py-3  text-blue-800">{totalQty}</td>
                    <td className="px-4 py-3 text-green-700">
                      ৳ {totalAmount.toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </Card>
  );
}
