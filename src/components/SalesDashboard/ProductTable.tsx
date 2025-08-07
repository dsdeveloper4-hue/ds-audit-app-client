import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { ProductType } from "@/type";

type PropsType = {
  products: ProductType[];
  totalQty: number;
  totalAmount: number;
  startDate: string;
  endDate: string;
};

export default function SalesTable({
  products,
  totalQty,
  totalAmount,
}: PropsType) {
  console.log(products[0]);
  return (
    <Card className="p-4 border shadow-sm rounded-2xl">
      <ScrollArea className="h-[60vh]">
        <div className="min-w-full overflow-x-auto relative h-[60vh]">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-blue-800 text-white uppercase text-[13px] md:text-[15px]">
              <tr>
                <th className="px-3 py-3 sticky top-0 bg-blue-800 z-10">#</th>
                <th className="px-3 py-3 sticky top-0 bg-blue-800 z-10">
                  Product Name
                </th>
                <th className="px-3 py-3 sticky top-0 bg-blue-800 z-10">
                  Price
                </th>
                <th className="px-3 py-3 sticky top-0 bg-blue-800 z-10">Qty</th>
                <th className="px-3 py-3 sticky top-0 bg-blue-800 z-10">
                  Total Cost
                </th>
                <th className="px-3 py-3 sticky top-0 bg-blue-800 z-10">
                  Total Sales
                </th>
                <th className="px-3 py-3 sticky top-0 bg-blue-800 z-10">
                  Total Revenue
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
                  {products.map((product, idx) => {
                    const totalCost =
                      product.item.purchase_price * product.total_qty;
                    return (
                      <tr
                        key={product.item_id}
                        className={`border-t ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                        } hover:bg-blue-200 transition-colors`}
                      >
                        <td className="px-3 py-2 text-gray-600 font-medium">
                          {idx + 1}
                        </td>
                        <td className="px-3 py-2 font-medium text-gray-800 break-words max-w-[160px]">
                          {product.item.item_name ?? "Unnamed"}
                        </td>
                        <td className="px-3 py-2 text-gray-700">
                          ৳ {product.item.sales_price?.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-gray-700">
                          {product.total_qty}
                        </td>
                        <td className="px-3 py-2 font-bold text-green-600">
                          ৳ {totalCost.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 font-bold text-green-600">
                          ৳ {product.total_amount?.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 font-bold text-green-600">
                          ৳{" "}
                          {(product.total_amount - totalCost).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}

                  <tr className="bg-blue-100 text-base font-bold border-t-2 h-16 border-blue-300">
                    <td colSpan={3} className="px-3 text-lg text-blue-700">
                      Total:
                    </td>
                    <td className="px-3 py-2 text-blue-800">{totalQty}</td>
                    <td className="px-3 py-2 text-green-700">
                      ৳{" "}
                      {products
                        .reduce(
                          (sum, p) => sum + p.item.purchase_price * p.total_qty,
                          0
                        )
                        .toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-green-700">
                      ৳ {totalAmount.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-green-700 font-bold">
                      ৳{" "}
                      {(
                        totalAmount -
                        products.reduce(
                          (sum, p) => sum + p.item.purchase_price * p.total_qty,
                          0
                        )
                      ).toLocaleString()}
                    </td>
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
