import { FC } from "react";
import { Outlet } from "react-router-dom";

import { CreationProvider } from "~/providers/CreationProvider";

export const CreationOutlet: FC = () => {
  return (
    <CreationProvider>
      <Outlet />
    </CreationProvider>
  );
};
