import { Account } from "@/domain";
import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

interface AccountState {
  updateRecords: Map<string, any>;
}

interface Actions {
  addUpdateRecord: (account: Partial<Account>) => void;
  getUpdateRecord: (id: string) => any;
  clearUpdateRecord: () => void;
}

const storeApi: StateCreator<
  AccountState & Actions,
  [["zustand/devtools", never]]
> = (set) => ({
  updateRecords: new Map(),
  addUpdateRecord: (account: Partial<Account>) =>
    set(
      (state) => {
        state.updateRecords.set(String(account.id!), account);
        return { updateRecords: state.updateRecords };
      },
      false,
      "addUpdateRecord"
    ),
  getUpdateRecord: (id: string) =>
    set((state) => state.updateRecords.get(id), false, "getUpdateRecord"),
  clearUpdateRecord: () =>
    set({ updateRecords: new Map() }, false, "clearUpdateRecord"),
});

export const useAccountStore = create<AccountState & Actions>()(
  devtools(storeApi, { name: "account" })
);
