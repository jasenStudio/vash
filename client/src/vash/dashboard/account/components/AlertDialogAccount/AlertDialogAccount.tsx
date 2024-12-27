import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAccountAlertDialog } from "../../hooks/use-account-alert-dialog";
import { useAccountDeleteMutation } from "../../hooks";
import { memo } from "react";
import { toast } from "sonner";
import { useAccountsDeleteMutation } from "../../hooks/use-accounts-delete-mutation";

export const AlertDialogAccount = memo(() => {
  const { actionType, dialogType, isOpen, onClose, typeComponent, data } =
    useAccountAlertDialog();
  const deleteAccountMutation = useAccountDeleteMutation();
  const batchDeleteAccountsMutation = useAccountsDeleteMutation();

  const handleSubmit = () => {
    if (Array.isArray(data)) {
      console.log("array");
      batchDeleteAccountsMutation.mutate(data, {
        onSuccess: () => {
          toast.success("Accounts deleted successfully");
          onClose();
        },
      });
    } else if (!isNaN(+data)) {
      deleteAccountMutation.mutate(+data, {
        onSuccess: () => {
          toast.success("Account deleted successfully");
          onClose();
        },
      });
    }
  };

  const shouldRenderAlertDialog =
    typeComponent === "alert" &&
    dialogType === "account" &&
    actionType === "delete";

  if (!shouldRenderAlertDialog) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            className="bg-button-primary text-white hover:bg-button-primary-foreground"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
