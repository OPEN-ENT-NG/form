import { createHashRouter } from "react-router-dom";

import Root from "~/app/root";
import ErrorPage from "~/components/PageError";

const routes = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        async lazy() {
          const { Home } = await import("./home");
          return {
            Component: Home,
          };
        },
      },
    ],
  },
];

// add # before roots to distinguish front roots (#/search) from back roots (/search)
export const router = createHashRouter(routes);
