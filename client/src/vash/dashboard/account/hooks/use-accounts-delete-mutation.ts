import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AccountService } from "../services/account.services";
import { usePagination } from "@/vash/store/ui/usePagination";
import { AccountsResponse } from "@/infrastructure/interfaces/account.response";
import { toast } from "sonner";

export const useAccountsDeleteMutation = () => {
  const { page, limit, search } = usePagination();
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

        // Actualizar los datos de la página actual
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

        // Actualizar todas las páginas anteriores
        for (let i = page - 1; i > 0; i--) {
          const prevPageKey = ["accounts", { page: i, limit, search }];
          const prevPageData =
            queryClient.getQueryData<AccountsResponse>(prevPageKey);

          if (prevPageData) {
            queryClient.setQueryData(prevPageKey, {
              ...prevPageData,
              meta: {
                ...prevPageData.meta,
                total: previousData.meta.total - ids.length,
                totalPages: Math.ceil(
                  (previousData.meta.total - ids.length) /
                    previousData.meta.limit
                ),
              },
            });
          }
        }
      }

      return { previousData, queryKey };
    },
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts", { page, limit, search }],
      });
    },
    onSuccess: (_, ids, context) => {
      const queryKey = ["accounts", { page, limit, search }];

      const { previousData } = context;
      if (ids.length < context.previousData!.data.accounts.length) {
        if (previousData) {
          const accountIds = new Set(ids);
          const updatedAccounts = previousData.data.accounts.filter(
            (account) => !accountIds.has(account.id!)
          );

          // Actualizar los datos de la página actual
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

          // Actualizar todas las páginas anteriores
          // for (let i = page - 1; i > 0; i--) {
          //   const prevPageKey = ["accounts", { page: i, limit, search }];
          //   const prevPageData =
          //     queryClient.getQueryData<AccountsResponse>(prevPageKey);

          //   if (prevPageData) {
          //     queryClient.setQueryData(prevPageKey, {
          //       ...prevPageData,
          //       meta: {
          //         ...prevPageData.meta,
          //         total: previousData.meta.total - ids.length,
          //         totalPages: Math.ceil(
          //           (previousData.meta.total - ids.length) /
          //             previousData.meta.limit
          //         ),
          //       },
          //     });
          //   }
          // }
        }
      }
      toast.success("Accounts deleted successfully");
    },
  });

  return mutation;
};
