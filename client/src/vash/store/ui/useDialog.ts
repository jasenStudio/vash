import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

export type DialogType = "account" | "subscription" | null;
export type ActionType = "create" | "update" | "show" | "delete" | null;
export type TypeComponent = "dialog" | "alert" | null;

interface DialogProps {
  isOpen: boolean;
  data: Record<string, unknown>;
  typeComponent: TypeComponent;
  dialogType: DialogType;
  actionType: ActionType;
}

interface DialogActions {
  setData(data: any): void;
  setDialogType(type: DialogType): void;
  setActionType(type: ActionType): void;
  setTypeComponent(type: TypeComponent): void;
  onOpen(
    typeComponent: TypeComponent,
    dialogType: DialogType,
    actionType: ActionType
  ): void;
  onClose: () => void;
}

const storeApi: StateCreator<DialogProps & DialogActions> = (set) => ({
  actionType: null,
  data: {},
  typeComponent: null,
  dialogType: null,
  isOpen: false,
  onClose: () =>
    set({
      isOpen: false,
      typeComponent: null,
      dialogType: null,
      actionType: null,
      data: {},
    }),
  onOpen: (typeComponent = null, dialogType = null, actionType = null) =>
    set({
      isOpen: true,
      typeComponent: typeComponent,
      dialogType: dialogType,
      actionType: actionType,
    }),
  setData: (data) => set({ data }),
  setActionType: (type) => set({ actionType: type }),
  setDialogType: (type) => set({ dialogType: type }),
  setTypeComponent: (type) => set({ typeComponent: type }),
});

export const useDialog = create<DialogProps & DialogActions>()(
  devtools(storeApi, { name: "DialogStore" })
);
