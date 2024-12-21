import { useMutation } from "@tanstack/react-query";
import { AccountService } from "../services/account.services";

export const useAccountMutation = () => {
  const mutation = useMutation({
    mutationFn: AccountService.store,
    onMutate: () => {},
  });
};
