// types/permission.ts

export interface TPermission {
  id: string;
  name: string;
  resource: string;
  action: string;
  created_at: string;
  updated_at: string;
  _count?: {
    roles: number;
  };
}

export interface TRole {
  id: string;
  name: string;
  description?: string;
  permissions: TRolePermission[];
  created_at: string;
  updated_at: string;
  _count?: {
    users: number;
  };
}

export interface TRolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  permission: TPermission;
  created_at: string;
}

export type TResource = 
  | "audit" 
  | "item" 
  | "room" 
  | "user"
  | "dashboard"
  | "role"
  | "permission";

export type TAction = 
  | "create" 
  | "read" 
  | "update" 
  | "delete";

export interface TUserWithRole {
  id: string;
  name: string;
  mobile: string;
  role_id: string;
  role: TRole;
  created_at: string;
  updated_at: string;
}
