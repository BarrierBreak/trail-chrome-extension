import React from "react";
import ReactDOM from "react-dom/client";
import { TrailUIProvider } from "@trail-ui/react";
import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TrailUIProvider>
      <App />
    </TrailUIProvider>
  </React.StrictMode>
);
