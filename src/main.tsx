import React from "react";
import { Provider } from "jotai/react";
import { createRoot } from "react-dom/client";
import { Page } from "./app";

const rootElement = document.getElementById("root")!;
createRoot(rootElement).render(
  <React.StrictMode>
    <Provider>
      <Page />
    </Provider>
  </React.StrictMode>
);
