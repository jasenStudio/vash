import { Toaster } from "@/components/ui/sonner";
import { AppRoutes } from "./routes/AppRoutes";
import { useTheme } from "./providers/theme-provider";

export const VashApp = () => {
  const { theme } = useTheme();
  return (
    <>
      <AppRoutes />
      <Toaster theme={theme} richColors position="top-center" />
    </>
  );
};
