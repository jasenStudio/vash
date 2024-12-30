import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

interface PaginationState {
  page: number;
  limit: number;
  totalPage: number;
  search: string;
}

interface Actions {
  setPage: (page: number) => void;
  setTotal: (totalPage: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
}

const storeApi: StateCreator<
  PaginationState & Actions,
  [["zustand/devtools", never]]
> = (set) => ({
  page: 1,
  limit: 5,
  search: "",
  totalPage: 0,
  setPage: (page) => set({ page }, false, "setpage"),
  setLimit: (limit) => set({ limit }),
  setTotal: (totalPage) => set({ totalPage }),
  setSearch: (search) => set({ search }),
});

export const usePaginationStore = create<PaginationState & Actions>()(
  devtools(storeApi, { name: "pagination" })
);
