// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { AccountService } from "../services/account.services";
// import { AccountsResponse } from "@/infrastructure/interfaces/account.response";
// import { toast } from "sonner";
// import { usePaginationStore } from "@/vash/store/ui/usePaginationStore";
// import { useAccountStore } from "@/vash/store";
// import { ActionsAccount } from "@/vash/store/account/useAccountStore";
// import { Account } from "@/domain";

// export const useAccountsDeleteMutation = () => {
//   const { page, limit, search } = usePaginationStore();
//   const setAction = useAccountStore((state) => state.setAction);
//   const queryClient = useQueryClient();

//   const mutation = useMutation({
//     mutationKey: ["deleteAccount"],
//     mutationFn: AccountService.deleteAccountsBatch,
//     onMutate: async (ids: number[]) => {
//       const queryKey = ["accounts", { page, limit, search }];
//       const previousData = queryClient.getQueryData<AccountsResponse>(queryKey);

//       if (previousData) {
//         const accountIds = new Set(ids);
//         const updatedAccounts = previousData.data.accounts.filter(
//           (account) => !accountIds.has(account.id!)
//         );

//         // Actualizar los datos de la página actual
//         queryClient.setQueryData(queryKey, {
//           ...previousData,
//           data: {
//             accounts: updatedAccounts,
//           },
//           meta: {
//             ...previousData.meta,
//             total: previousData.meta.total - ids.length,
//             totalPages: Math.ceil(
//               (previousData.meta.total - ids.length) / previousData.meta.limit
//             ),
//           },
//         });

//         // Obtener el número total de páginas
//         const totalPages = Math.ceil(
//           (previousData.meta.total - ids.length) / previousData.meta.limit
//         );

//         // Actualizar todas las páginas anteriores y posteriores
//         for (let i = 1; i <= totalPages; i++) {
//           const pageKey = ["accounts", { page: i, limit, search }];
//           const pageData = queryClient.getQueryData<AccountsResponse>(pageKey);

//           if (pageData) {
//             queryClient.setQueryData(pageKey, {
//               ...pageData,
//               meta: {
//                 ...pageData.meta,
//                 total: previousData.meta.total - ids.length,
//                 totalPages: totalPages,
//               },
//             });
//           }
//         }

//         /* Update next pageData */

//         const pageKey = ["accounts", { page: page + 1, limit, search }];
//         const pageData = queryClient.getQueryData<AccountsResponse>(pageKey);

//         console.log(pageData, "pageData");
//         console.log(ids.length, "ids.length");
//         if (pageData) {
//           const { data } = pageData as AccountsResponse;
//           let accounts_data = data.accounts;
//           accounts_data = accounts_data.slice(ids.length);

//           console.log(accounts_data, "accounts establenciendo");
//           console.log(pageData, "pageData no debe tener accounts");
//           queryClient.setQueryData(pageKey, {
//             ...pageData,
//             data: {
//               accounts: accounts_data,
//             },
//             meta: {
//               ...pageData.meta,
//               total: previousData.meta.total - ids.length,
//               totalPages: totalPages,
//             },
//           });
//         }
//       }

//       return { previousData, queryKey };
//     },
//     onError: (_error, _variables, context) => {
//       if (context?.previousData) {
//         queryClient.setQueryData(context.queryKey, context.previousData);
//       }
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["accounts", { page, limit, search }],
//       });
//     },
//     onSuccess: (_, ids, context) => {
//       const queryKey = ["accounts", { page, limit, search }];

//       const { previousData } = context;
//       if (ids.length < context.previousData!.data.accounts.length) {
//         if (previousData) {
//           const accountIds = new Set(ids);
//           const updatedAccounts = previousData.data.accounts.filter(
//             (account) => !accountIds.has(account.id!)
//           );

//           // Actualizar los datos de la página actual
//           queryClient.setQueryData(queryKey, {
//             ...previousData,
//             data: {
//               accounts: updatedAccounts,
//             },
//             meta: {
//               ...previousData.meta,
//               total: previousData.meta.total - ids.length,
//               totalPages: Math.ceil(
//                 (previousData.meta.total - ids.length) / previousData.meta.limit
//               ),
//             },
//           });

//           // Obtener el número total de páginas
//           const totalPages = Math.ceil(
//             (previousData.meta.total - ids.length) / previousData.meta.limit
//           );

//           // Actualizar todas las páginas anteriores y posteriores
//           for (let i = 1; i <= totalPages; i++) {
//             const pageKey = ["accounts", { page: i, limit, search }];
//             const pageData =
//               queryClient.getQueryData<AccountsResponse>(pageKey);

//             if (pageData) {
//               queryClient.setQueryData(pageKey, {
//                 ...pageData,
//                 meta: {
//                   ...pageData.meta,
//                   total: previousData.meta.total - ids.length,
//                   totalPages: totalPages,
//                 },
//               });
//             }
//           }

//           const pageKey = ["accounts", { page: page + 1, limit, search }];
//           const pageData = queryClient.getQueryData<AccountsResponse>(pageKey);

//           console.log(pageData, "pageData");
//           console.log(ids.length, "ids.length");
//           if (pageData) {
//             const { data } = pageData as AccountsResponse;
//             let accounts_data = data.accounts;
//             accounts_data = accounts_data.slice(ids.length);

//             console.log(accounts_data, "accounts establenciendo");
//             console.log(pageData, "pageData no debe tener accounts");
//             queryClient.setQueryData(pageKey, {
//               ...pageData,
//               data: {
//                 accounts: accounts_data,
//               },
//               meta: {
//                 ...pageData.meta,
//                 total: previousData.meta.total - ids.length,
//                 totalPages: totalPages,
//               },
//             });
//           }
//         }
//       }

//       setAction(ActionsAccount.delete);
//       toast.success("Accounts deleted successfully");
//     },
//   });

//   return mutation;
// };

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AccountService } from "../services/account.services";
import { AccountsResponse } from "@/infrastructure/interfaces/account.response";
import { toast } from "sonner";
import { usePaginationStore } from "@/vash/store/ui/usePaginationStore";
import { useAccountStore } from "@/vash/store";
import { ActionsAccount } from "@/vash/store/account/useAccountStore";

export const useAccountsDeleteMutation = () => {
  const { page, limit, search, setPage, setTotal } = usePaginationStore();
  const setAction = useAccountStore((state) => state.setAction);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["deleteAccount"],
    mutationFn: AccountService.deleteAccountsBatch,
    onMutate: async (ids: number[]) => {
      const queryKey = ["accounts", { page, limit, search }];
      const previousData = queryClient.getQueryData<AccountsResponse>(queryKey);

      if (previousData) {
        const accountIds = new Set(ids);
        const updatedAccounts = previousData.data.accounts.filter(
          (account) => !accountIds.has(account.id!)
        );

        const newTotal = previousData.meta.total - ids.length;
        const newTotalPages = Math.ceil(newTotal / limit);

        // Actualizar los datos de la página actual de manera optimista
        queryClient.setQueryData(queryKey, {
          ...previousData,
          data: {
            accounts: updatedAccounts,
          },
          meta: {
            ...previousData.meta,
            total: previousData.meta.total - ids.length,
            totalPages: Math.ceil(
              (previousData.meta.total - ids.length) / previousData.meta.limit
            ),
          },
        });

        // Función para mover registros de la página siguiente a la actual
        const moveRecordsToPreviousPage = (currentPage: number) => {
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

          if (currentPageData && nextPageData) {
            // Calcular cuántos elementos mover para completar el límite de la página actual
            const itemsNeeded = limit - currentPageData.data.accounts.length;
            const itemsToMove = Math.min(
              itemsNeeded,
              nextPageData.data.accounts.length
            );

            // Mover registros de la página siguiente a la actual
            const movedAccounts = nextPageData.data.accounts.slice(
              0,
              itemsToMove
            );
            const remainingAccounts =
              nextPageData.data.accounts.slice(itemsToMove);

            // Actualizar la página actual
            queryClient.setQueryData(currentPageKey, {
              ...currentPageData,
              data: {
                accounts: [...currentPageData.data.accounts, ...movedAccounts],
              },
            });

            // Actualizar la página siguiente
            queryClient.setQueryData(nextPageKey, {
              ...nextPageData,
              data: {
                accounts: remainingAccounts,
              },
            });

            // Si hay más páginas, repetir el proceso
            if (currentPage + 1 < previousData.meta.totalPages) {
              moveRecordsToPreviousPage(currentPage + 1);
            }
          }
        };

        // Iniciar el proceso de mover registros
        moveRecordsToPreviousPage(page);

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
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        // Revertir los cambios en caso de error
        queryClient.setQueryData(
          ["accounts", { page, limit, search }],
          context.previousData
        );
      }
    },
    onSettled: () => {
      // Invalidar la página actual para forzar un re-fetch
      queryClient
        .invalidateQueries({
          queryKey: ["accounts", { page, limit, search }],
        })
        .then(() => {
          // Verificar si la página actual está vacía
          const currentData = queryClient.getQueryData<AccountsResponse>([
            "accounts",
            { page, limit, search },
          ]);

          if (
            Array.isArray(currentData?.data.accounts) &&
            currentData.data.accounts.length === 0 &&
            page > 1
          ) {
            setPage(page - 1); // Redirigir a la página anterior
          }
        });
    },
    onSuccess: (_, ids) => {
      // Mostrar notificación de éxito
      toast.success(`${ids.length} accounts deleted successfully`);

      // Actualizar la acción en el store
      setAction(ActionsAccount.delete);
    },
  });

  return mutation;
};
