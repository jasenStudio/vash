import { create, StateCreator } from "zustand";

import { devtools, persist } from "zustand/middleware";
import { AuthStatus } from "@/infrastructure/interfaces/auth.status";
import { User } from "@/domain/entities/user";
import { AuthService } from "@/vash/auth/services/auth.services";

interface AuthState {
  status: AuthStatus;
  user?: User;
  token?: string;
  msgError?: string;
}
interface Actions {
  login: (user_name: string, password: string) => Promise<boolean>;
  checkStatusAuth: () => Promise<void>;
  register: (payload: User) => Promise<boolean>;
  clearMessage: () => void;
  logout: () => void;
}
const clearAuthStorage = () => {
  localStorage.removeItem("auth-token");
  localStorage.removeItem("auth-token-expiration");
};

const storeApi: StateCreator<AuthState & Actions> = (set) => ({
  status: "checking",
  user: undefined,
  token: undefined,
  msgError: undefined,
  login: async (user_name: string, password: string) => {
    try {
      const { data, token } = await AuthService.login(user_name, password);
      set({
        user: data.user,
        status: "authenticated",
        token: token,
        msgError: undefined,
      });

      return true;
    } catch (error) {
      const ParseError = error || JSON.parse((error as Error).message);
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
      const storageToken = localStorage.getItem("auth-token");
      const expiration = localStorage.getItem("auth-token-expiration");

      if (!storageToken || !expiration) {
        set({ status: "unauthenticated", token: undefined, user: undefined });
        return;
      }

      const expirationDate = new Date(expiration);
      const currentDate = new Date();
      const timeRemaining = expirationDate.getTime() - currentDate.getTime();

      if (timeRemaining > 300000) {
        set((state) => ({
          status: "authenticated",
          user: state.user,
          token: state.token,
        }));
        return;
      }

      const { data, token } = await AuthService.checkStatusAuth();
      set({
        status: "authenticated",
        user: data.user,
        token: token,
      });
    } catch (error) {
      set({
        status: "unauthenticated",
        token: undefined,
        user: undefined,
        msgError: "Token invalido",
      });
      clearAuthStorage();
    }
  },

  register: async (payload: User) => {
    try {
      const { ok } = await AuthService.registerUser({
        ...payload,
      });

      ok && set(() => ({ msgError: "Usuario registrado" }));
      return true;
    } catch (error) {
      console.log((error as Error).message);

      set(() => ({
        status: "unauthenticated",
        token: undefined,
        user: undefined,
        msgError: (error as Error).message,
      }));
      return false;
    }
  },

  clearMessage: () => {
    set(() => ({ msgError: undefined }));
  },
  logout: () => {
    clearAuthStorage();
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
      partialize: (state) => ({ token: state.token, user: state.user }),
    })
  )
);
