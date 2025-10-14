
export interface TAuthRes {
  accessToken: string;
  refreshToken?: string;
}

export interface TUser {
  id: string;
  name: string;
  mobile: string;
  roleName?: string;
}

export interface TDecodedUser {
  id: string;
  roleName?: string;
  iat?: number;
  exp?: number;
}
