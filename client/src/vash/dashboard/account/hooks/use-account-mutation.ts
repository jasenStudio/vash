import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AccountService } from "../services/account.services";
import { Account } from "@/domain";
import {
  AccountCreateResponse,
  AccountsResponse,
} from "@/infrastructure/interfaces/account.response";
import { toast } from "sonner";
import { t } from "i18next";

export const useAccountMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: AccountService.store,

    onMutate: async (newAccount) => {
      console.log("Mutación optimista iniciada");

      const previousData = queryClient.getQueryData<AccountsResponse>([
        "accounts",
        { page: 1, limit: 5, search: "" },
      ]);

      const optimisticAccount: Partial<Account> = {
        id: Math.random(),
        account_email: newAccount,
        created_at: String(new Date()),
        status: true,
        // Fecha válida
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
      accountResponse: AccountCreateResponse,
      _variables,
      context
    ) => {
      const { account } = accountResponse.data;
      queryClient.removeQueries({
        queryKey: ["account", context?.optimisticAccount.id],
      });

      queryClient.setQueryData(
        ["accounts", { page: 1, limit: 5, search: "" }],
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
      toast.success(t("entities.account.success"), { duration: 5000 });
    },
    onError: (error, _variables, context) => {
      if (error instanceof Error) {
        const error_account_exist = "El account_email ya está en uso";
        const { message } = error;
        if (message.includes(error_account_exist)) {
          toast.error(t("errors.account_email_exists"), { duration: 5000 });
        }

        queryClient.removeQueries({
          queryKey: ["account", context?.optimisticAccount.id],
        });

        queryClient.setQueryData(
          ["accounts", { page: 1, limit: 5, search: "" }],
          (old: AccountsResponse) => {
            if (!old) return context?.previousData;

            const accounts = old.data.accounts.filter(
              (account) => account.id !== context?.optimisticAccount.id
            );

            return {
              ...old,
              data: {
                accounts,
              },
            };
          }
        );
      } else {
        console.error("Error inesperado en la mutación:", error);
        toast.error(t("errors.account_email_exists"), { duration: 5000 });
      }
    },
  });

  return mutation;

  //* funcional  */
  //   onMutate: async (newAccount) => {
  //     console.log("Mutación optimista iniciada");

  //     await queryClient.cancelQueries({
  //       queryKey: ["accounts", { page: 1, limit: 5, search: "" }],
  //     });

  //     const previousData = queryClient.getQueryData<AccountsResponse>([
  //       "accounts",
  //       { page: 1, limit: 5, search: "" },
  //     ]);

  //     const optimisticAccount: Partial<Account> = {
  //       id: Math.random(),
  //       account_email: newAccount,
  //       created_at: new Date().toISOString(), // Fecha válida
  //     };

  //     queryClient.setQueryData(
  //       ["accounts", { page: 1, limit: 5, search: "" }],
  //       (old: AccountsResponse) => {
  //         if (!old) return previousData;
  //         return {
  //           ...old,
  //           data: {
  //             accounts: [optimisticAccount, ...old.data.accounts],
  //           },
  //         };
  //       }
  //     );

  //     return { previousData };
  //   },
  //   onError: (error, newAccount, context) => {
  //     console.error("Error en la mutación", error);
  //     if (context?.previousData) {
  //       queryClient.setQueryData(
  //         ["accounts", { page: 1, limit: 5, search: "" }],
  //         context.previousData
  //       );
  //     }
  //   },
  //   onSettled: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: ["accounts", { page: 1, limit: 5, search: "" }],
  //     });
  //   },
  // });

  // return mutation;
};
