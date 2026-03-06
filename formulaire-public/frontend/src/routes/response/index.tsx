import { FC } from "react";
import { useParams } from "react-router-dom";

import { ResponseView } from "~/containers/ResponseView";
import { ResponseProvider } from "~/providers/ResponseProvider";

export const Response: FC = () => {
  const { formKey } = useParams();
  return (
    <ResponseProvider key={formKey} formKey={formKey}>
      <ResponseView />
    </ResponseProvider>
  );
};
