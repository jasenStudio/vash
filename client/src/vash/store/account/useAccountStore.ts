import { Account } from "@/domain";
import { se } from "date-fns/locale";
import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

export enum ActionsAccount {
  create = "create",
  update = "update",
  delete = "delete",
}
interface AccountState {
  records: Map<string, any>;
  actionsCrud: ActionsAccount | null;
}

interface Actions {
  addRecord: (account: Partial<Account>, action: ActionsAccount) => void;
  setAction: (action: ActionsAccount) => void;
  getRecord: (id: string) => any;
  clearRecords: () => void;
}

const storeApi: StateCreator<
  AccountState & Actions,
  [["zustand/devtools", never]]
> = (set) => ({
  actionsCrud: null,
  records: new Map(),
  addRecord: (account: Partial<Account>) =>
    set(
      (state) => {
        state.records.set(String(account.id!), account);
        console.log(account, "accountValueStore");
        return { records: state.records };
      },
      false,
      "addRecord"
    ),
  getRecord: (id: string) =>
    set((state) => state.records.get(id), false, "getRecord"),
  setAction: (action: ActionsAccount) => {
    console.log(action, "action desde el store");
    set({ actionsCrud: action }, false, "setAction");
  },
  clearRecords: () => set({ records: new Map() }, false, "clearRecords"),
});

export const useAccountStore = create<AccountState & Actions>()(
  devtools(storeApi, { name: "account" })
);
