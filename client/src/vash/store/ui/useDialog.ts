import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

type DialogType = "account" | "subscription" | null;
type ActionType = "create" | "update" | "show" | null;

interface DialogProps {
  isOpen: boolean;
  data: Record<string, unknown>;
  dialogType: DialogType;
  actionType: ActionType;
}

interface DialogActions {
  setData(data: any): void;
  setDialogType(type: DialogType): void;
  setActionType(type: ActionType): void;
  onOpen(type: DialogType, actionType: ActionType): void;
  onClose: () => void;
}

const storeApi: StateCreator<DialogProps & DialogActions> = (set) => ({
  actionType: null,
  data: {},
  dialogType: null,
  isOpen: false,
  onClose: () =>
    set({ isOpen: false, dialogType: null, actionType: null, data: {} }),
  onOpen: (type, actionType) =>
    set({ isOpen: true, dialogType: type, actionType: actionType }),
  setData: (data) => set({ data: { data } }),
  setActionType: (type) => set({ actionType: type }),
  setDialogType: (type) => set({ dialogType: type }),
});

export const useDialog = create<DialogProps & DialogActions>()(
  devtools(storeApi, { name: "DialogStore" })
);
