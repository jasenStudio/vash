import React from "react";
import ReactDOM from "react-dom/client";

//*Providers
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, TanStackProvider } from "./vash/providers";

//* Imports utils and styles
import "@/i18n/i18n";
import "./index.css";

//* Component
import { VashApp } from "@/vash/VashApp";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
      }}
    >
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TanStackProvider>
          <VashApp />
        </TanStackProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
