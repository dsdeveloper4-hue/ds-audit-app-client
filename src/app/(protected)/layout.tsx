"use client";

import Sidebar from "@/components/shared/Sidebar";
import Navbar from "@/components/shared/Navbar";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { useAppSelector } from "@/redux/hook";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useAppSelector((state) => state.auth.token);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token === undefined) {
      // Still checking Redux store
      setLoading(true);
    } else if (!token) {
      // No token -> redirect
      router.push("/login");
    } else {
      // Token exists -> authenticated
      setLoading(false);
    }
  }, [token, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {/* Top Navbar */}
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-950 p-6 pt-20 lg:ml-64">
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
}
