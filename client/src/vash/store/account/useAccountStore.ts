import { Account } from "@/domain";
import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

interface AccountState {
  records: Map<string, any>;
}

interface Actions {
  addRecord: (account: Partial<Account>) => void;
  getRecord: (id: string) => any;
  clearRecords: () => void;
}

const storeApi: StateCreator<
  AccountState & Actions,
  [["zustand/devtools", never]]
> = (set) => ({
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
  clearRecords: () => set({ records: new Map() }, false, "clearRecords"),
});

export const useAccountStore = create<AccountState & Actions>()(
  devtools(storeApi, { name: "account" })
);
