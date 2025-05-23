import React from "react";

import { ThemeProvider as ThemeProviderCGI, ThemeProviderProps } from "@cgi-learning-hub/theme";
import "@edifice.io/bootstrap/dist/index.css";
import { EdificeClientProvider, EdificeThemeProvider } from "@edifice.io/react";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { DEFAULT_THEME, TOAST_CONFIG } from "./core/constants";
import { setupStore } from "./store";
import { options } from "./core/style/theme";
import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { GlobalStyles } from "@cgi-learning-hub/ui";
import { ModalProvider } from "./providers/ModalProvider";
import { globalOverrideStyles } from "./core/style/global";
import { t } from "~/i18n";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}
const root = createRoot(rootElement);

// Config

const themePlatform = (rootElement.getAttribute("data-theme") ?? DEFAULT_THEME) as ThemeProviderProps["themeId"];

if (process.env.NODE_ENV !== "production") {
  void import("@axe-core/react").then((axe) => {
    void axe.default(React, root, 1000);
  });
}

const store = setupStore();

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      if (error === "0090") window.location.replace("/auth/login");
    },
  }),
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <EdificeClientProvider
          params={{
            app: t("formulaire.title"),
          }}
        >
          <EdificeThemeProvider>
            <ThemeProviderCGI themeId={themePlatform ?? "default"} options={options}>
              <ModalProvider>
                <GlobalStyles styles={globalOverrideStyles} />
                <ToastContainer {...TOAST_CONFIG} />
                <RouterProvider router={router} />
              </ModalProvider>
            </ThemeProviderCGI>
          </EdificeThemeProvider>
        </EdificeClientProvider>
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

root.render(<App />);
