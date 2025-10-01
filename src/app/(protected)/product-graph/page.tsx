import ProductChartPage from "@/components/productGraph/ChartProduct";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Sales Graph",
  description:
    "Visualize product performance in Digital Seba with interactive graphs and charts. Track trends, monitor growth, and optimize inventory effectively.",
};

export default function ProductGraphPage() {
  return <ProductChartPage />;
}
