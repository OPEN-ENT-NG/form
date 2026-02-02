import { FC } from "react";

import { ResponseView } from "~/containers/ResponseView";
import { ResponsePageType } from "~/core/enums";
import { ResponseProvider } from "~/providers/ResponseProvider";

export const Response: FC = () => {
  return (
    <ResponseProvider initialPageType={ResponsePageType.RECAP}>
      <ResponseView />
    </ResponseProvider>
  );
};
