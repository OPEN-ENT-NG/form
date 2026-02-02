import { FC } from "react";

import { ResponseView } from "~/containers/ResponseView";
import { ResponseProvider } from "~/providers/ResponseProvider";

export const Response: FC = () => {
  return (
    <ResponseProvider>
      <ResponseView />
    </ResponseProvider>
  );
};
