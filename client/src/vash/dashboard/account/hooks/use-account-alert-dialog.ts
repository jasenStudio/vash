import { useDialog } from "@/vash/store/ui/useDialog";

export const useAccountAlertDialog = () => {
  const isOpen = useDialog((state) => state.isOpen);
  const onClose = useDialog((state) => state.onClose);
  const dialogType = useDialog((state) => state.dialogType);
  const actionType = useDialog((state) => state.actionType);
  const typeComponent = useDialog((state) => state.typeComponent);
  const data = useDialog((state) => state.data);

  return { typeComponent, actionType, dialogType, isOpen, onClose, data };
};
