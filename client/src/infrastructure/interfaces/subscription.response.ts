export interface SubcriptionsResponse {
  ok: boolean;
  data: {
    subscriptions: subscriptionResponse[];
  };
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface subscriptionResponse {
  id: number;
  user_name_subscription: null | string;
  services_id: number;
  account_id: number;
  status: boolean;
  accounts: Accounts;
  services: Services;
}

export interface Accounts {
  account_email: string;
}

export interface Services {
  name: string;
}
