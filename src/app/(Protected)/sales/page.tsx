import SalesPage from "@/components/ProductSales";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "This is product dashboard.",
};
const page = () => {
  return <SalesPage />;
};

export default page;
