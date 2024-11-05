import { AuthLayout } from "../layout/AuthLayout";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";

export const AuthRouter = () => {
  return (
    <AuthLayout>
      <Routes>
        <Route path="sign-in" element={<LoginPage />} />
        <Route path="sign-up" element={<RegisterPage />} />

        <Route path="/*" element={<Navigate to="/sign-in" />} />
      </Routes>
    </AuthLayout>
  );
};
