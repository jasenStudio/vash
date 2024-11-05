import { Navigate, Route, Routes } from "react-router-dom";
import { AuthRouter } from "../auth/router/AuthRouter";

import { useEffect } from "react";
import { useAuthStore } from "../store/auth/useAuthStore";
import { AccountRouter } from "../account/router/AccountRouter";

export const AppRoutes = () => {
  const checkStatusAuth = useAuthStore((state) => state.checkStatusAuth);
  const current_status = useAuthStore((state) => state.status);

  useEffect(() => {
    checkStatusAuth();
  }, []);

  if (current_status === "checking") {
    return <h3>Cargando...</h3>;
  }
  return (
    <>
      {current_status === "unauthenticated" ? (
        <>
          <Routes>
            <Route path="/*" element={<AuthRouter />} />

            <Route path="/*" element={<Navigate to="/sign-in" />} />
          </Routes>
        </>
      ) : (
        <>
          <Routes>
            <Route path="/accounts/*" element={<AccountRouter />} />
            <Route path="/*" element={<Navigate to="/accounts/list" />} />
          </Routes>
        </>
      )}
    </>
  );
};
