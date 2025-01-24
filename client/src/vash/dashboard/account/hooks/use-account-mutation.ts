import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AccountService } from "../services/account.services";
import { Account } from "@/domain";
import {
  AccountCreateResponse,
  AccountsResponse,
} from "@/infrastructure/interfaces/account.response";
import { toast } from "sonner";
import { t } from "i18next";
import { useAccountStore } from "@/vash/store";
import { ActionsAccount } from "@/vash/store/account/useAccountStore";

export const useAccountMutation = () => {
  const queryClient = useQueryClient();
  const addAccount = useAccountStore((state) => state.addRecord);
  const getAccount = useAccountStore((state) => state.records);
  const mutation = useMutation({
    mutationFn: AccountService.store,
    onMutate: async (newAccount) => {
      console.log("Mutación optimista iniciada");

      // await queryClient.cancelQueries({
      //   queryKey: ["accounts", { page: 1, limit: 5, search: "" }],
      // });

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
      console.log(optimisticAccount, "optimisticAccount");
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
      const allQueries = queryClient.getQueryCache().findAll();

      console.log(allQueries, "allQueries");

      queryClient.setQueryData(
        ["accounts", { page: 1, limit: 5, search: "" }],
        (old: AccountsResponse) => {
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
            meta: {
              ...old.meta,
              total: old.meta.total + 1,
              totalPages: Math.ceil((old.meta.total + 1) / old.meta.limit),
            },
          };
        }
      );
      addAccount(account, ActionsAccount.create);
      console.log(getAccount, "getAccount");
      toast.success(t("entities.account.success"), { duration: 5000 });
    },
    onError: (error, _variables, context) => {
      //TODO mejorar manipulacion

      const error_account_exist = "account_email";
      const { message } = error;

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

      if (message.includes(error_account_exist)) {
        toast.error(t("errors.account_email_exists"), { duration: 5000 });
        return;
      }

      toast.error("Ops hubo un error al crear la cuenta", { duration: 5000 });
    },
  });

  return mutation;
};

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
