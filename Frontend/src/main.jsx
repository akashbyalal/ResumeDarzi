import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./features/auth/services/auth.context";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);