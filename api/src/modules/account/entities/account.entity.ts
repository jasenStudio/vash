export interface Account {
  id: number;
  account_email: string;
  user_id: number;
  status: boolean;
}

export interface AccountsResponse {
  ok: boolean;
  message: string;
  data: {
    accounts: Account[];
  };
}

export interface AccountResponse {
  ok: boolean;
  message: string;
  data: {
    accounts: Account;
  };
}
