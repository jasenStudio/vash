import { create, StateCreator } from "zustand";

import { devtools, persist } from "zustand/middleware";
import { AuthStatus } from "@/infrastructure/interfaces/auth.status";
import { User } from "@/domain/entities/user";
import { AuthService } from "@/vash/services/auth.services";

interface AuthState {
  status: AuthStatus;
  user?: User;
  token?: string;
  msgError?: string;
}
interface Actions {
  login: (user_name: string, password: string) => Promise<boolean>;
  checkStatusAuth: () => Promise<void>;
  logout: () => void;
}

const storeApi: StateCreator<AuthState & Actions> = (set, get) => ({
  status: "checking",
  user: undefined,
  token: undefined,
  msgError: undefined,
  login: async (user_name: string, password: string) => {
    try {
      const { user, token } = await AuthService.login(user_name, password);
      set({
        user: user,
        status: "authenticated",
        token: token,
        msgError: undefined,
      });
      return true;
    } catch (error) {
      const ParseError = JSON.parse((error as Error).message);
      set(() => ({
        status: "unauthenticated",
        token: undefined,
        user: undefined,
        msgError: ParseError.message,
      }));
      return false;
    }
  },
  checkStatusAuth: async () => {
    try {
      const storage = localStorage.getItem("auth-token");

      const data = await AuthService.checkStatusAuth();
      set({
        status: "authenticated",
        user: data.user,
        token: data.token,
      });
      console.log(get().status, "current-state");
    } catch (error) {
      set({
        status: "unauthenticated",
        token: undefined,
        user: undefined,
      });
    }
  },
  logout: () => {
    localStorage.clear();
    set(() => ({
      status: "unauthenticated",
      token: undefined,
      user: undefined,
      msgError: undefined,
    }));
  },
});
export const useAuthStore = create<AuthState & Actions>()(
  devtools(
    persist(storeApi, {
      name: "auth-token",
      partialize: (state) => ({ token: state.token }),
    })
  )
);
