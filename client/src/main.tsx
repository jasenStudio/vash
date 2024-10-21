import React from "react";
import ReactDOM from "react-dom/client";
import { VashApp } from "@/vash/VashApp";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <VashApp />
    </BrowserRouter>
  </React.StrictMode>
);
