import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ResponseView } from "~/containers/ResponseView";
import { getCookie } from "~/core/cookieUtils";
import { ResponseProvider } from "~/providers/ResponseProvider";

export const Response: FC = () => {
  const { formKey } = useParams();
  const navigate = useNavigate();
  const hasAlreadyDistributionKey = getCookie(`distribution_key_${formKey}`) != null;

  if (hasAlreadyDistributionKey) navigate("/sorry");

  return (
    <ResponseProvider>
      <ResponseView />
    </ResponseProvider>
  );
};
