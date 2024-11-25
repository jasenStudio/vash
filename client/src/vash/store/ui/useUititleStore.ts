import { create, StateCreator } from "zustand";

interface UiTitleState {
  title: string;
}

interface Actions {
  setTitle: (title: string) => void;
}

const storeApi: StateCreator<UiTitleState & Actions> = (set) => ({
  title: "Menu",
  setTitle: (title: string) => set({ title: title }),
});

export const useUiTitleStore = create<UiTitleState & Actions>()(storeApi);
