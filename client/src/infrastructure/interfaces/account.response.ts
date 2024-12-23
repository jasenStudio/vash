import { Account } from "@/domain";

export interface AccountsResponse {
  ok: boolean;
  data: {
    accounts: Account[];
  };
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface AccountCreateResponse {
  ok: boolean;
  data: { account: Account };
  message: string;
}
