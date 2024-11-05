export interface AuthResponse {
  ok: boolean;
  user: {
    email: string;
    id: number;
    status: boolean;
    is_admin: boolean;
    user_name: string;
  };
  token: string;
}
