import React from "react";
import { createRoot } from "react-dom/client";
import { greet } from "./greet";

const rootElement = document.getElementById("root")!;

createRoot(rootElement).render(
  <React.StrictMode>
    <p>{greet("vite")}</p>
  </React.StrictMode>
);
