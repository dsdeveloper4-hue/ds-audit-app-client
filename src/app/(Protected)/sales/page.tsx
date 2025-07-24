import SalesPage from "@/components/ProductSales";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sales Dashboard",
  description: "This is sales dashboard.",
};
const page = () => {
  return <SalesPage />;
};

export default page;
