"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants/sidebarLinks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const NavItems = ({ onItemClick }: { onItemClick?: () => void }) => (
    <nav className="space-y-2 overflow-y-auto">
      {sidebarLinks.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Button
            key={link.href}
            asChild
            variant={isActive ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-2 rounded-xl px-3 py-2 text-base",
              isActive && "shadow-md"
            )}
          >
            <Link
              href={link.href}
              onClick={onItemClick}
              className="flex items-center gap-2 w-full"
            >
              <Icon className="h-5 w-5" />
              {link.title}
            </Link>
          </Button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Toggle (kept out of navbar as requested) */}
      <button
        type="button"
        aria-label="Open sidebar"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-[60] p-2 rounded-md bg-primary text-primary-foreground shadow"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Desktop Sidebar (always visible) */}
      <aside
        className={cn(
          "hidden lg:flex",
          "fixed left-0 top-16 z-40 w-64 h-[calc(100vh-4rem)]",
          "bg-white dark:bg-gray-900 border-r shadow-sm"
        )}
      >
        <div className="w-full h-full flex flex-col p-4">
          <NavItems />
        </div>
      </aside>

      {/* Mobile Sidebar + Overlay (under the fixed navbar) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark overlay that starts below navbar so the navbar stays clickable */}
            <motion.div
              key="overlay"
              className="fixed top-16 left-0 right-0 bottom-0 bg-black/40 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.aside
              key="mobile-aside"
              className={cn(
                "fixed top-16 left-0 z-[60] w-64 h-[calc(100vh-4rem)]",
                "bg-white dark:bg-gray-900 border-r shadow-lg p-4 flex flex-col lg:hidden"
              )}
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Close sidebar"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-md hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <NavItems onItemClick={() => setIsOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
