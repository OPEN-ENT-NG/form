import { FC } from "react";
import { Outlet, useMatches } from "react-router-dom";

import { ResponseProvider } from "~/providers/ResponseProvider";

import { IResponseRouteHandleProps } from "./type";

export const ResponseOutlet: FC = () => {
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const handle = currentMatch.handle ? (currentMatch.handle as IResponseRouteHandleProps) : null;
  const initialPageType = handle?.initialPageType;

  return (
    <ResponseProvider {...(initialPageType && { initialPageType: initialPageType })}>
      <Outlet />
    </ResponseProvider>
  );
};
