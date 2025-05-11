// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { AccountService } from "../services/account.services";
// import { usePaginationStore } from "@/vash/store";
// import { AccountsResponse } from "@/infrastructure/interfaces/account.response";
// import { toast } from "sonner";

// export const useAccountDeleteMutation = () => {
//   const { page, limit, search } = usePaginationStore();
//   const queryClient = useQueryClient();
//   const mutation = useMutation({
//     mutationFn: AccountService.delete,
//     onMutate: async (id) => {
//       const previousData = queryClient.getQueryData<AccountsResponse>([
//         "accounts",
//         { page, limit, search },
//       ]);

//       queryClient.setQueryData(
//         ["accounts", { page, limit, search }],
//         (old: AccountsResponse) => {
//           if (!old) return previousData;
//           return {
//             ...old,
//             data: {
//               accounts: old.data.accounts.filter(
//                 (account) => account.id !== id
//               ),
//             },
//           };
//         }
//       );

//       return { previousData };
//     },
//     onError: (_error, _variables, context) => {
//       queryClient.setQueryData(
//         ["accounts", { page, limit, search }],
//         context?.previousData
//       );
//     },
//     onSuccess: (_, id, context) => {
//       queryClient.setQueryData(
//         ["accounts", { page, limit, search }],
//         (old: AccountsResponse | undefined) => {
//           if (!old) return context?.previousData;

//           return {
//             ...old,
//             data: {
//               accounts: old.data.accounts.filter(
//                 (account) => account.id !== id
//               ),
//             },
//           };
//         }
//       );

//       queryClient.invalidateQueries({
//         queryKey: ["accounts", { page, limit, search }],
//       });

//       toast.success("Account deleted successfully");
//     },
//   });

//   return mutation;
// };

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AccountService } from "../services/account.services";
import { usePaginationStore } from "@/vash/store";
import { AccountsResponse } from "@/infrastructure/interfaces/account.response";
import { toast } from "sonner";

export const useAccountDeleteMutation = () => {
  const { page, limit, search, setPage } = usePaginationStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: AccountService.delete, // Función para eliminar un solo registro
    onMutate: async (id: number) => {
      const queryKey = ["accounts", { page, limit, search }];
      const previousData = queryClient.getQueryData<AccountsResponse>(queryKey);

      if (previousData) {
        // Actualización optimista: eliminar el registro de la caché
        const updatedAccounts = previousData.data.accounts.filter(
          (account) => account.id !== id
        );

        // Calcular el nuevo total y totalPages
        const newTotal = previousData.meta.total - 1;
        const newTotalPages = Math.ceil(newTotal / limit);

        // Actualizar los datos de la página actual
        queryClient.setQueryData(queryKey, {
          ...previousData,
          data: {
            accounts: updatedAccounts,
          },
          meta: {
            ...previousData.meta,
            total: newTotal,
            totalPages: newTotalPages,
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
            if (currentPage + 1 < newTotalPages) {
              moveRecordsToPreviousPage(currentPage + 1);
            }
          }
        };

        // Iniciar el proceso de mover registros
        moveRecordsToPreviousPage(page);

        // Actualizar el totalPages en todas las páginas
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
      // Revertir los cambios en caso de error
      if (context?.previousData) {
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
    onSuccess: () => {
      // Mostrar notificación de éxito
      toast.success("Account deleted successfully");
    },
  });

  return mutation;
};
