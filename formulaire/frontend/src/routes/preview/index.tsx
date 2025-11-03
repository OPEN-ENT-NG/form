import { FC } from "react";
import { ResponseProvider } from "~/providers/ResponseProvider";
import { ResponseView } from "~/containers/ResponseView";

export const Preview: FC = () => {
  return (
    <ResponseProvider previewMode>
      <ResponseView />
    </ResponseProvider>
  );
};
