// routes.ts
export type RouteDef<Params extends readonly string[] | undefined = undefined> = {
  path: string;
  build: Params extends readonly string[]
    ? (...args: { [K in keyof Params]: string | number }) => string
    : () => string;
};

export const defineRoute = <const Params extends readonly string[] | undefined = undefined>(
  path: string,
  params?: Params,
): RouteDef<Params> => ({
  path,
  build: ((...args: (string | number)[]) =>
    params
      ? params.reduce((acc, param, index) => acc.replace(`:${param}`, String(args[index])), path)
      : path) as RouteDef<Params>["build"],
});

export const FRONT_ROUTES = {
  home: defineRoute("/"),

  formEdit: defineRoute("form/:formId/edit", ["formId"]),
  formPreview: defineRoute("form/:formId/preview", ["formId"]),
  formResult: defineRoute("form/:formId/result", ["formId"]),

  formResponse: defineRoute("form/:formId/:distributionId", ["formId", "distributionId"]),
  formResponseRecap: defineRoute("form/:formId/:distributionId/recap", ["formId", "distributionId"]),

  error401: defineRoute("401"),
  error403: defineRoute("403"),
} as const;
