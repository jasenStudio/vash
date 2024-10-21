import { Route, Routes } from "react-router-dom";
import { AuthRouter } from "../auth/router/AuthRouter";
import { AccountRouter } from "../account/router/AccountRouter";

export const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/*" element={<AuthRouter />} />
        <Route path="/accounts/*" element={<AccountRouter />} />
      </Routes>
    </>
  );
};
