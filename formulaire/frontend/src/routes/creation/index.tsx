import { FC } from "react";

import { CreationView } from "~/containers/creation/CreationView";
import { CreationProvider } from "~/providers/CreationProvider";

export const Creation: FC = () => {
  return (
    <CreationProvider>
      <CreationView />
    </CreationProvider>
  );
};
