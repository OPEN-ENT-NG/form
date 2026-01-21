import { FC } from "react";
import { ResponseProvider } from "~/providers/ResponseProvider";
import { ResponseView } from "~/containers/ResponseView";
import { ResponsePageType } from "~/core/enums";

export const Response: FC = () => {
  return (
    <ResponseProvider initialPageType={ResponsePageType.RECAP}>
      <ResponseView />
    </ResponseProvider>
  );
};
