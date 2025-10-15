// constants/sidebarLinks.ts
import {
  Users,
  ClipboardCheck,
  Home,
  Package,
  DoorOpen,
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
    title: "Users",
    href: "/users",
    icon: Users,
  },
];
