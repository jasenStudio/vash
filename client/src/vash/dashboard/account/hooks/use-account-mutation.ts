import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AccountService } from "../services/account.services";
import { Account } from "@/domain";
import { AccountsResponse } from "@/infrastructure/interfaces/account.response";
import { toast } from "sonner";
import { useAccountStore, usePaginationStore } from "@/vash/store";
import { ActionsAccount } from "@/vash/store/account/useAccountStore";

export const useAccountMutation = () => {
  const queryClient = useQueryClient();
  const { page, limit, search } = usePaginationStore();
  const addRecord = useAccountStore((state) => state.addRecord);

  const mutation = useMutation<any, Error, any>({
    mutationFn: AccountService.store,
    onMutate: async (newAccount) => {
      const queryKey = ["accounts", { page: 1, limit, search: "" }];

      let accountToMoveOptimistic: Partial<Account> = {
        account_email: "",
        created_at: "",
        updated_at: "",
        user_id: 0,
      };

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<AccountsResponse>(queryKey);

      if (previousData) {
        // 1. Crear snapshot del estado actual para posible rollback
        const snapshot = {
          pages: {} as Record<number, AccountsResponse>,
          meta: { ...previousData.meta },
        };

        // Capturar estado actual de todas las páginas
        for (let i = 1; i <= previousData.meta.totalPages; i++) {
          const pageKey = ["accounts", { page: i, limit, search }];
          const pageData = queryClient.getQueryData<AccountsResponse>(pageKey);
          if (pageData) {
            snapshot.pages[i] = { ...pageData };
          }
        }

        // 2. Actualización optimista
        const optimisticAccount: Partial<Account> = {
          id: Math.random(),
          account_email: newAccount,
          created_at: new Date().toISOString(),
        };

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

        // 3. Redistribuir registros
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

          const accountsToMove = currentPageData.data.accounts.slice(limit);

          console.log(accountsToMove, "cuentas a mover");

          const remainingAccounts = currentPageData.data.accounts.slice(
            0,
            limit
          );

          //* 1. Agregando nuevo Registro a pagina actual sin cache disponible para la siguiente pagina
          if (
            currentPageData.data.accounts.length > limit &&
            !queryClient.getQueryData(nextPageKey)
          ) {
            queryClient.setQueryData(currentPageKey, {
              ...currentPageData,
              data: { accounts: remainingAccounts },
            });

            accountToMoveOptimistic = { ...accountsToMove[0] };
          } else if (currentPageData.data.accounts.length > limit) {
            //* 2. agregando nuevo registro a pagina actual con cache disponible para todas las paginas
            // Actualizar página actual
            queryClient.setQueryData(currentPageKey, {
              ...currentPageData,
              data: { accounts: remainingAccounts },
            });

            // Manejar página siguiente
            if (currentPage < newTotalPages) {
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

        redistributeRecords(1);

        // 4. Actualizar metadata en todas las páginas
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

        return {
          snapshot,
          optimisticAccount,
          previousData,
          accountToMoveOptimistic,
        };
      }
    },
    onError: (error, _variables, context: any) => {
      // Revertir todos los cambios si hay error
      if (context?.snapshot) {
        // Restaurar páginas individuales
        for (const [page, data] of Object.entries(context.snapshot.pages)) {
          queryClient.setQueryData(
            ["accounts", { page: parseInt(page), limit, search }],
            data
          );
        }

        // Restaurar metadata global en la primera página
        queryClient.setQueryData(
          ["accounts", { page: 1, limit, search: "" }],
          (old) =>
            old && {
              ...old,
              meta: context.snapshot.meta,
            }
        );
      }

      // Mostrar error específico si es de duplicado
      if (
        error.message.includes("duplicate") ||
        error.message.includes("exist")
      ) {
        toast.error("La cuenta ya existe");
      } else {
        toast.error("Error al agregar la cuenta: " + error.message);
      }
    },
    onSuccess: (accountResponse, _variables, context) => {
      const contexto = context as {
        snapshot: any;
        optimisticAccount: Account;
        previousData: AccountsResponse;
        accountToMoveOptimistic: Partial<Account>;
      };

      const { account } = accountResponse.data!;

      console.log(contexto.accountToMoveOptimistic);

      addRecord(
        {
          ...contexto.accountToMoveOptimistic,
          overridingAccountId: account.id,
        },
        ActionsAccount.create
      );

      queryClient.setQueryData(
        ["accounts", { page, limit, search }],
        (old: AccountsResponse) => {
          if (!old) return contexto.previousData;

          const accounts = old.data.accounts.map((cacheAccount) => {
            return cacheAccount.id === contexto.optimisticAccount.id
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

      toast.success("Cuenta agregada exitosamente");
    },
    onSettled: () => {
      // Limpieza adicional si es necesaria
    },
  });

  return mutation;
};
