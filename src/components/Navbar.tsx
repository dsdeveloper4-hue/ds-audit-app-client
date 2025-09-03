"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();

  // Simulate mounted state to avoid hydration mismatch
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Hardcoded user/auth state
  const isAuthenticated = true; // change to false to test unauthenticated state

  // Logout handler (hardcoded)
  const handleLogout = () => {
    // Replace this with real logout logic later
    console.log("User logged out");
    router.push("/login");
  };

  if (!hasMounted) {
    return (
      <nav className="bg-white fixed top-0 left-0 w-full z-50 shadow-sm border-b">
        <div className="mx-10 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Digital Seba
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse" />
          </div>
          <div className="md:hidden">
            <button
              className="text-gray-700 text-2xl focus:outline-none"
              disabled
              aria-label="Menu loading"
            >
              <HiOutlineMenu />
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white fixed top-0 left-0 w-full z-50 shadow-sm border-b">
      <div className="mx-10 px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-300"
        >
          Digital Seba
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 font-semibold text-gray-700 select-none">
          {/* User Auth Controls */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Button variant="default" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition rounded px-6 py-2 font-semibold">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="text-gray-700 text-3xl focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t px-6 py-5 space-y-4 shadow-inner"
          >
            {isAuthenticated && (
              <>
                <div className="mt-3 flex items-center justify-between">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </>
            )}
            {!isAuthenticated && (
              <Link href="/login">
                <Button size="sm" className="w-full">
                  Login
                </Button>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
