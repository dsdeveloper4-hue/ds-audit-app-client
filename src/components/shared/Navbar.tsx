"use client";

import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { logout as logoutAction } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  console.log(user)
  const [logoutApi, { isLoading }] = useLogoutMutation(); // ✅ RTK query hook

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap(); // ✅ call backend logout API
      dispatch(logoutAction()); // ✅ clear Redux auth state
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b shadow-sm z-50 flex items-center justify-between px-6">
      {/* Brand / Logo */}
      <div className="flex items-center space-x-2">
        <Link href={"/"} className="text-lg font-semibold text-primary">
          DIGITAL SEBA
        </Link>
      </div>

      {/* User Info + Logout */}
      <div className="flex items-center gap-4">
        {/* User Avatar + Name */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {user?.name || user?.mobile}
          </span>
        </div>

        {/* Logout Button */}
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {isLoading ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </nav>
  );
}
