import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";

import App from "./App";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { DashboardProvider } from "./context/DashboardContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <DashboardProvider>
          <App />
        </DashboardProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
);