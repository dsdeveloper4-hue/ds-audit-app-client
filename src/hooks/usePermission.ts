// hooks/usePermission.ts
"use client";

import { useAppSelector } from "@/redux/hook";
import { TResource, TAction } from "@/types/permission";

/**
 * Custom hook to check if the current user has a specific permission
 * @param resource - The resource to check (e.g., 'audit', 'item', 'room')
 * @param action - The action to check (e.g., 'create', 'read', 'update', 'delete')
 * @returns boolean - true if user has permission, false otherwise
 */
export const usePermission = (resource: TResource, action: TAction): boolean => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return false;
  }

  // If user doesn't have role information in token, assume no permissions
  if (!user.roleName) {
    return false;
  }

  // Admin has all permissions
  if (user.roleName === "Admin" || user.roleName === "admin") {
    return true;
  }

  // For other roles, we need to check permissions from the user data
  // Since we store minimal user info in token, we'll need to fetch full user data with permissions
  // For now, return true for read operations, false for write operations
  // This should be enhanced by fetching user permissions from an API
  
  // TODO: Implement actual permission checking logic using resource and action
  console.log(`Checking permission for ${resource}:${action}`);

  return false;
};

/**
 * Check if user has any of the specified permissions
 */
export const useHasAnyPermission = (
  permissions: Array<{ resource: TResource; action: TAction }>
): boolean => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user || !user.roleName) {
    return false;
  }

  // Admin has all permissions
  if (user.roleName === "Admin" || user.roleName === "admin") {
    return true;
  }

  // Check each permission
  for (const { resource, action } of permissions) {
    // TODO: Implement actual permission checking logic
    console.log(`Checking permission for ${resource}:${action}`);
    // For now, return false for non-admin users
  }

  return false;
};

/**
 * Check if user has all of the specified permissions
 */
export const useHasAllPermissions = (
  permissions: Array<{ resource: TResource; action: TAction }>
): boolean => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user || !user.roleName) {
    return false;
  }

  // Admin has all permissions
  if (user.roleName === "Admin" || user.roleName === "admin") {
    return true;
  }

  // Check each permission
  for (const { resource, action } of permissions) {
    // TODO: Implement actual permission checking logic
    console.log(`Checking permission for ${resource}:${action}`);
    // For now, return false for non-admin users
  }

  return false;
};
