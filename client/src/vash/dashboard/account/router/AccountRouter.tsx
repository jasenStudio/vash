import { Routes, Route, Navigate } from "react-router-dom";

import { AccountLayout } from "../layout/AccountLayout";
import { AnimatePresence } from "framer-motion";
import { AnimatedComponent } from "@/components/ui-custom/AnimatedComponent";
import React, { Suspense } from "react";
import LoaderCustom from "@/components/ui-custom/loader/LoaderCustom";

//** Lazy component */
const ListAccountPage = React.lazy(() => import("../pages/ListAccountPage"));
const ShowAccountPage = React.lazy(() => import("../pages/ShowAccountPage"));

const AccountRouter = () => {
  return (
    <>
      <AccountLayout>
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoaderCustom />}>
            <Routes>
              <Route
                path=""
                element={
                  <AnimatedComponent
                    key={"list-account"}
                    transition={{ duration: 0.5 }}
                  >
                    <ListAccountPage />
                  </AnimatedComponent>
                }
              />
              <Route
                path="show"
                element={
                  <AnimatedComponent
                    key={"show-account"}
                    transition={{ duration: 0.5 }}
                  >
                    <ShowAccountPage />
                  </AnimatedComponent>
                }
              />

              <Route path="/accounts/*" element={<Navigate to="/list" />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </AccountLayout>
    </>
  );
};
export default AccountRouter;
