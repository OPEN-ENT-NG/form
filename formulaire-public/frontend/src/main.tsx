import React from "react";

import {
  ThemeProvider as ThemeProviderCGI,
  ThemeProviderProps,
} from "@cgi-learning-hub/theme";
import "@edifice.io/bootstrap/dist/index.css";
import { EdificeClientProvider, EdificeThemeProvider } from "@edifice.io/react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { useTranslation } from "react-i18next";
import { DEFAULT_THEME, FORMULAIRE_PUBLIC } from "./core/constants";
import { setupStore } from "./store";
import { options } from "./styles/theme";
import { Box } from "@mui/material";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

// Config

const themePlatform = (rootElement?.getAttribute("data-theme") ??
  DEFAULT_THEME) as ThemeProviderProps["themeId"];

if (process.env.NODE_ENV !== "production") {
  import("@axe-core/react").then((axe) => {
    axe.default(React, root, 1000);
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
  const { t } = useTranslation(FORMULAIRE_PUBLIC);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <EdificeClientProvider
          params={{
            app: t("formulaire.public.title"),
          }}
        >
          <EdificeThemeProvider>
            <ThemeProviderCGI
              themeId={themePlatform ?? "default"}
              options={options}
            >
              <Box></Box>
            </ThemeProviderCGI>
          </EdificeThemeProvider>
        </EdificeClientProvider>
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

root.render(<App />);
