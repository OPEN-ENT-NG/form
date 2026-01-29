import { FC } from "react";
import { useParams } from "react-router-dom";

import SorryPage from "~/components/SorryPage";
import { ResponseView } from "~/containers/ResponseView";
import { getCookie } from "~/core/cookieUtils";
import { ResponseProvider } from "~/providers/ResponseProvider";

export const Response: FC = () => {
  const { formKey } = useParams();
  const hasAlreadyDistributionKey = getCookie(`distribution_key_${formKey}`) != null;

  return hasAlreadyDistributionKey ? (
    <SorryPage />
  ) : (
    <ResponseProvider>
      <ResponseView />
    </ResponseProvider>
  );
};
