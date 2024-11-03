import "./App.css";
import { Toaster } from "@/components/ui/sonner";
import { AppRoutes } from "./routes/AppRoutes";

export const VashApp = () => {
  return (
    <>
      <AppRoutes />
      <Toaster richColors position="top-center" />
    </>
  );
};
