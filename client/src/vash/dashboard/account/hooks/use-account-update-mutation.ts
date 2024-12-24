import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AccountService } from "../services/account.services";
import {
  AccountsResponse,
  AccountUpdateResponse,
} from "@/infrastructure/interfaces/account.response";
import { toast } from "sonner";
import { Account } from "@/domain";
import { usePagination } from "@/vash/store/ui/usePagination";
import { t } from "i18next";

export const useAccountUpdateMutation = () => {
  const { page, limit, search } = usePagination();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: AccountService.update,
    onMutate: async ({ id, payload: account }) => {
      console.log("Mutacion optismita inciada");
      console.log("🚀 ~ page:", page);
      console.log("🚀 ~ search:", search);
      console.log("🚀 ~ limit:", limit);
      console.log(Date.parse(account!.created_at!), "account.created_at");
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
        ["accounts", { page: 1, limit: 5, search: "" }],
        (old: AccountsResponse) => {
          if (!old) return previousData;
          return {
            ...old,
            data: {
              accounts: [optimisticAccount, ...old.data.accounts],
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
      queryClient.removeQueries({
        queryKey: ["account", context?.optimisticAccount.id],
      });

      queryClient.setQueryData(
        ["accounts", { page, limit, search }],
        (old: AccountsResponse) => {
          console.log(old, "old");
          if (!old) return context.previousData;

          const accounts = old.data.accounts.map((cacheAccount) => {
            return cacheAccount.id === context.optimisticAccount.id
              ? account
              : cacheAccount;
          });
          console.log(accounts, "accounts");
          return {
            ...old,
            data: {
              accounts,
            },
          };
        }
      );
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
