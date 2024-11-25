import { Button } from "@/components/ui/button";
import { useTitle } from "@/hooks/use-title";
import { useAuthStore } from "@/vash/store/auth/useAuthStore";
import { Link } from "react-router-dom";

export const ListAccountPage = () => {
  const logout = useAuthStore((state) => state.logout);
  useTitle("Listar cuentas");
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
      <Link to="/accounts/show">Show</Link>
    </div>
  );
};
