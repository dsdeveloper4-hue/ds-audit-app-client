import React from "react";
import { ProductType } from "@/type";

const ProductTable = ({ products }: { products: ProductType[] }) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="h-[calc(65vh-10px)] overflow-auto scroll-container">
        <table className="min-w-[640px] w-full text-sm text-left border-collapse">
          <thead className="bg-blue-800 text-white uppercase text-sm">
            <tr>
              <th className="px-4 py-3 sticky top-0 bg-blue-800 z-10">
                Product Name
              </th>
              <th className="px-4 py-3 sticky top-0 bg-blue-800 z-10">Price</th>
              <th className="px-4 py-3 sticky top-0 bg-blue-800 z-10">
                Sales Qty
              </th>
              <th className="px-4 py-3 sticky top-0 bg-blue-800 z-10">
                Total Sales
              </th>
              <th className="px-4 py-3 sticky top-0 bg-blue-800 z-10">Date</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-800">
                  {product.item_info?.item_name ?? "Unnamed"}
                </td>
                <td className="px-4 py-3">
                  ৳ {product.item_info?.sales_price}
                </td>
                <td className="px-4 py-3">{product.sales_qty}</td>
                <td className="px-4 py-3">৳ {product.total_cost}</td>
                <td className="px-4 py-3">
                  {product.created_date
                    ? new Date(product.created_date).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
