import React, { Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useAuthStore } from "../store/auth/useAuthStore";
import { LayoutRoot } from "../Layout";

const AuthRouter = React.lazy(() => import("../auth/router/AuthRouter"));
const AccountRouter = React.lazy(
  () => import("../dashboard/account/router/AccountRouter")
);

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
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        {current_status === "unauthenticated" ? (
          <>
            <Route path="/*" element={<AuthRouter />} />
            <Route path="/*" element={<Navigate to="/sign-in" />} />
          </>
        ) : (
          <>
            <Route element={<LayoutRoot />}>
              <Route path="/accounts/*" element={<AccountRouter />} />
              <Route path="/*" element={<Navigate to="/accounts" />} />
            </Route>
          </>
        )}
      </Routes>
    </Suspense>
  );
};
