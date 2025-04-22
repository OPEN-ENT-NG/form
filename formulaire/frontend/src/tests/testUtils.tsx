import { PropsWithChildren, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider, QueryCache } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import { setupStore } from "~/store";
import { EdificeClientProvider, EdificeThemeProvider } from "@edifice.io/react";
import { ThemeProvider as ThemeProviderCGI, ThemeProviderProps } from "@cgi-learning-hub/theme";
import { ModalProvider } from "~/providers/ModalProvider";
import { GlobalStyles } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { FORMULAIRE, TOAST_CONFIG, DEFAULT_THEME } from "~/core/constants";
import { globalOverrideStyles } from "~/core/style/global";
import { options } from "~/core/style/theme";

interface ITestProvidersProps {
  /**
   * Override the initial route in MemoryRouter
   */
  initialRoute?: string;
  /**
   * Provide a custom QueryClient
   */
  queryClient?: QueryClient;
}

// Create a fresh QueryClient with app-like defaults
function createTestQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      // mirror app behavior: on auth error redirect
      onError: (error: unknown) => {
        if (error === "0090") {
          // in tests, we can ignore or simulate
          // window.location.replace("/auth/login");
        }
      },
    }),
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });
}

function AllProviders({ children, initialRoute = "/", queryClient }: PropsWithChildren<ITestProvidersProps>) {
  const store = setupStore();
  const qc = queryClient ?? createTestQueryClient();
  // read theme from document attribute like in main.tsx
  const themePlatform = (document.documentElement.getAttribute("data-theme") ??
    DEFAULT_THEME) as ThemeProviderProps["themeId"];

  return (
    <QueryClientProvider client={qc}>
      <ReduxProvider store={store}>
        <EdificeClientProvider params={{ app: FORMULAIRE }}>
          <EdificeThemeProvider>
            <ThemeProviderCGI themeId={themePlatform ?? "default"} options={options}>
              <ModalProvider>
                <GlobalStyles styles={globalOverrideStyles} />
                <ToastContainer {...TOAST_CONFIG} />
                <MemoryRouter initialEntries={[initialRoute]}> {children} </MemoryRouter>
              </ModalProvider>
            </ThemeProviderCGI>
          </EdificeThemeProvider>
        </EdificeClientProvider>
      </ReduxProvider>
    </QueryClientProvider>
  );
}

/**
 * Custom render for React Testing Library that includes all app providers.
 */
export function renderWithProviders(ui: ReactElement, options: RenderOptions & ITestProvidersProps = {}) {
  return render(ui, {
    wrapper: (props) => (
      <AllProviders initialRoute={options.initialRoute} queryClient={options.queryClient}>
        {props.children}
      </AllProviders>
    ),
    ...options,
  });
}

// re-export RTL utilities
export * from "@testing-library/react";
