import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

interface PaginationState {
  page: number;
  limit: number;
  search: string;
}

interface Actions {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
}

const storeApi: StateCreator<PaginationState & Actions> = (set) => ({
  page: 1,
  limit: 5,
  search: "",
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
  setSearch: (search) => set({ search }),
});

export const usePagination = create<PaginationState & Actions>()(
  devtools(storeApi)
);
