import { createHashRouter } from "react-router-dom";

import Root from "~/app/root";
import { ErrorPage } from "~/components/ErrorPage";
import { ResponsePageType } from "~/core/enums";
import { FRONT_ROUTES } from "~/core/frontRoutes";

const routes = [
  {
    path: FRONT_ROUTES.home.path,
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
        path: FRONT_ROUTES.formEdit.path,
        async lazy() {
          const { Creation } = await import("./creation");
          return { Component: Creation };
        },
      },
      {
        path: FRONT_ROUTES.formPreview.path,
        async lazy() {
          const { Preview } = await import("./preview");
          return { Component: Preview };
        },
      },
      {
        path: FRONT_ROUTES.formResult.path,
        async lazy() {
          const { Result } = await import("./result");
          return { Component: Result };
        },
      },
      {
        path: FRONT_ROUTES.formTree.path,
        async lazy() {
          const { Tree } = await import("./tree");
          return { Component: Tree };
        },
      },
      {
        path: FRONT_ROUTES.formResponse.path,
        async lazy() {
          const { ResponseOutlet } = await import("./response");
          return { Component: ResponseOutlet };
        },
        children: [
          {
            index: true,
            async lazy() {
              const { Response } = await import("./response/response");
              return { Component: Response };
            },
          },
          {
            path: "recap",
            async lazy() {
              const { Recap } = await import("./response/recap");
              return { Component: Recap };
            },
            handle: { initialPageType: ResponsePageType.RECAP },
          },
        ],
      },
      {
        path: FRONT_ROUTES.error401.path,
        element: <ErrorPage errorCode={401} />,
      },
      {
        path: FRONT_ROUTES.error403.path,
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
