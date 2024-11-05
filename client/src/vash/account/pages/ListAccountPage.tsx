import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/vash/store/auth/useAuthStore";

export const ListAccountPage = () => {
  const logout = useAuthStore((state) => state.logout);
  return (
    <div>
      ListAccountPage
      <Button
        onClick={() => {
          logout();
        }}
      >
        LOGOUT
      </Button>
    </div>
  );
};
