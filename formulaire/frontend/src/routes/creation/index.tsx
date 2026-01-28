import { FC } from "react";

import { CreationView } from "~/containers/CreationView";
import { CreationProvider } from "~/providers/CreationProvider";

export const Creation: FC = () => {
  return (
    <CreationProvider>
      <CreationView />
    </CreationProvider>
  );
};
