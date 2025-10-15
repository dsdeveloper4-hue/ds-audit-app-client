// hooks/useRole.ts
"use client";

import { useAppSelector } from "@/redux/hook";

/**
 * Custom hook to check user role and permissions based on your API's role system
 */
export const useRole = () => {
  const user = useAppSelector((state) => state.auth.user);

  const isAuthenticated = !!user;
  // The token contains 'role' field directly (not 'roleName')
  const userRole = (user as any)?.role;

  const isSuperAdmin = userRole === "SUPER_ADMIN";
  const isAdmin = userRole === "ADMIN";
  const isUser = userRole === "USER";

  // Check if user can manage users (based on your API's userManagementAuth middleware)
  const canManageUsers = isSuperAdmin || isAdmin;

  // Check if user can create/update/delete specific roles
  const canManageRole = (targetRole?: string) => {
    if (isSuperAdmin) return true;
    if (isAdmin && targetRole && (targetRole === "ADMIN" || targetRole === "SUPER_ADMIN")) {
      return false; // Admins cannot manage other admins or super admins
    }
    return isAdmin;
  };

  return {
    user,
    isAuthenticated,
    userRole,
    isSuperAdmin,
    isAdmin,
    isUser,
    canManageUsers,
    canManageRole,
  };
};
