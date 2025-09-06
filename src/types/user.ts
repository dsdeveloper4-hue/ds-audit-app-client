
export interface TAuthRes {
  user: TUser;
  accessToken: string;
}

export interface TUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  profile_picture: string | undefined; // you can refine this later
}
