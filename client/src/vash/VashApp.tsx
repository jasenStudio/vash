import { Toaster } from "@/components/ui/sonner";
import { AppRoutes } from "./routes/AppRoutes";
import { useTheme } from "./providers/theme-provider";
import { useMemo } from "react";

export const VashApp = () => {
  const { theme } = useTheme();
  const memoizedTheme = useMemo(() => theme, [theme]);
  return (
    <>
      <AppRoutes />
      <Toaster theme={memoizedTheme} richColors position="top-center" />
    </>
  );
};
