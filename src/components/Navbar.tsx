"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import api from "@/lib/api";

type UserType = {
  userId: string;
  role: number;
  name: string;
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    // Try to get user from localStorage on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      localStorage.removeItem("user");
      setUser(null);
      queryClient.setQueryData(["auth-status"], null);
      queryClient.invalidateQueries({ queryKey: ["auth-status"] });
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isAuthenticated = !!user;
  const userName = user?.name;

  return (
    <nav className="bg-white fixed top-0 left-0 w-full z-50 shadow-sm border-b">
      <div className="mx-10 px-4 py-3 flex items-center justify-between">
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

          {loading ? (
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

            {loading ? (
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
