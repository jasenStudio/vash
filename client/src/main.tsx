import React from "react";
import ReactDOM from "react-dom/client";
import { VashApp } from "@/vash/VashApp";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./vash/providers/theme-provider";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <VashApp />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
