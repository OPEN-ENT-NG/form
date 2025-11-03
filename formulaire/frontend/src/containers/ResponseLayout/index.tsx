import { FC, useState } from "react";
import { Box, Button } from "@cgi-learning-hub/ui";
import { responseLayoutStyle, StyledButtonsWrapper } from "./style";
import { useTranslation } from "react-i18next";
import { FORMULAIRE } from "~/core/constants";
import { ComponentVariant } from "~/core/style/themeProps";
import { useResponse } from "~/providers/ResponseProvider";
import { IFormElement } from "~/core/models/formElement/types";

export const ResponseLayout: FC = () => {
  const { formElementsList } = useResponse();
  const { t } = useTranslation(FORMULAIRE);
  const [currentElement, setCurrentElement] = useState<IFormElement>(formElementsList[0] ?? null);

  const isFirstElement = currentElement.position && currentElement.position === 1;
  const isLastElement = currentElement.position && currentElement.position === formElementsList.length;

  const goPreviousElement = () => {
    if (!currentElement.position) return;
    setCurrentElement(formElementsList[currentElement.position - 2]);
  };

  const goNextElement = () => {
    if (!currentElement.position) return;
    setCurrentElement(formElementsList[currentElement.position]);
  };

  return (
    <Box sx={responseLayoutStyle}>
      <Box>//TODO fil d'ariane component</Box>
      <Box>Titre de la question : {currentElement.title}</Box>
      <Box>//TODO response card component</Box>
      <StyledButtonsWrapper isFirstElement={!!isFirstElement} isLastElement={!!isLastElement}>
        {!isFirstElement && (
          <Button variant={ComponentVariant.OUTLINED} onClick={goPreviousElement}>
            {t("formulaire.prev")}
          </Button>
        )}
        {!isLastElement && (
          <Button variant={ComponentVariant.CONTAINED} onClick={goNextElement}>
            {t("formulaire.next")}
          </Button>
        )}
      </StyledButtonsWrapper>
    </Box>
  );
};
