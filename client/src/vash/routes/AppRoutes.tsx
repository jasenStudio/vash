import { Navigate, Route, Routes } from "react-router-dom";

import { useEffect } from "react";
import { useAuthStore } from "../store/auth/useAuthStore";

import { AuthRouter } from "../auth/router/AuthRouter";
import { AccountRouter } from "../dashboard/account/router/AccountRouter";
import { LayoutRoot } from "../Layout";

export const AppRoutes = () => {
  const checkStatusAuth = useAuthStore((state) => state.checkStatusAuth);
  const current_status = useAuthStore((state) => state.status);
  console.log(current_status);
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
            <Route element={<LayoutRoot />}>
              <Route path="/accounts/*" element={<AccountRouter />} />
              <Route path="/*" element={<Navigate to="/accounts" />} />
            </Route>
          </Routes>
        </>
      )}
    </>
  );
};
