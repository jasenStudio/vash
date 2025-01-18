import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { AnimatedComponent } from "@/components/ui-custom/AnimatedComponent";
import LoaderCustom from "@/components/ui-custom/loader/LoaderCustom";
import SubscriptionLayout from "../layout/SubscriptionLayout";

const ListSubscriptionPage = React.lazy(
  () => import("../pages/ListSubscriptionPage")
);

const SubscriptionRouter = () => {
  return (
    <SubscriptionLayout>
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoaderCustom />}>
          <Routes>
            <Route
              path="list"
              element={
                <AnimatedComponent
                  key={"list-subscription"}
                  transition={{ duration: 0.5 }}
                >
                  <ListSubscriptionPage />
                </AnimatedComponent>
              }
            />

            <Route path="/subscriptions/*" element={<Navigate to="/list" />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </SubscriptionLayout>
  );
};

export default SubscriptionRouter;
