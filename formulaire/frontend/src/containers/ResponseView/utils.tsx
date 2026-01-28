import { useNavigate } from "react-router-dom";

import { getFormEditPath, getHrefHomeResponsesPath } from "~/core/pathHelper";
import { ComponentVariant } from "~/core/style/themeProps";
import { IButtonProps } from "~/core/types";
import { t } from "~/i18n";

export const useGetResponseHeaderButtons = (
  formId: string | number | undefined,
  isInPreviewMode: boolean,
): IButtonProps[] => {
  const navigate = useNavigate();
  const buttonTitleKey = isInPreviewMode ? "formulaire.backToEditor" : "formulaire.saveAndQuit";

  const buttons: (IButtonProps | undefined)[] = [
    {
      title: t(buttonTitleKey),
      variant: ComponentVariant.OUTLINED,
      action: () => {
        if (formId) {
          if (!isInPreviewMode) return (window.location.href = getHrefHomeResponsesPath());
          navigate(getFormEditPath(formId));
        }
      },
    },
  ];

  return buttons.filter(Boolean) as IButtonProps[];
};
