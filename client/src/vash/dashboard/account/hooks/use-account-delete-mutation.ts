import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AccountService } from "../services/account.services";
import { usePaginationStore } from "@/vash/store";
import { AccountsResponse } from "@/infrastructure/interfaces/account.response";
import { toast } from "sonner";

export const useAccountDeleteMutation = () => {
  const { page, limit, search } = usePaginationStore();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: AccountService.delete,
    onMutate: async (id) => {
      const previousData = queryClient.getQueryData<AccountsResponse>([
        "accounts",
        { page, limit, search },
      ]);

      queryClient.setQueryData(
        ["accounts", { page, limit, search }],
        (old: AccountsResponse) => {
          if (!old) return previousData;
          return {
            ...old,
            data: {
              accounts: old.data.accounts.filter(
                (account) => account.id !== id
              ),
            },
          };
        }
      );

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        ["accounts", { page, limit, search }],
        context?.previousData
      );
    },
    onSuccess: (_, id, context) => {
      queryClient.setQueryData(
        ["accounts", { page, limit, search }],
        (old: AccountsResponse | undefined) => {
          if (!old) return context?.previousData;

          return {
            ...old,
            data: {
              accounts: old.data.accounts.filter(
                (account) => account.id !== id
              ),
            },
          };
        }
      );

      // queryClient.invalidateQueries({
      //   queryKey: ["accounts", { page, limit, search }],
      // });

      toast.success("Account deleted successfully");
    },
  });

  return mutation;
};
