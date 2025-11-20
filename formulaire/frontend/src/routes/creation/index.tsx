import { FC } from "react";
import { CreationView } from "~/containers/CreationView";
import { CreationDndProvider } from "~/providers/CreationDndProvider";
import { CreationProvider } from "~/providers/CreationProvider";

export const Creation: FC = () => {
  return (
    <CreationProvider>
      <CreationDndProvider>
        <CreationView />
      </CreationDndProvider>
    </CreationProvider>
  );
};
