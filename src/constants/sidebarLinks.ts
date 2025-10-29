// constants/sidebarLinks.ts
import {
  Users,
  ClipboardCheck,
  Home,
  Package,
  DoorOpen,
  History,
  ShoppingCart,
} from "lucide-react";

export const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Audits",
    href: "/audits",
    icon: ClipboardCheck,
  },
  {
    title: "Add Assets",
    href: "/asset-purchases",
    icon: ShoppingCart,
  },
  {
    title: "Rooms",
    href: "/rooms",
    icon: DoorOpen,
  },
  {
    title: "Items",
    href: "/items",
    icon: Package,
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
  {
    title: "Activity History",
    href: "/history",
    icon: History,
  },
];
