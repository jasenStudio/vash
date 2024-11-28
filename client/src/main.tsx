import React from "react";
import ReactDOM from "react-dom/client";

//*Providers
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./vash/providers/theme-provider";

//* Imports utils and styles
import "@/i18n/i18n";
import "./index.css";

//* Component
import { VashApp } from "@/vash/VashApp";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <VashApp />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
