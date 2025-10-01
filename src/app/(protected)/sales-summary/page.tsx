import SalesPage from "@/components/salesReport/ProductSales";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Total Sales",
  description:
    "View detailed sales reports in Digital Seba. Analyze revenue, track performance, and make data-driven business decisions with ease.",
};
const page = () => {
  return <SalesPage />;
};

export default page;
