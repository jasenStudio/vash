export interface AuthResponse {
  ok: boolean;
  data: {
    user: {
      email: string;
      id: number;
      status: boolean;
      is_admin: boolean;
      user_name: string;
    };
  };
  expiration?: string;
}

export interface AuthCheckStatusRespone {
  ok: boolean;
  message: string;
  data: {
    user: {
      email: string;
      id: number;
      status: boolean;
      is_admin: boolean;
      user_name: string;
    };
  };
}
