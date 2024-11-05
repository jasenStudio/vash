export interface auth_user {
  id?: number | string;
  email: string;
  user_name: string;
  status: boolean;
  is_admin: boolean;
}

export interface registerUserResponse {
  ok?: boolean;
  user: auth_user;
  token: string;
  expiration?: string;
}

export interface loginUserResponse {
  ok?: boolean;
  user: auth_user;
  token: string;
  expiration?: string;
}
