import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/vash/store/auth/useAuthStore";
import { Link } from "react-router-dom";

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
      <Link to="/accounts/show">Show</Link>
    </div>
  );
};
