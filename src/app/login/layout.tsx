"use client";

import { useAppSelector } from "@/redux/hook";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginLayout({
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
    } else if (token) {
      // Already logged in -> redirect
      router.push("/");
    } else {
      // No token -> allow login page
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

  return <>{children}</>;
}
