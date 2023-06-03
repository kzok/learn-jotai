import React from "react";
import { createRoot } from "react-dom/client";
import { Greeting } from "./greeting";

const rootElement = document.getElementById("root")!;

createRoot(rootElement).render(
  <React.StrictMode>
    <Greeting name="vite" />
  </React.StrictMode>
);
