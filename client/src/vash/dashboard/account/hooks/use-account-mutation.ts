import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AccountService } from "../services/account.services";
import { Account } from "@/domain";
import { AccountsResponse } from "@/infrastructure/interfaces/account.response";
import { toast } from "sonner";

import { usePaginationStore } from "@/vash/store";

export const useAccountMutation = () => {
  const queryClient = useQueryClient();
  const { page, limit, search } = usePaginationStore();

  //***Store Pagination *****/
  const pageCurrent = usePaginationStore((state) => state.limit);

  const mutation = useMutation<any, Error, any>({
    mutationFn: AccountService.store,
    onMutate: async (newAccount) => {
      const queryKey = ["accounts", { page: 1, limit, search: "" }];

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<AccountsResponse>(queryKey);

      if (previousData) {
        // 1. Crear el nuevo registro optimista
        const optimisticAccount: Partial<Account> = {
          id: Math.random(),
          account_email: newAccount,
          created_at: new Date().toISOString(),
        };

        // 2. Actualizar la primera página con el nuevo registro
        const updatedAccounts = [
          optimisticAccount,
          ...previousData.data.accounts,
        ];
        const newTotal = previousData.meta.total + 1;
        const newTotalPages = Math.ceil(newTotal / limit);

        queryClient.setQueryData(queryKey, {
          ...previousData,
          data: { accounts: updatedAccounts },
          meta: {
            ...previousData.meta,
            total: newTotal,
            totalPages: newTotalPages,
          },
        });

        // 3. Función para redistribuir registros
        const redistributeRecords = (currentPage: number) => {
          const currentPageKey = [
            "accounts",
            { page: currentPage, limit, search },
          ];
          const nextPageKey = [
            "accounts",
            { page: currentPage + 1, limit, search },
          ];

          const currentPageData =
            queryClient.getQueryData<AccountsResponse>(currentPageKey);
          const nextPageData =
            queryClient.getQueryData<AccountsResponse>(nextPageKey);

          if (!currentPageData) return;

          // Si excede el límite o es la última página y necesita una nueva
          if (currentPageData.data.accounts.length > limit) {
            const accountsToMove = currentPageData.data.accounts.slice(limit);
            const remainingAccounts = currentPageData.data.accounts.slice(
              0,
              limit
            );

            // Actualizar página actual
            queryClient.setQueryData(currentPageKey, {
              ...currentPageData,
              data: { accounts: remainingAccounts },
            });

            // Manejar página siguiente
            if (currentPage < newTotalPages) {
              // Si ya existe la página siguiente
              if (nextPageData) {
                queryClient.setQueryData(nextPageKey, {
                  ...nextPageData,
                  data: {
                    accounts: [
                      ...accountsToMove,
                      ...nextPageData.data.accounts,
                    ],
                  },
                });
              } else {
                // Crear nueva página si no existe
                queryClient.setQueryData(nextPageKey, {
                  ...currentPageData,
                  data: { accounts: accountsToMove },
                  meta: {
                    ...currentPageData.meta,
                    currentPage: currentPage + 1,
                  },
                });
              }

              // Verificar si la página siguiente ahora excede el límite
              const updatedNextData =
                queryClient.getQueryData<AccountsResponse>(nextPageKey);
              if (updatedNextData!.data.accounts.length > limit) {
                redistributeRecords(currentPage + 1);
              }
            }
          }
        };

        // 4. Iniciar la redistribución desde la primera página
        redistributeRecords(1);

        // 5. Actualizar metadata en todas las páginas
        for (let i = 1; i <= newTotalPages; i++) {
          const pageKey = ["accounts", { page: i, limit, search }];
          const pageData = queryClient.getQueryData<AccountsResponse>(pageKey);

          if (pageData) {
            queryClient.setQueryData(pageKey, {
              ...pageData,
              meta: {
                ...pageData.meta,
                total: newTotal,
                totalPages: newTotalPages,
              },
            });
          }
        }
      }

      return { previousData };
    },
    // ... otros handlers (onError, onSettled)

    onError: (_error, _variables, context: any) => {
      toast.error("An error occurred while creating the account");
    },
    onSettled: () => {},
    onSuccess: (result, variables, context) => {
      toast.success("Account added successfully");
    },
  });

  return mutation;
};
