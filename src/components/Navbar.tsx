"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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

const fetchAuthStatus = async () => {
  const res = await axios.get<{
    user: {
      userId: string;
      role: number;
      name: string;
    };
  }>(`${process.env.NEXT_PUBLIC_API_URL}/api/verify-jwt`, {
    withCredentials: true,
  });
  return res.data;
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["auth-status"],
    queryFn: fetchAuthStatus,
    retry: false,
  });

  const isAuthenticated = !!data?.user?.userId;
  const userName = data?.user?.name;

const handleLogout = async () => {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
   queryClient.setQueryData(["auth-status"], null); // forcefully set auth to null
   queryClient.invalidateQueries({ queryKey: ["auth-status"] }); // mark as stale
   router.push("/login");
    router.push("/login");
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

  return (
    <nav className="bg-white fixed top-0 left-0 w-full z-50 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Digital Seba
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {isAuthenticated && (
            <>
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Home
              </Link>
              <Link
                href="/sales"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Sales Dashboard
              </Link>
            </>
          )}

          {isLoading ? (
            <Skeleton className="h-8 w-24 rounded-md" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-gray-700"
                >
                  <FaUserCircle className="text-xl" />
                  <span className="capitalize">{userName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setOpen(!open)}
            className="text-gray-700 text-2xl focus:outline-none"
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
            className="md:hidden bg-white border-t px-4 py-4 space-y-3 shadow-inner"
          >
            {isAuthenticated && (
              <>
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="block text-gray-700 font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/sales"
                  onClick={() => setOpen(false)}
                  className="block text-gray-700 font-medium"
                >
                  Sales Dashboard
                </Link>
              </>
            )}

            {isLoading ? (
              <Skeleton className="h-8 w-20 rounded-md" />
            ) : isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 text-gray-700 font-medium mt-2">
                  <FaUserCircle className="text-lg" />
                  <span className="capitalize">{userName}</span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-2"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
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
