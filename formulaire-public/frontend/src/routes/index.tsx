import { createHashRouter } from "react-router-dom";

import Root from "~/app/root";
import Page404 from "~/components/Page404";

const routes = [
  {
    path: "/",
    element: <Root />,
    errorElement: <Page404 />,
    children: [
      {
        index: true,
        async lazy() {
          const { Error404 } = await import("./e404");
          return { Component: Error404 };
        },
      },
      {
        path: "form/:formKey",
        async lazy() {
          const { Response } = await import("./response");
          return { Component: Response };
        },
      },
    ],
  },
];

// add # before roots to distinguish front roots (#/search) from back roots (/search)
export const router = createHashRouter(routes);
