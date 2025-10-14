// constants/sidebarLinks.ts
import {
  Users,
  ClipboardCheck,
  Home,
  Package,
  DoorOpen,
  Warehouse,
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
    title: "Inventory",
    href: "/inventory",
    icon: Warehouse,
  },

];
