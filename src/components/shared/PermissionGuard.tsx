// components/shared/PermissionGuard.tsx
"use client";

import { usePermission } from "@/hooks/usePermission";
import { TResource, TAction } from "@/types/permission";
import { ReactNode } from "react";

interface PermissionGuardProps {
  resource: TResource;
  action: TAction;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders children based on user permissions
 * @param resource - The resource to check permission for
 * @param action - The action to check permission for
 * @param children - Content to render if user has permission
 * @param fallback - Optional content to render if user doesn't have permission
 */
export default function PermissionGuard({
  resource,
  action,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const hasPermission = usePermission(resource, action);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
