// types/permission.ts

export interface TRole {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  _count?: {
    users: number;
  };
}

export interface TUserWithRole {
  id: string;
  name: string;
  mobile: string;
  role_id: string;
  role: TRole;
  created_at: string;
  updated_at: string;
}
