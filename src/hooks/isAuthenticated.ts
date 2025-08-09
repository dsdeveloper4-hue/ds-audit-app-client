"use client";
import { useAppSelector } from "@/redux/hook";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
function useIsAuthenticated() {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = !!user;
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router, isAuthenticated]);
}

export default useIsAuthenticated;
