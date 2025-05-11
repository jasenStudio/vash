import React, { Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useAuthStore } from "../store/auth/useAuthStore";
import { LayoutRoot } from "../Layout";
import LoaderCustom from "@/components/ui-custom/loader/LoaderCustom";

const AuthRouter = React.lazy(() => import("../auth/router/AuthRouter"));
const AccountRouter = React.lazy(
  () => import("../dashboard/account/router/AccountRouter")
);
const SubscriptionRouter = React.lazy(
  () => import("../dashboard/subscription/router/SubscriptionRouter")
);

export const AppRoutes = () => {
  const checkStatusAuth = useAuthStore((state) => state.checkStatusAuth);
  const current_status = useAuthStore((state) => state.status);

  useEffect(() => {
    checkStatusAuth();
  }, []);

  if (current_status === "checking") {
    return <LoaderCustom />;
  }

  return (
    <Suspense fallback={<LoaderCustom />}>
      <Routes>
        {current_status === "unauthenticated" ? (
          <>
            <Route path="/*" element={<AuthRouter />} />
            <Route path="*" element={<Navigate to="/sign-in" />} />
          </>
        ) : (
          <>
            <Route element={<LayoutRoot />}>
              <Route path="/accounts/*" element={<AccountRouter />} />
              <Route path="/subscriptions/*" element={<SubscriptionRouter />} />
              <Route path="*" element={<Navigate to="/accounts" />} />
            </Route>
          </>
        )}
      </Routes>
    </Suspense>
  );
};
