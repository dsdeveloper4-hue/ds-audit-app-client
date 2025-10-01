// constants/sidebarLinks.ts
import { BarChart3, FileText, Users } from "lucide-react";

export const sidebarLinks = [
  {
    title: "Total Sales",
    href: "/sales-summary",
    icon: FileText, // summary report
  },
  {
    title: "Product Sales Graph",
    href: "/product-graph",
    icon: BarChart3, // graph visualization
  },
  {
    title: "Customer Report",
    href: "/customer-report",
    icon: Users, // customers & their purchases
  },
];
