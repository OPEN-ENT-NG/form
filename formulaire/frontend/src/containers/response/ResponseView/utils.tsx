import { ResponsePageType } from "~/core/enums";
import { ComponentVariant } from "~/core/style/themeProps";
import { IButtonProps } from "~/core/types";
import { useFormulaireNavigation } from "~/hook/useFormulaireNavigation";
import { t } from "~/i18n";
import { useResponse } from "~/providers/ResponseProvider";

export const useGetResponseHeaderButtons = (
  formId: string | number | undefined,
  isInPreviewMode: boolean,
  pageType: ResponsePageType = ResponsePageType.FORM_ELEMENT,
): IButtonProps[] => {
  const { navigateToFormEdit, navigateToHomeResponses } = useFormulaireNavigation();
  const { saveResponses, currentElement } = useResponse();

  const buttons: (IButtonProps | undefined)[] = [
    {
      title: t(getButtonTitleKey(isInPreviewMode, pageType)),
      variant: ComponentVariant.OUTLINED,
      action: () => {
        if (!formId) return;

        if (!isInPreviewMode) {
          if (!currentElement) return;
          void saveResponses(currentElement);
          navigateToHomeResponses();
          return;
        }

        navigateToFormEdit(formId);
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
