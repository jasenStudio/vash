export interface User {
  id?: number;
  email: string;
  user_name: string;
  password?: string;
  status?: boolean;
  is_admin?: boolean;
}
