import { create, StateCreator } from "zustand";

import { devtools, persist } from "zustand/middleware";
import { AuthStatus } from "@/infrastructure/interfaces/auth.status";
import { User } from "@/domain/entities/user";
import { AuthService } from "@/vash/auth/services/auth.services";
import { CloudFog } from "lucide-react";

interface AuthState {
  status: AuthStatus;
  user?: User;
  msgError?: string;
}
interface Actions {
  login: (user_name: string, password: string) => Promise<boolean>;
  checkStatusAuth: () => Promise<void>;
  register: (payload: User) => Promise<boolean>;
  clearMessage: () => void;
  logout: () => void;
}

const storeApi: StateCreator<AuthState & Actions> = (set) => ({
  status: "checking",
  user: undefined,
  token: undefined,
  msgError: undefined,
  login: async (user_name: string, password: string) => {
    try {
      const { data } = await AuthService.login(user_name, password);
      set({
        user: data.user,
        status: "authenticated",
        msgError: undefined,
      });

      return true;
    } catch (error) {
      set(() => ({
        status: "unauthenticated",
        user: undefined,
        msgError: (error as Error).message,
      }));
      return false;
    }
  },

  checkStatusAuth: async () => {
    try {
      const { data, ok } = await AuthService.checkStatusAuth();
      console.log(data);
      if (ok) {
        set({
          status: "authenticated",
          user: data.user,
        });
      }
    } catch (error) {
      set({
        status: "unauthenticated",
        user: undefined,
        msgError: "Token invalido",
      });
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
  logout: async () => {
    try {
      const { message } = await AuthService.logout();

      set(() => ({
        status: "unauthenticated",
        user: undefined,
        msgError: message,
      }));
    } catch (error) {
      console.log((error as Error).message);
    }
  },
});
export const useAuthStore = create<AuthState & Actions>()(
  devtools(
    persist(storeApi, {
      name: "auth-token",
      partialize: (state) => ({ user: state.user }),
    })
  )
);
