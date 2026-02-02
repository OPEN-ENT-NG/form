import { useNavigate } from "react-router-dom";

import { ResponsePageType } from "~/core/enums";
import { getFormEditPath, getHrefHomeResponsesPath } from "~/core/pathHelper";
import { ComponentVariant } from "~/core/style/themeProps";
import { IButtonProps } from "~/core/types";
import { t } from "~/i18n";

export const useGetResponseHeaderButtons = (
  formId: string | number | undefined,
  isInPreviewMode: boolean,
  pageType: ResponsePageType = ResponsePageType.FORM_ELEMENT,
): IButtonProps[] => {
  const navigate = useNavigate();
  const buttonTitleKey = getButtonTitleKey(isInPreviewMode, pageType);

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

const getButtonTitleKey = (isInPreviewMode: boolean, pageType: ResponsePageType = ResponsePageType.FORM_ELEMENT) => {
  if (isInPreviewMode) return "formulaire.backToEditor";
  switch (pageType) {
    case ResponsePageType.RGPD:
    case ResponsePageType.DESCRIPTION:
      return "formulaire.quit";
    default:
      return "formulaire.saveAndQuit";
  }
};
