import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AccountService } from "../services/account.services";
import {
  AccountsResponse,
  AccountUpdateResponse,
} from "@/infrastructure/interfaces/account.response";
import { toast } from "sonner";
import { Account } from "@/domain";
import { usePaginationStore } from "@/vash/store/ui/usePaginationStore";

import { t } from "i18next";

export const useAccountUpdateMutation = () => {
  const { page, limit, search } = usePaginationStore();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["account", "update"],
    mutationFn: AccountService.update,
    onMutate: async ({ id, payload: account }) => {
      const previousData = queryClient.getQueryData<AccountsResponse>([
        "accounts",
        { page, limit, search },
      ]);

      const optimisticAccount: Partial<Account> = {
        id: id,
        created_at: account.created_at,
        ...account,
      };

      queryClient.setQueryData(
        ["accounts", { page, limit, search }],
        (old: AccountsResponse) => {
          if (!old) return previousData;

          const accounts = old.data.accounts.map((cacheAccount) =>
            cacheAccount.id === optimisticAccount.id
              ? optimisticAccount
              : cacheAccount
          );

          const accountExists = old.data.accounts.some(
            (cacheAccount) => cacheAccount.id === optimisticAccount.id
          );
          if (!accountExists) {
            accounts.push(optimisticAccount);
          }

          return {
            ...old,
            data: {
              accounts,
            },
          };
        }
      );

      return { optimisticAccount, previousData };
    },
    onSuccess: (
      accountResponse: AccountUpdateResponse,
      _variables,
      context
    ) => {
      const { account } = accountResponse.data!;

      queryClient.setQueryData(
        ["accounts", { page, limit, search }],
        (old: AccountsResponse) => {
          if (!old) return context.previousData;

          const accounts = old.data.accounts.map((cacheAccount) => {
            return cacheAccount.id === context.optimisticAccount.id
              ? account
              : cacheAccount;
          });

          return {
            ...old,
            data: {
              accounts,
            },
          };
        }
      );
      queryClient.removeQueries({
        queryKey: ["account", context?.optimisticAccount.id],
      });

      queryClient.getQueryData(["accounts", { page, limit, search }]);
      toast.success(t("entities.account.updated"), { duration: 5000 });
    },
    onError: (_error, _variables, context) => {
      console.log(_error.message, "error");
      queryClient.removeQueries({
        queryKey: ["account", context?.optimisticAccount.id],
      });

      queryClient.setQueryData(
        ["accounts", { page, limit, search }],
        (old: AccountsResponse) => {
          if (!old) return context?.previousData;

          const accounts = old.data.accounts.filter(
            (account) => account.id !== context?.optimisticAccount.id
          );

          return { ...old, data: { accounts } };
        }
      );

      toast.error(t("entities.account.updated_error"), { duration: 5000 });
    },
  });

  return mutation;
};
