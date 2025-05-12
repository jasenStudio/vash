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
import { useTranslation } from "react-i18next";

export const AlertDialogAccount = memo(() => {
  const { t } = useTranslation();
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
          <AlertDialogTitle>
            {t("entities.account.confirmAccountDeletion")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("entities.account.accountDeletionWarning")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            {t("common.close")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            className="bg-button-primary text-white hover:bg-button-primary-foreground"
          >
            {t("common.continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
