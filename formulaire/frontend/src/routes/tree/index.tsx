import { FC } from "react";
import { TreeView } from "~/containers/creation/TreeView";

import { CreationProvider } from "~/providers/CreationProvider";

export const Tree: FC = () => {
  return (
    <CreationProvider>
      <TreeView />
    </CreationProvider>
  );
};
