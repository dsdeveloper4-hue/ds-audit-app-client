
export interface TAuthRes {
  accessToken: string;
  refreshToken?: string;
}

export interface TUser {
  id: string;
  name: string;
  mobile: string;
  roleName?: string;
  role_id?: string;
}

export interface TDecodedUser {
  id: string;
  roleName?: string;
  role_id?: string;
  iat?: number;
  exp?: number;
}
