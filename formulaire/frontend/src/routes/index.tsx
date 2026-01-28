import { createHashRouter } from "react-router-dom";

import Root from "~/app/root";
import { ErrorPage } from "~/components/ErrorPage";

const routes = [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        async lazy() {
          const { Home } = await import("./home");
          return { Component: Home };
        },
      },
      {
        path: "form/:formId/edit",
        async lazy() {
          const { Creation } = await import("./creation");
          return { Component: Creation };
        },
      },
      {
        path: "form/:formId/preview",
        async lazy() {
          const { Preview } = await import("./preview");
          return { Component: Preview };
        },
      },
      {
        path: "401",
        element: <ErrorPage errorCode={401} />,
      },
      {
        path: "403",
        element: <ErrorPage errorCode={403} />,
      },
      {
        path: "*",
        element: <ErrorPage errorCode={404} />,
      },
    ],
  },
];

// add # before roots to distinguish front roots (#/search) from back roots (/search)
export const router = createHashRouter(routes);
