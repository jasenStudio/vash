export interface Account {
  account_email: string;
  created_at: string | Date;
  id?: number;
  status?: boolean;
  updated_at: string;
  user_id: number;
}
