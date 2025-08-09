"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FaUserCircle } from "react-icons/fa";
import api from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { clearUser } from "@/redux/slices/authSlice";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = !!user;
  const userName = user?.name;
  const queryClient = useQueryClient();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
    setHasMounted(true);
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      dispatch(clearUser());
      localStorage.removeItem("reduxState");
      queryClient.setQueryData(["auth-status"], null);
      queryClient.invalidateQueries({ queryKey: ["auth-status"] });
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Render loading skeleton during SSR to avoid hydration mismatch
  if (!hasMounted) {
    return (
      <nav className="bg-white fixed top-0 left-0 w-full z-50 shadow-sm border-b">
        <div className="mx-10 px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Digital Seba
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Skeleton className="h-8 w-24 rounded-md" />
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
          {isAuthenticated && (
            <div className="flex gap-10">
              <Link
                href="/"
                className="relative group transition-colors duration-300 hover:text-blue-600"
              >
                Home
                <span
                  className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/sales"
                className="relative group transition-colors duration-300 hover:text-blue-600"
              >
                Sales Dashboard
                <span
                  className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"
                  aria-hidden="true"
                />
              </Link>
            </div>
          )}

          {/* User Auth Controls */}
          {user === undefined ? (
            <Skeleton className="h-10 w-28 rounded-md" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors duration-300 focus:ring-2 focus:ring-blue-400 focus:outline-none rounded"
                >
                  <FaUserCircle className="text-2xl" />
                  <span className="capitalize">{userName}</span>
                  <svg
                    className="w-4 h-4 ml-1 text-gray-400 group-hover:text-blue-600 transition-colors duration-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="shadow-lg rounded-md border border-gray-200"
              >
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="hover:bg-red-600 hover:text-white transition-colors duration-200"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" aria-label="Login">
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
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="block text-gray-700 font-semibold hover:text-blue-600 transition-colors duration-300"
                >
                  Home
                </Link>
                <Link
                  href="/sales"
                  onClick={() => setOpen(false)}
                  className="block text-gray-700 font-semibold hover:text-blue-600 transition-colors duration-300"
                >
                  Sales Dashboard
                </Link>
              </>
            )}

            {user === undefined ? (
              <Skeleton className="h-10 w-24 rounded-md" />
            ) : isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 text-gray-700 font-semibold mt-3">
                  <FaUserCircle className="text-xl" />
                  <span className="capitalize">{userName}</span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login" aria-label="Login">
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
