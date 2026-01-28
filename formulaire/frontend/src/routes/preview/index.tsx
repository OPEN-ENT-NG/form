import { FC } from "react";

import { ResponseView } from "~/containers/ResponseView";
import { ResponseProvider } from "~/providers/ResponseProvider";

export const Preview: FC = () => {
  return (
    <ResponseProvider previewMode>
      <ResponseView />
    </ResponseProvider>
  );
};
