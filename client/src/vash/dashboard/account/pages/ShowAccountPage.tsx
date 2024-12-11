import { useTitle } from "@/hooks/use-title";
// import { useUiTitleStore } from "@/vash/store/ui/useUititleStore";
// import { useEffect } from "react";
import { Link } from "react-router-dom";

export const ShowAccountPage = () => {
  useTitle("Detalle pagina");

  return (
    <div>
      ShowAccountPage
      <Link to="/accounts/">LIst</Link>
    </div>
  );
};
