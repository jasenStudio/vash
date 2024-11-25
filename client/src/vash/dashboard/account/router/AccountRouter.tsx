import { Routes, Route, Navigate } from "react-router-dom";
import { ListAccountPage } from "../pages/ListAccountPage";
import { AccountLayout } from "../layout/AccountLayout";
import { ShowAccountPage } from "../pages/ShowAccountPage";
import { AnimatePresence } from "framer-motion";
import { AnimatedComponent } from "@/components/ui-custom/AnimatedComponent";
export const AccountRouter = () => {
  return (
    <>
      <AccountLayout>
        <AnimatePresence mode="wait">
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
        </AnimatePresence>
      </AccountLayout>
    </>
  );
};
