import React, { Suspense } from "react";
import { AuthLayout } from "../layout/AuthLayout";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, Variants } from "framer-motion";
import { AnimatedComponent } from "@/components/ui-custom/AnimatedComponent";
import LoaderCustom from "@/components/ui-custom/loader/LoaderCustom";

const pageTransition: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
};
const LoginPage = React.lazy(() => import("../pages/LoginPage"));
const RegisterPage = React.lazy(() => import("../pages/RegisterPage"));

const AuthRouter = () => {
  const location = useLocation();
  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoaderCustom />}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="sign-in"
              element={
                <AnimatedComponent
                  pageTransition={pageTransition}
                  key={"sign-in"}
                  transition={{ duration: 0.5 }}
                >
                  <LoginPage />
                </AnimatedComponent>
              }
            />
            <Route
              path="sign-up"
              element={
                <AnimatedComponent
                  pageTransition={pageTransition}
                  key={"sign-up"}
                  transition={{ duration: 0.5 }}
                >
                  <RegisterPage />
                </AnimatedComponent>
              }
            />
            <Route path="/*" element={<Navigate to="/sign-in" />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </AuthLayout>
  );
};

export default AuthRouter;
