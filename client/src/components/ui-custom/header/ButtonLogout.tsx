import { useAuthStore } from "@/vash/store/auth/useAuthStore";
import { LogOut } from "lucide-react";
import { memo } from "react";

import { queryClient } from "@/vash/providers/tanstack-provider";

export const ButtonLogoutCustom = memo(() => {
  const logout = useAuthStore((state) => state.logout);

  return (
    <button
      className="font-semibold rounded-[5px] mx-5"
      onClick={() => {
        queryClient.clear();
        logout();
      }}
    >
      <LogOut className="inline-block mr-1" size={35} />
    </button>
  );
});
