import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

export enum ActionsAccount {
  create = "create",
  update = "update",
  delete = "delete",
}

interface LikeAccount {
  id?: number;
  account_email?: string;
  status?: boolean;
  user_id?: number;
  overridingAccountId?: number;
  created_at?: string;
  updated_at?: string;
}
interface AccountState {
  records: Map<string, any>;
  actionsCrud: ActionsAccount | null;
}

interface Actions {
  addRecord: (account: LikeAccount, action: ActionsAccount) => void;
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
  addRecord: (account: LikeAccount, action: ActionsAccount) =>
    set(
      (state) => {
        state.records.set(String(account.id!), account);
        state.actionsCrud = action;

        return { records: state.records };
      },
      false,
      "addRecord"
    ),
  getRecord: (id: string) =>
    set((state) => state.records.get(id), false, "getRecord"),
  setAction: (action: ActionsAccount) => {
    set({ actionsCrud: action }, false, "setAction");
  },
  clearRecords: () => set({ records: new Map() }, false, "clearRecords"),
});

export const useAccountStore = create<AccountState & Actions>()(
  devtools(storeApi, { name: "account" })
);
