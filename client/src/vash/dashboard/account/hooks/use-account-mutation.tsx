import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AccountService } from "../services/account.services";
import { Account } from "@/domain";
import { AccountsResponse } from "@/infrastructure/interfaces/account.response";

export const useAccountMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: AccountService.store,

    onMutate: async (newAccount) => {
      console.log("Mutación optimista iniciada");

      await queryClient.cancelQueries({
        queryKey: ["accounts", { page: 1, limit: 5, search: "" }],
      });

      const previousData = queryClient.getQueryData<AccountsResponse>([
        "accounts",
        { page: 1, limit: 5, search: "" },
      ]);

      const optimisticAccount: Partial<Account> = {
        id: Math.random(),
        account_email: newAccount,
        created_at: new Date().toISOString(), // Fecha válida
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

      return { previousData };
    },
    onError: (error, newAccount, context) => {
      console.error("Error en la mutación", error);
      if (context?.previousData) {
        queryClient.setQueryData(
          ["accounts", { page: 1, limit: 5, search: "" }],
          context.previousData
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts", { page: 1, limit: 5, search: "" }],
      });
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
