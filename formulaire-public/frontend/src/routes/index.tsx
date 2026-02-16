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
        element: <ErrorPage errorCode={404} />,
      },
      {
        path: "form/:formKey",
        async lazy() {
          const { Response } = await import("./response");
          return { Component: Response };
        },
      },
      {
        path: "sorry",
        async lazy() {
          const { Sorry } = await import("./sorry");
          return { Component: Sorry };
        },
      },
      {
        path: "thanks",
        async lazy() {
          const { Thanks } = await import("./thanks");
          return { Component: Thanks };
        },
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
