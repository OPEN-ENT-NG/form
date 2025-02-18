import React from "react";

import { ThemeProvider as ThemeProviderCGI } from "@cgi-learning-hub/theme";
import "@edifice.io/bootstrap/dist/index.css";
import { EdificeClientProvider, EdificeThemeProvider } from "@edifice.io/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "~/i18n";

import "react-toastify/dist/ReactToastify.css";

import dayjs from "dayjs";
import "dayjs/locale/fr";
import { APPOINTMENTS, TOAST_CONFIG } from "./core/constants";
import { AvailabilityProvider } from "./providers/AvailabilityProvider";
import { BookAppointmentModalProvider } from "./providers/BookAppointmentModalProvider";
import { FindAppointmentsProvider } from "./providers/FindAppointmentsProvider";
import { GlobalProvider } from "./providers/GlobalProvider";
import { GridModalProvider } from "./providers/GridModalProvider";
import { router } from "./routes";
import { setupStore } from "./store";
import { options } from "./styles/theme";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

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

dayjs.locale("fr");

root.render(

);
