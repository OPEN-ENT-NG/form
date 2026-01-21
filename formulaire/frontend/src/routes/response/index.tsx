import { FC } from "react";
import { ResponseProvider } from "~/providers/ResponseProvider";
import { ResponseView } from "~/containers/ResponseView";

export const Response: FC = () => {
  return (
    <ResponseProvider>
      <ResponseView />
    </ResponseProvider>
  );
};
