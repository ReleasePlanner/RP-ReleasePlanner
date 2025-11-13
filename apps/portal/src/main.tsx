import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { store } from "./store/store";
import { queryClient } from "./api/queryClient";
import { RootProvider } from "./RootProvider";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RootProvider />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
