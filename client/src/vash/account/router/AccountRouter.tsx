import { Routes, Route, Navigate } from "react-router-dom";
import { ListAccountPage } from "../pages/ListAccountPage";
import { AccountLayout } from "../layout/AccountLayout";
export const AccountRouter = () => {
  return (
    <>
      <AccountLayout>
        <Routes>
          <Route path="list" element={<ListAccountPage />} />
          <Route path="/accounts/*" element={<Navigate to="/list" />} />
        </Routes>
      </AccountLayout>
    </>
  );
};
