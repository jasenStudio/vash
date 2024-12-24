import { useDialog } from "@/vash/store/ui/useDialog";
import { Account } from "@/domain";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Props {
  formAccountSchema: z.ZodObject<{
    account_email: z.ZodString;
    status: z.ZodDefault<z.ZodString>;
  }>;
}
export const useAccountDialog = ({ formAccountSchema }: Props) => {
  const isOpen = useDialog((state) => state.isOpen);
  const onClose = useDialog((state) => state.onClose);
  const dialogType = useDialog((state) => state.dialogType);
  const actionType = useDialog((state) => state.actionType);

  const form = useForm<z.infer<typeof formAccountSchema>>({
    resolver: zodResolver(formAccountSchema),
    defaultValues: {
      account_email: "",
      status: "true",
    },
  });

  const { data: account } = useDialog(
    (state) => state.data as { data: Account }
  );

  useEffect(() => {
    if (actionType === "update" && account) {
      form.reset({
        account_email: account.account_email,
        status: String(account.status),
      });
    } else {
      form.reset({
        account_email: "",
        status: "true",
      });
    }
  }, [actionType]);

  return {
    onClose,
    isOpen,
    dialogType,
    actionType,
    account,
    form,
  };
};
