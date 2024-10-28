import "./App.css";

import { AppRoutes } from "./routes/AppRoutes";
import { ThemeProvider } from "./providers/theme-provider";
export const VashApp = () => {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AppRoutes />{" "}
      </ThemeProvider>
    </>
  );
};
